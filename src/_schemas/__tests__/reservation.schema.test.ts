import { describe, expect, it } from "vitest";

import {
  reservationFormSchema,
  updateReservationFormSchema,
} from "../reservation.schema";

describe("reservationFormSchema", () => {
  const validReservationData = {
    menuId: "550e8400-e29b-41d4-a716-446655440000",
    menuVariationId: "550e8400-e29b-41d4-a716-446655440001",
    reservationDate: "2025-12-31",
  };

  describe("menuId validation", () => {
    it("should accept valid UUID", () => {
      const result = reservationFormSchema.safeParse(validReservationData);
      expect(result.success).toBe(true);
    });

    it("should reject invalid UUID", () => {
      const result = reservationFormSchema.safeParse({
        ...validReservationData,
        menuId: "invalid-uuid",
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe("Menu inválido");
      }
    });

    it("should reject empty string", () => {
      const result = reservationFormSchema.safeParse({
        ...validReservationData,
        menuId: "",
      });

      expect(result.success).toBe(false);
    });
  });

  describe("menuVariationId validation", () => {
    it("should accept valid UUID", () => {
      const result = reservationFormSchema.safeParse(validReservationData);
      expect(result.success).toBe(true);
    });

    it("should reject invalid UUID", () => {
      const result = reservationFormSchema.safeParse({
        ...validReservationData,
        menuVariationId: "invalid-uuid",
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe("Selecione uma variação");
      }
    });

    it("should reject empty string", () => {
      const result = reservationFormSchema.safeParse({
        ...validReservationData,
        menuVariationId: "",
      });

      expect(result.success).toBe(false);
    });
  });

  describe("reservationDate validation", () => {
    it("should accept valid date format YYYY-MM-DD", () => {
      const result = reservationFormSchema.safeParse(validReservationData);
      expect(result.success).toBe(true);
    });

    it("should reject invalid date format", () => {
      const result = reservationFormSchema.safeParse({
        ...validReservationData,
        reservationDate: "31/12/2025",
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe("Data inválida");
      }
    });

    it("should reject date without leading zeros", () => {
      const result = reservationFormSchema.safeParse({
        ...validReservationData,
        reservationDate: "2025-1-1",
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe("Data inválida");
      }
    });

    it("should reject empty date", () => {
      const result = reservationFormSchema.safeParse({
        ...validReservationData,
        reservationDate: "",
      });

      expect(result.success).toBe(false);
    });
  });
});

describe("updateReservationFormSchema", () => {
  const validUpdateData = {
    menuVariationId: "550e8400-e29b-41d4-a716-446655440001",
  };

  describe("menuVariationId validation", () => {
    it("should accept valid UUID", () => {
      const result = updateReservationFormSchema.safeParse(validUpdateData);
      expect(result.success).toBe(true);
    });

    it("should reject invalid UUID", () => {
      const result = updateReservationFormSchema.safeParse({
        menuVariationId: "invalid-uuid",
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe("Selecione uma variação");
      }
    });

    it("should reject empty string", () => {
      const result = updateReservationFormSchema.safeParse({
        menuVariationId: "",
      });

      expect(result.success).toBe(false);
    });
  });
});
