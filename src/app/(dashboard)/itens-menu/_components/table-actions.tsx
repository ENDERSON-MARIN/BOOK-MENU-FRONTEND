import {
  CheckCircleIcon,
  EditIcon,
  MoreVerticalIcon,
  TrashIcon,
  XCircleIcon,
} from "lucide-react";
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
import { useDeleteMenuItem } from "@/_hooks/mutations/use-delete-menu-item";
import { useUpdateMenuItem } from "@/_hooks/mutations/use-update-menu-item";
import { MenuItem } from "@/_types/menu-item";

import MenuItemFormDialog from "./menu-item-form-dialog";

interface MenuItemsTableActionsProps {
  menuItem: MenuItem;
}

const MenuItemsTableActions = ({ menuItem }: MenuItemsTableActionsProps) => {
  const [upsertDialogIsOpen, setUpsertDialogIsOpen] = useState(false);

  const { mutate: deleteMenuItem, isPending: isDeletePending } =
    useDeleteMenuItem();

  const { mutate: updateMenuItem, isPending: isTogglePending } =
    useUpdateMenuItem();

  const handleDeleteMenuItemClick = () => {
    deleteMenuItem(menuItem.id, {
      onSuccess: () => {
        toast.success("Item de menu deletado com sucesso.");
      },
      onError: (error: Error) => {
        const errorMessage =
          error?.message ||
          "Erro ao deletar item de menu. Verifique se não está sendo usado em cardápios ativos.";
        toast.error(errorMessage);
      },
    });
  };

  const handleToggleStatusClick = () => {
    updateMenuItem(
      {
        id: menuItem.id,
        data: { isActive: !menuItem.isActive },
      },
      {
        onSuccess: () => {
          const newStatus = menuItem.isActive ? "desativado" : "ativado";
          toast.success(`Item de menu ${newStatus} com sucesso.`);
        },
        onError: () => {
          toast.error("Erro ao alterar status do item de menu.");
        },
      },
    );
  };

  return (
    <>
      <Dialog open={upsertDialogIsOpen} onOpenChange={setUpsertDialogIsOpen}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVerticalIcon className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>{menuItem.name}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setUpsertDialogIsOpen(true)}>
              <EditIcon className="mr-2 h-4 w-4" />
              Editar
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={handleToggleStatusClick}
              disabled={isTogglePending}
            >
              {menuItem.isActive ? (
                <>
                  <XCircleIcon className="mr-2 h-4 w-4" />
                  Desativar
                </>
              ) : (
                <>
                  <CheckCircleIcon className="mr-2 h-4 w-4" />
                  Ativar
                </>
              )}
            </DropdownMenuItem>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  <TrashIcon className="mr-2 h-4 w-4" />
                  Excluir
                </DropdownMenuItem>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Tem certeza que deseja deletar esse item de menu?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    Essa ação não pode ser revertida. Isso irá deletar o item de
                    menu permanentemente.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDeleteMenuItemClick}
                    disabled={isDeletePending}
                    className="text-white"
                  >
                    {isDeletePending ? "Deletando..." : "Deletar"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </DropdownMenuContent>
        </DropdownMenu>

        <MenuItemFormDialog
          menuItem={menuItem}
          onSuccess={() => setUpsertDialogIsOpen(false)}
        />
      </Dialog>
    </>
  );
};

export default MenuItemsTableActions;
