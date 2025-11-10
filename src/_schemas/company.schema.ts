import { z } from "zod";

export const companyFormSchema = z.object({
  name: z.string().trim().min(3, "O nome deve ter no mínimo 3 caracteres."),
  cnpj: z.string().trim().length(14, "O CNPJ deve ter exatamente 14 dígitos."),
  email: z.string().trim().email("Formato de e-mail inválido."),
  phone: z.string().optional(),
  address: z.string().optional(),
});

export type CompanyFormValues = z.infer<typeof companyFormSchema>;
