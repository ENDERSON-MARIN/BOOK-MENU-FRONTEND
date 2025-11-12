import { PowerIcon } from "lucide-react";
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
import { DropdownMenuItem } from "@/_components/ui/dropdown-menu";
import { useToggleUserStatus } from "@/_hooks/mutations/use-toggle-user-status";
import { User } from "@/_types/user";

interface UserStatusToggleProps {
  user: User;
}

const UserStatusToggle = ({ user }: UserStatusToggleProps) => {
  const { mutate: toggleStatus, isPending } = useToggleUserStatus();

  const handleToggleStatus = () => {
    const newStatus = user.status === "ATIVO" ? "INATIVO" : "ATIVO";

    toggleStatus(
      { id: user.id, newStatus },
      {
        onSuccess: () => {
          const statusText = newStatus === "ATIVO" ? "ativado" : "desativado";
          toast.success(`Usuário ${statusText} com sucesso.`);
        },
        onError: () => {
          toast.error("Erro ao alterar status do usuário.");
        },
      },
    );
  };

  const isActive = user.status === "ATIVO";
  const actionText = isActive ? "Desativar" : "Ativar";
  const confirmTitle = isActive
    ? "Tem certeza que deseja desativar este usuário?"
    : "Tem certeza que deseja ativar este usuário?";
  const confirmDescription = isActive
    ? "O usuário não poderá mais acessar o sistema até ser reativado."
    : "O usuário poderá acessar o sistema novamente.";

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          <PowerIcon className="mr-2 h-4 w-4" />
          {actionText}
        </DropdownMenuItem>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{confirmTitle}</AlertDialogTitle>
          <AlertDialogDescription>{confirmDescription}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={handleToggleStatus} disabled={isPending}>
            {isPending ? "Processando..." : actionText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default UserStatusToggle;
