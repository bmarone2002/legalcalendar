"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type UseListboxArrowKeysOptions = {
  open: boolean;
  itemCount: number;
  /** Cambiamenti su questo valore (es. elenco filtrato) azzerano l’indice attivo. */
  resetKey?: string | number;
  onConfirmIndex: (index: number) => void;
  onEscape?: () => void;
  listRef?: React.RefObject<HTMLElement | null>;
};

/**
 * Freccia su/giù per liste tipo autocomplete; Enter conferma la voce evidenziata; Escape chiude.
 * Le voci nel DOM devono avere `data-suggestion-index={index}` dentro `listRef`.
 */
export function useListboxArrowKeys({
  open,
  itemCount,
  resetKey = 0,
  onConfirmIndex,
  onEscape,
  listRef,
}: UseListboxArrowKeysOptions) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeRef = useRef(0);
  activeRef.current = activeIndex;

  useEffect(() => {
    if (open && itemCount > 0) {
      setActiveIndex(0);
    }
  }, [open, itemCount, resetKey]);

  useEffect(() => {
    if (!open || !listRef?.current) return;
    const el = listRef.current.querySelector(`[data-suggestion-index="${activeIndex}"]`);
    el?.scrollIntoView({ block: "nearest" });
  }, [activeIndex, open, listRef]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!open || itemCount === 0) return;
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((i) => Math.min(i + 1, itemCount - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((i) => Math.max(i - 1, 0));
      } else if (e.key === "Enter") {
        e.preventDefault();
        onConfirmIndex(activeRef.current);
      } else if (e.key === "Escape") {
        e.preventDefault();
        onEscape?.();
      }
    },
    [open, itemCount, onConfirmIndex, onEscape]
  );

  return { activeIndex, handleKeyDown };
}
