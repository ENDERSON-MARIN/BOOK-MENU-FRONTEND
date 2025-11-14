"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon, ClockIcon, InfoIcon } from "lucide-react";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Badge } from "@/_components/ui/badge";
import { Button } from "@/_components/ui/button";
import {
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
import { useCreateReservation } from "@/_hooks/mutations/use-create-reservation";
import { formatDateBR, isBeforeCutoffTime } from "@/_lib/date-utils";
import {
  reservationFormSchema,
  type ReservationFormValues,
} from "@/_schemas/reservation.schema";
import type { Menu } from "@/_types/menu";

interface ReservationFormDialogProps {
  menu: Menu;
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

const ReservationFormDialog = ({
  menu,
  onSuccess,
}: ReservationFormDialogProps) => {
  // Check if reservation deadline has passed (8:30 AM)
  const isBeforeCutoff = useMemo(() => {
    return isBeforeCutoffTime(menu.date);
  }, [menu.date]);

  // Get default variation (or first one if no default)
  const defaultVariation = useMemo(() => {
    if (!menu.variations || menu.variations.length === 0) {
      return undefined;
    }
    const defaultVar = menu.variations.find((v) => v.isDefault);
    return defaultVar || menu.variations[0];
  }, [menu.variations]);

  // Convert menu.date to YYYY-MM-DD format if it's in ISO format
  const formattedMenuDate = useMemo(() => {
    if (menu.date.includes("T")) {
      // If date is in ISO format, extract just the date part
      return menu.date.split("T")[0];
    }
    return menu.date;
  }, [menu.date]);

  const form = useForm<ReservationFormValues>({
    resolver: zodResolver(reservationFormSchema),
    defaultValues: {
      menuId: menu.id,
      menuVariationId: defaultVariation?.id || "",
      reservationDate: formattedMenuDate,
    },
  });

  // Update form when default variation changes
  useEffect(() => {
    if (defaultVariation?.id) {
      form.setValue("menuVariationId", defaultVariation.id);
    }
  }, [defaultVariation, form]);

  const { mutate: createReservation, isPending } = useCreateReservation();

  const onSubmit = (data: ReservationFormValues) => {
    console.log("Submitting reservation:", data);

    // Double-check cutoff time before submitting
    if (!isBeforeCutoff) {
      toast.error("Prazo para reservas encerrado (até 8:30 AM)");
      return;
    }

    // Convert date to ISO 8601 format with timestamp
    const reservationData = {
      ...data,
      reservationDate: new Date(data.reservationDate).toISOString(),
    };

    console.log("Formatted reservation data:", reservationData);

    createReservation(reservationData, {
      onSuccess: () => {
        console.log("Reservation created successfully");
        toast.success("Reserva criada com sucesso!");
        form.reset();
        onSuccess();
      },
      onError: (error: Error) => {
        console.error("Error creating reservation:", error);
        const errorMessage = error?.message || "Erro ao criar reserva.";
        toast.error(errorMessage);
      },
    });
  };

  // Group menu items by category
  const itemsByCategory = useMemo(() => {
    const grouped: Record<string, Menu["menuCompositions"]> = {};

    if (!menu.menuCompositions || menu.menuCompositions.length === 0) {
      return grouped;
    }

    menu.menuCompositions.forEach((composition) => {
      const categoryName = composition.menuItem?.category?.name || "Outros";
      if (!grouped[categoryName]) {
        grouped[categoryName] = [];
      }
      grouped[categoryName].push(composition);
    });

    return grouped;
  }, [menu.menuCompositions]);

  // Sort categories by display order
  const sortedCategories = useMemo(() => {
    if (!menu.menuCompositions || menu.menuCompositions.length === 0) {
      return [];
    }

    const categories = Object.keys(itemsByCategory);

    return categories.sort((a, b) => {
      const categoryA = menu.menuCompositions.find(
        (c) => c.menuItem?.category?.name === a,
      )?.menuItem?.category;
      const categoryB = menu.menuCompositions.find(
        (c) => c.menuItem?.category?.name === b,
      )?.menuItem?.category;

      return (
        (categoryA?.displayOrder || 999) - (categoryB?.displayOrder || 999)
      );
    });
  }, [itemsByCategory, menu.menuCompositions]);

  // Format date
  const formattedDate = formatDateBR(menu.date);
  const dayOfWeek = DAY_OF_WEEK_LABELS[menu.dayOfWeek] || menu.dayOfWeek;

  return (
    <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
      <DialogHeader>
        <DialogTitle>Fazer Reserva</DialogTitle>
        <DialogDescription>
          Selecione a variação desejada e confirme sua reserva.
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

        {/* Observations */}
        {menu.observations && (
          <div className="bg-muted/50 rounded-lg border p-4">
            <div className="mb-2 flex items-center gap-2">
              <InfoIcon className="text-muted-foreground h-4 w-4" />
              <h3 className="text-sm font-medium">Observações</h3>
            </div>
            <p className="text-muted-foreground text-sm">{menu.observations}</p>
          </div>
        )}

        {/* Menu Composition by Category */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium">Composição do Cardápio</h3>
          {!menu.menuCompositions || menu.menuCompositions.length === 0 ? (
            <div className="bg-muted/50 rounded-lg border p-4">
              <p className="text-muted-foreground text-sm">
                Nenhum item cadastrado neste cardápio.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {sortedCategories.map((categoryName) => {
                const items = itemsByCategory[categoryName];
                return (
                  <div key={categoryName} className="space-y-2">
                    <h4 className="text-muted-foreground text-xs font-medium uppercase">
                      {categoryName}
                    </h4>
                    <div className="space-y-2">
                      {items.map((composition) => (
                        <div
                          key={composition.id}
                          className="flex items-start gap-3 rounded-lg border p-3"
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-medium">
                                {composition.menuItem?.name ||
                                  "Item do cardápio"}
                              </p>
                              {composition.isMainProtein && (
                                <Badge
                                  variant="default"
                                  className="text-xs text-white"
                                >
                                  Proteína Principal
                                </Badge>
                              )}
                              {composition.isAlternativeProtein && (
                                <Badge
                                  variant="secondary"
                                  className="text-xs text-white"
                                >
                                  Proteína Alternativa
                                </Badge>
                              )}
                            </div>
                            {composition.menuItem?.description && (
                              <p className="text-muted-foreground mt-1 text-xs">
                                {composition.menuItem.description}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Cutoff Time Warning */}
        {!isBeforeCutoff && (
          <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-900 dark:bg-yellow-950/20">
            <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
              ⚠ Prazo para reservas encerrado (até 8:30 AM)
            </p>
          </div>
        )}

        {/* Variation Selection Form */}
        {isBeforeCutoff && (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="menuVariationId"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Selecione a Variação</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-2"
                        disabled={isPending}
                      >
                        {menu.variations && menu.variations.length > 0 ? (
                          menu.variations.map((variation) => (
                            <div
                              key={variation.id}
                              className="flex items-start space-x-3 rounded-lg border p-4"
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
                                  {variation.isDefault && (
                                    <Badge
                                      variant="default"
                                      className="text-xs text-white"
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
                          ))
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
                  disabled={
                    isPending ||
                    !menu.variations ||
                    menu.variations.length === 0 ||
                    !form.watch("menuVariationId")
                  }
                  className="w-full text-white"
                  onClick={() => {
                    console.log("Button clicked");
                    console.log("Form values:", form.getValues());
                    console.log("Form errors:", form.formState.errors);
                  }}
                >
                  {isPending ? "Criando reserva..." : "Confirmar Reserva"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        )}
      </div>
    </DialogContent>
  );
};

export default ReservationFormDialog;
