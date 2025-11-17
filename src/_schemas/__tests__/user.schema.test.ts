import { describe, expect, it } from "vitest";

import { updateUserFormSchema, userFormSchema } from "../user.schema";

describe("userFormSchema", () => {
  const validUserData = {
    cpf: "12345678901",
    name: "João Silva",
    password: "123456",
    role: "USER" as const,
    userType: "FIXO" as const,
  };

  describe("cpf validation", () => {
    it("should accept valid 11-digit CPF", () => {
      const result = userFormSchema.safeParse(validUserData);
      expect(result.success).toBe(true);
    });

    it("should reject CPF with less than 11 digits", () => {
      const result = userFormSchema.safeParse({
        ...validUserData,
        cpf: "1234567890",
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          "CPF deve conter exatamente 11 dígitos",
        );
      }
    });

    it("should reject CPF with non-numeric characters", () => {
      const result = userFormSchema.safeParse({
        ...validUserData,
        cpf: "123.456.789-01",
      });

      expect(result.success).toBe(false);
    });
  });

  describe("name validation", () => {
    it("should accept name with 3 characters", () => {
      const result = userFormSchema.safeParse({
        ...validUserData,
        name: "Ana",
      });

      expect(result.success).toBe(true);
    });

    it("should accept name with 255 characters", () => {
      const result = userFormSchema.safeParse({
        ...validUserData,
        name: "a".repeat(255),
      });

      expect(result.success).toBe(true);
    });

    it("should reject name with less than 3 characters", () => {
      const result = userFormSchema.safeParse({
        ...validUserData,
        name: "Jo",
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          "Nome deve ter no mínimo 3 caracteres",
        );
      }
    });

    it("should reject name with more than 255 characters", () => {
      const result = userFormSchema.safeParse({
        ...validUserData,
        name: "a".repeat(256),
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          "Nome deve ter no máximo 255 caracteres",
        );
      }
    });
  });

  describe("password validation", () => {
    it("should accept password with 6 characters", () => {
      const result = userFormSchema.safeParse({
        ...validUserData,
        password: "123456",
      });

      expect(result.success).toBe(true);
    });

    it("should reject password with less than 6 characters", () => {
      const result = userFormSchema.safeParse({
        ...validUserData,
        password: "12345",
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          "Senha deve ter no mínimo 6 caracteres",
        );
      }
    });
  });

  describe("role validation", () => {
    it("should accept ADMIN role", () => {
      const result = userFormSchema.safeParse({
        ...validUserData,
        role: "ADMIN",
      });

      expect(result.success).toBe(true);
    });

    it("should accept USER role", () => {
      const result = userFormSchema.safeParse({
        ...validUserData,
        role: "USER",
      });

      expect(result.success).toBe(true);
    });

    it("should reject invalid role", () => {
      const result = userFormSchema.safeParse({
        ...validUserData,
        role: "INVALID",
      });

      expect(result.success).toBe(false);
    });
  });

  describe("userType validation", () => {
    it("should accept FIXO type", () => {
      const result = userFormSchema.safeParse({
        ...validUserData,
        userType: "FIXO",
      });

      expect(result.success).toBe(true);
    });

    it("should accept NAO_FIXO type", () => {
      const result = userFormSchema.safeParse({
        ...validUserData,
        userType: "NAO_FIXO",
      });

      expect(result.success).toBe(true);
    });

    it("should reject invalid userType", () => {
      const result = userFormSchema.safeParse({
        ...validUserData,
        userType: "INVALID",
      });

      expect(result.success).toBe(false);
    });
  });
});

describe("updateUserFormSchema", () => {
  const validUpdateData = {
    name: "João Silva",
    role: "USER" as const,
    userType: "FIXO" as const,
  };

  it("should accept valid update data without password", () => {
    const result = updateUserFormSchema.safeParse(validUpdateData);
    expect(result.success).toBe(true);
  });

  it("should accept valid update data with password", () => {
    const result = updateUserFormSchema.safeParse({
      ...validUpdateData,
      password: "123456",
    });

    expect(result.success).toBe(true);
  });

  it("should accept empty string as password", () => {
    const result = updateUserFormSchema.safeParse({
      ...validUpdateData,
      password: "",
    });

    expect(result.success).toBe(true);
  });

  it("should reject password with less than 6 characters", () => {
    const result = updateUserFormSchema.safeParse({
      ...validUpdateData,
      password: "12345",
    });

    expect(result.success).toBe(false);
  });

  it("should not require cpf field", () => {
    const result = updateUserFormSchema.safeParse({
      ...validUpdateData,
      cpf: "12345678901",
    });

    // CPF should not be in the schema
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).not.toHaveProperty("cpf");
    }
  });
});
