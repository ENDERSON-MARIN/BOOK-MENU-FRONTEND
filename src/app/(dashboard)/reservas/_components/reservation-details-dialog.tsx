"use client";

import {
  CalendarIcon,
  ClockIcon,
  InfoIcon,
  Loader2Icon,
  XIcon,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/_components/ui/alert-dialog";
import { Badge } from "@/_components/ui/badge";
import { Button } from "@/_components/ui/button";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/_components/ui/dialog";
import { Separator } from "@/_components/ui/separator";
import { useCancelReservation } from "@/_hooks/mutations/use-cancel-reservation";
import { useGetReservation } from "@/_hooks/queries/use-get-reservation";
import { formatDateBR, isBeforeCutoffTime } from "@/_lib/date-utils";
import type { Reservation } from "@/_types/reservation";

interface ReservationDetailsDialogProps {
  reservation: Reservation;
  onClose?: () => void;
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

const STATUS_LABELS: Record<string, string> = {
  ACTIVE: "Ativa",
  CANCELLED: "Cancelada",
};

const ReservationDetailsDialog = ({
  reservation,
  onClose,
}: ReservationDetailsDialogProps) => {
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);

  // Fetch full reservation details with all relations
  const { data: fullReservation, isLoading: isLoadingReservation } =
    useGetReservation(reservation.id);

  // Use full reservation data if available, otherwise fallback to prop
  const reservationData = fullReservation || reservation;

  // The reservation already includes the full menu with compositions
  const menuData = reservationData.menu;

  // Cancel reservation mutation
  const { mutate: cancelReservation, isPending: isCancelPending } =
    useCancelReservation();

  // Check if user can modify the reservation
  const canModify =
    reservationData.status === "ACTIVE" &&
    isBeforeCutoffTime(reservationData.reservationDate);

  const handleCancelReservation = () => {
    cancelReservation(reservationData.id, {
      onSuccess: () => {
        toast.success("Reserva cancelada com sucesso.");
        setCancelDialogOpen(false);
        onClose?.();
      },
      onError: (error) => {
        toast.error(
          error instanceof Error ? error.message : "Erro ao cancelar reserva.",
        );
      },
    });
  };

  // Format dates
  const formattedDate = formatDateBR(reservationData.reservationDate);
  const formattedCreatedAt = formatDateBR(reservationData.createdAt);
  const formattedUpdatedAt = formatDateBR(reservationData.updatedAt);

  const dayOfWeek = menuData?.dayOfWeek
    ? DAY_OF_WEEK_LABELS[menuData.dayOfWeek] || menuData.dayOfWeek
    : "N/A";

  // Group menu items by category
  const itemsByCategory = useMemo(() => {
    const grouped: Record<string, typeof menuData.menuCompositions> = {};

    if (!menuData?.menuCompositions || menuData.menuCompositions.length === 0) {
      return grouped;
    }

    menuData.menuCompositions.forEach((composition) => {
      const categoryName = composition.menuItem?.category?.name || "Outros";
      if (!grouped[categoryName]) {
        grouped[categoryName] = [];
      }
      grouped[categoryName].push(composition);
    });

    return grouped;
  }, [menuData]);

  // Sort categories by display order
  const sortedCategories = useMemo(() => {
    if (!menuData?.menuCompositions || menuData.menuCompositions.length === 0) {
      return [];
    }

    const categories = Object.keys(itemsByCategory);

    return categories.sort((a, b) => {
      const categoryA = menuData.menuCompositions.find(
        (c) => c.menuItem?.category?.name === a,
      )?.menuItem?.category;
      const categoryB = menuData.menuCompositions.find(
        (c) => c.menuItem?.category?.name === b,
      )?.menuItem?.category;

      return (
        (categoryA?.displayOrder || 999) - (categoryB?.displayOrder || 999)
      );
    });
  }, [itemsByCategory, menuData]);

  return (
    <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
      <DialogHeader>
        <DialogTitle>Detalhes da Reserva</DialogTitle>
        <DialogDescription>
          Visualize todas as informações da sua reserva.
        </DialogDescription>
      </DialogHeader>

      {isLoadingReservation ? (
        <div className="flex items-center justify-center py-8">
          <Loader2Icon className="text-muted-foreground h-8 w-8 animate-spin" />
        </div>
      ) : (
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

          {/* Status and Auto-Generated Badge */}
          <div className="flex flex-wrap items-center gap-2">
            <Badge
              variant={
                reservationData.status === "ACTIVE" ? "default" : "destructive"
              }
              className="text-white"
            >
              {STATUS_LABELS[reservationData.status] || reservationData.status}
            </Badge>
            {reservationData.isAutoGenerated && (
              <Badge variant="secondary" className="text-xs">
                Gerada Automaticamente
              </Badge>
            )}
          </div>

          {/* Menu Observations */}
          {menuData?.observations && (
            <div className="bg-muted/50 rounded-lg border p-4">
              <div className="mb-2 flex items-center gap-2">
                <InfoIcon className="text-muted-foreground h-4 w-4" />
                <h3 className="text-sm font-medium">Observações do Cardápio</h3>
              </div>
              <p className="text-muted-foreground text-sm">
                {menuData.observations}
              </p>
            </div>
          )}

          {/* Menu Composition by Category */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Composição do Cardápio</h3>
            {!menuData?.menuCompositions ||
            menuData.menuCompositions.length === 0 ? (
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

          {/* Selected Variation */}
          {reservationData.menuVariation && (
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Variação Selecionada</h3>
              <div className="rounded-lg border p-4">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium">
                    {VARIATION_TYPE_LABELS[
                      reservationData.menuVariation.variationType
                    ] || reservationData.menuVariation.variationType}
                  </p>
                  {reservationData.menuVariation.isDefault && (
                    <Badge variant="secondary" className="text-xs">
                      Padrão
                    </Badge>
                  )}
                </div>
                {reservationData.menuVariation.proteinItem && (
                  <p className="text-muted-foreground mt-2 text-xs">
                    Proteína: {reservationData.menuVariation.proteinItem.name}
                  </p>
                )}
                {reservationData.menuVariation.proteinItem?.description && (
                  <p className="text-muted-foreground mt-1 text-xs">
                    {reservationData.menuVariation.proteinItem.description}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Timestamps */}
          <div className="bg-muted/50 space-y-2 rounded-lg border p-4">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-xs">
                Data de Criação:
              </span>
              <span className="text-xs font-medium">{formattedCreatedAt}</span>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-xs">
                Última Atualização:
              </span>
              <span className="text-xs font-medium">{formattedUpdatedAt}</span>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Reservation Button */}
      {reservationData.status === "ACTIVE" && (
        <DialogFooter>
          {!canModify && (
            <p className="text-muted-foreground mr-auto text-xs">
              Prazo para alterações encerrado (até 8:30 AM do dia da refeição)
            </p>
          )}
          <AlertDialog
            open={cancelDialogOpen}
            onOpenChange={setCancelDialogOpen}
          >
            <AlertDialogTrigger asChild>
              <Button
                variant="destructive"
                disabled={!canModify || isCancelPending}
              >
                <XIcon className="mr-2 h-4 w-4" />
                Cancelar Reserva
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Tem certeza que deseja cancelar esta reserva?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  {!canModify
                    ? "Prazo para alterações encerrado (até 8:30 AM do dia da refeição)."
                    : "Essa ação não pode ser revertida. A reserva será cancelada permanentemente."}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleCancelReservation}
                  disabled={isCancelPending || !canModify}
                >
                  {isCancelPending ? "Cancelando..." : "Confirmar"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </DialogFooter>
      )}
    </DialogContent>
  );
};

export default ReservationDetailsDialog;
