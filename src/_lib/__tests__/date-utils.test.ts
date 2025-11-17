import dayjs from "dayjs";
import { beforeEach, describe, expect, it, vi } from "vitest";

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
    beforeEach(() => {
      vi.useFakeTimers();
    });

    it("should return true when current time is before 8:30 AM on meal date", () => {
      const mealDate = dayjs().format("YYYY-MM-DD");
      vi.setSystemTime(dayjs().hour(8).minute(0).second(0).toDate());

      const result = isBeforeCutoffTime(mealDate);

      expect(result).toBe(true);
    });

    it("should return false when current time is after 8:30 AM on meal date", () => {
      const mealDate = dayjs().format("YYYY-MM-DD");
      vi.setSystemTime(dayjs().hour(9).minute(0).second(0).toDate());

      const result = isBeforeCutoffTime(mealDate);

      expect(result).toBe(false);
    });

    it("should return false when current time is exactly 8:30 AM on meal date", () => {
      const mealDate = dayjs().format("YYYY-MM-DD");
      vi.setSystemTime(dayjs().hour(8).minute(30).second(0).toDate());

      const result = isBeforeCutoffTime(mealDate);

      expect(result).toBe(false);
    });

    it("should return true when meal date is in the future", () => {
      const mealDate = dayjs().add(1, "day").format("YYYY-MM-DD");
      vi.setSystemTime(dayjs().hour(10).minute(0).second(0).toDate());

      const result = isBeforeCutoffTime(mealDate);

      expect(result).toBe(true);
    });

    it("should return false when meal date is in the past", () => {
      const mealDate = dayjs().subtract(1, "day").format("YYYY-MM-DD");
      vi.setSystemTime(dayjs().hour(8).minute(0).second(0).toDate());

      const result = isBeforeCutoffTime(mealDate);

      expect(result).toBe(false);
    });

    it("should return false for invalid date format", () => {
      const result = isBeforeCutoffTime("invalid-date");

      expect(result).toBe(false);
    });

    it("should return false for empty string", () => {
      const result = isBeforeCutoffTime("");

      expect(result).toBe(false);
    });
  });

  describe("formatDateBR", () => {
    it("should format date string to DD/MM/YYYY", () => {
      const result = formatDateBR("2025-12-31");

      expect(result).toBe("31/12/2025");
    });

    it("should format Date object to DD/MM/YYYY", () => {
      const date = new Date(2025, 11, 31); // Month is 0-indexed
      const result = formatDateBR(date);

      expect(result).toBe("31/12/2025");
    });

    it("should format ISO date with timezone correctly", () => {
      const result = formatDateBR("2025-12-31T00:00:00.000Z");

      expect(result).toBe("31/12/2025");
    });

    it("should handle first day of month", () => {
      const result = formatDateBR("2025-01-01");

      expect(result).toBe("01/01/2025");
    });

    it("should handle last day of month", () => {
      const result = formatDateBR("2025-02-28");

      expect(result).toBe("28/02/2025");
    });
  });

  describe("formatDateTimeBR", () => {
    it("should format date string to DD/MM/YYYY HH:mm", () => {
      const result = formatDateTimeBR("2025-12-31T14:30:00");

      expect(result).toMatch(/31\/12\/2025 \d{2}:\d{2}/);
    });

    it("should format Date object to DD/MM/YYYY HH:mm", () => {
      const date = new Date(2025, 11, 31, 14, 30);
      const result = formatDateTimeBR(date);

      expect(result).toBe("31/12/2025 14:30");
    });

    it("should include leading zeros for hours and minutes", () => {
      const date = new Date(2025, 0, 1, 9, 5);
      const result = formatDateTimeBR(date);

      expect(result).toBe("01/01/2025 09:05");
    });
  });

  describe("getDayOfWeekName", () => {
    it("should return 'Segunda-feira' for Monday", () => {
      const result = getDayOfWeekName("2025-01-06"); // Monday

      expect(result).toBe("Segunda-feira");
    });

    it("should return 'Terça-feira' for Tuesday", () => {
      const result = getDayOfWeekName("2025-01-07"); // Tuesday

      expect(result).toBe("Terça-feira");
    });

    it("should return 'Quarta-feira' for Wednesday", () => {
      const result = getDayOfWeekName("2025-01-08"); // Wednesday

      expect(result).toBe("Quarta-feira");
    });

    it("should return 'Quinta-feira' for Thursday", () => {
      const result = getDayOfWeekName("2025-01-09"); // Thursday

      expect(result).toBe("Quinta-feira");
    });

    it("should return 'Sexta-feira' for Friday", () => {
      const result = getDayOfWeekName("2025-01-10"); // Friday

      expect(result).toBe("Sexta-feira");
    });

    it("should return 'Sábado' for Saturday", () => {
      const result = getDayOfWeekName("2025-01-11"); // Saturday

      expect(result).toBe("Sábado");
    });

    it("should return 'Domingo' for Sunday", () => {
      const result = getDayOfWeekName("2025-01-12"); // Sunday

      expect(result).toBe("Domingo");
    });

    it("should work with Date object", () => {
      const date = new Date(2025, 0, 6); // Monday
      const result = getDayOfWeekName(date);

      expect(result).toBe("Segunda-feira");
    });
  });

  describe("isFutureDate", () => {
    beforeEach(() => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date(2025, 0, 15)); // January 15, 2025
    });

    it("should return true for future date", () => {
      const result = isFutureDate("2025-01-16");

      expect(result).toBe(true);
    });

    it("should return false for today", () => {
      const result = isFutureDate("2025-01-15");

      expect(result).toBe(false);
    });

    it("should return false for past date", () => {
      const result = isFutureDate("2025-01-14");

      expect(result).toBe(false);
    });

    it("should return true for date far in the future", () => {
      const result = isFutureDate("2026-01-15");

      expect(result).toBe(true);
    });
  });

  describe("getTodayFormatted", () => {
    beforeEach(() => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date(2025, 0, 15)); // January 15, 2025
    });

    it("should return today's date in YYYY-MM-DD format", () => {
      const result = getTodayFormatted();

      expect(result).toBe("2025-01-15");
    });

    it("should include leading zeros", () => {
      vi.setSystemTime(new Date(2025, 0, 5)); // January 5, 2025
      const result = getTodayFormatted();

      expect(result).toBe("2025-01-05");
    });
  });
});
