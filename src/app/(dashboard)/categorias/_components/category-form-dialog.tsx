"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/_components/ui/button";
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
import { Textarea } from "@/_components/ui/textarea";
import { useCreateCategory } from "@/_hooks/mutations/use-create-category";
import { useUpdateCategory } from "@/_hooks/mutations/use-update-category";
import {
  categoryFormSchema,
  type CategoryFormValues,
} from "@/_schemas/category.schema";
import type { Category } from "@/_types/category";

interface CategoryFormDialogProps {
  category?: Category;
  onSuccess: () => void;
}

const CategoryFormDialog = ({
  category,
  onSuccess,
}: CategoryFormDialogProps) => {
  const isEditing = !!category;

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      name: category?.name || "",
      description: category?.description || "",
      displayOrder: category?.displayOrder || 1,
    },
  });

  // Reset form when category changes
  useEffect(() => {
    if (category) {
      form.reset({
        name: category.name,
        description: category.description || "",
        displayOrder: category.displayOrder,
      });
    } else {
      form.reset({
        name: "",
        description: "",
        displayOrder: 1,
      });
    }
  }, [category, form]);

  const { mutate: createCategory, isPending: isCreating } = useCreateCategory();
  const { mutate: updateCategory, isPending: isUpdating } = useUpdateCategory();

  const isPending = isCreating || isUpdating;

  const onSubmit = (data: CategoryFormValues) => {
    if (isEditing) {
      updateCategory(
        {
          id: category.id,
          data: {
            name: data.name,
            description: data.description || undefined,
            displayOrder: data.displayOrder,
          },
        },
        {
          onSuccess: () => {
            toast.success("Categoria atualizada com sucesso.");
            onSuccess();
          },
          onError: (error: Error) => {
            const errorMessage =
              error?.message || "Erro ao atualizar categoria.";

            // Check for duplicate name error
            if (
              errorMessage.toLowerCase().includes("já existe") ||
              errorMessage.toLowerCase().includes("duplicado") ||
              errorMessage.toLowerCase().includes("duplicate")
            ) {
              toast.error("Já existe uma categoria com este nome.");
            } else {
              toast.error(errorMessage);
            }
          },
        },
      );
    } else {
      createCategory(
        {
          name: data.name,
          description: data.description || undefined,
          displayOrder: data.displayOrder,
        },
        {
          onSuccess: () => {
            toast.success("Categoria criada com sucesso.");
            form.reset();
            onSuccess();
          },
          onError: (error: Error) => {
            const errorMessage = error?.message || "Erro ao criar categoria.";

            // Check for duplicate name error
            if (
              errorMessage.toLowerCase().includes("já existe") ||
              errorMessage.toLowerCase().includes("duplicado") ||
              errorMessage.toLowerCase().includes("duplicate")
            ) {
              toast.error("Já existe uma categoria com este nome.");
            } else {
              toast.error(errorMessage);
            }
          },
        },
      );
    }
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>
          {isEditing ? "Editar Categoria" : "Nova Categoria"}
        </DialogTitle>
        <DialogDescription>
          {isEditing
            ? "Atualize as informações da categoria abaixo."
            : "Preencha os campos abaixo para criar uma nova categoria."}
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
                    placeholder="Ex: Proteína, Acompanhamento, Salada..."
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
                    placeholder="Descreva a categoria..."
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
            name="displayOrder"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ordem de Exibição</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={1}
                    placeholder="1"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    disabled={isPending}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <DialogFooter>
            <Button className="text-white" type="submit" disabled={isPending}>
              {isPending
                ? isEditing
                  ? "Atualizando..."
                  : "Criando..."
                : isEditing
                  ? "Atualizar"
                  : "Criar"}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
};

export default CategoryFormDialog;
