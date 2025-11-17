import { describe, expect, it } from "vitest";

import { loginSchema } from "../auth.schema";

describe("loginSchema", () => {
  describe("cpf validation", () => {
    it("should accept valid 11-digit CPF", () => {
      const result = loginSchema.safeParse({
        cpf: "12345678901",
        password: "123456",
      });

      expect(result.success).toBe(true);
    });

    it("should reject CPF with less than 11 digits", () => {
      const result = loginSchema.safeParse({
        cpf: "1234567890",
        password: "123456",
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          "CPF deve conter exatamente 11 dígitos",
        );
      }
    });

    it("should reject CPF with more than 11 digits", () => {
      const result = loginSchema.safeParse({
        cpf: "123456789012",
        password: "123456",
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          "CPF deve conter exatamente 11 dígitos",
        );
      }
    });

    it("should reject CPF with non-numeric characters", () => {
      const result = loginSchema.safeParse({
        cpf: "123.456.789-01",
        password: "123456",
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          "CPF deve conter exatamente 11 dígitos",
        );
      }
    });

    it("should reject CPF with letters", () => {
      const result = loginSchema.safeParse({
        cpf: "1234567890a",
        password: "123456",
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          "CPF deve conter apenas números",
        );
      }
    });
  });

  describe("password validation", () => {
    it("should accept password with 6 characters", () => {
      const result = loginSchema.safeParse({
        cpf: "12345678901",
        password: "123456",
      });

      expect(result.success).toBe(true);
    });

    it("should accept password with more than 6 characters", () => {
      const result = loginSchema.safeParse({
        cpf: "12345678901",
        password: "12345678",
      });

      expect(result.success).toBe(true);
    });

    it("should reject password with less than 6 characters", () => {
      const result = loginSchema.safeParse({
        cpf: "12345678901",
        password: "12345",
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          "Senha deve ter no mínimo 6 caracteres",
        );
      }
    });

    it("should reject empty password", () => {
      const result = loginSchema.safeParse({
        cpf: "12345678901",
        password: "",
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          "Senha deve ter no mínimo 6 caracteres",
        );
      }
    });
  });
});
