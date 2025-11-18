"use client";

import { memo } from "react";

interface LiveRegionProps {
  message: string;
  priority?: "polite" | "assertive";
  atomic?: boolean;
}

/**
 * Componente para anunciar mensagens para screen readers
 * Usa aria-live para notificar mudanças de conteúdo
 */
export const LiveRegion = memo(function LiveRegion({
  message,
  priority = "polite",
  atomic = true,
}: LiveRegionProps) {
  const role = priority === "assertive" ? "alert" : "status";

  return (
    <div
      role={role}
      aria-live={priority}
      aria-atomic={atomic}
      className="sr-only"
    >
      {message}
    </div>
  );
});
