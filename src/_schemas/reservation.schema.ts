import { z } from "zod";

export const reservationFormSchema = z.object({
  menuId: z.string().uuid("Menu inválido"),
  menuVariationId: z.string().uuid("Selecione uma variação"),
  reservationDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Data inválida"),
});

export const updateReservationFormSchema = z.object({
  menuVariationId: z.string().uuid("Selecione uma variação"),
});

export type ReservationFormValues = z.infer<typeof reservationFormSchema>;
export type UpdateReservationFormValues = z.infer<
  typeof updateReservationFormSchema
>;
