import dayjs from "dayjs";
import { describe, expect, it } from "vitest";

import {
  formatDateBR,
  formatDateTimeBR,
  getDayOfWeekName,
  getTodayFormatted,
  isBeforeCutoffTime,
  isFutureDate,
} from "../date-utils";

describe("date-utils", () => {
  describe("isBeforeCutoffTime", () => {
    it("deve retornar true para datas futuras (sempre antes do cutoff)", () => {
      const tomorrow = dayjs().add(1, "day").format("YYYY-MM-DD");
      const result = isBeforeCutoffTime(tomorrow);

      expect(result).toBe(true);
    });

    it("deve retornar true para datas muito futuras", () => {
      const nextWeek = dayjs().add(7, "days").format("YYYY-MM-DD");
      const result = isBeforeCutoffTime(nextWeek);

      expect(result).toBe(true);
    });

    it("deve retornar false para datas passadas", () => {
      const yesterday = dayjs().subtract(1, "day").format("YYYY-MM-DD");
      const result = isBeforeCutoffTime(yesterday);

      expect(result).toBe(false);
    });

    it("deve retornar false para data inválida", () => {
      const result = isBeforeCutoffTime("invalid-date");

      expect(result).toBe(false);
    });

    it("deve validar corretamente para data de hoje baseado no horário atual", () => {
      const today = dayjs().format("YYYY-MM-DD");
      const result = isBeforeCutoffTime(today);
      const currentHour = dayjs().hour();
      const currentMinute = dayjs().minute();

      // Se for antes das 8:30, deve retornar true
      // Se for 8:30 ou depois, deve retornar false
      const shouldBeBeforeCutoff =
        currentHour < 8 || (currentHour === 8 && currentMinute < 30);

      expect(result).toBe(shouldBeBeforeCutoff);
    });
  });

  describe("formatDateBR", () => {
    it("deve formatar data no formato brasileiro (DD/MM/YYYY)", () => {
      const date = "2024-03-15";
      const result = formatDateBR(date);

      expect(result).toBe("15/03/2024");
    });

    it("deve formatar string de data ISO no formato brasileiro", () => {
      const date = "2024-12-25T00:00:00";
      const result = formatDateBR(date);

      expect(result).toBe("25/12/2024");
    });
  });

  describe("formatDateTimeBR", () => {
    it("deve formatar data e hora no formato brasileiro (DD/MM/YYYY HH:mm)", () => {
      const dateTime = "2024-03-15T14:30:00";
      const result = formatDateTimeBR(dateTime);

      expect(result).toBe("15/03/2024 14:30");
    });

    it("deve formatar string ISO com hora no formato brasileiro", () => {
      const dateTime = "2024-12-25T09:15:00";
      const result = formatDateTimeBR(dateTime);

      expect(result).toBe("25/12/2024 09:15");
    });
  });

  describe("getDayOfWeekName", () => {
    it("deve retornar nome correto para segunda-feira", () => {
      // 2024-01-01 é uma segunda-feira
      const date = "2024-01-01";
      const result = getDayOfWeekName(date);

      expect(result).toBe("Segunda-feira");
    });

    it("deve retornar nome correto para domingo", () => {
      // 2024-01-07 é um domingo
      const date = "2024-01-07";
      const result = getDayOfWeekName(date);

      expect(result).toBe("Domingo");
    });

    it("deve retornar nome correto para sexta-feira", () => {
      // 2024-01-05 é uma sexta-feira
      const date = "2024-01-05";
      const result = getDayOfWeekName(date);

      expect(result).toBe("Sexta-feira");
    });
  });

  describe("isFutureDate", () => {
    it("deve retornar true para data futura", () => {
      const tomorrow = dayjs().add(1, "day").format("YYYY-MM-DD");
      const result = isFutureDate(tomorrow);

      expect(result).toBe(true);
    });

    it("deve retornar false para data passada", () => {
      const yesterday = dayjs().subtract(1, "day").format("YYYY-MM-DD");
      const result = isFutureDate(yesterday);

      expect(result).toBe(false);
    });

    it("deve retornar false para data de hoje", () => {
      const today = dayjs().format("YYYY-MM-DD");
      const result = isFutureDate(today);

      expect(result).toBe(false);
    });
  });

  describe("getTodayFormatted", () => {
    it("deve retornar data de hoje no formato YYYY-MM-DD", () => {
      const result = getTodayFormatted();
      const expected = dayjs().format("YYYY-MM-DD");

      expect(result).toBe(expected);
    });

    it("deve retornar string no formato correto", () => {
      const result = getTodayFormatted();

      expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });
  });
});
