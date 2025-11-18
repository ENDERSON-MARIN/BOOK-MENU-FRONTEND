import { useEffect } from "react";

interface KeyboardShortcutOptions {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  meta?: boolean;
  preventDefault?: boolean;
}

/**
 * Hook para gerenciar atalhos de teclado
 * Melhora a acessibilidade permitindo navegação rápida via teclado
 */
export function useKeyboardShortcut(
  options: KeyboardShortcutOptions,
  callback: () => void,
  enabled = true,
) {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      const {
        key,
        ctrl = false,
        shift = false,
        alt = false,
        meta = false,
        preventDefault = true,
      } = options;

      const isMatch =
        event.key.toLowerCase() === key.toLowerCase() &&
        event.ctrlKey === ctrl &&
        event.shiftKey === shift &&
        event.altKey === alt &&
        event.metaKey === meta;

      if (isMatch) {
        if (preventDefault) {
          event.preventDefault();
        }
        callback();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [options, callback, enabled]);
}
