import {
  CalendarCheckIcon,
  EditIcon,
  EyeIcon,
  MoreVerticalIcon,
  TrashIcon,
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
import { useDeleteMenu } from "@/_hooks/mutations/use-delete-menu";
import { useGetMyReservations } from "@/_hooks/queries/use-get-my-reservations";
import { useAuth } from "@/_hooks/use-auth";
import {
  isBeforeCutoffTime,
  isFutureDate as checkIsFutureDate,
} from "@/_lib/date-utils";
import { Menu } from "@/_types/menu";

import MenuDetailsDialog from "./menu-details-dialog";
import MenuFormDialog from "./menu-form-dialog";
import ReservationFormDialog from "./reservation-form-dialog";

interface MenusTableActionsProps {
  menu: Menu;
}

const MenusTableActions = ({ menu }: MenusTableActionsProps) => {
  const [upsertDialogIsOpen, setUpsertDialogIsOpen] = useState(false);
  const [detailsDialogIsOpen, setDetailsDialogIsOpen] = useState(false);
  const [reservationDialogIsOpen, setReservationDialogIsOpen] = useState(false);
  const { user } = useAuth();
  const isAdmin = user?.role === "ADMIN";
  const isUser = user?.role === "USER";

  const { mutate: deleteMenu, isPending: isDeletePending } = useDeleteMenu();

  // Fetch user reservations to check if already has reservation for this menu
  const { data: myReservations } = useGetMyReservations({
    status: "ACTIVE",
  });

  const isFutureDate = checkIsFutureDate(menu.date);

  // Check if user already has a reservation for this menu
  const hasReservation = useMemo(() => {
    if (!myReservations || !isUser) return false;
    return myReservations.some(
      (reservation) =>
        reservation.menuId === menu.id && reservation.status === "ACTIVE",
    );
  }, [myReservations, menu.id, isUser]);

  // Check if reservation deadline has passed (8:30 AM)
  const isBeforeCutoff = useMemo(() => {
    return isBeforeCutoffTime(menu.date);
  }, [menu.date]);

  const handleDeleteMenuClick = () => {
    if (!isFutureDate) {
      toast.error(
        "Não é possível excluir cardápios de datas passadas ou do dia atual.",
      );
      return;
    }

    deleteMenu(menu.id, {
      onSuccess: () => {
        toast.success("Cardápio deletado com sucesso.");
      },
      onError: (error: Error) => {
        const errorMessage =
          error?.message ||
          "Erro ao deletar cardápio. Verifique se não há reservas associadas.";
        toast.error(errorMessage);
      },
    });
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreVerticalIcon className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Ações</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setDetailsDialogIsOpen(true)}>
            <EyeIcon className="mr-2 h-4 w-4" />
            Ver Detalhes
          </DropdownMenuItem>

          {isUser && (
            <DropdownMenuItem
              onClick={() => setReservationDialogIsOpen(true)}
              disabled={hasReservation || !isBeforeCutoff}
            >
              <CalendarCheckIcon className="mr-2 h-4 w-4" />
              {hasReservation
                ? "Reserva já realizada"
                : !isBeforeCutoff
                  ? "Prazo expirado"
                  : "Fazer Reserva"}
            </DropdownMenuItem>
          )}

          {isAdmin && (
            <>
              <DropdownMenuItem onClick={() => setUpsertDialogIsOpen(true)}>
                <EditIcon className="mr-2 h-4 w-4" />
                Editar
              </DropdownMenuItem>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem
                    onSelect={(e) => e.preventDefault()}
                    disabled={!isFutureDate}
                  >
                    <TrashIcon className="mr-2 h-4 w-4" />
                    Excluir
                    {!isFutureDate && " (data passada)"}
                  </DropdownMenuItem>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Tem certeza que deseja deletar esse cardápio?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      Essa ação não pode ser revertida. Isso irá deletar o
                      cardápio permanentemente.
                      {!isFutureDate && (
                        <span className="text-destructive mt-2 block">
                          Atenção: Este cardápio é de uma data passada ou do dia
                          atual.
                        </span>
                      )}
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDeleteMenuClick}
                      disabled={isDeletePending || !isFutureDate}
                      className="text-white"
                    >
                      {isDeletePending ? "Deletando..." : "Deletar"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {isAdmin && upsertDialogIsOpen && (
        <Dialog open={upsertDialogIsOpen} onOpenChange={setUpsertDialogIsOpen}>
          <MenuFormDialog
            menu={menu}
            onSuccess={() => setUpsertDialogIsOpen(false)}
          />
        </Dialog>
      )}

      <Dialog open={detailsDialogIsOpen} onOpenChange={setDetailsDialogIsOpen}>
        <MenuDetailsDialog menu={menu} />
      </Dialog>

      {isUser && (
        <Dialog
          open={reservationDialogIsOpen}
          onOpenChange={setReservationDialogIsOpen}
        >
          <ReservationFormDialog
            menu={menu}
            onSuccess={() => setReservationDialogIsOpen(false)}
          />
        </Dialog>
      )}
    </>
  );
};

export default MenusTableActions;
