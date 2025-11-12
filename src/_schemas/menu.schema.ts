import { z } from "zod";

export const menuFormSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Data inválida"),
  dayOfWeek: z.enum([
    "MONDAY",
    "TUESDAY",
    "WEDNESDAY",
    "THURSDAY",
    "FRIDAY",
    "SATURDAY",
    "SUNDAY",
  ]),
  observations: z
    .string()
    .max(500, "Observações devem ter no máximo 500 caracteres")
    .optional()
    .or(z.literal("")),
  menuCompositions: z
    .array(
      z.object({
        menuItemId: z.string().uuid(),
        isMainProtein: z.boolean(),
      }),
    )
    .min(1, "Selecione pelo menos um item"),
});

export type MenuFormValues = z.infer<typeof menuFormSchema>;
