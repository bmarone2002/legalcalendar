"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { X } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { createEvent, updateEvent, getEventById, deleteEvent } from "@/lib/actions/events";
import { parseDocumentForEvent } from "@/lib/actions/parse-document";
import {
  regenerateSubEvents,
  getSubEventsPreview,
  updateSubEvent,
  createSubEventsFromPreview,
  deleteSubEvent,
} from "@/lib/actions/sub-events";
import type { EventType, SubEvent } from "@/types";
import { RULE_TEMPLATES } from "@/types";
import type { ActionType, ActionMode } from "@/types/atto-giuridico";
import { ACTION_TYPES, ACTION_MODES, ACTION_TYPE_LABELS, ACTION_MODE_LABELS } from "@/types/atto-giuridico";
import { AttoGiuridicoPanel } from "./AttoGiuridicoPanel";
import { MacroAreaPanel } from "./MacroAreaPanel";
import { ProsecuzionePanel } from "./ProsecuzionePanel";
import type { MacroAreaCode, ProcedimentoCode, ParteProcessuale } from "@/types/macro-areas";
import { LEGACY_ACTION_TYPE_MAP, LEGACY_ACTION_MODE_MAP } from "@/types/macro-areas";
import { DateTimePicker } from "./DateTimePicker";
import { PopoverContainerContext } from "./popover-container-context";
import { formatDateTime } from "@/lib/utils";

type ModalMode = "create" | "edit";

type ActiveTab = "dettagli" | "prosecuzione";

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

/** Palette colori per tag evento (evento + sottoeventi). Testo bianco leggibile. */
const EVENT_TAG_COLORS = [
  "#5D4037", "#8D6E63",
  "#2E7D32", "#1565C0", "#6A1B9A", "#C62828", "#E65100",
  "#00695C", "#283593", "#0097A7", "#F9A825", "#AD1457",
];

type EventFormState = {
  title: string;
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
  actionType: ActionType;
  actionMode: ActionMode;
  inputs: Record<string, unknown>;
  color: string | null;
  reminderOffsets: number[];
  status: "pending" | "done";
};

const defaultEvent = (start?: Date, end?: Date): EventFormState => {
  const now = new Date();
  const defaultStart = new Date(now);
  defaultStart.setHours(8, 0, 0, 0);
  const defaultEnd = new Date(defaultStart);
  defaultEnd.setHours(9, 0, 0, 0);
  return {
    title: "",
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
    actionType: ACTION_TYPES[0],
    actionMode: ACTION_MODES[0],
    inputs: {},
    color: null,
    // Nessun promemoria di default: l'utente li aggiunge esplicitamente.
    reminderOffsets: [],
    status: "pending",
  };
};

/** Categorie per cui non si mostrano Data/Ora inizio-fine: la data evento è solo quella del pannello "Dati per il calcolo". Estendere qui per future categorie. */
const MACRO_TYPES_WITH_CALCULATION_DATE_ONLY: (string | null)[] = ["ATTO_GIURIDICO"];
function usesCalculationDateOnly(macroType: "ATTO_GIURIDICO" | null): boolean {
  return macroType != null && MACRO_TYPES_WITH_CALCULATION_DATE_ONLY.includes(macroType);
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
  onRigeneraSubEvents: () => void;
  onDeleteSelectedSubEvent: () => void;
  saving: boolean;
  readOnly: boolean;
  /** Se true, il pannello è mostrato nel bottom sheet mobile (niente hidden lg). */
  embedInSheet?: boolean;
}

function EventSummaryPanel({
  mode,
  form,
  subEvents,
  previewSubEvents,
  selectedSubEventId,
  setSelectedSubEventId,
  highlightSubEventId,
  highlightRowRef,
  handleRemovePreviewSubEvent,
  onRigeneraSubEvents,
  onDeleteSelectedSubEvent,
  saving,
  readOnly,
  embedInSheet = false,
}: EventSummaryPanelProps) {
  const eventsToShow =
    mode === "edit" && subEvents.length > 0 ? subEvents : previewSubEvents;

  const mainDate =
    usesCalculationDateOnly(form.macroType) && getPrimaryDateFromInputs(form.inputs)
      ? getPrimaryDateFromInputs(form.inputs)
      : form.startAt;

  return (
    <div
      className={
        embedInSheet
          ? "flex flex-col w-full min-h-0 flex-1"
          : "hidden lg:flex lg:flex-col lg:w-80 lg:border-l lg:border-zinc-200 lg:pl-4 lg:ml-4 lg:pt-1"
      }
    >
      <div className={`rounded-lg bg-[var(--navy)] text-white flex flex-col ${embedInSheet ? "min-h-0 flex-1" : "h-full"}`}>
        <div className="px-4 pt-3 pb-2 border-b border-white/10">
          <p className="text-xs font-semibold tracking-wide uppercase text-white/70">
            Eventi &amp; Scadenze
          </p>
          <p className="mt-1 text-sm font-medium line-clamp-2">
            {form.title?.trim() || "Pratica senza titolo"}
          </p>
          <div className="mt-1 text-xs text-white/70">
            {mainDate ? formatDateTime(mainDate) : "Data da definire"}
          </div>
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
                  const isSavedSub = mode === "edit" && subEvents.length > 0;
                  const currentId = (s as { id?: string }).id ?? `sub-${idx}`;
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
                        if (isSavedSub) {
                          setSelectedSubEventId(isSelected ? null : currentId);
                        }
                      }}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold truncate">{s.title}</p>
                          <p className="mt-0.5 text-[11px] text-white/75">
                            {isPlaceholder ? (
                              <span className="italic text-amber-200">
                                Da schedulare
                              </span>
                            ) : (
                              formatDateTime(s.dueAt as Date)
                            )}
                          </p>
                          {(s as { explanation?: string | null }).explanation && (
                            <p className="mt-0.5 text-[11px] text-white/65 line-clamp-2">
                              {(s as { explanation?: string | null }).explanation}
                            </p>
                          )}
                        </div>
                        {!isSavedSub && (
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
                Nessun evento calcolato. Compila i dettagli e, se previsto, usa
                il pulsante <span className="font-semibold">Calcola</span> per
                generare scadenze e promemoria.
              </p>
            </div>
          )}
        </div>

        {!readOnly && (
          <div className="px-4 pb-3 pt-2 border-t border-white/10 flex flex-col gap-2">
            {mode === "edit" && subEvents.length > 0 && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-8 border-white/40 text-white hover:bg-white/10"
                onClick={onRigeneraSubEvents}
                disabled={saving}
              >
                Rigenera sottoeventi
              </Button>
            )}
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8 border-red-300 text-red-100 hover:bg-red-500/20"
              onClick={onDeleteSelectedSubEvent}
              disabled={saving || !selectedSubEventId}
            >
              Rimuovi evento
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [activeTab, setActiveTab] = useState<ActiveTab>("dettagli");
  const [calculating, setCalculating] = useState(false);
  const [parsingDocument, setParsingDocument] = useState(false);
  const [popoverContainer, setPopoverContainer] = useState<HTMLElement | null>(null);
  const [selectedSubEventId, setSelectedSubEventId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const highlightRowRef = useRef<HTMLLIElement | null>(null);
  const [showEventsPanel, setShowEventsPanel] = useState(false);
  /** Se true, l'utente ha cliccato "Calcola" almeno una volta: al Salva usiamo la lista preview (anche se vuota). Altrimenti usiamo regenerateSubEvents per creare tutti i sottoeventi. */
  const userHasClickedCalcolaRef = useRef(false);

  const loadEvent = useCallback(async (id: string) => {
    setLoading(true);
    const result = await getEventById(id, targetUserId);
    setLoading(false);
    if (result.success && result.data) {
      const e = result.data;
      const savedRuleParams = (e.ruleParams as Record<string, unknown> | null | undefined) ?? {};
      const savedOffsets = Array.isArray(savedRuleParams.reminderOffsets)
        ? (savedRuleParams.reminderOffsets as number[])
        : [];
      setForm({
        title: e.title,
        description: e.description ?? "",
        startAt: new Date(e.startAt),
        endAt: new Date(e.endAt),
        type: e.type,
        tags: e.tags ?? [],
        notes: e.notes ?? "",
        generateSubEvents: e.generateSubEvents,
        ruleTemplateId: e.ruleTemplateId ?? RULE_TEMPLATES[0].id,
        macroType: e.macroType ?? null,
        macroArea: (e.macroArea as MacroAreaCode) ?? null,
        procedimento: (e.procedimento as ProcedimentoCode) ?? null,
        parteProcessuale: (e.parteProcessuale as ParteProcessuale) ?? null,
        eventoCode: (e as { eventoCode?: string | null }).eventoCode ?? null,
        actionType: (e.actionType as ActionType) ?? ACTION_TYPES[0],
        actionMode: (e.actionMode as ActionMode) ?? ACTION_MODES[0],
        inputs: (e.inputs as Record<string, unknown>) ?? {},
        color: e.color ?? null,
        reminderOffsets: savedOffsets,
        status: (e.status === "done" ? "done" : "pending") as "pending" | "done",
      });
      setSubEvents(e.subEvents ?? []);
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
                inputs: { ...serializeInputsForServer(form.inputs), macroArea: form.macroArea, procedimento: form.procedimento, parteProcessuale: form.parteProcessuale, reminderOffsets: form.reminderOffsets },
              }
            : form.ruleTemplateId === "atto-giuridico"
            ? {
                macroType: "ATTO_GIURIDICO",
                actionType: form.actionType,
                actionMode: form.actionMode,
                inputs: { ...serializeInputsForServer(form.inputs), reminderOffsets: form.reminderOffsets },
              }
            : {
                inputs: { reminderOffsets: form.reminderOffsets },
              }),
        };
        const result = await getSubEventsPreview(payload);
        if (cancelled) return;
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
    }, 500);
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
    form.actionType,
    form.actionMode,
    form.inputs,
    form.reminderOffsets,
  ]);

  const handleCalcola = useCallback(async () => {
    setError(null);

      if (form.macroType === "ATTO_GIURIDICO" && form.ruleTemplateId === "data-driven") {
      const isNotificaCitazione =
        form.procedimento === "CITAZIONE_CIVILE" && form.eventoCode === "NOTIFICA_CITAZIONE";
      const isCostituzioneConvenutoConDueDate =
        form.procedimento === "CITAZIONE_CIVILE" &&
        form.parteProcessuale === "CONVENUTO" &&
        form.eventoCode === "COSTITUZIONE_CONVENUTO";
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
      const hasDataUdienzaComparizione =
        typeof form.inputs?.dataUdienzaComparizione === "string" &&
        String(form.inputs.dataUdienzaComparizione).trim().length > 0;
      const soloDataPrimaUdienza = new Set([
        "ISCRIZIONE_RUOLO",
        "SLITTAMENTO_UDIENZA",
        "MEMORIA_171TER_1",
        "MEMORIA_171TER_2",
        "MEMORIA_171TER_3",
      ]).has(form.eventoCode ?? "");
      const hasBaseDate = isNotificaCitazione
        ? typeof form.inputs?.dataPrimaNotificaCitazione === "string" &&
          String(form.inputs.dataPrimaNotificaCitazione).trim().length > 0 &&
          hasDataPrimaUdienza
        : isCostituzioneConvenutoConDueDate
          ? hasDataUdienzaComparizione && hasDataPrimaUdienza
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
            ? "Inserisci entrambe le date: Notifica atto di citazione e Data prima udienza, poi clicca Calcola."
            : isCostituzioneConvenutoConDueDate
              ? "Inserisci entrambe le date: Data udienza di comparizione e Data prima udienza, poi clicca Calcola."
              : richiedeDataPrimaUdienza
                ? soloDataPrimaUdienza
                  ? "Inserisci la Data prima udienza, poi clicca Calcola."
                  : "Inserisci la data dell'evento e la Data prima udienza, poi clicca Calcola."
                : "Seleziona macro area, procedimento, parte, evento e inserisci la data base (es. data udienza) prima di calcolare. Calcola genera tutte le fasi future dalla fase scelta."
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
              inputs: { ...serializeInputsForServer(form.inputs), macroArea: form.macroArea, procedimento: form.procedimento, parteProcessuale: form.parteProcessuale, reminderOffsets: form.reminderOffsets },
            }
          : form.ruleTemplateId === "atto-giuridico"
          ? {
              macroType: "ATTO_GIURIDICO",
              actionType: form.actionType,
              actionMode: form.actionMode,
              inputs: { ...serializeInputsForServer(form.inputs), reminderOffsets: form.reminderOffsets },
            }
          : {
              inputs: { reminderOffsets: form.reminderOffsets },
            }),
      };
      const result = await getSubEventsPreview(payload);
      if (result.success && result.data && result.data.length > 0) {
        userHasClickedCalcolaRef.current = true;
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
        if (
          result.success &&
          (!result.data || result.data.length === 0) &&
          (form.ruleTemplateId === "atto-giuridico" || form.ruleTemplateId === "data-driven") &&
          form.macroType === "ATTO_GIURIDICO"
        ) {
          setError(
            form.procedimento === "CITAZIONE_CIVILE" && form.eventoCode === "NOTIFICA_CITAZIONE"
              ? "Inserisci entrambe le date (Notifica citazione e Data prima udienza) e clicca Calcola."
              : "Inserire la data base per la fase selezionata (es. data prima udienza) per calcolare le fasi successive dalla tabella."
          );
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
  }, [form]);

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

      if (mode === "create") {
        const result = await createEvent({
          title: form.title,
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
          actionType: form.macroType ? form.actionType : undefined,
          actionMode: form.macroType ? form.actionMode : undefined,
          inputs: form.macroType ? serializeInputsForServer(form.inputs) : undefined,
          ruleParams: { reminderOffsets: form.reminderOffsets },
          color: form.color,
          status: form.status,
        }, targetUserId);
        if (!result.success) {
          setError(result.error);
          return;
        }
        savedNewEventId = result.data?.id;
        if (result.data && form.generateSubEvents) {
          const usePreviewList = userHasClickedCalcolaRef.current;
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
        const result = await updateEvent(eventId, {
          title: form.title,
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
          actionType: form.macroType ? form.actionType : undefined,
          actionMode: form.macroType ? form.actionMode : undefined,
          inputs: form.macroType ? serializeInputsForServer(form.inputs) : undefined,
          ruleParams: { reminderOffsets: form.reminderOffsets },
          color: form.color,
          status: form.status,
        }, targetUserId);
        if (!result.success) {
          setError(normalizeDisplayError(result.error));
          return;
        }
        if (form.generateSubEvents) {
          const usePreviewList = userHasClickedCalcolaRef.current;
          if (usePreviewList) {
            const regen = await createSubEventsFromPreview(
              eventId,
              previewSubEvents.map((p) => p.id),
              targetUserId
            );
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
      }
      // Dopo il salvataggio, una eventuale bozza collegata può essere rimossa
      onDraftCleared?.(draftId ?? null);
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

  const handleRigenera = async () => {
    if (mode !== "edit" || !eventId) return;
    setSaving(true);
    setError(null);
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
      const up = await updateEvent(eventId, {
        title: form.title,
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
        actionType: form.macroType ? form.actionType : undefined,
        actionMode: form.macroType ? form.actionMode : undefined,
        inputs: form.macroType ? serializeInputsForServer(form.inputs) : undefined,
        ruleParams: { reminderOffsets: form.reminderOffsets },
        color: form.color,
        status: form.status,
      }, targetUserId);
      if (!up.success) {
        setError(normalizeDisplayError(up.error));
        return;
      }
      const result = await regenerateSubEvents(eventId, targetUserId);
      if (result.success && result.data) {
        setSubEvents(result.data);
        setSelectedSubEventId(null);
      } else if (!result.success) {
        setError(normalizeDisplayError(result.error) ?? "Errore rigenerazione");
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
      <Dialog open onOpenChange={() => onClose()}>
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
          if (mode === "create" && onDraft) {
            onDraft(draftId ?? null, form);
          }
          onClose();
        }
      }}
    >
      <DialogContent
        ref={setPopoverContainer}
        className="max-w-4xl max-h-[min(90vh,90dvh)] flex flex-col bg-white event-modal-light overflow-hidden p-4 sm:p-6"
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
            onClick={() => {
              if (!readOnly && mode === "create" && onDraft) {
                onDraft(draftId ?? null, form);
              }
              onClose();
            }}
          >
            <X className="h-4 w-4" aria-hidden />
            Chiudi
          </Button>
        </DialogHeader>
        <Tabs
          value={activeTab}
          onValueChange={(v) => setActiveTab(v as ActiveTab)}
          className="flex-1 min-h-0 flex flex-col lg:flex-row lg:gap-4"
        >
          <div className="flex-1 min-w-0 flex flex-col">
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
            <TabsContent value="dettagli" className="flex-1 min-h-0 overflow-auto mt-2 data-[state=inactive]:hidden">
            <div className="space-y-4 pb-2">
              {/* 1. Titolo */}
              <div>
                <Label>PRATICA</Label>
                <Input
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  placeholder="DETTAGLI PRATICA"
                  disabled={readOnly}
                />
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
                        ? { macroArea: null, procedimento: null, parteProcessuale: null, eventoCode: null, inputs: {} }
                        : { macroArea: null, procedimento: null, parteProcessuale: null, eventoCode: null, actionType: ACTION_TYPES[0], actionMode: ACTION_MODES[0], inputs: {} }),
                    }));
                  }}
                >
                  <SelectTrigger className="bg-white border-zinc-200 text-zinc-900 focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none">
                    <SelectValue placeholder="Seleziona tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="generico">Pratiche in Corso</SelectItem>
                    <SelectItem value="ATTO_GIURIDICO">NUOVO ATTO GIURIDICO</SelectItem>
                  </SelectContent>
                </Select>
              </div>

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
                    <div className="rounded-md border border-dashed border-zinc-300 bg-zinc-50/80 p-4 space-y-2">
                      <Label className="text-sm font-medium text-zinc-700">Compila da documento</Label>
                      <p className="text-xs text-zinc-500">
                        Allega il PDF o l&apos;immagine della pratica: l&apos;AI estrarrà titolo, tipo, date e campi per precompilare il form. Verifica i dati e salva.
                      </p>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".pdf,application/pdf,image/jpeg,image/png,image/webp"
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
                              const legacyMapping = !aiMacroArea && d.actionType ? LEGACY_ACTION_TYPE_MAP[d.actionType] : null;
                              const legacyParte = !aiParte && d.actionMode ? LEGACY_ACTION_MODE_MAP[d.actionMode] : null;
                              setForm((f) => ({
                                ...f,
                                title: d.title ?? f.title,
                                description: d.description ?? f.description,
                                type: (d.type as EventType) ?? f.type,
                                notes: d.notes ?? f.notes,
                                ...(d.actionType && { actionType: d.actionType as ActionType }),
                                ...(d.actionMode && { actionMode: d.actionMode as ActionMode }),
                                ...(aiMacroArea ? { macroArea: aiMacroArea } : legacyMapping ? { macroArea: legacyMapping.macroArea } : {}),
                                ...(aiProcedimento ? { procedimento: aiProcedimento } : legacyMapping ? { procedimento: legacyMapping.procedimento } : {}),
                                ...(aiParte ? { parteProcessuale: aiParte } : legacyParte ? { parteProcessuale: legacyParte } : {}),
                                ...(aiEventoCode && { eventoCode: aiEventoCode }),
                                ...((aiMacroArea || legacyMapping) && { ruleTemplateId: "data-driven" }),
                                ...(Object.keys(mergedInputs).length > 0 && { inputs: mergedInputs }),
                              }));
                              setError(null);
                            } else if (!result.success) {
                              setError(result.error ?? "Impossibile analizzare il documento.");
                            }
                          } catch {
                            setError("Errore durante l'analisi del documento.");
                          } finally {
                            setParsingDocument(false);
                            e.target.value = "";
                          }
                        }}
                      />
                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="border-[var(--navy)] text-[var(--navy)] bg-white hover:bg-[var(--calendar-brown-pale)]"
                          disabled={parsingDocument || saving || calculating}
                          onClick={() => fileInputRef.current?.click()}
                        >
                          {parsingDocument ? "Analisi in corso…" : "Allega file e compila con AI"}
                        </Button>
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
                      setForm((f) => ({
                        ...f,
                        procedimento: p,
                        parteProcessuale: null,
                        eventoCode: null,
                        inputs: {},
                      }))
                    }
                    onParteProcessualeChange={(p) =>
                      setForm((f) => ({ ...f, parteProcessuale: p, eventoCode: null, inputs: {} }))
                    }
                    onEventoChange={(code) =>
                      setForm((f) => ({ ...f, eventoCode: code, inputs: {} }))
                    }
                    onInputsChange={(inputs) => setForm((f) => ({ ...f, inputs }))}
                  />

                  {/* Legacy: pannello vecchio (visibile solo se evento caricato con vecchio actionType senza macroArea) */}
                  {mode === "edit" && !form.macroArea && form.actionType && (
                    <>
                      <div className="pt-2 border-t border-zinc-200">
                        <p className="text-xs text-amber-600 mb-2">Evento creato con la struttura precedente. Seleziona una Macro Area sopra per migrarlo.</p>
                        <Label>Sotto-categoria (legacy)</Label>
                        <Select
                          value={form.actionType}
                          onValueChange={(v) => setForm((f) => ({ ...f, actionType: v as ActionType }))}
                        >
                          <SelectTrigger className="bg-white border-zinc-200 text-zinc-900 focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none">
                            <SelectValue placeholder="Seleziona sotto-categoria" />
                          </SelectTrigger>
                          <SelectContent>
                            {ACTION_TYPES.map((t) => (
                              <SelectItem key={t} value={t}>
                                {ACTION_TYPE_LABELS[t]}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Modalità (legacy)</Label>
                        <Select
                          value={form.actionMode}
                          onValueChange={(v) => setForm((f) => ({ ...f, actionMode: v as ActionMode }))}
                        >
                          <SelectTrigger className="bg-white dark:bg-white border-zinc-200 dark:border-zinc-200 text-zinc-900 dark:text-zinc-900 focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none">
                            <SelectValue placeholder="Seleziona modalità" />
                          </SelectTrigger>
                          <SelectContent>
                            {ACTION_MODES.map((m) => (
                              <SelectItem key={m} value={m}>
                                {ACTION_MODE_LABELS[m]}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="pt-1">
                        <AttoGiuridicoPanel
                          actionType={form.actionType}
                          actionMode={form.actionMode}
                          inputs={form.inputs}
                          onInputsChange={(inputs) => setForm((f) => ({ ...f, inputs }))}
                        />
                      </div>
                    </>
                  )}
                </>
              )}

              {/* 4b. Promemoria (tutte le sezioni: Pratiche in Corso, Atto Giuridico, future). Default: un solo promemoria a 7 giorni; frecce per i giorni, aggiungi/rimuovi a piacimento. */}
              <div>
                <Label>Promemoria</Label>
                <div className="space-y-2 mt-1.5">
                  {form.reminderOffsets.map((days, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          setForm((f) => {
                            const next = [...f.reminderOffsets];
                            next[i] = Math.max(1, next[i] - 1);
                            return { ...f, reminderOffsets: next };
                          })
                        }
                        className="h-8 w-8 rounded border border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-50 text-lg font-bold leading-none flex items-center justify-center"
                        aria-label="Diminuisci giorni"
                      >
                        −
                      </button>
                      <span className="w-10 text-center text-sm font-medium text-zinc-900 select-none">
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
                        className="h-8 w-8 rounded border border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-50 text-lg font-bold leading-none flex items-center justify-center"
                        aria-label="Aumenta giorni"
                      >
                        +
                      </button>
                      <span className="text-sm text-zinc-600">giorni prima</span>
                      <button
                        type="button"
                        onClick={() =>
                          setForm((f) => ({
                            ...f,
                            reminderOffsets: f.reminderOffsets.filter((_, idx) => idx !== i),
                          }))
                        }
                        className="text-red-500 hover:text-red-700 text-lg leading-none px-1"
                        aria-label="Rimuovi promemoria"
                      >
                        ×
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
                    className="mt-1 border-zinc-300 text-zinc-700 hover:bg-zinc-50"
                  >
                    + Aggiungi promemoria
                  </Button>
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
                  onClick={() =>
                    setForm((f) => ({ ...f, status: f.status === "done" ? "pending" : "done" }))
                  }
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-md border text-sm font-medium transition-colors ${
                    form.status === "done"
                      ? "bg-green-100 border-green-400 text-green-800 hover:bg-green-200"
                      : "bg-white border-zinc-300 text-zinc-600 hover:bg-zinc-50"
                  }`}
                  aria-label="Segna come completato"
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
                  {form.status === "done" ? "Completato" : "Segna come completato"}
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
            </TabsContent>
            <TabsContent value="prosecuzione" className="flex-1 min-h-0 overflow-auto mt-2 data-[state=inactive]:hidden">
              {mode === "edit" && eventId ? (
                <ProsecuzionePanel
                  eventId={eventId}
                  targetUserId={targetUserId}
                  readOnly={readOnly}
                  macroArea={form.macroArea}
                  procedimento={form.procedimento}
                  parteProcessuale={form.parteProcessuale}
                  onSubEventsChanged={async () => {
                    if (eventId) {
                      const result = await getEventById(eventId, targetUserId);
                      if (result.success && result.data) {
                        setSubEvents(result.data.subEvents ?? []);
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
            </TabsContent>
          </div>

          {/* Colonna Eventi & Scadenze desktop */}
          <EventSummaryPanel
            mode={mode}
            form={form}
            subEvents={subEvents}
            previewSubEvents={previewSubEvents}
            selectedSubEventId={selectedSubEventId}
            setSelectedSubEventId={setSelectedSubEventId}
            highlightSubEventId={highlightSubEventIdProp ?? selectedSubEventId}
            highlightRowRef={highlightRowRef}
            handleRemovePreviewSubEvent={handleRemovePreviewSubEvent}
            onRigeneraSubEvents={handleRigenera}
            onDeleteSelectedSubEvent={handleDeleteSelectedSubEvent}
            saving={saving}
            readOnly={readOnly}
          />
        </Tabs>

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
              className="bg-white rounded-t-2xl shadow-xl w-full flex flex-col overflow-hidden max-h-[min(75vh,75dvh)]"
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
                <button
                  type="button"
                  className="text-sm text-zinc-500 hover:text-zinc-800 shrink-0 ml-2"
                  onClick={() => setShowEventsPanel(false)}
                >
                  Chiudi
                </button>
              </div>
              <div className="flex-1 min-h-0 flex flex-col p-3 overflow-hidden">
                <EventSummaryPanel
                  mode={mode}
                  form={form}
                  subEvents={subEvents}
                  previewSubEvents={previewSubEvents}
                  selectedSubEventId={selectedSubEventId}
                  setSelectedSubEventId={setSelectedSubEventId}
                  highlightSubEventId={highlightSubEventIdProp ?? selectedSubEventId}
                  highlightRowRef={highlightRowRef}
                  handleRemovePreviewSubEvent={handleRemovePreviewSubEvent}
                  onRigeneraSubEvents={handleRigenera}
                  onDeleteSelectedSubEvent={handleDeleteSelectedSubEvent}
                  saving={saving}
                  readOnly={readOnly}
                  embedInSheet
                />
              </div>
            </div>
          </div>
        )}
</think>

        {error && <p className="text-sm text-red-600 mt-2 shrink-0">{error}</p>}
        <DialogFooter className="dialog-footer-light flex-row justify-between shrink-0 pt-2 border-t border-zinc-200 bg-white">
          <div className="flex gap-2">
            {!readOnly && mode === "edit" && eventId && (
              <Button
                type="button"
                variant="destructive"
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
              onClick={() => {
                if (!readOnly && mode === "create" && onDraft) {
                  onDraft(draftId ?? null, form);
                }
                onClose();
              }}
              disabled={saving || calculating}
            >
              {readOnly ? "Chiudi" : "Annulla"}
            </Button>
            {!readOnly && (
              <>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCalcola}
                  disabled={saving || calculating || !form.ruleTemplateId}
                >
                  {calculating ? "Calcolo..." : "Calcola"}
                </Button>
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
