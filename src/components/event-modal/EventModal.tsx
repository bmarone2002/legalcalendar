"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
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
import { ProsecuzionePanel } from "./ProsecuzionePanel";
import { DateTimePicker } from "./DateTimePicker";
import { PopoverContainerContext } from "./popover-container-context";
import { formatDateTime } from "@/lib/utils";

type ModalMode = "create" | "edit";

interface EventModalProps {
  mode: ModalMode;
  eventId?: string;
  initialStart?: Date;
  initialEnd?: Date;
  draftId?: string | null;
  initialDraft?: Partial<EventFormState>;
  onClose: () => void;
  onChanged?: () => void;
  onDeleted?: (id: string) => void;
  onDraft?: (draftId: string | null, form: EventFormState) => void;
  onDraftCleared?: (draftId: string | null) => void;
  targetUserId?: string;
  readOnly?: boolean;
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
  ruleTemplateId: "atto-giuridico",
  macroType: "ATTO_GIURIDICO",
  actionType: ACTION_TYPES[0],
  actionMode: ACTION_MODES[0],
  inputs: {},
  color: null,
  reminderOffsets: [7, 1],
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
      dueAt: Date;
      explanation: string;
      ruleId: string;
      ruleParams?: Record<string, unknown> | null;
      kind: string;
      priority?: number;
    }>
  >([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [activeTab, setActiveTab] = useState<"dettagli" | "regole" | "prosecuzione">("dettagli");
  const [calculating, setCalculating] = useState(false);
  const [parsingDocument, setParsingDocument] = useState(false);
  const [popoverContainer, setPopoverContainer] = useState<HTMLElement | null>(null);
  const [selectedSubEventId, setSelectedSubEventId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  /** Se true, non sovrascrivere la lista preview con l'useEffect (l'utente ha rimosso elementi con ×). Si resetta solo al click su Calcola. */
  const previewEditedByUserRef = useRef(false);
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
        : [7, 1];
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
        actionType: (e.actionType as ActionType) ?? ACTION_TYPES[0],
        actionMode: (e.actionMode as ActionMode) ?? ACTION_MODES[0],
        inputs: (e.inputs as Record<string, unknown>) ?? {},
        color: e.color ?? null,
        reminderOffsets: savedOffsets,
        status: (e.status === "done" ? "done" : "pending") as "pending" | "done",
      });
      setSubEvents(e.subEvents ?? []);
      setSelectedSubEventId(null);
    }
  }, [targetUserId]);

  useEffect(() => {
    if (mode === "edit" && eventId) loadEvent(eventId);
  }, [mode, eventId, loadEvent]);

  useEffect(() => {
    if (!form.generateSubEvents || !form.ruleTemplateId) {
      setPreviewSubEvents([]);
      previewEditedByUserRef.current = false;
      return;
    }
    if (previewEditedByUserRef.current) return;
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
          ...(form.ruleTemplateId === "atto-giuridico"
            ? {
                macroType: "ATTO_GIURIDICO",
                actionType: form.actionType,
                actionMode: form.actionMode,
                inputs: serializeInputsForServer(form.inputs),
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
              dueAt: new Date(c.dueAt),
              explanation: c.explanation,
              ruleId: c.ruleId,
              ruleParams: c.ruleParams ?? null,
              kind: c.kind,
              priority: c.priority,
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
    form.actionType,
    form.actionMode,
    form.inputs,
    form.reminderOffsets,
  ]);

  const handleCalcola = useCallback(async () => {
    setError(null);
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
        ...(form.ruleTemplateId === "atto-giuridico"
          ? {
              macroType: "ATTO_GIURIDICO",
              actionType: form.actionType,
              actionMode: form.actionMode,
              inputs: serializeInputsForServer(form.inputs),
            }
          : {
              inputs: { reminderOffsets: form.reminderOffsets },
            }),
      };
      const result = await getSubEventsPreview(payload);
      previewEditedByUserRef.current = false;
      if (result.success && result.data && result.data.length > 0) {
        userHasClickedCalcolaRef.current = true;
        setPreviewSubEvents(
          result.data.map((c) => ({
            id: c.id,
            title: c.title,
            dueAt: new Date(c.dueAt),
            explanation: c.explanation,
            ruleId: c.ruleId,
            ruleParams: c.ruleParams ?? null,
            kind: c.kind,
            priority: c.priority,
          }))
        );
        setError(null);
      } else {
        setPreviewSubEvents([]);
        if (
          result.success &&
          (!result.data || result.data.length === 0) &&
          form.ruleTemplateId === "atto-giuridico" &&
          form.macroType === "ATTO_GIURIDICO"
        ) {
          setError("Inserire tutte le date e i campi necessari per effettuare il calcolo.");
        } else {
          setError(
            !result.success
              ? normalizeDisplayError(result.error)
              : "Impossibile calcolare i sottoeventi"
          );
        }
      }
      setActiveTab("regole");
    } finally {
      setCalculating(false);
    }
  }, [form]);

  const handleRemovePreviewSubEvent = (id: string) => {
    previewEditedByUserRef.current = true;
    setPreviewSubEvents((prev) => prev.filter((s) => s.id !== id));
  };

  const handleSave = async () => {
    setError(null);
    setSaving(true);
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
          actionType: form.macroType ? form.actionType : undefined,
          actionMode: form.macroType ? form.actionMode : undefined,
          inputs: form.macroType ? serializeInputsForServer(form.inputs) : undefined,
          ruleParams: !form.macroType ? { reminderOffsets: form.reminderOffsets } : undefined,
          color: form.color,
          status: form.status,
        }, targetUserId);
        if (!result.success) {
          setError(result.error);
          return;
        }
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
          actionType: form.macroType ? form.actionType : undefined,
          actionMode: form.macroType ? form.actionMode : undefined,
          inputs: form.macroType ? serializeInputsForServer(form.inputs) : undefined,
          ruleParams: !form.macroType ? { reminderOffsets: form.reminderOffsets } : undefined,
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
      onChanged?.();
      onClose();
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
        actionType: form.macroType ? form.actionType : undefined,
        actionMode: form.macroType ? form.actionMode : undefined,
        inputs: form.macroType ? serializeInputsForServer(form.inputs) : undefined,
        ruleParams: !form.macroType ? { reminderOffsets: form.reminderOffsets } : undefined,
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
        className="max-w-2xl max-h-[90vh] flex flex-col bg-white event-modal-light"
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <PopoverContainerContext.Provider value={popoverContainer}>
        <DialogHeader>
          <DialogTitle className="text-[var(--calendar-brown)]">
            {readOnly ? "VISUALIZZAZIONE PRATICA" : mode === "create" ? "NUOVA PRATICA" : "DETTAGLIO PRATICA"}
          </DialogTitle>
          {mode === "create" && draftId && (
            <p className="text-xs font-semibold text-red-600 mt-1">BOZZA (non ancora salvato)</p>
          )}
        </DialogHeader>
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "dettagli" | "regole" | "prosecuzione")} className="flex-1 min-h-0 flex flex-col">
          <TabsList className="bg-zinc-100 dark:bg-zinc-100 dark:text-zinc-600 p-1">
            <TabsTrigger value="dettagli" className="data-[state=active]:bg-white data-[state=active]:text-zinc-900 dark:data-[state=active]:bg-white dark:data-[state=active]:text-zinc-900 data-[state=active]:shadow-sm">Dettagli</TabsTrigger>
            <TabsTrigger value="regole" className="data-[state=active]:bg-white data-[state=active]:text-zinc-900 dark:data-[state=active]:bg-white dark:data-[state=active]:text-zinc-900 data-[state=active]:shadow-sm">Regole & Sottoeventi</TabsTrigger>
            {mode === "edit" && eventId && (
              <TabsTrigger value="prosecuzione" className="data-[state=active]:bg-white data-[state=active]:text-zinc-900 dark:data-[state=active]:bg-white dark:data-[state=active]:text-zinc-900 data-[state=active]:shadow-sm">Prosecuzione</TabsTrigger>
            )}
          </TabsList>
          <TabsContent value="dettagli" className="flex-1 overflow-auto mt-2">
            <div className="space-y-4">
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
                      ruleTemplateId: isAtto ? "atto-giuridico" : "reminder",
                      generateSubEvents: true,
                      ...(isAtto
                        ? {}
                        : { actionType: ACTION_TYPES[0], actionMode: ACTION_MODES[0], inputs: {} }),
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

              {/* 4a. Se Atto Giuridico: compila da documento (AI) + Sotto-categoria e Modalità */}
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
                              setForm((f) => ({
                                ...f,
                                title: d.title ?? f.title,
                                description: d.description ?? f.description,
                                type: (d.type as EventType) ?? f.type,
                                notes: d.notes ?? f.notes,
                                ...(d.actionType && { actionType: d.actionType as ActionType }),
                                ...(d.actionMode && { actionMode: d.actionMode as ActionMode }),
                                ...(Object.keys(d.inputs ?? {}).length > 0 && { inputs: d.inputs ?? f.inputs }),
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
                          className="border-[var(--calendar-brown)] text-[var(--calendar-brown)] bg-white hover:bg-[var(--calendar-brown-pale)]"
                          disabled={parsingDocument || saving || calculating}
                          onClick={() => fileInputRef.current?.click()}
                        >
                          {parsingDocument ? "Analisi in corso…" : "Allega file e compila con AI"}
                        </Button>
                      </div>
                    </div>
                  )}
                  <div>
                    <Label>Sotto-categoria</Label>
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
                    <Label>Modalità</Label>
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

              {/* 4b. Se Pratiche in Corso: promemoria builder */}
              {form.macroType !== "ATTO_GIURIDICO" && (
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
                              generateSubEvents: f.reminderOffsets.length > 1,
                              ruleTemplateId: f.reminderOffsets.length > 1 ? "reminder" : f.ruleTemplateId,
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
                          generateSubEvents: true,
                          ruleTemplateId: "reminder",
                        }))
                      }
                      className="mt-1 border-zinc-300 text-zinc-700 hover:bg-zinc-50"
                    >
                      + Aggiungi promemoria
                    </Button>
                  </div>
                </div>
              )}

              {/* 5. Note */}
              <div>
                <Label>Adempimenti / Note</Label>
                <textarea
                  className="flex min-h-[80px] w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 ring-offset-white placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--calendar-brown)] focus-visible:ring-offset-2"
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
                        ? "border-[var(--calendar-brown)]"
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
                          ? "border-[var(--calendar-brown)] shadow-[0_0_0_1px_rgba(93,64,55,0.45)]"
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
          <TabsContent value="regole" className="flex-1 overflow-auto mt-2">
            <div className="space-y-4">
              {form.generateSubEvents ? (
                <>
                  <p className="text-sm text-zinc-600">
                    Sotto-eventi generati (preview). Per ogni voce: data e calcolo/audit.
                  </p>
                  {(previewSubEvents.length > 0 || subEvents.length > 0) && (
                    <ScrollArea className="h-[280px] rounded-md border p-4">
                      <ul className="space-y-3">
                        {(mode === "edit" && subEvents.length > 0 ? subEvents : previewSubEvents).map(
                          (s, idx) => {
                          const isSavedSub = mode === "edit" && subEvents.length > 0;
                          const isDone = isSavedSub && (s as SubEvent).status === "done";
                          const currentId = (s as { id?: string }).id ?? `sub-${idx}`;
                          const isSelected = isSavedSub && selectedSubEventId === currentId;
                          return (
                            <li
                              key={currentId}
                              className={`border-b pb-2 flex items-start gap-2 rounded-md transition-colors ${
                                isSelected
                                  ? "bg-red-100/70 border-red-300"
                                  : "hover:bg-zinc-50"
                              }`}
                              onClick={() => {
                                if (isSavedSub) {
                                  setSelectedSubEventId((prev) =>
                                    prev === currentId ? null : currentId
                                  );
                                }
                              }}
                            >
                              {isSavedSub && (
                                <div className="flex items-center gap-2 shrink-0 pt-0.5">
                                  <Checkbox
                                    id={`sub-done-${(s as SubEvent).id}`}
                                    checked={isDone}
                                    disabled={readOnly}
                                    onCheckedChange={async (checked) => {
                                      const id = (s as SubEvent).id;
                                      const result = await updateSubEvent(id, { status: checked ? "done" : "pending" }, targetUserId);
                                      if (result.success && result.data) {
                                        setSubEvents((prev) => prev.map((se) => (se.id === id ? { ...se, status: result.data!.status } : se)));
                                      }
                                    }}
                                  />
                                  <Label htmlFor={`sub-done-${(s as SubEvent).id}`} className="text-xs text-zinc-600 cursor-pointer">
                                    Completato
                                  </Label>
                                </div>
                              )}
                              <div className="flex-1 min-w-0">
                                <div className="font-medium">{s.title}</div>
                                <div className="text-sm text-zinc-500">
                                  {formatDateTime(s.dueAt)}
                                </div>
                                <div className="text-xs text-zinc-500 mt-1">
                                  Calcolo: {(s as { explanation?: string | null }).explanation ?? ""}
                                </div>
                              </div>
                              {!isSavedSub && (
                                <button
                                  type="button"
                                  className="ml-2 text-xs text-red-600 hover:text-red-800 shrink-0"
                                  onClick={() =>
                                    handleRemovePreviewSubEvent(
                                      (s as { id: string | undefined }).id ?? `sub-${idx}`
                                    )
                                  }
                                  aria-label="Rimuovi sottoevento"
                                >
                                  ×
                                </button>
                              )}
                            </li>
                          );
                        })}
                      </ul>
                    </ScrollArea>
                  )}
                  {mode === "edit" && eventId && (
                    <Button
                      variant="outline"
                      className="border-[var(--calendar-brown)] text-[var(--calendar-brown)] bg-white hover:bg-[var(--calendar-brown-pale)] dark:bg-white dark:border-[var(--calendar-brown)] dark:text-[var(--calendar-brown)] dark:hover:bg-[var(--calendar-brown-pale)]"
                      onClick={handleRigenera}
                      disabled={saving}
                    >
                      Rigenera sottoeventi
                    </Button>
                  )}
                </>
              ) : (
                <p className="text-sm text-zinc-500">
                  Attiva &quot;Genera sottoeventi automaticamente&quot; nella tab Dettagli per vedere preview e sottoeventi.
                </p>
              )}
            </div>
          </TabsContent>
          {mode === "edit" && eventId && (
            <TabsContent value="prosecuzione" className="flex-1 overflow-auto mt-2">
              <ProsecuzionePanel
                eventId={eventId}
                targetUserId={targetUserId}
                readOnly={readOnly}
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
            </TabsContent>
          )}
        </Tabs>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <DialogFooter className="dialog-footer-light flex-row justify-between">
          <div className="flex gap-2">
            {!readOnly && mode === "edit" && eventId && (
              <>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleDeleteSelectedSubEvent}
                  disabled={saving || !selectedSubEventId}
                >
                  Rimuovi evento
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => setShowDeleteConfirm(true)}
                  disabled={saving}
                >
                  Rimuovi tutto
                </Button>
              </>
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
              <DialogTitle className="text-[var(--calendar-brown)]">Conferma eliminazione</DialogTitle>
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
