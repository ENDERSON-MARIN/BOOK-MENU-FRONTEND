"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { PatternFormat } from "react-number-format";
import { toast } from "sonner";

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
import { Input } from "@/_components/ui/input";
import { LoadingButton } from "@/_components/ui/loading-button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/_components/ui/select";
import { useCreateUser } from "@/_hooks/mutations/use-create-user";
import { useUpdateUser } from "@/_hooks/mutations/use-update-user";
import {
  updateUserFormSchema,
  type UpdateUserFormValues,
  userFormSchema,
  type UserFormValues,
} from "@/_schemas/user.schema";
import type { User } from "@/_types/user";

interface UserFormDialogProps {
  user?: User;
  onSuccess: () => void;
}

const UserFormDialog = ({ user, onSuccess }: UserFormDialogProps) => {
  const isEditing = !!user;

  const { mutate: createUser, isPending: isCreating } = useCreateUser();
  const { mutate: updateUser, isPending: isUpdating } = useUpdateUser();

  const isPending = isCreating || isUpdating;

  const form = useForm<UserFormValues | UpdateUserFormValues>({
    resolver: zodResolver(isEditing ? updateUserFormSchema : userFormSchema),
    mode: "onChange",
    defaultValues: isEditing
      ? {
          name: user.name,
          password: "",
          role: user.role,
          userType: user.userType,
        }
      : {
          cpf: "",
          name: "",
          password: "",
          role: undefined,
          userType: undefined,
        },
  });

  useEffect(() => {
    if (user) {
      form.reset({
        name: user.name,
        password: "",
        role: user.role,
        userType: user.userType,
      });
    }
  }, [user, form]);

  const onSubmit = (data: UserFormValues | UpdateUserFormValues) => {
    console.log("Dados do formulário:", data);

    if (isEditing) {
      const updateData = data as UpdateUserFormValues;
      const payload = {
        name: updateData.name,
        role: updateData.role,
        userType: updateData.userType,
        ...(updateData.password && { password: updateData.password }),
      };

      console.log("Payload de atualização:", payload);

      updateUser(
        { id: user.id, data: payload },
        {
          onSuccess: () => {
            toast.success("Usuário atualizado com sucesso.");
            form.reset();
            onSuccess();
          },
          onError: (error) => {
            console.error("Erro ao atualizar usuário:", error);
            toast.error(
              error.message || "Erro ao atualizar usuário. Tente novamente.",
            );
          },
        },
      );
    } else {
      const createData = data as UserFormValues;
      console.log("Payload de criação:", createData);

      createUser(createData, {
        onSuccess: () => {
          toast.success("Usuário criado com sucesso.");
          form.reset();
          onSuccess();
        },
        onError: (error) => {
          console.error("Erro ao criar usuário:", error);
          if (error.message?.includes("CPF")) {
            form.setError("cpf", {
              type: "manual",
              message: "Já existe um usuário com este CPF no sistema",
            });
          }
          toast.error(
            error.message || "Erro ao criar usuário. Tente novamente.",
          );
        },
      });
    }
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>
          {isEditing ? "Editar Usuário" : "Novo Usuário"}
        </DialogTitle>
        <DialogDescription>
          {isEditing
            ? "Atualize as informações do usuário abaixo."
            : "Preencha os dados para criar um novo usuário."}
        </DialogDescription>
      </DialogHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {!isEditing && (
            <FormField
              control={form.control}
              name="cpf"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CPF</FormLabel>
                  <FormControl>
                    <PatternFormat
                      format="###.###.###-##"
                      mask="_"
                      customInput={Input}
                      placeholder="000.000.000-00"
                      value={field.value}
                      onValueChange={(values) => {
                        field.onChange(values.value);
                      }}
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Digite o nome completo"
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    name={field.name}
                    disabled={isPending}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {isEditing ? "Nova Senha (opcional)" : "Senha"}
                </FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder={
                      isEditing
                        ? "Deixe em branco para manter a senha atual"
                        : "Digite a senha"
                    }
                    {...field}
                    disabled={isPending}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Perfil</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  disabled={isPending}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione um perfil" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="ADMIN">Administrador</SelectItem>
                    <SelectItem value="USER">Usuário</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="userType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  disabled={isPending}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione um tipo" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="FIXO">Fixo</SelectItem>
                    <SelectItem value="NAO_FIXO">Não Fixo</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <DialogFooter>
            <LoadingButton
              className="w-full text-white"
              type="submit"
              isLoading={isPending}
              disabled={isPending || !form.formState.isValid}
              loadingText={isEditing ? "Atualizando..." : "Criando..."}
            >
              {isEditing ? "Atualizar" : "Criar"}
            </LoadingButton>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
};

export default UserFormDialog;
