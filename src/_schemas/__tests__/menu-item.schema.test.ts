import { describe, expect, it } from "vitest";

import { menuItemFormSchema } from "../menu-item.schema";

describe("menuItemFormSchema", () => {
  const validMenuItemData = {
    name: "Arroz",
    description: "Arroz branco cozido",
    categoryId: "550e8400-e29b-41d4-a716-446655440000",
  };

  describe("name validation", () => {
    it("should accept name with 2 characters", () => {
      const result = menuItemFormSchema.safeParse({
        ...validMenuItemData,
        name: "Ab",
      });

      expect(result.success).toBe(true);
    });

    it("should accept name with 200 characters", () => {
      const result = menuItemFormSchema.safeParse({
        ...validMenuItemData,
        name: "a".repeat(200),
      });

      expect(result.success).toBe(true);
    });

    it("should reject name with less than 2 characters", () => {
      const result = menuItemFormSchema.safeParse({
        ...validMenuItemData,
        name: "A",
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          "Nome deve ter no mínimo 2 caracteres",
        );
      }
    });

    it("should reject name with more than 200 characters", () => {
      const result = menuItemFormSchema.safeParse({
        ...validMenuItemData,
        name: "a".repeat(201),
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          "Nome deve ter no máximo 200 caracteres",
        );
      }
    });
  });

  describe("description validation", () => {
    it("should accept description with 500 characters", () => {
      const result = menuItemFormSchema.safeParse({
        ...validMenuItemData,
        description: "a".repeat(500),
      });

      expect(result.success).toBe(true);
    });

    it("should accept undefined description", () => {
      const result = menuItemFormSchema.safeParse({
        name: "Arroz",
        categoryId: "550e8400-e29b-41d4-a716-446655440000",
      });

      expect(result.success).toBe(true);
    });

    it("should reject description with more than 500 characters", () => {
      const result = menuItemFormSchema.safeParse({
        ...validMenuItemData,
        description: "a".repeat(501),
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          "Descrição deve ter no máximo 500 caracteres",
        );
      }
    });
  });

  describe("categoryId validation", () => {
    it("should accept valid UUID", () => {
      const result = menuItemFormSchema.safeParse({
        ...validMenuItemData,
        categoryId: "550e8400-e29b-41d4-a716-446655440000",
      });

      expect(result.success).toBe(true);
    });

    it("should reject empty string", () => {
      const result = menuItemFormSchema.safeParse({
        ...validMenuItemData,
        categoryId: "",
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe("Selecione uma categoria");
      }
    });

    it("should reject invalid UUID format", () => {
      const result = menuItemFormSchema.safeParse({
        ...validMenuItemData,
        categoryId: "invalid-uuid",
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          "Selecione uma categoria válida",
        );
      }
    });

    it("should reject non-UUID string", () => {
      const result = menuItemFormSchema.safeParse({
        ...validMenuItemData,
        categoryId: "12345",
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          "Selecione uma categoria válida",
        );
      }
    });
  });
});
