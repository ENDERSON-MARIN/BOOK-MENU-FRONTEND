import { describe, expect, it } from "vitest";

import { menuFormSchema } from "../menu.schema";

describe("menuFormSchema", () => {
  const validMenuData = {
    date: "2025-12-31",
    dayOfWeek: "FRIDAY" as const,
    observations: "Cardápio especial",
    menuCompositions: [
      {
        menuItemId: "550e8400-e29b-41d4-a716-446655440000",
        isMainProtein: true,
      },
    ],
  };

  describe("date validation", () => {
    it("should accept valid date format YYYY-MM-DD", () => {
      const result = menuFormSchema.safeParse(validMenuData);
      expect(result.success).toBe(true);
    });

    it("should reject invalid date format", () => {
      const result = menuFormSchema.safeParse({
        ...validMenuData,
        date: "31/12/2025",
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe("Data inválida");
      }
    });

    it("should reject date without leading zeros", () => {
      const result = menuFormSchema.safeParse({
        ...validMenuData,
        date: "2025-1-1",
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe("Data inválida");
      }
    });

    it("should reject empty date", () => {
      const result = menuFormSchema.safeParse({
        ...validMenuData,
        date: "",
      });

      expect(result.success).toBe(false);
    });
  });

  describe("dayOfWeek validation", () => {
    const daysOfWeek = [
      "MONDAY",
      "TUESDAY",
      "WEDNESDAY",
      "THURSDAY",
      "FRIDAY",
      "SATURDAY",
      "SUNDAY",
    ] as const;

    daysOfWeek.forEach((day) => {
      it(`should accept ${day}`, () => {
        const result = menuFormSchema.safeParse({
          ...validMenuData,
          dayOfWeek: day,
        });

        expect(result.success).toBe(true);
      });
    });

    it("should reject invalid day of week", () => {
      const result = menuFormSchema.safeParse({
        ...validMenuData,
        dayOfWeek: "INVALID",
      });

      expect(result.success).toBe(false);
    });
  });

  describe("observations validation", () => {
    it("should accept observations with 500 characters", () => {
      const result = menuFormSchema.safeParse({
        ...validMenuData,
        observations: "a".repeat(500),
      });

      expect(result.success).toBe(true);
    });

    it("should accept empty string as observations", () => {
      const result = menuFormSchema.safeParse({
        ...validMenuData,
        observations: "",
      });

      expect(result.success).toBe(true);
    });

    it("should accept undefined observations", () => {
      const { observations, ...dataWithoutObservations } = validMenuData;
      const result = menuFormSchema.safeParse(dataWithoutObservations);

      expect(result.success).toBe(true);
    });

    it("should reject observations with more than 500 characters", () => {
      const result = menuFormSchema.safeParse({
        ...validMenuData,
        observations: "a".repeat(501),
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          "Observações devem ter no máximo 500 caracteres",
        );
      }
    });
  });

  describe("menuCompositions validation", () => {
    it("should accept array with one item", () => {
      const result = menuFormSchema.safeParse(validMenuData);
      expect(result.success).toBe(true);
    });

    it("should accept array with multiple items", () => {
      const result = menuFormSchema.safeParse({
        ...validMenuData,
        menuCompositions: [
          {
            menuItemId: "550e8400-e29b-41d4-a716-446655440000",
            isMainProtein: true,
          },
          {
            menuItemId: "550e8400-e29b-41d4-a716-446655440001",
            isMainProtein: false,
          },
        ],
      });

      expect(result.success).toBe(true);
    });

    it("should reject empty array", () => {
      const result = menuFormSchema.safeParse({
        ...validMenuData,
        menuCompositions: [],
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          "Selecione pelo menos um item",
        );
      }
    });

    it("should reject composition with invalid UUID", () => {
      const result = menuFormSchema.safeParse({
        ...validMenuData,
        menuCompositions: [
          {
            menuItemId: "invalid-uuid",
            isMainProtein: true,
          },
        ],
      });

      expect(result.success).toBe(false);
    });

    it("should reject composition without isMainProtein", () => {
      const result = menuFormSchema.safeParse({
        ...validMenuData,
        menuCompositions: [
          {
            menuItemId: "550e8400-e29b-41d4-a716-446655440000",
          },
        ],
      });

      expect(result.success).toBe(false);
    });
  });
});
