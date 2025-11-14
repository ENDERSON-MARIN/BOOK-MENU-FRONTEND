"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon, ClockIcon, InfoIcon } from "lucide-react";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Badge } from "@/_components/ui/badge";
import { Button } from "@/_components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/_components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/_components/ui/form";
import { Label } from "@/_components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/_components/ui/radio-group";
import { Separator } from "@/_components/ui/separator";
import { useUpdateReservation } from "@/_hooks/mutations/use-update-reservation";
import { useGetMenu } from "@/_hooks/queries/use-get-menu";
import { formatDateBR, isBeforeCutoffTime } from "@/_lib/date-utils";
import {
  updateReservationFormSchema,
  type UpdateReservationFormValues,
} from "@/_schemas/reservation.schema";
import type { Reservation } from "@/_types/reservation";

interface ChangeVariationDialogProps {
  reservation: Reservation;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const DAY_OF_WEEK_LABELS: Record<string, string> = {
  MONDAY: "Segunda-feira",
  TUESDAY: "Terça-feira",
  WEDNESDAY: "Quarta-feira",
  THURSDAY: "Quinta-feira",
  FRIDAY: "Sexta-feira",
  SATURDAY: "Sábado",
  SUNDAY: "Domingo",
};

const VARIATION_TYPE_LABELS: Record<string, string> = {
  STANDARD: "Padrão",
  EGG_SUBSTITUTE: "Com Ovo",
  VEGETARIAN: "Vegetariano",
};

const ChangeVariationDialog = ({
  reservation,
  isOpen,
  onOpenChange,
  onSuccess,
}: ChangeVariationDialogProps) => {
  // Check if reservation deadline has passed (8:30 AM)
  const isBeforeCutoff = useMemo(() => {
    return isBeforeCutoffTime(reservation.reservationDate);
  }, [reservation.reservationDate]);

  const form = useForm<UpdateReservationFormValues>({
    resolver: zodResolver(updateReservationFormSchema),
    defaultValues: {
      menuVariationId: reservation.menuVariationId,
    },
  });

  const { mutate: updateReservation, isPending } = useUpdateReservation();

  // Fetch full menu details to get variations
  const {
    data: fullMenu,
    isLoading: isLoadingMenu,
    error: menuError,
  } = useGetMenu(reservation.menuId);

  const onSubmit = (data: UpdateReservationFormValues) => {
    // Double-check cutoff time before submitting
    if (!isBeforeCutoff) {
      toast.error("Prazo para alterações encerrado (até 8:30 AM)");
      return;
    }

    // Check if variation is different
    if (data.menuVariationId === reservation.menuVariationId) {
      toast.info("Selecione uma variação diferente da atual");
      return;
    }

    updateReservation(
      { id: reservation.id, data },
      {
        onSuccess: () => {
          toast.success("Variação alterada com sucesso!");
          form.reset();
          onSuccess();
        },
        onError: (error: Error) => {
          const errorMessage = error?.message || "Erro ao alterar variação.";
          toast.error(errorMessage);
        },
      },
    );
  };

  // Format date
  const formattedDate = formatDateBR(reservation.reservationDate);
  const dayOfWeek = reservation.menu?.dayOfWeek
    ? DAY_OF_WEEK_LABELS[reservation.menu.dayOfWeek] ||
      reservation.menu.dayOfWeek
    : "N/A";

  // Get available variations from full menu data
  const availableVariations = fullMenu?.variations || [];

  // Check if menu data is loading or has error
  if (isLoadingMenu) {
    return (
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Carregando...</DialogTitle>
            <DialogDescription>
              Carregando variações disponíveis do cardápio.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );
  }

  if (menuError || !fullMenu) {
    return (
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Erro ao Carregar Dados</DialogTitle>
            <DialogDescription>
              Não foi possível carregar os dados do cardápio. Por favor, tente
              novamente.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Alterar Variação da Reserva</DialogTitle>
          <DialogDescription>
            Selecione uma nova variação para sua reserva.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Date and Day of Week */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <CalendarIcon className="text-muted-foreground h-4 w-4" />
              <span className="text-sm font-medium">{formattedDate}</span>
            </div>
            <Separator orientation="vertical" className="h-4" />
            <div className="flex items-center gap-2">
              <ClockIcon className="text-muted-foreground h-4 w-4" />
              <span className="text-muted-foreground text-sm">{dayOfWeek}</span>
            </div>
          </div>

          {/* Current Variation */}
          <div className="bg-muted/50 rounded-lg border p-4">
            <div className="mb-2 flex items-center gap-2">
              <InfoIcon className="text-muted-foreground h-4 w-4" />
              <h3 className="text-sm font-medium">Variação Atual</h3>
            </div>
            <div className="flex items-center gap-2">
              <p className="text-sm">
                {VARIATION_TYPE_LABELS[
                  reservation.menuVariation.variationType
                ] || reservation.menuVariation.variationType}
              </p>
              {reservation.menuVariation.proteinItem && (
                <span className="text-muted-foreground text-xs">
                  ({reservation.menuVariation.proteinItem.name})
                </span>
              )}
            </div>
          </div>

          {/* Cutoff Time Warning */}
          {!isBeforeCutoff && (
            <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-900 dark:bg-yellow-950/20">
              <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                ⚠ Prazo para alterações encerrado (até 8:30 AM do dia da
                refeição)
              </p>
            </div>
          )}

          {/* Variation Selection Form */}
          {isBeforeCutoff && (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="menuVariationId"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Selecione a Nova Variação</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col space-y-2"
                          disabled={isPending}
                        >
                          {availableVariations.length > 0 ? (
                            availableVariations.map((variation) => {
                              const isCurrent =
                                variation.id === reservation.menuVariationId;
                              return (
                                <div
                                  key={variation.id}
                                  className={`flex items-start space-x-3 rounded-lg border p-4 ${
                                    isCurrent
                                      ? "border-primary bg-primary/5"
                                      : ""
                                  }`}
                                >
                                  <RadioGroupItem
                                    value={variation.id}
                                    id={variation.id}
                                    className="mt-1"
                                  />
                                  <div className="flex-1">
                                    <Label
                                      htmlFor={variation.id}
                                      className="flex cursor-pointer items-center gap-2 text-sm font-medium"
                                    >
                                      {VARIATION_TYPE_LABELS[
                                        variation.variationType
                                      ] || variation.variationType}
                                      {isCurrent && (
                                        <Badge
                                          variant="default"
                                          className="text-xs text-white"
                                        >
                                          Atual
                                        </Badge>
                                      )}
                                      {variation.isDefault && (
                                        <Badge
                                          variant="secondary"
                                          className="text-xs"
                                        >
                                          Padrão
                                        </Badge>
                                      )}
                                    </Label>
                                    {variation.proteinItem && (
                                      <p className="text-muted-foreground mt-1 text-xs">
                                        Proteína: {variation.proteinItem.name}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              );
                            })
                          ) : (
                            <div className="bg-muted/50 rounded-lg border p-4">
                              <p className="text-muted-foreground text-sm">
                                Nenhuma variação disponível para este cardápio.
                              </p>
                            </div>
                          )}
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <DialogFooter>
                  <Button
                    type="submit"
                    disabled={isPending || availableVariations.length === 0}
                    className="w-full text-white sm:w-auto"
                  >
                    {isPending ? "Alterando..." : "Confirmar Alteração"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ChangeVariationDialog;
