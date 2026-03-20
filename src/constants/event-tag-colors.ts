/** Palette colori per tag evento (evento + sottoeventi). Allineata a EventModal. */
export const EVENT_TAG_COLORS = [
  "#5D4037",
  "#8D6E63",
  "#2E7D32",
  "#1565C0",
  "#6A1B9A",
  "#C62828",
  "#E65100",
  "#00695C",
  "#283593",
  "#0097A7",
  "#F9A825",
  "#AD1457",
] as const;

/** Chiave filtro calendario: nessun colore / non in palette */
export const COLOR_FILTER_NONE = "__none__";
export const COLOR_FILTER_OTHER = "__other__";

const PALETTE_LOWER = new Set(EVENT_TAG_COLORS.map((c) => c.toLowerCase()));

export function normalizeTagColorRaw(raw: string | null | undefined): string | null {
  const t = (raw ?? "").trim();
  if (!t) return null;
  const lower = t.toLowerCase();
  if (lower === "#fff" || lower === "#ffffff" || lower === "white") return null;
  return t;
}

/** Chiave univoca per filtro agenda (lowercase hex palette, __none__, __other__). */
export function paletteKeyForFilter(color: string | null | undefined): string {
  const n = normalizeTagColorRaw(color);
  if (!n) return COLOR_FILTER_NONE;
  const lower = n.toLowerCase();
  if (PALETTE_LOWER.has(lower)) return lower;
  return COLOR_FILTER_OTHER;
}

export function allCalendarFilterColorKeys(): string[] {
  return [...EVENT_TAG_COLORS.map((c) => c.toLowerCase()), COLOR_FILTER_NONE, COLOR_FILTER_OTHER];
}
