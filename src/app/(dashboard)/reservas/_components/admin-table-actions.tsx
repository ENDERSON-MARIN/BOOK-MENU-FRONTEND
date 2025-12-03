"use client";

import {
  CheckCircleIcon,
  EyeIcon,
  MoreVerticalIcon,
  XIcon,
} from "lucide-react";
import { useState } from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
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
import { useToggleReservationStatus } from "@/_hooks/mutations/use-toggle-reservation-status";
import { isBeforeCutoffTime } from "@/_lib/date-utils";
import { Reservation } from "@/_types/reservation";

import ReservationDetailsDialog from "./reservation-details-dialog";

interface AdminTableActionsProps {
  reservation: Reservation;
}

const AdminTableActions = ({ reservation }: AdminTableActionsProps) => {
  const [detailsDialogIsOpen, setDetailsDialogIsOpen] = useState(false);
  const [alertDialogIsOpen, setAlertDialogIsOpen] = useState(false);
  const [actionType, setActionType] = useState<"cancel" | "reactivate">(
    "cancel",
  );

  const { mutate: toggleStatus, isPending } = useToggleReservationStatus();

  // Check if modifications are allowed based on cutoff time
  const canModify = isBeforeCutoffTime(reservation.reservationDate);

  // Determine which action to show based on current status
  const isActive = reservation.status === "ACTIVE";
  const isCancelled = reservation.status === "CANCELLED";

  const handleActionClick = (type: "cancel" | "reactivate") => {
    setActionType(type);
    setAlertDialogIsOpen(true);
  };

  const handleConfirmAction = () => {
    const newStatus = actionType === "cancel" ? "CANCELLED" : "ACTIVE";

    toggleStatus(
      {
        id: reservation.id,
        newStatus,
      },
      {
        onSuccess: () => {
          setAlertDialogIsOpen(false);
        },
      },
    );
  };

  // Dialog titles based on action type
  const dialogTitle =
    actionType === "cancel"
      ? "Tem certeza que deseja cancelar esta reserva?"
      : "Tem certeza que deseja reativar esta reserva?";

  const dialogDescription = !canModify
    ? "Prazo para alterações encerrado (até 8:30 AM do dia da refeição)."
    : actionType === "cancel"
      ? "Essa ação irá cancelar a reserva do usuário."
      : "Essa ação irá reativar a reserva do usuário.";

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
            {isActive && (
              <DropdownMenuItem
                disabled={!canModify}
                onClick={() => handleActionClick("cancel")}
              >
                <XIcon className="mr-2 h-4 w-4" />
                Cancelar Reserva
              </DropdownMenuItem>
            )}
            {isCancelled && (
              <DropdownMenuItem
                disabled={!canModify}
                onClick={() => handleActionClick("reactivate")}
              >
                <CheckCircleIcon className="mr-2 h-4 w-4" />
                Reativar Reserva
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        <ReservationDetailsDialog
          reservation={reservation}
          onClose={() => setDetailsDialogIsOpen(false)}
        />
      </Dialog>

      {/* Alert Dialog for Confirmation */}
      <AlertDialog open={alertDialogIsOpen} onOpenChange={setAlertDialogIsOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{dialogTitle}</AlertDialogTitle>
            <AlertDialogDescription>{dialogDescription}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmAction}
              disabled={isPending || !canModify}
            >
              {isPending ? "Processando..." : "Confirmar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default AdminTableActions;
