import { z } from "zod";

export const userFormSchema = z.object({
  cpf: z
    .string()
    .length(11, "CPF deve conter exatamente 11 dígitos")
    .regex(/^\d{11}$/, "CPF deve conter apenas números"),
  name: z
    .string()
    .min(3, "Nome deve ter no mínimo 3 caracteres")
    .max(255, "Nome deve ter no máximo 255 caracteres"),
  password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
  role: z.enum(["ADMIN", "USER"], {
    message: "Selecione um perfil",
  }),
  userType: z.enum(["FIXO", "NAO_FIXO"], {
    message: "Selecione um tipo",
  }),
});

export const updateUserFormSchema = userFormSchema
  .omit({ cpf: true, password: true })
  .extend({
    password: z.string().min(6).optional().or(z.literal("")),
  });

export type UserFormValues = z.infer<typeof userFormSchema>;
export type UpdateUserFormValues = z.infer<typeof updateUserFormSchema>;
