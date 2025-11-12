import { z } from "zod";

export const menuItemFormSchema = z.object({
  name: z
    .string()
    .min(2, "Nome deve ter no mínimo 2 caracteres")
    .max(200, "Nome deve ter no máximo 200 caracteres"),
  description: z
    .string()
    .max(500, "Descrição deve ter no máximo 500 caracteres")
    .optional(),
  categoryId: z
    .string()
    .min(1, "Selecione uma categoria")
    .uuid("Selecione uma categoria válida"),
});

export type MenuItemFormValues = z.infer<typeof menuItemFormSchema>;
