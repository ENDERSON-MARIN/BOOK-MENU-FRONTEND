import { EditIcon, EyeIcon, MoreVerticalIcon, TrashIcon } from "lucide-react";
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
import { useDeleteMenu } from "@/_hooks/mutations/use-delete-menu";
import { useAuth } from "@/_hooks/use-auth";
import { isFutureDate as checkIsFutureDate } from "@/_lib/date-utils";
import { Menu } from "@/_types/menu";

import MenuDetailsDialog from "./menu-details-dialog";
import MenuFormDialog from "./menu-form-dialog";

interface MenusTableActionsProps {
  menu: Menu;
}

const MenusTableActions = ({ menu }: MenusTableActionsProps) => {
  const [upsertDialogIsOpen, setUpsertDialogIsOpen] = useState(false);
  const [detailsDialogIsOpen, setDetailsDialogIsOpen] = useState(false);
  const { user } = useAuth();
  const isAdmin = user?.role === "ADMIN";

  const { mutate: deleteMenu, isPending: isDeletePending } = useDeleteMenu();

  const isFutureDate = checkIsFutureDate(menu.date);

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
    </>
  );
};

export default MenusTableActions;
