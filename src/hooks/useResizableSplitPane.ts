"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const STORAGE_KEY = "eventModal.desktopSummaryWidthPct";
const MIN_PCT = 30;
const MAX_PCT = 55;

export function useResizableSplitPane(containerRef: React.RefObject<HTMLElement | null>) {
  const resizingRef = useRef(false);
  const [widthPct, setWidthPct] = useState(42);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = Number(saved);
      if (Number.isFinite(parsed)) {
        setWidthPct(Math.min(MAX_PCT, Math.max(MIN_PCT, parsed)));
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(STORAGE_KEY, String(widthPct));
  }, [widthPct]);

  const stopResizing = useCallback(() => {
    resizingRef.current = false;
    if (typeof document !== "undefined") {
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    }
  }, []);

  const handleResizeMove = useCallback((clientX: number) => {
    const host = containerRef.current;
    if (!host) return;
    const rect = host.getBoundingClientRect();
    if (rect.width <= 0) return;
    const nextLeftPct = ((clientX - rect.left) / rect.width) * 100;
    const nextRightPct = 100 - nextLeftPct;
    setWidthPct(Math.min(MAX_PCT, Math.max(MIN_PCT, nextRightPct)));
  }, [containerRef]);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!resizingRef.current) return;
      handleResizeMove(e.clientX);
    };
    const onMouseUp = () => {
      if (!resizingRef.current) return;
      stopResizing();
    };
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [handleResizeMove, stopResizing]);

  const startResizing = useCallback(() => {
    resizingRef.current = true;
    if (typeof document !== "undefined") {
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
    }
  }, []);

  return { widthPct, startResizing, stopResizing };
}
