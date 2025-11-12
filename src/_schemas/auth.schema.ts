import { z } from "zod";

export const loginSchema = z.object({
  cpf: z
    .string()
    .length(11, "CPF deve conter exatamente 11 dígitos")
    .regex(/^\d{11}$/, "CPF deve conter apenas números"),
  password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
