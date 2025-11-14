"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
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
import { Textarea } from "@/_components/ui/textarea";
import { useCreateMenuItem } from "@/_hooks/mutations/use-create-menu-item";
import { useUpdateMenuItem } from "@/_hooks/mutations/use-update-menu-item";
import { useGetCategories } from "@/_hooks/queries/use-get-categories";
import {
  menuItemFormSchema,
  type MenuItemFormValues,
} from "@/_schemas/menu-item.schema";
import type { MenuItem } from "@/_types/menu-item";

interface MenuItemFormDialogProps {
  menuItem?: MenuItem;
  onSuccess: () => void;
}

const MenuItemFormDialog = ({
  menuItem,
  onSuccess,
}: MenuItemFormDialogProps) => {
  const isEditing = !!menuItem;

  const form = useForm<MenuItemFormValues>({
    resolver: zodResolver(menuItemFormSchema),
    mode: "onChange",
    defaultValues: {
      name: menuItem?.name || "",
      description: menuItem?.description || "",
      categoryId: menuItem?.categoryId || "",
    },
  });

  // Reset form when menuItem changes
  useEffect(() => {
    if (menuItem) {
      form.reset({
        name: menuItem.name,
        description: menuItem.description || "",
        categoryId: menuItem.categoryId,
      });
    } else {
      form.reset({
        name: "",
        description: "",
        categoryId: "",
      });
    }
  }, [menuItem, form]);

  const { data: allCategories, isLoading: isLoadingCategories } =
    useGetCategories({ isActive: true });

  // Filter active categories on client side as additional safety
  const categories = allCategories?.filter((cat) => cat.isActive);

  const { mutate: createMenuItem, isPending: isCreating } = useCreateMenuItem();
  const { mutate: updateMenuItem, isPending: isUpdating } = useUpdateMenuItem();

  const isPending = isCreating || isUpdating;

  const onSubmit = (data: MenuItemFormValues) => {
    // Validate that selected category is active
    const selectedCategory = categories?.find(
      (cat) => cat.id === data.categoryId,
    );
    if (!selectedCategory || !selectedCategory.isActive) {
      toast.error(
        "A categoria selecionada está inativa. Por favor, selecione uma categoria ativa.",
      );
      return;
    }

    const payload = {
      name: data.name.trim(),
      description: data.description?.trim() || undefined,
      categoryId: data.categoryId,
    };

    if (isEditing) {
      updateMenuItem(
        {
          id: menuItem.id,
          data: payload,
        },
        {
          onSuccess: () => {
            toast.success("Item de menu atualizado com sucesso.");
            onSuccess();
          },
          onError: (error: Error) => {
            const errorMessage =
              error?.message || "Erro ao atualizar item de menu.";
            toast.error(errorMessage);
            console.error("Erro ao atualizar item:", error);
          },
        },
      );
    } else {
      createMenuItem(payload, {
        onSuccess: () => {
          toast.success("Item de menu criado com sucesso.");
          form.reset();
          onSuccess();
        },
        onError: (error: Error) => {
          const errorMessage = error?.message || "Erro ao criar item de menu.";
          toast.error(errorMessage);
          console.error("Erro ao criar item:", error);
        },
      });
    }
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>
          {isEditing ? "Editar Item de Menu" : "Novo Item de Menu"}
        </DialogTitle>
        <DialogDescription>
          {isEditing
            ? "Atualize as informações do item de menu abaixo."
            : "Preencha os campos abaixo para criar um novo item de menu."}
        </DialogDescription>
      </DialogHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Ex: Frango Grelhado, Arroz Integral..."
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
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descrição (opcional)</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Descreva o item de menu..."
                    rows={3}
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
            name="categoryId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Categoria</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  value={field.value}
                  disabled={isPending || isLoadingCategories}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione uma categoria" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories?.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
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

export default MenuItemFormDialog;
