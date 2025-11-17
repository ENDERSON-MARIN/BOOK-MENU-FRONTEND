import { describe, expect, it } from "vitest";

import { cn } from "../utils";

describe("utils", () => {
  describe("cn", () => {
    it("should merge class names", () => {
      const result = cn("text-red-500", "bg-blue-500");

      expect(result).toBe("text-red-500 bg-blue-500");
    });

    it("should handle conditional classes", () => {
      const result = cn("text-red-500", false && "bg-blue-500");

      expect(result).toBe("text-red-500");
    });

    it("should merge conflicting Tailwind classes", () => {
      const result = cn("p-4", "p-8");

      expect(result).toBe("p-8");
    });

    it("should handle arrays of classes", () => {
      const result = cn(["text-red-500", "bg-blue-500"]);

      expect(result).toBe("text-red-500 bg-blue-500");
    });

    it("should handle objects with boolean values", () => {
      const result = cn({
        "text-red-500": true,
        "bg-blue-500": false,
        "font-bold": true,
      });

      expect(result).toBe("text-red-500 font-bold");
    });

    it("should handle undefined and null values", () => {
      const result = cn("text-red-500", undefined, null, "bg-blue-500");

      expect(result).toBe("text-red-500 bg-blue-500");
    });

    it("should handle empty strings", () => {
      const result = cn("text-red-500", "", "bg-blue-500");

      expect(result).toBe("text-red-500 bg-blue-500");
    });

    it("should merge multiple conflicting Tailwind classes correctly", () => {
      const result = cn("px-4 py-2", "px-8");

      expect(result).toBe("py-2 px-8");
    });

    it("should handle complex combinations", () => {
      const isActive = true;
      const isDisabled = false;

      const result = cn(
        "base-class",
        isActive && "active-class",
        isDisabled && "disabled-class",
        { "conditional-class": true },
      );

      expect(result).toBe("base-class active-class conditional-class");
    });
  });
});
