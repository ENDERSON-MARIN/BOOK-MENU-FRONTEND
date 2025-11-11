import { z } from "zod";

export const categoryFormSchema = z.object({
  name: z
    .string()
    .min(2, "Nome deve ter no mínimo 2 caracteres")
    .max(100, "Nome deve ter no máximo 100 caracteres"),
  description: z
    .string()
    .max(500, "Descrição deve ter no máximo 500 caracteres")
    .optional()
    .or(z.literal("")),
  displayOrder: z
    .number()
    .int("Ordem deve ser um número inteiro")
    .positive("Ordem deve ser um número positivo"),
});

export type CategoryFormValues = z.infer<typeof categoryFormSchema>;
