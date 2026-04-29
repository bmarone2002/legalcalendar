/**
 * Fasi (label tabella / titoli sottoevento) considerate udienze «di interesse» nel pannello
 * intelligente — scheda Prossime udienze. Confronto per uguaglianza sul testo normalizzato
 * (maiuscole, spazi, apostrofi, underscore).
 */

const UDIENZA_PANEL_PHASE_LABELS = [
  "DATA UDIENZA",
  "Data udienza cautelare",
  "Data udienza di discussione",
  "Fissazione Udienza per l'Autorizzazione alla Vendita (art. 569 c.p.c.)",
  "Prima udienza",
  "Udienza",
  "Udienza comparizione",
  "Udienza conclusioni",
  "Udienza fissata dal giudice con decreto - fase cautelare",
  "Udienza differita",
  "Udienza istruttoria",
  "Udienza sospensiva",
  "Udienza trattazione",
] as const;

/**
 * Toglie i blocchi tra parentesi tonde (ripetutamente): spesso sono la formula del calcolo
 * (es. «40 gg prima udienza»), non il nome della fase.
 */
export function titoloSenzaParentesiFormula(text: string | null | undefined): string {
  if (text == null) return "";
  let s = String(text).trim();
  let prev = "";
  while (s !== prev) {
    prev = s;
    s = s.replace(/\([^)]*\)/g, " ").replace(/\s+/g, " ").trim();
  }
  return s;
}

function normalizeUdienzaPanelPhaseText(text: string): string {
  return text
    .trim()
    .toLowerCase()
    .replace(/\u2019/g, "'")
    .replace(/_/g, " ")
    .replace(/[\u2013\u2014]/g, "-")
    .replace(/\s+/g, " ");
}

const UDIENZA_PANEL_PHASE_NORMALIZED = new Set(
  UDIENZA_PANEL_PHASE_LABELS.map((l) => normalizeUdienzaPanelPhaseText(l))
);

/**
 * Tipi udienza Prosecuzione (label come in `TIPO_UDIENZA_LABELS`) → fase whitelist equivalente.
 * Solo per titoli rinvio «Udienza: …».
 */
const RINVIO_INNER_ALIAS_NORMALIZED: Record<string, string> = {
  [normalizeUdienzaPanelPhaseText("Prima comparizione")]: normalizeUdienzaPanelPhaseText("Prima udienza"),
  [normalizeUdienzaPanelPhaseText("Precisazione delle conclusioni")]: normalizeUdienzaPanelPhaseText(
    "Udienza conclusioni"
  ),
  [normalizeUdienzaPanelPhaseText("Discussione orale")]: normalizeUdienzaPanelPhaseText("Udienza conclusioni"),
};

/**
 * True se il testo (dopo rimozione parentesi di formula) corrisponde a una delle fasi whitelist,
 * oppure è un titolo rinvio «Udienza: …» la cui parte descrittiva coincide con una fase o con
 * «udienza» + parte descrittiva (es. «Trattazione» → «udienza trattazione»).
 */
export function matchesUdienzaPanelPhaseLabel(text: string | null | undefined): boolean {
  if (text == null) return false;
  const cleaned = titoloSenzaParentesiFormula(text);
  if (!cleaned) return false;

  const n = normalizeUdienzaPanelPhaseText(cleaned);
  if (UDIENZA_PANEL_PHASE_NORMALIZED.has(n)) return true;

  const m = cleaned.match(/^udienza\s*:\s*(.+)$/i);
  if (m) {
    const inner = normalizeUdienzaPanelPhaseText(m[1]);
    if (!inner) return false;
    const candidates = new Set<string>([
      inner,
      normalizeUdienzaPanelPhaseText(`udienza ${inner}`),
    ]);
    const aliasNorm = RINVIO_INNER_ALIAS_NORMALIZED[inner];
    if (aliasNorm) candidates.add(aliasNorm);
    for (const c of candidates) {
      if (UDIENZA_PANEL_PHASE_NORMALIZED.has(c)) return true;
    }
  }

  return false;
}
