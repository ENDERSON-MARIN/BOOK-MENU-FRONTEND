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
import { useDeleteCategory } from "@/_hooks/mutations/use-delete-category";
import { useToggleCategoryStatus } from "@/_hooks/mutations/use-toggle-category-status";
import { Category } from "@/_types/category";

import CategoryFormDialog from "./category-form-dialog";

interface CategoriesTableActionsProps {
  category: Category;
}

const CategoriesTableActions = ({ category }: CategoriesTableActionsProps) => {
  const [upsertDialogIsOpen, setUpsertDialogIsOpen] = useState(false);

  const { mutate: deleteCategory, isPending: isDeletePending } =
    useDeleteCategory();

  const { mutate: toggleStatus, isPending: isTogglePending } =
    useToggleCategoryStatus();

  const handleDeleteCategoryClick = () => {
    deleteCategory(category.id, {
      onSuccess: () => {
        toast.success("Categoria deletada com sucesso.");
      },
      onError: (error: Error) => {
        const errorMessage =
          error?.message ||
          "Erro ao deletar categoria. Verifique se não há itens associados.";
        toast.error(errorMessage);
      },
    });
  };

  const handleToggleStatusClick = () => {
    toggleStatus(category.id, {
      onSuccess: () => {
        const newStatus = category.isActive ? "desativada" : "ativada";
        toast.success(`Categoria ${newStatus} com sucesso.`);
      },
      onError: () => {
        toast.error("Erro ao alterar status da categoria.");
      },
    });
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
            <DropdownMenuLabel>{category.name}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setUpsertDialogIsOpen(true)}>
              <EditIcon className="mr-2 h-4 w-4" />
              Editar
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={handleToggleStatusClick}
              disabled={isTogglePending}
            >
              {category.isActive ? (
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
                    Tem certeza que deseja deletar essa categoria?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    Essa ação não pode ser revertida. Isso irá deletar a
                    categoria permanentemente.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDeleteCategoryClick}
                    disabled={isDeletePending}
                  >
                    {isDeletePending ? "Deletando..." : "Deletar"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </DropdownMenuContent>
        </DropdownMenu>

        <CategoryFormDialog
          category={category}
          onSuccess={() => setUpsertDialogIsOpen(false)}
        />
      </Dialog>
    </>
  );
};

export default CategoriesTableActions;
