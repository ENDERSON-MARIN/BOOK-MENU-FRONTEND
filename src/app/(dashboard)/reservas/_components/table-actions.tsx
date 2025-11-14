"use client";

import { EyeIcon, MoreVerticalIcon, RefreshCwIcon, XIcon } from "lucide-react";
import { useState } from "react";
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
import { Button } from "@/_components/ui/button";
import { Dialog } from "@/_components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/_components/ui/dropdown-menu";
import { useCancelReservation } from "@/_hooks/mutations/use-cancel-reservation";
import { isBeforeCutoffTime } from "@/_lib/date-utils";
import { Reservation } from "@/_types/reservation";

import ChangeVariationDialog from "./change-variation-dialog";
import ReservationDetailsDialog from "./reservation-details-dialog";

interface MyReservationsTableActionsProps {
  reservation: Reservation;
}

const MyReservationsTableActions = ({
  reservation,
}: MyReservationsTableActionsProps) => {
  const [detailsDialogIsOpen, setDetailsDialogIsOpen] = useState(false);
  const [changeVariationDialogIsOpen, setChangeVariationDialogIsOpen] =
    useState(false);

  const { mutate: cancelReservation, isPending: isCancelPending } =
    useCancelReservation();

  const canModify =
    reservation.status === "ACTIVE" &&
    isBeforeCutoffTime(reservation.reservationDate);

  const handleCancelReservation = () => {
    cancelReservation(reservation.id, {
      onSuccess: () => {
        toast.success("Reserva cancelada com sucesso.");
      },
      onError: (error) => {
        toast.error(
          error instanceof Error ? error.message : "Erro ao cancelar reserva.",
        );
      },
    });
  };

  return (
    <>
      <Dialog open={detailsDialogIsOpen} onOpenChange={setDetailsDialogIsOpen}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVerticalIcon className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Ações</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setDetailsDialogIsOpen(true)}>
              <EyeIcon className="mr-2 h-4 w-4" />
              Ver Detalhes
            </DropdownMenuItem>
            <DropdownMenuItem
              disabled={!canModify}
              onClick={() => setChangeVariationDialogIsOpen(true)}
            >
              <RefreshCwIcon className="mr-2 h-4 w-4" />
              Alterar Variação
            </DropdownMenuItem>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <DropdownMenuItem
                  onSelect={(e) => e.preventDefault()}
                  disabled={!canModify}
                >
                  <XIcon className="mr-2 h-4 w-4" />
                  Cancelar Reserva
                </DropdownMenuItem>
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
          </DropdownMenuContent>
        </DropdownMenu>

        <ReservationDetailsDialog reservation={reservation} />
      </Dialog>

      {/* Change Variation Dialog */}
      <ChangeVariationDialog
        reservation={reservation}
        isOpen={changeVariationDialogIsOpen}
        onOpenChange={setChangeVariationDialogIsOpen}
        onSuccess={() => setChangeVariationDialogIsOpen(false)}
      />
    </>
  );
};

export default MyReservationsTableActions;
