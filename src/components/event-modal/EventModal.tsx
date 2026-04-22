"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Bell, Gavel, Link2, Sparkles, Trash2, X } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { createEvent, updateEvent, getEventById, deleteEvent, completeEventWithSubEvents } from "@/lib/actions/events";
import { parseDocumentForEvent } from "@/lib/actions/parse-document";
import {
  regenerateSubEvents,
  getSubEventsPreview,
  getPhase1MainPreview,
  createSubEventsFromPreview,
  deleteSubEvent,
} from "@/lib/actions/sub-events";
import type { EventType, SubEvent } from "@/types";
import { RULE_TEMPLATES } from "@/types";
import { MacroAreaPanel } from "./MacroAreaPanel";
import { ProsecuzionePanel } from "./ProsecuzionePanel";
import type { MacroAreaCode, ProcedimentoCode, ParteProcessuale } from "@/types/macro-areas";
import { getMacroAreaForProcedimento, getEventoByCode } from "@/types/macro-areas";
import { DateTimePicker } from "./DateTimePicker";
import { PopoverContainerContext } from "./popover-container-context";
import { LinkedEventOffsetDateControls } from "./LinkedEventOffsetDateControls";
import { formatDateTime } from "@/lib/utils";
import type { LinkedEventSpec } from "@/lib/linked-events";
import { EVENT_TAG_COLORS } from "@/constants/event-tag-colors";
import { getFaseDisplayFromFields } from "@/lib/event-fase";
import { useListboxArrowKeys } from "@/hooks/useListboxArrowKeys";

type ModalMode = "create" | "edit";

type ActiveTab = "dettagli" | "prosecuzione";

type PendingRinvioSaveResult = "not_required" | "saved" | "failed";

interface EventModalProps {
  mode: ModalMode;
  eventId?: string;
  initialStart?: Date;
  initialEnd?: Date;
  draftId?: string | null;
  initialDraft?: Partial<EventFormState>;
  onClose: () => void;
  /** Chiamato dopo salvataggio; se fornito newEventId (dopo creazione), il parent può passare in modalità modifica. */
  onChanged?: (newEventId?: string) => void;
  onDeleted?: (id: string) => void;
  onDraft?: (draftId: string | null, form: EventFormState) => void;
  onDraftCleared?: (draftId: string | null) => void;
  targetUserId?: string;
  readOnly?: boolean;
  /** Se impostato, apre il tab Regole & Sottoeventi e evidenzia/scrolla a questo sottoevento (es. click su promemoria in calendario). */
  highlightSubEventId?: string | null;
}

type EventFormState = {
  title: string;
  parti: string;
  rg: string;
  autorita: string;
  luogo: string;
  description: string;
  startAt: Date;
  endAt: Date;
  type: EventType;
  tags: string[];
  notes: string;
  generateSubEvents: boolean;
  ruleTemplateId: string;
  macroType: "ATTO_GIURIDICO" | null;
  macroArea: MacroAreaCode | null;
  procedimento: ProcedimentoCode | null;
  parteProcessuale: ParteProcessuale | null;
  eventoCode: string | null;
  inputs: Record<string, unknown>;
  color: string | null;
  reminderOffsets: number[];
  /** Titolo + giorni solari (±) dalla data di riferimento della fase (stessa logica festivi dei promemoria). */
  linkedEvents: LinkedEventSpec[];
  status: "pending" | "done";
};

const AUTORITA_SUGGESTIONS: string[] = [
  "Giudice di Pace",
  "Tribunale ordinario",
  "Corte d'Appello",
  "Corte di Cassazione",
  "TAR",
  "Consiglio di Stato",
  "CGARS",
  "Corte dei conti",
  "Sezioni giurisdizionali centrali di appello Corte dei Conti",
  "Corte di giustizia tributaria di primo grado",
  "Corte di giustizia tributaria di secondo grado",
  "Corte Costituzionale",
  "Tribunale Regionale delle Acque Pubbliche",
  "Tribunale Superiore delle Acque Pubbliche",
  "Organismo di Mediazione",
  "Camera Arbitrale",
  "Collegio Arbitrale",
];

type ComuneJsonItem = {
  nome?: string;
  provincia?: { nome?: string } | null;
  sigla?: string | null;
};

function normalizeSuggestionValue(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function toDateOnlyStringLocal(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

const defaultEvent = (start?: Date, end?: Date): EventFormState => {
  const now = new Date();
  const defaultStart = new Date(now);
  defaultStart.setHours(8, 0, 0, 0);
  const defaultEnd = new Date(defaultStart);
  defaultEnd.setHours(9, 0, 0, 0);
  return {
    title: "",
    parti: "",
    rg: "",
    autorita: "",
    luogo: "",
    description: "",
    startAt: start ?? defaultStart,
    endAt: end ?? defaultEnd,
    type: "altro",
    tags: [],
    notes: "",
    generateSubEvents: true,
    ruleTemplateId: "data-driven",
    macroType: "ATTO_GIURIDICO",
    macroArea: null,
    procedimento: null,
    parteProcessuale: null,
    eventoCode: null,
    inputs: {},
    color: null,
    // Nessun promemoria di default: l'utente li aggiunge esplicitamente.
    reminderOffsets: [],
    linkedEvents: [],
    status: "pending",
  };
};

/** Categorie per cui non si mostrano Data/Ora inizio-fine: la data evento è solo quella del pannello "Dati per il calcolo". Estendere qui per future categorie. */
const MACRO_TYPES_WITH_CALCULATION_DATE_ONLY: (string | null)[] = ["ATTO_GIURIDICO"];
function usesCalculationDateOnly(macroType: "ATTO_GIURIDICO" | null): boolean {
  return macroType != null && MACRO_TYPES_WITH_CALCULATION_DATE_ONLY.includes(macroType);
}

function composePracticeTitle(parts: {
  parti: string;
  rg: string;
  autorita: string;
  luogo: string;
}): string {
  return [parts.parti, parts.rg, parts.autorita, parts.luogo]
    .map((v) => v.trim())
    .filter((v) => v.length > 0)
    .join(" - ");
}

function extractPracticeIdentityFromAiTitle(title: string): {
  parti: string;
  rg: string;
  autorita: string;
  luogo: string;
} {
  const empty = { parti: "", rg: "", autorita: "", luogo: "" };
  const raw = title.trim();
  if (!raw) return empty;

  // Formato atteso: PARTI: ... | RG: ... | AUTORITÀ: ... | LUOGO: ...
  const normalized = raw.replace(/AUTORIT[ÀA]/gi, "AUTORITA");
  const matchParti = normalized.match(/(?:^|\|)\s*PARTI\s*:\s*([^|]+)/i);
  const matchRg = normalized.match(/(?:^|\|)\s*RG\s*:\s*([^|]+)/i);
  const matchAutorita = normalized.match(/(?:^|\|)\s*AUTORITA\s*:\s*([^|]+)/i);
  const matchLuogo = normalized.match(/(?:^|\|)\s*LUOGO\s*:\s*([^|]+)/i);

  if (matchParti || matchRg || matchAutorita || matchLuogo) {
    return {
      parti: (matchParti?.[1] ?? "").trim(),
      rg: (matchRg?.[1] ?? "").trim(),
      autorita: (matchAutorita?.[1] ?? "").trim(),
      luogo: (matchLuogo?.[1] ?? "").trim(),
    };
  }

  // Fallback legacy: "Parti - RG - Autorità - Luogo"
  const parts = raw.split(" - ").map((p) => p.trim());
  if (parts.length >= 4) {
    return {
      parti: parts[0] ?? "",
      rg: parts[1] ?? "",
      autorita: parts[2] ?? "",
      luogo: parts.slice(3).join(" - "),
    };
  }

  return empty;
}

/** Serializza inputs per Server Actions: Date → ISO string così il server riceve valori validi. */
function serializeInputsForServer(inputs: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(inputs)) {
    out[k] = v instanceof Date ? v.toISOString() : v;
  }
  return out;
}

/** Normalizza l'errore da Server Action: se arriva l'array Zod (es. JSON), mostra messaggio utente. */
function normalizeDisplayError(err: unknown): string {
  if (typeof err === "string") {
    const t = err.trim();
    if (t.startsWith("[") && (t.includes("too_small") || t.includes("at least 1")) && t.includes("title")) return "Inserire un titolo evento";
    try {
      const parsed = JSON.parse(err) as unknown;
      if (Array.isArray(parsed) && parsed.length > 0) {
        const first = parsed[0] as { path?: unknown[]; code?: string };
        if (first?.path?.[0] === "title" && first?.code === "too_small") return "Inserire un titolo evento";
      }
    } catch {
      // non è JSON, usa la stringa
    }
    return err;
  }
  if (Array.isArray(err) && err.length > 0) {
    const first = err[0] as { path?: unknown[]; code?: string };
    if (first?.path?.[0] === "title" && first?.code === "too_small") return "Inserire un titolo evento";
    const msg = (first as { message?: string })?.message;
    return typeof msg === "string" ? msg : "Errore di validazione";
  }
  if (err && typeof err === "object" && "message" in err && typeof (err as { message: unknown }).message === "string") return (err as { message: string }).message;
  return "Si è verificato un errore";
}

/** Restituisce la prima data valida dagli inputs (per Atto Giuridico) da usare come start/end nel preview. */
function getPrimaryDateFromInputs(inputs: Record<string, unknown>): Date | null {
  const dateKeys = [
    "dataNotifica",
    "dataPrimaNotificaCitazione",
    "dataPrimaUdienza",
    "dataUdienzaComparizione",
    "dataUdienzaRiferimentoMemorie",
    "dataNotificaCitazione",
    "dataNotificaDecretoIngiuntivo",
    "dataUdienzaOpposizione",
    "dataUdienza",
    "dataNotificaAttoImpugnato",
    "dataNotificaRicorso",
    "dataNotificaSentenza",
    "dataPubblicazioneSentenza",
    "dataNotificaAppello",
    "dataNotificaSentenzaTributaria",
    "dataPubblicazioneSentenzaTributaria",
    "dataManuale",
  ];
  for (const key of dateKeys) {
    const v = inputs[key];
    if (typeof v !== "string" || !v.trim()) continue;
    const d = new Date(v);
    if (!isNaN(d.getTime())) return d;
  }
  return null;
}

interface EventSummaryPanelProps {
  mode: ModalMode;
  form: EventFormState;
  subEvents: SubEvent[];
  /** Dopo «Calcola anteprima» in modifica, la colonna blu segue l'anteprima anche se esistono sottoeventi salvati. */
  hasClickedCalcola: boolean;
  previewSubEvents: Array<{
    id: string;
    title: string;
    dueAt: Date | null;
    explanation: string;
    ruleId: string;
    ruleParams?: Record<string, unknown> | null;
    kind: string;
    priority?: number;
    isPlaceholder?: boolean;
  }>;
  selectedSubEventId: string | null;
  setSelectedSubEventId: (id: string | null) => void;
  highlightSubEventId: string | null;
  highlightRowRef: React.RefObject<HTMLLIElement | null>;
  handleRemovePreviewSubEvent: (id: string) => void;
  onDeleteSelectedSubEvent: () => void;
  saving: boolean;
  readOnly: boolean;
  /** Se true, il pannello è mostrato nel bottom sheet mobile (niente hidden lg). */
  embedInSheet?: boolean;
  /** Data calcolata per la fase 1 promossa (anteprima prima del salvataggio). */
  phase1MainDueAt: Date | null;
  /** Testo formula / norma sotto la data della fase 1. */
  phase1MainExplanation: string;
}

function EventSummaryPanel({
  mode,
  form,
  subEvents,
  hasClickedCalcola,
  previewSubEvents,
  selectedSubEventId,
  setSelectedSubEventId,
  highlightSubEventId,
  highlightRowRef,
  handleRemovePreviewSubEvent,
  onDeleteSelectedSubEvent,
  saving,
  readOnly,
  embedInSheet = false,
  phase1MainDueAt,
  phase1MainExplanation,
}: EventSummaryPanelProps) {
  const rinvioSubEventsPersisted =
    mode === "edit" ? subEvents.filter((s) => s.ruleId === "rinvio-udienza") : [];

  const baseEventsToShow =
    hasClickedCalcola && previewSubEvents.length > 0
      ? [...rinvioSubEventsPersisted, ...previewSubEvents].filter((s, idx, arr) => {
          const sid = (s as { id?: string }).id;
          if (!sid) return true;
          return arr.findIndex((x) => (x as { id?: string }).id === sid) === idx;
        })
      : mode === "edit" && subEvents.length > 0
        ? subEvents
        : previewSubEvents;

  // "Promuovi fase1": in anteprima la data segue il motore regole; se manca la base, resta il giorno cliccato sul calendario.
  const mainDate = phase1MainDueAt ?? form.startAt;

  const practiceTitle = composePracticeTitle(form).trim() || "Pratica senza titolo";
  const phaseTitle =
    form.macroType === "ATTO_GIURIDICO"
      ? getFaseDisplayFromFields(form.eventoCode ?? null, form.procedimento ?? null) || form.title?.trim() || "Fase iniziale"
      : form.title?.trim() || "Evento principale";

  // Sotto la linea: sempre tutti gli eventi generati, a partire dalla fase iniziale stessa.
  const eventsToShow = [
    {
      id: "phase-1-main",
      title: phaseTitle,
      dueAt: mainDate,
      explanation: phase1MainExplanation,
      ruleId: "main",
      kind: "attivita",
      __isMainEvent: true,
    } as unknown as SubEvent,
    ...baseEventsToShow,
  ];

  return (
    <div
      className={
        embedInSheet
          ? "flex flex-col w-full min-h-0 flex-1"
          : "hidden lg:flex lg:flex-col lg:flex-1 lg:min-h-0 lg:pl-3 lg:pt-1"
      }
    >
      <div className="rounded-lg bg-[var(--navy)] text-white flex flex-col min-h-0 flex-1">
        <div className="px-4 pt-3 pb-2 border-b border-white/10">
          <p className="text-xs font-semibold tracking-wide uppercase text-white/70">
            Eventi &amp; Scadenze
          </p>
          <p className="mt-1 text-sm font-medium line-clamp-2">
            {practiceTitle}
          </p>
          {form.reminderOffsets.length > 0 && (
            <div className="mt-1 text-[11px] text-white/60">
              Promemoria:{" "}
              {form.reminderOffsets
                .map((d) => `${d} gg prima`)
                .join(" · ")}
            </div>
          )}
        </div>

        <div className="flex-1 min-h-0 px-1 py-2">
          {eventsToShow.length > 0 ? (
            <ScrollArea className="h-full pr-2">
              <ul className="space-y-2">
                {eventsToShow.map((s, idx) => {
                  const isSavedSub =
                    mode === "edit" &&
                    subEvents.length > 0 &&
                    !(hasClickedCalcola && previewSubEvents.length > 0);
                  const currentId = (s as { id?: string }).id ?? `sub-${idx}`;
                  const isMainEvent = (s as { __isMainEvent?: boolean }).__isMainEvent === true;
                  const isSelected = isSavedSub && selectedSubEventId === currentId;
                  const isHighlightRow = currentId === highlightSubEventId;
                  const isPlaceholder =
                    (s as { isPlaceholder?: boolean }).isPlaceholder || !s.dueAt ||
                    (s.dueAt instanceof Date && s.dueAt.getTime() === 0);

                  return (
                    <li
                      key={currentId}
                      ref={isHighlightRow ? (el) => { highlightRowRef.current = el; } : undefined}
                      className={`rounded-md border px-3 py-2 text-xs bg-white/5 backdrop-blur-sm transition-colors cursor-pointer ${
                        isSelected
                          ? "bg-white text-[var(--navy)] border-white shadow-sm"
                          : "border-white/10 hover:bg-white/10"
                      }`}
                      onClick={() => {
                        if (isSavedSub && !isMainEvent) {
                          setSelectedSubEventId(isSelected ? null : currentId);
                        }
                      }}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <p
                            className={`font-semibold leading-snug break-words ${
                              isSelected ? "text-[var(--navy)]" : "text-white"
                            }`}
                          >
                            {s.title}
                          </p>
                          <p className={`mt-0.5 text-[11px] ${isSelected ? "text-zinc-600" : "text-white/75"}`}>
                            {isPlaceholder ? (
                              <span className={`italic ${isSelected ? "text-amber-700" : "text-amber-200"}`}>
                                Da schedulare
                              </span>
                            ) : (
                              formatDateTime(s.dueAt as Date)
                            )}
                          </p>
                          {(s as { explanation?: string | null }).explanation && (
                            <p className={`mt-0.5 text-[11px] break-words ${isSelected ? "text-zinc-500" : "text-white/65"}`}>
                              {(s as { explanation?: string | null }).explanation}
                            </p>
                          )}
                        </div>
                        {!isSavedSub && !isMainEvent && (
                          <button
                            type="button"
                            className="ml-1 text-[13px] text-red-200 hover:text-red-100"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemovePreviewSubEvent(currentId);
                            }}
                            aria-label="Rimuovi sottoevento"
                          >
                            ×
                          </button>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </ScrollArea>
          ) : (
            <div className="h-full flex items-center justify-center px-4 text-center">
              <p className="text-xs text-white/70">
                Nessun evento calcolato. Compila i dettagli e salva la pratica per
                generare scadenze e promemoria.
              </p>
            </div>
          )}
        </div>

        {!readOnly && (
          <div className="px-4 pb-3 pt-2 border-t border-white/10 flex flex-col gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8 border-red-300 text-red-100 hover:bg-red-500/20"
              onClick={onDeleteSelectedSubEvent}
              disabled={saving || !selectedSubEventId}
            >
              Rimuovi singolo evento
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export function EventModal({
  mode,
  eventId,
  initialStart,
  initialEnd,
  draftId,
  initialDraft,
  onClose,
  onChanged,
  onDeleted,
  onDraft,
  onDraftCleared,
  targetUserId,
  readOnly = false,
  highlightSubEventId: highlightSubEventIdProp = null,
}: EventModalProps) {
  // Data evento: solo i valori attuali del form contano. initialStart/initialEnd servono solo come default iniziale se apri da click sul calendario; se modifichi data/ora in creazione, resta ciò che hai impostato.
  const defaultAnchorDateStr = initialStart ? toDateOnlyStringLocal(initialStart) : "";
  const [form, setForm] = useState<EventFormState>(() => {
    const base = defaultEvent(initialStart, initialEnd);
    if (!initialDraft) return base;
    return {
      ...base,
      ...initialDraft,
      startAt: initialDraft.startAt
        ? new Date(initialDraft.startAt as unknown as Date)
        : base.startAt,
      endAt: initialDraft.endAt
        ? new Date(initialDraft.endAt as unknown as Date)
        : base.endAt,
    };
  });
  const [subEvents, setSubEvents] = useState<SubEvent[]>([]);
  const [previewSubEvents, setPreviewSubEvents] = useState<
    Array<{
      id: string;
      title: string;
      dueAt: Date | null;
      explanation: string;
      ruleId: string;
      ruleParams?: Record<string, unknown> | null;
      kind: string;
      priority?: number;
      isPlaceholder?: boolean;
    }>
  >([]);
  const [phase1Preview, setPhase1Preview] = useState<{
    dueAt: Date | null;
    explanation: string;
  }>({ dueAt: null, explanation: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showAutoritaSuggestions, setShowAutoritaSuggestions] = useState(false);
  const [showLuogoSuggestions, setShowLuogoSuggestions] = useState(false);
  const [comuniLuogoSuggestions, setComuniLuogoSuggestions] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<ActiveTab>("dettagli");
  const [calculating, setCalculating] = useState(false);
  const [parsingDocument, setParsingDocument] = useState(false);
  const [popoverContainer, setPopoverContainer] = useState<HTMLElement | null>(null);
  const [selectedSubEventId, setSelectedSubEventId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const highlightRowRef = useRef<HTMLLIElement | null>(null);
  const [showEventsPanel, setShowEventsPanel] = useState(false);
  const [mobileEventsPanelExpanded, setMobileEventsPanelExpanded] = useState(false);
  const [desktopSummaryWidthPct, setDesktopSummaryWidthPct] = useState<number>(40);
  const resizingRef = useRef(false);
  const tabsContainerRef = useRef<HTMLDivElement | null>(null);
  /** Se true, l'utente ha cliccato "Calcola anteprima" almeno una volta: al Salva usiamo la lista preview (anche se vuota). Altrimenti usiamo regenerateSubEvents per creare tutti i sottoeventi. */
  const [hasClickedCalcola, setHasClickedCalcola] = useState(false);
  const pendingRinvioSaveHandlerRef = useRef<null | (() => Promise<PendingRinvioSaveResult>)>(null);
  const baselineSnapshotRef = useRef<string | null>(null);
  const baselineKeyRef = useRef<string>("");
  const [baselineReady, setBaselineReady] = useState(mode === "create");
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const currentUnsavedSnapshot = useMemo(() => JSON.stringify({
    form: {
      ...form,
      startAt: form.startAt?.toISOString() ?? null,
      endAt: form.endAt?.toISOString() ?? null,
    },
  }), [form]);

  useEffect(() => {
    const key = `${mode}:${eventId ?? "new"}`;
    if (baselineKeyRef.current === key) return;
    baselineKeyRef.current = key;
    baselineSnapshotRef.current = null;
    setHasUnsavedChanges(false);
    setBaselineReady(mode === "create");
    setHasClickedCalcola(false);
  }, [mode, eventId]);

  useEffect(() => {
    if (!baselineReady) return;
    if (baselineSnapshotRef.current == null) {
      baselineSnapshotRef.current = currentUnsavedSnapshot;
      setHasUnsavedChanges(false);
      return;
    }
    setHasUnsavedChanges(baselineSnapshotRef.current !== currentUnsavedSnapshot);
  }, [baselineReady, currentUnsavedSnapshot]);

  const handleRequestClose = useCallback((saveDraftBeforeClose: boolean) => {
    if (!readOnly && hasUnsavedChanges) {
      const shouldClose = window.confirm(
        "Hai modifiche non salvate. Vuoi chiudere comunque senza salvare?",
      );
      if (!shouldClose) return;
    }
    if (saveDraftBeforeClose && !readOnly && mode === "create" && onDraft) {
      onDraft(draftId ?? null, form);
    }
    onClose();
  }, [readOnly, hasUnsavedChanges, mode, onDraft, draftId, form, onClose]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const savedWidth = window.localStorage.getItem("eventModal.desktopSummaryWidthPct");
    if (savedWidth) {
      const parsed = Number(savedWidth);
      if (Number.isFinite(parsed)) {
        setDesktopSummaryWidthPct(Math.min(55, Math.max(30, parsed)));
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem("eventModal.desktopSummaryWidthPct", String(desktopSummaryWidthPct));
  }, [desktopSummaryWidthPct]);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const comuniModule = await import("comuni-json/comuni.json");
        const raw = (comuniModule.default ?? []) as ComuneJsonItem[];
        const labels = raw
          .map((item) => {
            const nome = (item.nome ?? "").trim();
            if (!nome) return "";
            const sigla = (item.sigla ?? "").trim();
            const provincia = (item.provincia?.nome ?? "").trim();
            if (sigla) return `${nome} (${sigla})`;
            if (provincia) return `${nome} (${provincia})`;
            return nome;
          })
          .filter((v) => v.length > 0);
        if (active) setComuniLuogoSuggestions(labels);
      } catch {
        if (active) setComuniLuogoSuggestions([]);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const filteredAutoritaSuggestions = useMemo(() => {
    const q = normalizeSuggestionValue(form.autorita);
    if (!q) return AUTORITA_SUGGESTIONS.slice(0, 8);
    const starts = AUTORITA_SUGGESTIONS.filter((item) => normalizeSuggestionValue(item).startsWith(q));
    const contains = AUTORITA_SUGGESTIONS.filter((item) => {
      const n = normalizeSuggestionValue(item);
      return !n.startsWith(q) && n.includes(q);
    });
    return [...starts, ...contains].slice(0, 8);
  }, [form.autorita]);

  const filteredLuogoSuggestions = useMemo(() => {
    const q = normalizeSuggestionValue(form.luogo);
    if (q.length < 2) return comuniLuogoSuggestions.slice(0, 10);
    const starts = comuniLuogoSuggestions.filter((item) => normalizeSuggestionValue(item).startsWith(q));
    const contains = comuniLuogoSuggestions.filter((item) => {
      const n = normalizeSuggestionValue(item);
      return !n.startsWith(q) && n.includes(q);
    });
    return [...starts, ...contains].slice(0, 10);
  }, [form.luogo, comuniLuogoSuggestions]);

  const autoritaListRef = useRef<HTMLDivElement>(null);
  const luogoListRef = useRef<HTMLDivElement>(null);
  const autoritaSuggestionsOpen =
    !readOnly && showAutoritaSuggestions && filteredAutoritaSuggestions.length > 0;
  const luogoSuggestionsOpen =
    !readOnly && showLuogoSuggestions && filteredLuogoSuggestions.length > 0;
  const autoritaResetKey = filteredAutoritaSuggestions.join("\u0001");
  const luogoResetKey = filteredLuogoSuggestions.join("\u0001");

  const confirmAutoritaSuggestion = useCallback(
    (i: number) => {
      const picked = filteredAutoritaSuggestions[i];
      if (picked == null) return;
      setForm((f) => {
        const next = { ...f, autorita: picked };
        return { ...next, title: composePracticeTitle(next) };
      });
      setShowAutoritaSuggestions(false);
    },
    [filteredAutoritaSuggestions]
  );

  const confirmLuogoSuggestion = useCallback(
    (i: number) => {
      const picked = filteredLuogoSuggestions[i];
      if (picked == null) return;
      setForm((f) => {
        const next = { ...f, luogo: picked };
        return { ...next, title: composePracticeTitle(next) };
      });
      setShowLuogoSuggestions(false);
    },
    [filteredLuogoSuggestions]
  );

  const autoritaListNav = useListboxArrowKeys({
    open: autoritaSuggestionsOpen,
    itemCount: filteredAutoritaSuggestions.length,
    resetKey: autoritaResetKey,
    listRef: autoritaListRef,
    onConfirmIndex: confirmAutoritaSuggestion,
    onEscape: () => setShowAutoritaSuggestions(false),
  });

  const luogoListNav = useListboxArrowKeys({
    open: luogoSuggestionsOpen,
    itemCount: filteredLuogoSuggestions.length,
    resetKey: luogoResetKey,
    listRef: luogoListRef,
    onConfirmIndex: confirmLuogoSuggestion,
    onEscape: () => setShowLuogoSuggestions(false),
  });

  const stopResizing = useCallback(() => {
    resizingRef.current = false;
    if (typeof document !== "undefined") {
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    }
  }, []);

  const handleResizeMove = useCallback((clientX: number) => {
    const host = tabsContainerRef.current;
    if (!host) return;
    const rect = host.getBoundingClientRect();
    if (rect.width <= 0) return;
    const nextLeftPct = ((clientX - rect.left) / rect.width) * 100;
    const nextRightPct = 100 - nextLeftPct;
    const clamped = Math.min(55, Math.max(30, nextRightPct));
    setDesktopSummaryWidthPct(clamped);
  }, []);

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

  const loadEvent = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    const result = await getEventById(id, targetUserId);
    setLoading(false);
    if (!result.success) {
      setError(normalizeDisplayError(result.error) || "Errore caricamento evento");
      return;
    }
    if (!result.data) {
      setError("Evento non trovato");
      return;
    }
    if (result.success && result.data) {
      const e = result.data;
      const savedRuleParams = (e.ruleParams as Record<string, unknown> | null | undefined) ?? {};
      const savedOffsets = Array.isArray(savedRuleParams.reminderOffsets)
        ? (savedRuleParams.reminderOffsets as number[])
        : [];
      const rawLinked = savedRuleParams.linkedEvents;
      const savedLinked: LinkedEventSpec[] = Array.isArray(rawLinked)
        ? rawLinked
            .filter(
              (x): x is LinkedEventSpec =>
                x != null &&
                typeof x === "object" &&
                typeof (x as LinkedEventSpec).title === "string" &&
                typeof (x as LinkedEventSpec).offsetDays === "number" &&
                Number.isFinite((x as LinkedEventSpec).offsetDays),
            )
            .map((x) => ({ title: x.title, offsetDays: x.offsetDays }))
        : [];
      setForm({
        title: e.title,
        parti: "",
        rg: "",
        autorita: "",
        luogo: "",
        description: e.description ?? "",
        startAt: new Date(e.startAt),
        endAt: new Date(e.endAt),
        type: e.type,
        tags: e.tags ?? [],
        notes: e.notes ?? "",
        generateSubEvents: e.generateSubEvents,
        ruleTemplateId:
          e.ruleTemplateId === "atto-giuridico"
            ? "data-driven"
            : (e.ruleTemplateId ?? RULE_TEMPLATES[0].id),
        macroType: e.macroType ?? null,
        macroArea: (e.macroArea as MacroAreaCode) ?? null,
        procedimento: (e.procedimento as ProcedimentoCode) ?? null,
        parteProcessuale: (e.parteProcessuale as ParteProcessuale) ?? null,
        eventoCode: (e as { eventoCode?: string | null }).eventoCode ?? null,
        inputs: (e.inputs as Record<string, unknown>) ?? {},
        color: e.color ?? null,
        reminderOffsets: savedOffsets,
        linkedEvents: savedLinked,
        status: (e.status === "done" ? "done" : "pending") as "pending" | "done",
      });
      const savedInputs = (e.inputs as Record<string, unknown> | null) ?? {};
      const ident = (savedInputs.practiceIdentity as Record<string, unknown> | undefined) ?? {};
      const parti = typeof ident.parti === "string" ? ident.parti : "";
      const rg = typeof ident.rg === "string" ? ident.rg : "";
      const autorita = typeof ident.autorita === "string" ? ident.autorita : "";
      const luogo = typeof ident.luogo === "string" ? ident.luogo : "";
      setForm((prev) => ({ ...prev, parti, rg, autorita, luogo }));
      setSubEvents(e.subEvents ?? []);
      setHasClickedCalcola(false);
      setBaselineReady(true);
      const subs = e.subEvents ?? [];
      if (highlightSubEventIdProp && subs.some((se) => se.id === highlightSubEventIdProp)) {
        setSelectedSubEventId(highlightSubEventIdProp);
      } else {
        setSelectedSubEventId(null);
      }
    }
  }, [targetUserId, highlightSubEventIdProp]);

  useEffect(() => {
    if (mode === "edit" && eventId) loadEvent(eventId);
  }, [mode, eventId, loadEvent]);

  // Scroll al promemoria evidenziato quando si apre dal calendario (tab Regole già attiva)
  useEffect(() => {
    if (!(highlightSubEventIdProp ?? selectedSubEventId)) return;
    const id = setTimeout(() => {
      highlightRowRef.current?.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }, 100);
    return () => clearTimeout(id);
  }, [highlightSubEventIdProp, selectedSubEventId, subEvents, previewSubEvents]);

  useEffect(() => {
    if (!form.generateSubEvents || !form.ruleTemplateId) {
      setPreviewSubEvents([]);
      setPhase1Preview({ dueAt: null, explanation: "" });
      return;
    }
    let cancelled = false;
    const timer = setTimeout(() => {
      (async () => {
        let startAt = form.startAt;
        let endAt = form.endAt;
        if (usesCalculationDateOnly(form.macroType)) {
          const primary = getPrimaryDateFromInputs(form.inputs);
          if (primary) {
            startAt = primary;
            endAt = new Date(primary.getTime() + 60 * 60 * 1000);
          }
        }
        const mergedInputsDataDriven = {
          ...serializeInputsForServer(form.inputs),
          macroArea: form.macroArea,
          procedimento: form.procedimento,
          parteProcessuale: form.parteProcessuale,
          reminderOffsets: form.reminderOffsets,
          linkedEvents: form.linkedEvents,
        };
        const payload = {
          title: form.title,
          startAt: startAt.toISOString(),
          endAt: endAt.toISOString(),
          type: form.type,
          tags: form.tags,
          ruleTemplateId: form.ruleTemplateId,
          ...(form.ruleTemplateId === "data-driven"
            ? {
                macroType: "ATTO_GIURIDICO",
                macroArea: form.macroArea,
                procedimento: form.procedimento,
                parteProcessuale: form.parteProcessuale,
                eventoCode: form.eventoCode,
                inputs: mergedInputsDataDriven,
              }
            : {
                inputs: { reminderOffsets: form.reminderOffsets, linkedEvents: form.linkedEvents },
              }),
        };
        const phase1Promise =
          form.ruleTemplateId === "data-driven" &&
          form.macroArea &&
          form.procedimento &&
          form.parteProcessuale &&
          form.eventoCode
            ? getPhase1MainPreview({
                macroArea: form.macroArea,
                procedimento: form.procedimento,
                parteProcessuale: form.parteProcessuale,
                eventoCode: form.eventoCode,
                inputs: mergedInputsDataDriven,
              })
            : Promise.resolve({ success: true as const, data: { dueAt: null as string | null, explanation: "" } });

        const [result, phase1Result] = await Promise.all([
          getSubEventsPreview(payload),
          phase1Promise,
        ]);
        if (cancelled) return;
        if (phase1Result.success && phase1Result.data) {
          setPhase1Preview({
            dueAt: phase1Result.data.dueAt ? new Date(phase1Result.data.dueAt) : null,
            explanation: phase1Result.data.explanation ?? "",
          });
        } else {
          setPhase1Preview({ dueAt: null, explanation: "" });
        }
        if (result.success && result.data) {
          setPreviewSubEvents(
            result.data.map((c) => ({
              id: c.id,
              title: c.title,
              dueAt: c.dueAt ? new Date(c.dueAt) : null,
              explanation: c.explanation,
              ruleId: c.ruleId,
              ruleParams: c.ruleParams ?? null,
              kind: c.kind,
              priority: c.priority,
              isPlaceholder: (c as { isPlaceholder?: boolean }).isPlaceholder ?? false,
            }))
          );
        } else {
          setPreviewSubEvents([]);
        }
      })();
    }, 300);
    return () => { cancelled = true; clearTimeout(timer); };
  }, [
    form.title,
    form.startAt,
    form.endAt,
    form.type,
    form.tags,
    form.generateSubEvents,
    form.ruleTemplateId,
    form.macroType,
    form.macroArea,
    form.procedimento,
    form.parteProcessuale,
    form.eventoCode,
    form.inputs,
    form.reminderOffsets,
    form.linkedEvents,
  ]);

  const linkedEventReferenceDate = useMemo(() => {
    const src =
      phase1Preview.dueAt ??
      getPrimaryDateFromInputs(form.inputs) ??
      form.startAt;
    if (!src || isNaN(src.getTime())) return null;
    return new Date(
      src.getFullYear(),
      src.getMonth(),
      src.getDate(),
      12,
      0,
      0,
    );
  }, [phase1Preview.dueAt, form.inputs, form.startAt]);

  const handleCalcola = useCallback(async () => {
    setError(null);

    // Coerenza con "Salva": se in Prosecuzione c'è un rinvio in bozza, lo persistiamo prima
    // del calcolo anteprima, così la colonna Eventi & Scadenze include anche quei sottoeventi.
    if (mode === "edit" && eventId && !readOnly) {
      const pendingResult = await pendingRinvioSaveHandlerRef.current?.();
      if (pendingResult === "failed") {
        return;
      }
      if (pendingResult === "saved") {
        const updated = await getEventById(eventId, targetUserId);
        if (updated.success && updated.data) {
          setSubEvents(updated.data.subEvents ?? []);
        }
      }
    }

      if (form.macroType === "ATTO_GIURIDICO" && form.ruleTemplateId === "data-driven") {
      const isNotificaCitazione =
        form.procedimento === "CITAZIONE_CIVILE" && form.eventoCode === "NOTIFICA_CITAZIONE";
      const isNotificaRicorsoDecretoAppelloLavoro =
        form.procedimento === "APPELLO_LAVORO" &&
        form.eventoCode === "NOTIFICA_RICORSO_DECRETO_APPELLO_LAVORO";
      const eventiConDataPrimaUdienza = new Set([
        "NOTIFICA_CITAZIONE",
        "ISCRIZIONE_RUOLO",
        "COSTITUZIONE_CONVENUTO",
        "SLITTAMENTO_UDIENZA",
        "MEMORIA_171TER_1",
        "MEMORIA_171TER_2",
        "MEMORIA_171TER_3",
      ]);
      const richiedeDataPrimaUdienza =
        form.procedimento === "CITAZIONE_CIVILE" &&
        form.eventoCode &&
        eventiConDataPrimaUdienza.has(form.eventoCode);
      const hasDataPrimaUdienza =
        typeof form.inputs?.dataPrimaUdienza === "string" &&
        String(form.inputs.dataPrimaUdienza).trim().length > 0;
      const hasDataComunicazioneDecretoAppelloLavoro =
        typeof form.inputs?.dataComunicazioneDecretoFissazioneUdienzaAppelloLavoro === "string" &&
        String(form.inputs.dataComunicazioneDecretoFissazioneUdienzaAppelloLavoro).trim().length > 0;
      const hasDataUdienzaAppelloLavoro =
        typeof form.inputs?.dataUdienzaAppelloLavoro === "string" &&
        String(form.inputs.dataUdienzaAppelloLavoro).trim().length > 0;
      const soloDataPrimaUdienza = new Set([
        "ISCRIZIONE_RUOLO",
        "COSTITUZIONE_CONVENUTO",
        "SLITTAMENTO_UDIENZA",
        "MEMORIA_171TER_1",
        "MEMORIA_171TER_2",
        "MEMORIA_171TER_3",
      ]).has(form.eventoCode ?? "");
      const hasBaseDate = isNotificaCitazione
        ? typeof form.inputs?.dataPrimaNotificaCitazione === "string" &&
          String(form.inputs.dataPrimaNotificaCitazione).trim().length > 0 &&
          hasDataPrimaUdienza
        : isNotificaRicorsoDecretoAppelloLavoro
          ? hasDataComunicazioneDecretoAppelloLavoro && hasDataUdienzaAppelloLavoro
        : richiedeDataPrimaUdienza
            ? soloDataPrimaUdienza
              ? hasDataPrimaUdienza
              : hasDataPrimaUdienza &&
                Object.entries(form.inputs ?? {}).some(
                  ([k, v]) => k !== "dataPrimaUdienza" && typeof v === "string" && v.trim().length > 0
                )
            : Object.values(form.inputs ?? {}).some(
                (v) => typeof v === "string" && v.trim().length > 0,
              );
      if (!form.macroArea || !form.procedimento || !form.parteProcessuale || !form.eventoCode || !hasBaseDate) {
        setError(
          isNotificaCitazione
            ? "Inserisci entrambe le date: Data notifica atto di citazione e Data prima udienza, poi clicca Calcola anteprima."
            : isNotificaRicorsoDecretoAppelloLavoro
              ? "Inserisci entrambe le date: Data comunicazione decreto di fissazione udienza e Data udienza, poi clicca Calcola anteprima."
            : richiedeDataPrimaUdienza
                ? soloDataPrimaUdienza
                  ? "Inserisci la Data prima udienza, poi clicca Calcola anteprima."
                  : "Inserisci la data dell'evento e la Data prima udienza, poi clicca Calcola anteprima."
                : "Seleziona macro area, procedimento, parte e fase, poi inserisci la data prima di procedere."
        );
        return;
      }
    }

    setCalculating(true);
    try {
      let startAt = form.startAt;
      let endAt = form.endAt;
      if (usesCalculationDateOnly(form.macroType)) {
        const primary = getPrimaryDateFromInputs(form.inputs);
        if (primary) {
          startAt = primary;
          endAt = new Date(primary.getTime() + 60 * 60 * 1000);
        }
      }
      const payload = {
        title: form.title,
        startAt: startAt.toISOString(),
        endAt: endAt.toISOString(),
        type: form.type,
        tags: form.tags,
        ruleTemplateId: form.ruleTemplateId,
        ...(form.ruleTemplateId === "data-driven"
          ? {
              macroType: "ATTO_GIURIDICO",
              macroArea: form.macroArea,
              procedimento: form.procedimento,
              parteProcessuale: form.parteProcessuale,
              eventoCode: form.eventoCode,
              inputs: { ...serializeInputsForServer(form.inputs), macroArea: form.macroArea, procedimento: form.procedimento, parteProcessuale: form.parteProcessuale, reminderOffsets: form.reminderOffsets, linkedEvents: form.linkedEvents },
            }
          : {
              inputs: { reminderOffsets: form.reminderOffsets, linkedEvents: form.linkedEvents },
            }),
      };
      const mergedInputsDataDriven = {
        ...serializeInputsForServer(form.inputs),
        macroArea: form.macroArea,
        procedimento: form.procedimento,
        parteProcessuale: form.parteProcessuale,
        reminderOffsets: form.reminderOffsets,
        linkedEvents: form.linkedEvents,
      };
      const phase1Promise =
        form.ruleTemplateId === "data-driven" &&
        form.macroArea &&
        form.procedimento &&
        form.parteProcessuale &&
        form.eventoCode
          ? getPhase1MainPreview({
              macroArea: form.macroArea,
              procedimento: form.procedimento,
              parteProcessuale: form.parteProcessuale,
              eventoCode: form.eventoCode,
              inputs: mergedInputsDataDriven,
            })
          : Promise.resolve({
              success: true as const,
              data: { dueAt: null as string | null, explanation: "" },
            });

      const [result, phase1Result] = await Promise.all([getSubEventsPreview(payload), phase1Promise]);

      if (phase1Result.success && phase1Result.data) {
        setPhase1Preview({
          dueAt: phase1Result.data.dueAt ? new Date(phase1Result.data.dueAt) : null,
          explanation: phase1Result.data.explanation ?? "",
        });
      } else {
        setPhase1Preview({ dueAt: null, explanation: "" });
      }

      if (result.success && result.data && result.data.length > 0) {
        setHasClickedCalcola(true);
        setPreviewSubEvents(
          result.data.map((c) => ({
            id: c.id,
            title: c.title,
            dueAt: c.dueAt ? new Date(c.dueAt) : null,
            explanation: c.explanation,
            ruleId: c.ruleId,
            ruleParams: c.ruleParams ?? null,
            kind: c.kind,
            priority: c.priority,
            isPlaceholder: (c as { isPlaceholder?: boolean }).isPlaceholder ?? false,
          }))
        );
        setError(null);
      } else {
        setPreviewSubEvents([]);
        setHasClickedCalcola(false);
        if (
          result.success &&
          (!result.data || result.data.length === 0) &&
          form.ruleTemplateId === "data-driven" &&
          form.macroType === "ATTO_GIURIDICO"
        ) {
          const isManualEvento =
            form.eventoCode === "__MANUALE__" ||
            (!!form.eventoCode && !/^[A-Z][A-Z0-9_]*$/.test(form.eventoCode));
          if (isManualEvento) {
            setError(null);
          } else {
            setError(
              form.procedimento === "CITAZIONE_CIVILE" && form.eventoCode === "NOTIFICA_CITAZIONE"
                ? "Inserisci entrambe le date (Data notifica atto di citazione e Data prima udienza) e clicca Calcola anteprima."
                : "Inserire la data base per la fase selezionata (es. data prima udienza) per calcolare le fasi successive dalla tabella."
            );
          }
        } else {
          setError(
            !result.success
              ? normalizeDisplayError(result.error)
              : "Impossibile calcolare i sottoeventi"
          );
        }
      }
    } finally {
      setCalculating(false);
    }
  }, [eventId, form, mode, readOnly, targetUserId]);

  const handleRemovePreviewSubEvent = (id: string) => {
    setPreviewSubEvents((prev) => prev.filter((s) => s.id !== id));
  };

  const handleSave = async () => {
    setError(null);
    setSaving(true);
    let savedNewEventId: string | undefined;
    try {
      // Per Atto Giuridico (e categorie simili) la data evento è quella del pannello "Dati per il calcolo", non i campi inizio/fine
      let startAt = form.startAt;
      let endAt = form.endAt;
      if (usesCalculationDateOnly(form.macroType)) {
        const primary = getPrimaryDateFromInputs(form.inputs);
        if (primary) {
          startAt = primary;
          endAt = new Date(primary.getTime() + 60 * 60 * 1000);
        }
      }

      // Se l'utente sta creando/modificando un rinvio nella tab Prosecuzione,
      // il bottone "Salva" dell'evento principale deve anche salvare quel rinvio.
      if (mode === "edit" && eventId && !readOnly) {
        const pendingResult = await pendingRinvioSaveHandlerRef.current?.();
        if (pendingResult === "failed") {
          // L'errore, se presente, viene mostrato dal pannello Prosecuzione.
          return;
        }
      }

      if (mode === "create") {
        const composedTitle = composePracticeTitle(form);
        const mergedInputs: Record<string, unknown> = {
          ...((form.inputs as Record<string, unknown> | null) ?? {}),
          practiceIdentity: {
            parti: form.parti.trim(),
            rg: form.rg.trim(),
            autorita: form.autorita.trim(),
            luogo: form.luogo.trim(),
          },
        };
        const result = await createEvent({
          title: composedTitle || form.title,
          description: form.description || null,
          startAt,
          endAt,
          type: form.type,
          tags: form.tags,
          notes: form.notes || null,
          generateSubEvents: form.generateSubEvents,
          ruleTemplateId: form.ruleTemplateId || null,
          macroType: form.macroType ?? undefined,
          macroArea: form.macroArea,
          procedimento: form.procedimento,
          parteProcessuale: form.parteProcessuale,
          eventoCode: form.eventoCode,
          inputs: serializeInputsForServer(mergedInputs),
          ruleParams: { reminderOffsets: form.reminderOffsets, linkedEvents: form.linkedEvents },
          color: form.color,
          status: form.status,
        }, targetUserId);
        if (!result.success) {
          setError(normalizeDisplayError(result.error));
          return;
        }
        savedNewEventId = result.data?.id;
        if (result.data && form.generateSubEvents) {
          const usePreviewList = hasClickedCalcola;
          const regen = usePreviewList
            ? await createSubEventsFromPreview(result.data.id, previewSubEvents.map((p) => p.id), targetUserId)
            : await regenerateSubEvents(result.data.id, targetUserId);
          if (!regen.success) {
            setError(
              regen.error ?? "Errore creazione sottoeventi. Riprova o rigenera dalla tab Regole."
            );
            return;
          }
        }
      } else if (eventId) {
        const composedTitle = composePracticeTitle(form);
        const mergedInputs: Record<string, unknown> = {
          ...((form.inputs as Record<string, unknown> | null) ?? {}),
          practiceIdentity: {
            parti: form.parti.trim(),
            rg: form.rg.trim(),
            autorita: form.autorita.trim(),
            luogo: form.luogo.trim(),
          },
        };
        const result = await updateEvent(eventId, {
          title: composedTitle || form.title,
          description: form.description || null,
          startAt,
          endAt,
          type: form.type,
          tags: form.tags,
          notes: form.notes || null,
          generateSubEvents: form.generateSubEvents,
          ruleTemplateId: form.ruleTemplateId || null,
          macroType: form.macroType ?? undefined,
          macroArea: form.macroArea,
          procedimento: form.procedimento,
          parteProcessuale: form.parteProcessuale,
          eventoCode: form.eventoCode,
          inputs: serializeInputsForServer(mergedInputs),
          ruleParams: { reminderOffsets: form.reminderOffsets, linkedEvents: form.linkedEvents },
          color: form.color,
          status: form.status,
        }, targetUserId);
        if (!result.success) {
          setError(normalizeDisplayError(result.error));
          return;
        }
        if (form.generateSubEvents) {
          const usePreviewList = hasClickedCalcola;
          const regen = usePreviewList
            ? await createSubEventsFromPreview(
                eventId,
                previewSubEvents.map((p) => p.id),
                targetUserId
              )
            : await regenerateSubEvents(eventId, targetUserId);

          if (!regen.success) {
            setError(
              regen.error ??
                "Errore aggiornamento sottoeventi. Riprova o rigenera dalla tab Regole."
            );
            return;
          }
          if (regen.data) {
            setSubEvents(regen.data);
            setSelectedSubEventId(null);
          }
        }
      }
      setHasClickedCalcola(false);
      // Dopo il salvataggio, una eventuale bozza collegata può essere rimossa
      onDraftCleared?.(draftId ?? null);
      baselineSnapshotRef.current = currentUnsavedSnapshot;
      setHasUnsavedChanges(false);
      // Non chiudere il popup: l'utente può aggiungere prosecuzione ecc. Chiude solo con la X.
      if (savedNewEventId) {
        onChanged?.(savedNewEventId);
      } else {
        onChanged?.();
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteSelectedSubEvent = async () => {
    if (!selectedSubEventId) return;
    setSaving(true);
    setError(null);
    try {
      const result = await deleteSubEvent(selectedSubEventId, targetUserId);
      if (result.success) {
        setSubEvents((prev) => prev.filter((se) => se.id !== selectedSubEventId));
        setSelectedSubEventId(null);
      } else {
        setError(normalizeDisplayError(result.error) ?? "Errore eliminazione sottoevento");
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (mode !== "edit" || !eventId) return;
    setSaving(true);
    setError(null);
    try {
      const result = await deleteEvent(eventId, targetUserId);
      if (result.success) {
        setShowDeleteConfirm(false);
        onChanged?.();
        onDeleted?.(eventId);
        onClose();
      } else {
        setError(normalizeDisplayError(result.error) ?? "Errore durante l'eliminazione");
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading && mode === "edit") {
    return (
      <Dialog open onOpenChange={() => handleRequestClose(false)}>
        <DialogContent>
          <p>Caricamento...</p>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) {
          handleRequestClose(false);
        }
      }}
    >
      <DialogContent
        ref={setPopoverContainer}
        className="max-w-[68.75rem] max-h-[min(94vh,94dvh)] max-lg:h-[min(94vh,94dvh)] flex flex-col bg-white event-modal-light overflow-hidden p-4 sm:p-6"
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
        showClose={false}
      >
        <PopoverContainerContext.Provider value={popoverContainer}>
        <DialogHeader className="relative pr-24 shrink-0">
          <DialogTitle className="text-[var(--navy)]">
            {readOnly ? "VISUALIZZAZIONE PRATICA" : mode === "create" ? "NUOVA PRATICA" : "DETTAGLIO PRATICA"}
          </DialogTitle>
          {mode === "create" && draftId && (
            <p className="text-xs font-semibold text-red-600 mt-1">BOZZA (non ancora salvato)</p>
          )}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 flex items-center gap-1.5 rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-zinc-700 shadow-sm hover:bg-zinc-50 hover:text-zinc-900"
            onClick={() => handleRequestClose(true)}
          >
            <X className="h-4 w-4" aria-hidden />
            Chiudi
          </Button>
        </DialogHeader>
        <div className="flex-1 min-h-0 flex flex-col max-lg:overflow-y-auto max-lg:overflow-x-hidden event-modal-mobile-scroll">
        <Tabs
          ref={tabsContainerRef}
          value={activeTab}
          onValueChange={(v) => setActiveTab(v as ActiveTab)}
          className="flex flex-col lg:flex-row lg:gap-4 lg:flex-1 lg:min-h-0"
        >
          <div className="min-w-0 flex flex-col flex-1" style={{ flexBasis: `${100 - desktopSummaryWidthPct}%` }}>
            <TabsList className="bg-zinc-100 dark:bg-zinc-100 dark:text-zinc-600 p-1">
              <TabsTrigger
                value="dettagli"
                className="data-[state=active]:bg-white data-[state=active]:text-zinc-900 dark:data-[state=active]:bg-white dark:data-[state=active]:text-zinc-900 data-[state=active]:shadow-sm"
              >
                Dettagli
              </TabsTrigger>
              <TabsTrigger
                value="prosecuzione"
                className="data-[state=active]:bg-white data-[state=active]:text-zinc-900 dark:data-[state=active]:bg-white dark:data-[state=active]:text-zinc-900 data-[state=active]:shadow-sm"
              >
                Prosecuzione
              </TabsTrigger>
            </TabsList>
            <TabsContent
              value="dettagli"
              className="flex-1 min-h-0 flex flex-col overflow-hidden mt-2 data-[state=inactive]:hidden"
            >
              <div className="flex-1 min-h-0 flex flex-col overflow-y-auto pr-2 pb-2">
                  <div className="space-y-4">
              {/* 1. Campi identificativi pratica (compongono il titolo ricercabile) */}
              <div className="space-y-2">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  <div>
                    <Label className="font-bold">PARTI</Label>
                    <Input
                      value={form.parti}
                      onChange={(e) =>
                        setForm((f) => {
                          const next = { ...f, parti: e.target.value };
                          return { ...next, title: composePracticeTitle(next) };
                        })
                      }
                      placeholder="Es. Rossi c/ Bianchi"
                      disabled={readOnly}
                    />
                  </div>
                  <div>
                    <Label className="font-bold">RG</Label>
                    <Input
                      value={form.rg}
                      onChange={(e) =>
                        setForm((f) => {
                          const next = { ...f, rg: e.target.value };
                          return { ...next, title: composePracticeTitle(next) };
                        })
                      }
                      placeholder="Es. 1234/2026"
                      disabled={readOnly}
                    />
                  </div>
                  <div>
                    <Label className="font-bold">AUTORITA&apos;</Label>
                    <div className="relative">
                      <Input
                        value={form.autorita}
                        onChange={(e) =>
                          setForm((f) => {
                            const next = { ...f, autorita: e.target.value };
                            return { ...next, title: composePracticeTitle(next) };
                          })
                        }
                        onFocus={() => setShowAutoritaSuggestions(true)}
                        onBlur={() => setTimeout(() => setShowAutoritaSuggestions(false), 120)}
                        onKeyDown={autoritaListNav.handleKeyDown}
                        placeholder="Es. Tribunale di Napoli"
                        disabled={readOnly}
                      />
                      {!readOnly && showAutoritaSuggestions && filteredAutoritaSuggestions.length > 0 && (
                        <div
                          ref={autoritaListRef}
                          role="listbox"
                          className="absolute z-30 mt-1 max-h-48 w-full overflow-auto rounded-md border border-zinc-200 bg-white shadow-lg"
                        >
                          {filteredAutoritaSuggestions.map((item, index) => (
                            <button
                              key={item}
                              type="button"
                              role="option"
                              data-suggestion-index={index}
                              aria-selected={autoritaListNav.activeIndex === index}
                              className={`w-full px-3 py-2 text-left text-sm text-zinc-700 hover:bg-zinc-50 ${
                                autoritaListNav.activeIndex === index ? "bg-zinc-100" : ""
                              }`}
                              onMouseDown={(e) => {
                                e.preventDefault();
                                setForm((f) => {
                                  const next = { ...f, autorita: item };
                                  return { ...next, title: composePracticeTitle(next) };
                                });
                                setShowAutoritaSuggestions(false);
                              }}
                            >
                              {item}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <Label className="font-bold">LUOGO</Label>
                    <div className="relative">
                      <Input
                        value={form.luogo}
                        onChange={(e) =>
                          setForm((f) => {
                            const next = { ...f, luogo: e.target.value };
                            return { ...next, title: composePracticeTitle(next) };
                          })
                        }
                        onFocus={() => setShowLuogoSuggestions(true)}
                        onBlur={() => setTimeout(() => setShowLuogoSuggestions(false), 120)}
                        onKeyDown={luogoListNav.handleKeyDown}
                        placeholder="Es. Napoli"
                        disabled={readOnly}
                      />
                      {!readOnly && showLuogoSuggestions && filteredLuogoSuggestions.length > 0 && (
                        <div
                          ref={luogoListRef}
                          role="listbox"
                          className="absolute z-30 mt-1 max-h-56 w-full overflow-auto rounded-md border border-zinc-200 bg-white shadow-lg"
                        >
                          {filteredLuogoSuggestions.map((item, index) => (
                            <button
                              key={item}
                              type="button"
                              role="option"
                              data-suggestion-index={index}
                              aria-selected={luogoListNav.activeIndex === index}
                              className={`w-full px-3 py-2 text-left text-sm text-zinc-700 hover:bg-zinc-50 ${
                                luogoListNav.activeIndex === index ? "bg-zinc-100" : ""
                              }`}
                              onMouseDown={(e) => {
                                e.preventDefault();
                                setForm((f) => {
                                  const next = { ...f, luogo: item };
                                  return { ...next, title: composePracticeTitle(next) };
                                });
                                setShowLuogoSuggestions(false);
                              }}
                            >
                              {item}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div>
                  <Label className="font-bold">PRATICA</Label>
                  <Input
                    value={composePracticeTitle(form)}
                    placeholder="Titolo composto automaticamente"
                    disabled
                  />
                </div>
              </div>

              {/* 2. Primo menu: Atto Giuridico oppure Evento generico */}
              <div>
                <Label>Tipo</Label>
                <Select
                  value={form.macroType === "ATTO_GIURIDICO" ? "ATTO_GIURIDICO" : "generico"}
                  onValueChange={(v) => {
                    const isAtto = v === "ATTO_GIURIDICO";
                    setForm((f) => ({
                      ...f,
                      macroType: isAtto ? "ATTO_GIURIDICO" : null,
                      ruleTemplateId: isAtto ? "data-driven" : "reminder",
                      generateSubEvents: true,
                      ...(isAtto
                        ? {
                            macroArea: null,
                            procedimento: null,
                            parteProcessuale: null,
                            eventoCode: null,
                            inputs: {},
                          }
                        : {
                            macroArea: null,
                            procedimento: null,
                            parteProcessuale: null,
                            eventoCode: null,
                            inputs: {},
                          }),
                    }));
                  }}
                >
                  <SelectTrigger className="bg-white border-zinc-200 text-zinc-900 focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none">
                    <SelectValue placeholder="Seleziona tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="generico">Gestione Manuale</SelectItem>
                    <SelectItem value="ATTO_GIURIDICO">Gestione Automatizzata</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {form.macroType === null && (
                <div className="rounded-lg border border-zinc-100 bg-zinc-50/40 p-3.5">
                  <div className="flex gap-2.5">
                    <Gavel className="mt-0.5 h-3.5 w-3.5 shrink-0 text-zinc-400" aria-hidden />
                    <div className="min-w-0 flex-1 space-y-2">
                      <div className="flex items-center justify-between gap-3">
                        <Label
                          htmlFor="manual-hearing-toggle"
                          className="cursor-pointer text-xs font-medium leading-snug text-zinc-800"
                        >
                          È un&apos;udienza
                        </Label>
                        <Checkbox
                          id="manual-hearing-toggle"
                          checked={form.type === "udienza"}
                          disabled={readOnly}
                          onCheckedChange={(checked) =>
                            setForm((f) => ({
                              ...f,
                              type: checked ? "udienza" : "altro",
                            }))
                          }
                        />
                      </div>
                      <p className="text-[11px] leading-relaxed text-zinc-500">
                        Se attivo, compare solo nel{" "}
                        <span className="font-medium text-zinc-700">Pannello intelligente</span>, scheda{" "}
                        <span className="font-medium text-zinc-700">Prossime udienze</span>.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* 3. Data e ora inizio/fine: solo per Evento generico. Per Atto Giuridico (e altre categorie in MACRO_TYPES_WITH_CALCULATION_DATE_ONLY) la data è quella del blocco "Dati per il calcolo" sotto. */}
              {!usesCalculationDateOnly(form.macroType) && (
                <>
                  <div>
                    <Label>Data e ora inizio</Label>
                    {mode === "create" && (
                      <p className="text-xs text-zinc-500 mb-1">
                        Se hai cliccato su un giorno, qui vedi una data suggerita; modificala come
                        vuoi: l’evento userà le date che imposti qui.
                      </p>
                    )}
                    <DateTimePicker
                      value={form.startAt}
                      onChange={(d) =>
                        setForm((f) => {
                          const newStart = d;
                          // Pratiche in Corso: durata sempre 1h fissa
                          const newEnd =
                            f.macroType === null
                              ? new Date(newStart.getTime() + 60 * 60 * 1000)
                              : f.endAt <= newStart
                                ? new Date(newStart.getTime() + 60 * 60 * 1000)
                                : f.endAt;
                          return { ...f, startAt: newStart, endAt: newEnd };
                        })
                      }
                      placeholder="Data e ora inizio"
                    />
                  </div>
                  {/* Data e ora fine: nascosta per Pratiche in Corso (macroType===null) */}
                  {form.macroType !== null && (
                    <div>
                      <Label>Data e ora fine</Label>
                      <DateTimePicker
                        value={form.endAt}
                        onChange={(d) =>
                          setForm((f) => {
                            let newEnd = d;
                            const start = f.startAt;
                            if (newEnd < start) {
                              newEnd = new Date(start.getTime() + 60 * 60 * 1000);
                            }
                            return { ...f, endAt: newEnd };
                          })
                        }
                        placeholder="Data e ora fine"
                      />
                    </div>
                  )}
                </>
              )}

              {/* 4a. Se Atto Giuridico: compila da documento (AI) + gerarchia 4 livelli */}
              {form.macroType === "ATTO_GIURIDICO" && (
                <>
                  {/* Compila da documento: solo in creazione */}
                  {mode === "create" && !readOnly && (
                    <div className="rounded-lg border border-zinc-100 bg-zinc-50/40 p-3.5">
                      <div className="flex gap-2.5">
                        <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-zinc-400" aria-hidden />
                        <div className="min-w-0 space-y-1">
                          <p className="text-xs font-medium text-zinc-700">Compila da documento</p>
                          <p className="text-[11px] leading-relaxed text-zinc-500">
                            Allega il PDF: l&apos;AI estrarrà titolo, tipo, date e campi utili. Controlla e salva.
                          </p>
                          <p className="text-[11px] leading-relaxed text-zinc-400">
                            Solo PDF con testo selezionabile (non immagini o scansioni).
                          </p>
                        </div>
                      </div>
                      <div className="mt-3 space-y-2">
                        <input
                        ref={fileInputRef}
                        type="file"
                        accept=".pdf,application/pdf"
                        className="hidden"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          setError(null);
                          setParsingDocument(true);
                          try {
                            const formData = new FormData();
                            formData.append("file", file);
                            const result = await parseDocumentForEvent(formData);
                            if (result.success && result.data) {
                              const d = result.data;
                              const parsedIdentityFromTitle = extractPracticeIdentityFromAiTitle(d.title ?? "");
                              let mergedInputs = (d.inputs ?? {}) as Record<string, unknown>;
                              if (Object.keys(mergedInputs).length > 0) {
                                const dataComp = mergedInputs.dataUdienzaComparizione as string | undefined;
                                if (dataComp && mergedInputs.dataUdienza == null) {
                                  mergedInputs = { ...mergedInputs, dataUdienza: dataComp.slice(0, 10) };
                                }
                              }
                              const aiMacroArea = (d as { macroArea?: string }).macroArea as MacroAreaCode | undefined;
                              const aiProcedimento = (d as { procedimento?: string }).procedimento as ProcedimentoCode | undefined;
                              const aiParte = (d as { parteProcessuale?: string }).parteProcessuale as ParteProcessuale | undefined;
                              const aiEventoCode = (d as { eventoCode?: string }).eventoCode ?? null;
                              setForm((f) => ({
                                ...(() => {
                                  const nextParti = parsedIdentityFromTitle.parti || f.parti;
                                  const nextRg = parsedIdentityFromTitle.rg || f.rg;
                                  const nextAutorita = parsedIdentityFromTitle.autorita || f.autorita;
                                  const nextLuogo = parsedIdentityFromTitle.luogo || f.luogo;
                                  const composedTitle = composePracticeTitle({
                                    parti: nextParti,
                                    rg: nextRg,
                                    autorita: nextAutorita,
                                    luogo: nextLuogo,
                                  });
                                  return {
                                    ...f,
                                    parti: nextParti,
                                    rg: nextRg,
                                    autorita: nextAutorita,
                                    luogo: nextLuogo,
                                    title: composedTitle || d.title || f.title,
                                  };
                                })(),
                                description: d.description ?? f.description,
                                type: (d.type as EventType) ?? f.type,
                                notes: d.notes ?? f.notes,
                                ...(aiMacroArea ? { macroArea: aiMacroArea } : {}),
                                ...(aiProcedimento ? { procedimento: aiProcedimento } : {}),
                                ...(aiParte ? { parteProcessuale: aiParte } : {}),
                                ...(aiEventoCode && { eventoCode: aiEventoCode }),
                                ...(aiMacroArea && { ruleTemplateId: "data-driven" }),
                                // Mantiene i campi data visibili nel pannello ma evita valori residui da precedenti analisi.
                                // Se l'AI non trova date, inputs resta semplicemente vuoto e l'utente può compilare manualmente.
                                inputs: mergedInputs,
                              }));
                              setError(null);
                            } else if (!result.success) {
                              setError(normalizeDisplayError(result.error) || "Impossibile analizzare il documento.");
                            }
                          } catch (err) {
                            setError(normalizeDisplayError(err) || "Errore durante l'analisi del documento.");
                          } finally {
                            setParsingDocument(false);
                            e.target.value = "";
                          }
                        }}
                        />
                        <div className="flex flex-wrap items-center gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="h-8 border-zinc-200 bg-white text-xs font-normal text-zinc-700 hover:bg-zinc-50"
                            disabled={parsingDocument || saving || calculating}
                            onClick={() => fileInputRef.current?.click()}
                          >
                            {parsingDocument ? "Analisi in corso…" : "Allega PDF"}
                          </Button>
                          {!parsingDocument && !error && form.inputs && Object.keys(form.inputs).length > 0 && (
                            <span className="inline-flex items-center gap-1 rounded-md border border-zinc-200 bg-white px-2 py-0.5 text-[11px] text-zinc-600">
                              <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" />
                              Dati estratti
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Gerarchia: Macro Area -> Procedimento -> Parte processuale -> Evento -> Data */}
                  <MacroAreaPanel
                    macroArea={form.macroArea}
                    procedimento={form.procedimento}
                    parteProcessuale={form.parteProcessuale}
                    eventoCode={form.eventoCode}
                    inputs={form.inputs}
                    onMacroAreaChange={(ma) =>
                      setForm((f) => ({
                        ...f,
                        macroArea: ma,
                        procedimento: null,
                        parteProcessuale: null,
                        eventoCode: null,
                        inputs: {},
                        ruleTemplateId: "data-driven",
                      }))
                    }
                    onProcedimentoChange={(p) =>
                      setForm((f) => {
                        const resolvedMacroArea = getMacroAreaForProcedimento(p);
                        return {
                          ...f,
                          macroArea: resolvedMacroArea,
                          procedimento: p,
                          parteProcessuale: null,
                          eventoCode: null,
                          inputs: {},
                        };
                      })
                    }
                    onParteProcessualeChange={(p) =>
                      setForm((f) => ({
                        ...f,
                        parteProcessuale: p,
                        eventoCode: null,
                        inputs: {},
                      }))
                    }
                    onEventoChange={(code) =>
                      setForm((f) => {
                        const prevInputs = (f.inputs ?? {}) as Record<string, unknown>;
                        const MANUALE_CODE = "__MANUALE__";
                        const isKnownEventCode = !!(code && f.procedimento && getEventoByCode(f.procedimento, code));

                        const baseKey =
                          code === MANUALE_CODE || !isKnownEventCode
                            ? "dataManuale"
                            : (f.procedimento ? getEventoByCode(f.procedimento, code)?.inputKey ?? "dataManuale" : "dataManuale");

                        const existingBaseValue = prevInputs[baseKey];
                        const baseValue =
                          typeof existingBaseValue === "string" && existingBaseValue.trim().length > 0
                            ? existingBaseValue
                            : defaultAnchorDateStr || "";

                        return {
                          ...f,
                          eventoCode: code,
                          inputs: {
                            ...(baseValue ? { [baseKey]: baseValue } : {}),
                          },
                        };
                      })
                    }
                    onInputsChange={(inputs) => setForm((f) => ({ ...f, inputs }))}
                  />
                </>
              )}

              {/* 4b. Promemoria + eventi collegati: due blocchi visivi separati; azioni «aggiungi» vicine al rispettivo contenuto. */}
              <div className="space-y-4">
                <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
                  <div className="flex gap-3 border-b border-zinc-100 bg-gradient-to-r from-zinc-50 to-white px-4 py-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--navy)]/10 text-[var(--navy)]">
                      <Bell className="h-4 w-4" aria-hidden />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-zinc-900">Promemoria</p>
                      <p className="mt-0.5 text-xs leading-relaxed text-zinc-500">
                        Notifiche sulla pratica: quanti giorni prima della data di riferimento vuoi il promemoria.
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2 p-4">
                    {form.reminderOffsets.length === 0 ? (
                      <p className="rounded-lg border border-dashed border-zinc-200 bg-zinc-50/80 px-3 py-2.5 text-xs text-zinc-500">
                        Nessun promemoria. Aggiungi almeno uno se vuoi un avviso anticipato.
                      </p>
                    ) : null}
                    {form.reminderOffsets.map((days, i) => (
                      <div
                        key={i}
                        className="flex flex-wrap items-center gap-2 rounded-lg border border-zinc-100 bg-zinc-50/60 px-3 py-2 sm:flex-nowrap sm:justify-between"
                      >
                        <span className="text-xs font-medium text-zinc-500 sm:hidden">Promemoria {i + 1}</span>
                        <div className="flex flex-1 flex-wrap items-center gap-2 sm:flex-nowrap sm:gap-3">
                          <div className="inline-flex items-stretch overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm">
                            <button
                              type="button"
                              onClick={() =>
                                setForm((f) => {
                                  const next = [...f.reminderOffsets];
                                  next[i] = Math.max(1, next[i] - 1);
                                  return { ...f, reminderOffsets: next };
                                })
                              }
                              className="flex h-9 w-9 items-center justify-center border-r border-zinc-200 text-lg font-semibold leading-none text-zinc-700 transition-colors hover:bg-zinc-50 disabled:opacity-40"
                              aria-label="Diminuisci giorni"
                              disabled={readOnly}
                            >
                              −
                            </button>
                            <span className="flex min-w-[2.75rem] items-center justify-center bg-zinc-50/80 px-2 text-sm font-semibold tabular-nums text-zinc-900">
                              {days}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                setForm((f) => {
                                  const next = [...f.reminderOffsets];
                                  next[i] = next[i] + 1;
                                  return { ...f, reminderOffsets: next };
                                })
                              }
                              className="flex h-9 w-9 items-center justify-center border-l border-zinc-200 text-lg font-semibold leading-none text-zinc-700 transition-colors hover:bg-zinc-50 disabled:opacity-40"
                              aria-label="Aumenta giorni"
                              disabled={readOnly}
                            >
                              +
                            </button>
                          </div>
                          <span className="text-sm text-zinc-600">giorni prima della data di riferimento</span>
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            setForm((f) => ({
                              ...f,
                              reminderOffsets: f.reminderOffsets.filter((_, idx) => idx !== i),
                            }))
                          }
                          className="ml-auto inline-flex h-9 w-9 items-center justify-center rounded-lg text-zinc-400 transition-colors hover:bg-red-50 hover:text-red-600 disabled:opacity-40"
                          aria-label="Rimuovi promemoria"
                          disabled={readOnly}
                          title="Rimuovi"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setForm((f) => ({
                          ...f,
                          reminderOffsets: [...f.reminderOffsets, 7],
                        }))
                      }
                      className="mt-1 w-full border-dashed border-zinc-300 text-zinc-700 hover:border-[var(--navy)]/40 hover:bg-[var(--calendar-brown-pale)] sm:w-auto"
                      disabled={readOnly}
                    >
                      + Aggiungi promemoria
                    </Button>
                  </div>
                </div>

                <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
                  <div className="flex gap-3 border-b border-zinc-100 bg-gradient-to-r from-zinc-50 to-white px-4 py-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--navy)]/10 text-[var(--navy)]">
                      <Link2 className="h-4 w-4" aria-hidden />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-zinc-900">Eventi collegati</p>
                      <p className="mt-0.5 text-xs leading-relaxed text-zinc-500">
                        Sottoeventi con titolo libero e data calcolata in giorni solari rispetto alla data di riferimento
                        (come i promemoria: festivi e weekend seguono le stesse regole dell’app).
                      </p>
                    </div>
                  </div>
                  <div className="space-y-3 p-4">
                    {form.linkedEvents.length === 0 ? (
                      <p className="rounded-lg border border-dashed border-zinc-200 bg-zinc-50/80 px-3 py-2.5 text-xs text-zinc-500">
                        Nessun adempimento collegato. Aggiungi voci per creare scadenze o attività legate alla pratica.
                      </p>
                    ) : null}
                    {form.linkedEvents.map((row, i) => (
                      <div
                        key={i}
                        className="space-y-3 rounded-lg border border-zinc-100 bg-zinc-50/60 p-3"
                      >
                        <Input
                          className="w-full border-zinc-200 bg-white sm:max-w-none"
                          placeholder="Titolo dell'adempimento collegato"
                          value={row.title}
                          onChange={(e) =>
                            setForm((f) => {
                              const next = [...f.linkedEvents];
                              next[i] = { ...next[i], title: e.target.value };
                              return { ...f, linkedEvents: next };
                            })
                          }
                          disabled={readOnly}
                        />
                        <div className="flex flex-wrap items-center gap-2 sm:justify-between">
                          <div className="flex min-w-0 flex-1 flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
                            <span className="text-xs font-medium text-zinc-500">Scostamento</span>
                            <LinkedEventOffsetDateControls
                              offsetDays={row.offsetDays}
                              onOffsetChange={(next) =>
                                setForm((f) => {
                                  const ev = [...f.linkedEvents];
                                  ev[i] = { ...ev[i], offsetDays: next };
                                  return { ...f, linkedEvents: ev };
                                })
                              }
                              referenceDate={linkedEventReferenceDate}
                              readOnly={readOnly}
                              minusButtonClassName="flex h-9 w-9 items-center justify-center border-r border-zinc-200 text-lg font-semibold leading-none text-zinc-700 transition-colors hover:bg-zinc-50 disabled:opacity-40"
                              plusButtonClassName="flex h-9 w-9 items-center justify-center border-l border-zinc-200 text-lg font-semibold leading-none text-zinc-700 transition-colors hover:bg-zinc-50 disabled:opacity-40"
                            />
                            <span className="text-xs text-zinc-500">giorni dalla data di riferimento (anche negativi)</span>
                          </div>
                          <button
                            type="button"
                            onClick={() =>
                              setForm((f) => ({
                                ...f,
                                linkedEvents: f.linkedEvents.filter((_, idx) => idx !== i),
                              }))
                            }
                            className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-zinc-400 transition-colors hover:bg-red-50 hover:text-red-600 disabled:opacity-40 sm:ml-0"
                            aria-label="Rimuovi adempimento collegato"
                            disabled={readOnly}
                            title="Rimuovi"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setForm((f) => ({
                          ...f,
                          linkedEvents: [...f.linkedEvents, { title: "", offsetDays: 7 }],
                        }))
                      }
                      className="w-full border-dashed border-zinc-300 text-zinc-700 hover:border-[var(--navy)]/40 hover:bg-[var(--calendar-brown-pale)] sm:w-auto"
                      disabled={readOnly}
                    >
                      + Aggiungi adempimento collegato
                    </Button>
                  </div>
                </div>
              </div>

              {/* 5. Note */}
              <div>
                <Label>Adempimenti / Note</Label>
                <textarea
                  className="flex min-h-[80px] w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 ring-offset-white placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--navy)] focus-visible:ring-offset-2"
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  placeholder="Adempimenti o note"
                  disabled={readOnly}
                />
              </div>

              {/* 6. Stato completamento evento */}
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={async () => {
                    if (readOnly) return;
                    // In creazione aggiorniamo solo lo stato locale; in modifica persistiamo anche su server + sottoeventi
                    if (mode === "edit" && eventId) {
                      setError(null);
                      setSaving(true);
                      try {
                        const result = await completeEventWithSubEvents(eventId, targetUserId);
                        if (!result.success || !result.data) {
                          setError(
                            !result.success
                              ? normalizeDisplayError(result.error)
                              : "Impossibile completare la pratica"
                          );
                          return;
                        }
                        const e = result.data;
                        const nextStatus = e.status === "done" ? "done" : "pending";
                        setForm((f) => ({
                          ...f,
                          status: nextStatus,
                        }));
                        setSubEvents(e.subEvents ?? []);
                        setSelectedSubEventId(null);
                      } finally {
                        setSaving(false);
                      }
                    } else {
                      setForm((f) => ({ ...f, status: f.status === "done" ? "pending" : "done" }));
                    }
                  }}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-md border text-sm font-medium transition-colors ${
                    form.status === "done"
                      ? "bg-green-100 border-green-400 text-green-800 hover:bg-green-200"
                      : "bg-white border-zinc-300 text-zinc-600 hover:bg-zinc-50"
                  }`}
                  aria-label={
                    form.status === "done"
                      ? "Segna la pratica come da fare"
                      : "Segna la pratica come completata"
                  }
                  disabled={saving || readOnly}
                >
                  <span
                    className={`inline-block w-4 h-4 rounded-full border-2 flex-shrink-0 ${
                      form.status === "done"
                        ? "bg-green-500 border-green-500"
                        : "border-zinc-400"
                    }`}
                  >
                    {form.status === "done" && (
                      <svg viewBox="0 0 16 16" fill="none" className="w-full h-full">
                        <path d="M3 8l3.5 3.5L13 5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </span>
                  {form.status === "done" ? "Segna la pratica come da fare" : "Segna la pratica come completata"}
                </button>
              </div>

              {/* 7. Colore tag: applicato a evento e sottoeventi in calendario */}
              <div>
                <Label>Colore tag</Label>
                <div className="flex flex-wrap gap-2 mt-1.5 pl-1">
                  <button
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, color: null }))}
                    className={`h-8 w-8 rounded-full border-2 shrink-0 transition-all ${
                      form.color === null
                        ? "border-[var(--navy)]"
                        : "border-zinc-300 hover:border-zinc-400 bg-zinc-50"
                    }`}
                    title="Nessun tag"
                  >
                    <span className="sr-only">Nessun tag</span>
                  </button>
                  {EVENT_TAG_COLORS.map((hex) => (
                    <button
                      key={hex}
                      type="button"
                      onClick={() => setForm((f) => ({ ...f, color: hex }))}
                      className={`h-8 w-8 rounded-full shrink-0 border-2 transition-all ${
                        form.color === hex
                          ? "border-[var(--navy)] shadow-[0_0_0_1px_rgba(26,43,69,0.35)]"
                          : "border-transparent hover:opacity-90"
                      }`}
                      style={{ backgroundColor: hex }}
                      title={hex}
                    >
                      <span className="sr-only">Colore {hex}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
              </div>
            </TabsContent>
            <TabsContent
              value="prosecuzione"
              className="flex-1 min-h-0 flex flex-col overflow-hidden mt-2 data-[state=inactive]:hidden"
            >
              <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
                <ScrollArea className="h-full event-modal-scroll">
                  <div className="pr-2">
              {mode === "edit" && eventId ? (
                <ProsecuzionePanel
                  eventId={eventId}
                  targetUserId={targetUserId}
                  readOnly={readOnly}
                  isManualPractice={form.macroType === null}
                  macroArea={form.macroArea}
                  procedimento={form.procedimento}
                  parteProcessuale={form.parteProcessuale}
                  onRegisterSavePendingRinvio={(fn) => {
                    pendingRinvioSaveHandlerRef.current = fn;
                  }}
                  onSubEventsChanged={async () => {
                    if (eventId) {
                      const result = await getEventById(eventId, targetUserId);
                      if (result.success && result.data) {
                        setSubEvents(result.data.subEvents ?? []);
                        setHasClickedCalcola(false);
                        setPreviewSubEvents([]);
                      }
                    }
                    onChanged?.();
                  }}
                />
              ) : (
                <div className="h-full flex items-center justify-center px-4 py-8">
                  <p className="text-sm text-zinc-500 text-center max-w-xs">
                    Potrai aggiungere rinvii, udienze e adempimenti dopo aver creato
                    e salvato la pratica principale.
                  </p>
                </div>
              )}
                  </div>
                </ScrollArea>
              </div>
            </TabsContent>
          </div>

          <div
            className="hidden lg:flex lg:w-2 lg:cursor-col-resize lg:items-stretch lg:justify-center"
            onMouseDown={(e) => {
              resizingRef.current = true;
              document.body.style.cursor = "col-resize";
              document.body.style.userSelect = "none";
              handleResizeMove(e.clientX);
            }}
          >
            <span className="my-2 w-[2px] rounded bg-zinc-200" />
          </div>

          <div className="flex-1 hidden lg:flex min-w-0" style={{ flexBasis: `${desktopSummaryWidthPct}%` }}>
            {/* Colonna Eventi & Scadenze desktop */}
            <EventSummaryPanel
              mode={mode}
              form={form}
              subEvents={subEvents}
              hasClickedCalcola={hasClickedCalcola}
              previewSubEvents={previewSubEvents}
              selectedSubEventId={selectedSubEventId}
              setSelectedSubEventId={setSelectedSubEventId}
              highlightSubEventId={highlightSubEventIdProp ?? selectedSubEventId}
              highlightRowRef={highlightRowRef}
              handleRemovePreviewSubEvent={handleRemovePreviewSubEvent}
              onDeleteSelectedSubEvent={handleDeleteSelectedSubEvent}
              saving={saving}
              readOnly={readOnly}
              phase1MainDueAt={phase1Preview.dueAt}
              phase1MainExplanation={phase1Preview.explanation}
            />
          </div>
        </Tabs>

        </div>

        {/* Pulsante sempre visibile per aprire Eventi & Scadenze su mobile (sopra il footer) */}
        <div className="shrink-0 pt-2 block lg:hidden">
          <Button
            type="button"
            variant="outline"
            className="w-full border-[var(--navy)] text-[var(--navy)] hover:bg-[var(--calendar-brown-pale)]"
            onClick={() => setShowEventsPanel(true)}
          >
            Mostra Eventi &amp; Scadenze
          </Button>
        </div>

        {/* Bottom sheet Eventi & Scadenze (mobile) */}
        {showEventsPanel && (
          <div className="fixed inset-0 z-40 flex flex-col justify-end bg-black/40 lg:hidden">
            <div
              className={`bg-white shadow-xl w-full flex flex-col overflow-hidden ${
                mobileEventsPanelExpanded
                  ? "rounded-none max-h-[min(96vh,96dvh)]"
                  : "rounded-t-2xl max-h-[min(75vh,75dvh)]"
              }`}
              style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
            >
              <div className="flex items-center justify-between px-4 pt-3 pb-2 border-b border-zinc-200 shrink-0">
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-semibold uppercase text-zinc-500">
                    Eventi &amp; Scadenze
                  </span>
                  <span className="text-sm font-medium text-zinc-800 line-clamp-1">
                    {form.title?.trim() || "Pratica senza titolo"}
                  </span>
                </div>
                <div className="flex items-center gap-3 shrink-0 ml-2">
                  <button
                    type="button"
                    className="text-sm text-zinc-500 hover:text-zinc-800"
                    onClick={() => setMobileEventsPanelExpanded((v) => !v)}
                  >
                    {mobileEventsPanelExpanded ? "Riduci" : "Espandi"}
                  </button>
                  <button
                    type="button"
                    className="text-sm text-zinc-500 hover:text-zinc-800"
                    onClick={() => setShowEventsPanel(false)}
                  >
                    Chiudi
                  </button>
                </div>
              </div>
              <div className="flex-1 min-h-0 flex flex-col p-3 overflow-hidden">
                <EventSummaryPanel
                  mode={mode}
                  form={form}
                  subEvents={subEvents}
                  hasClickedCalcola={hasClickedCalcola}
                  previewSubEvents={previewSubEvents}
                  selectedSubEventId={selectedSubEventId}
                  setSelectedSubEventId={setSelectedSubEventId}
                  highlightSubEventId={highlightSubEventIdProp ?? selectedSubEventId}
                  highlightRowRef={highlightRowRef}
                  handleRemovePreviewSubEvent={handleRemovePreviewSubEvent}
                  onDeleteSelectedSubEvent={handleDeleteSelectedSubEvent}
                  saving={saving}
                  readOnly={readOnly}
                  embedInSheet
                  phase1MainDueAt={phase1Preview.dueAt}
                  phase1MainExplanation={phase1Preview.explanation}
                />
              </div>
            </div>
          </div>
        )}

        {error && <p className="text-sm text-red-600 mt-2 shrink-0">{error}</p>}
        <DialogFooter className="dialog-footer-light flex-row justify-between shrink-0 pt-2 border-t border-zinc-200 bg-white">
          <div className="flex gap-2 items-center">
            {!readOnly && mode === "edit" && eventId && (
              <Button
                type="button"
                variant="destructive"
                className="bg-red-600 hover:bg-red-700 text-white"
                onClick={() => setShowDeleteConfirm(true)}
                disabled={saving}
              >
                Rimuovi pratica
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => handleRequestClose(false)}
              disabled={saving || calculating}
            >
              {readOnly ? "Chiudi" : "Annulla"}
            </Button>
            {!readOnly && (
              <>
                <Button className="btn-save-primary" onClick={handleSave} disabled={saving || calculating}>
                  {saving ? "Salvataggio..." : "Salva"}
                </Button>
              </>
            )}
          </div>
        </DialogFooter>
        </PopoverContainerContext.Provider>
      </DialogContent>
      {showDeleteConfirm && (
        <Dialog open onOpenChange={(open) => !open && setShowDeleteConfirm(false)}>
          <DialogContent className="max-w-md bg-white event-modal-light">
            <DialogHeader>
              <DialogTitle className="text-[var(--navy)]">Conferma eliminazione</DialogTitle>
            </DialogHeader>
            <p className="text-zinc-700">
              {subEvents.length > 0
                ? "Sei sicuro di voler eliminare questo evento? Verranno eliminati anche tutti i sottoeventi collegati."
                : "Sei sicuro di voler eliminare questo evento?"}
            </p>
            <DialogFooter className="dialog-footer-light">
              <Button variant="outline" onClick={() => setShowDeleteConfirm(false)} disabled={saving}>
                Annulla
              </Button>
              <Button
                className="btn-delete-confirm"
                onClick={handleDeleteConfirm}
                disabled={saving}
              >
                {saving ? "Eliminazione..." : "Elimina"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </Dialog>
  );
}
