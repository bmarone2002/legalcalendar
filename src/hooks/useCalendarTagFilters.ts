"use client";

import { useCallback, useState } from "react";
import { allCalendarFilterColorKeys } from "@/constants/event-tag-colors";

const STORAGE_KEY = "calendar:visibleTagColors";
const LABELS_KEY = "calendar:tagColorLabels";

function loadFromStorage(): Set<string> {
  const all = allCalendarFilterColorKeys();
  if (typeof window === "undefined") return new Set(all);
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const arr = JSON.parse(raw) as string[];
      if (Array.isArray(arr) && arr.length > 0) return new Set(arr);
    }
  } catch { /* ignore */ }
  return new Set(all);
}

function loadTagColorLabels(): Record<string, string> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(LABELS_KEY);
    if (raw) return JSON.parse(raw) as Record<string, string>;
  } catch { /* ignore */ }
  return {};
}

function persistTagColorLabels(labels: Record<string, string>) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(LABELS_KEY, JSON.stringify(labels));
}

export function useCalendarTagFilters() {
  const [visibleTagColors, setVisibleTagColors] = useState<Set<string>>(loadFromStorage);
  const [tagColorLabels, setTagColorLabels] = useState<Record<string, string>>(loadTagColorLabels);

  const toggleTagColorFilter = useCallback((key: string) => {
    setVisibleTagColors((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      if (typeof window !== "undefined") {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify([...next]));
      }
      return next;
    });
  }, []);

  const selectAllTagColors = useCallback(() => {
    setVisibleTagColors(() => {
      const next = new Set(allCalendarFilterColorKeys());
      if (typeof window !== "undefined") {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify([...next]));
      }
      return next;
    });
  }, []);

  const deselectAllTagColors = useCallback(() => {
    setVisibleTagColors(() => {
      const next = new Set<string>();
      if (typeof window !== "undefined") {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
      }
      return next;
    });
  }, []);

  const updateTagColorLabel = useCallback((key: string, value: string) => {
    setTagColorLabels((prev) => {
      const next = { ...prev };
      const trimmed = value.trim();
      if (trimmed === "") delete next[key];
      else next[key] = trimmed;
      persistTagColorLabels(next);
      return next;
    });
  }, []);

  return {
    visibleTagColors,
    tagColorLabels,
    toggleTagColorFilter,
    selectAllTagColors,
    deselectAllTagColors,
    updateTagColorLabel,
  };
}
