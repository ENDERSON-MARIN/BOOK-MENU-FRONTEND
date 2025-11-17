import { describe, expect, it } from "vitest";

import { categoryFormSchema } from "../category.schema";

describe("categoryFormSchema", () => {
  const validCategoryData = {
    name: "Proteína",
    description: "Carnes e proteínas",
    displayOrder: 1,
  };

  describe("name validation", () => {
    it("should accept name with 2 characters", () => {
      const result = categoryFormSchema.safeParse({
        ...validCategoryData,
        name: "Ab",
      });

      expect(result.success).toBe(true);
    });

    it("should accept name with 100 characters", () => {
      const result = categoryFormSchema.safeParse({
        ...validCategoryData,
        name: "a".repeat(100),
      });

      expect(result.success).toBe(true);
    });

    it("should reject name with less than 2 characters", () => {
      const result = categoryFormSchema.safeParse({
        ...validCategoryData,
        name: "A",
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          "Nome deve ter no mínimo 2 caracteres",
        );
      }
    });

    it("should reject name with more than 100 characters", () => {
      const result = categoryFormSchema.safeParse({
        ...validCategoryData,
        name: "a".repeat(101),
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          "Nome deve ter no máximo 100 caracteres",
        );
      }
    });
  });

  describe("description validation", () => {
    it("should accept description with 500 characters", () => {
      const result = categoryFormSchema.safeParse({
        ...validCategoryData,
        description: "a".repeat(500),
      });

      expect(result.success).toBe(true);
    });

    it("should accept empty string as description", () => {
      const result = categoryFormSchema.safeParse({
        ...validCategoryData,
        description: "",
      });

      expect(result.success).toBe(true);
    });

    it("should accept undefined description", () => {
      const result = categoryFormSchema.safeParse({
        name: "Proteína",
        displayOrder: 1,
      });

      expect(result.success).toBe(true);
    });

    it("should reject description with more than 500 characters", () => {
      const result = categoryFormSchema.safeParse({
        ...validCategoryData,
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

  describe("displayOrder validation", () => {
    it("should accept positive integer", () => {
      const result = categoryFormSchema.safeParse({
        ...validCategoryData,
        displayOrder: 5,
      });

      expect(result.success).toBe(true);
    });

    it("should reject zero", () => {
      const result = categoryFormSchema.safeParse({
        ...validCategoryData,
        displayOrder: 0,
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          "Ordem deve ser um número positivo",
        );
      }
    });

    it("should reject negative number", () => {
      const result = categoryFormSchema.safeParse({
        ...validCategoryData,
        displayOrder: -1,
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          "Ordem deve ser um número positivo",
        );
      }
    });

    it("should reject decimal number", () => {
      const result = categoryFormSchema.safeParse({
        ...validCategoryData,
        displayOrder: 1.5,
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          "Ordem deve ser um número inteiro",
        );
      }
    });
  });
});
