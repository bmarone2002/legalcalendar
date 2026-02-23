"use client";

import React, { useCallback, useEffect, useState } from "react";
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
import { regenerateSubEvents, getSubEventsPreview } from "@/lib/actions/sub-events";
import type { EventType, SubEvent } from "@/types";
import { EVENT_TYPES, RULE_TEMPLATES } from "@/types";
import type { ActionType, ActionMode } from "@/types/atto-giuridico";
import { ACTION_TYPES, ACTION_MODES, ACTION_TYPE_LABELS, ACTION_MODE_LABELS } from "@/types/atto-giuridico";
import { AttoGiuridicoPanel } from "./AttoGiuridicoPanel";
import { DateTimePicker } from "./DateTimePicker";
import { PopoverContainerContext } from "./popover-container-context";
import { formatDateTime } from "@/lib/utils";

type ModalMode = "create" | "edit";

interface EventModalProps {
  mode: ModalMode;
  eventId?: string;
  initialStart?: Date;
  initialEnd?: Date;
  onClose: () => void;
}

/** Palette colori per tag evento (evento + sottoeventi). Testo bianco leggibile. */
const EVENT_TAG_COLORS = [
  "#5D4037", "#4E342E", "#3E2723", "#6D4C41", "#8D6E63",
  "#2E7D32", "#1565C0", "#6A1B9A", "#C62828", "#E65100",
  "#00695C", "#283593",
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
};

const defaultEvent = (start?: Date, end?: Date): EventFormState => ({
  title: "",
  description: "",
  startAt: start ?? new Date(),
  endAt: end ?? new Date(new Date().setHours(new Date().getHours() + 1)),
  type: "altro",
  tags: [],
  notes: "",
  generateSubEvents: false,
  ruleTemplateId: RULE_TEMPLATES[0].id,
  macroType: null,
  actionType: ACTION_TYPES[0],
  actionMode: ACTION_MODES[0],
  inputs: {},
  color: null,
});

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
    "dataUdienzaComparizione",
    "dataNotificaCitazione",
    "dataNotificaDecretoIngiuntivo",
    "dataUdienzaOpposizione",
    "dataNotificaAttoOpposizione",
    "dataNotificaAttoImpugnato",
    "dataProposizioneRicorso",
    "dataNotificaRicorso",
    "dataNotificaSentenza",
    "dataPubblicazioneSentenza",
    "dataNotificaAttoAppello",
    "dataNotificaSentenzaTributaria",
    "dataPubblicazioneSentenzaTributaria",
    "dataNotificaAppelloTributario",
    "dataUltimaNotificaRicorsoCassazione",
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
  onClose,
}: EventModalProps) {
  // Data evento: solo i valori attuali del form contano. initialStart/initialEnd servono solo come default iniziale se apri da click sul calendario; se modifichi data/ora in creazione, resta ciò che hai impostato.
  const [form, setForm] = useState<EventFormState>(() => defaultEvent(initialStart, initialEnd));
  const [subEvents, setSubEvents] = useState<SubEvent[]>([]);
  const [previewSubEvents, setPreviewSubEvents] = useState<Array<{ title: string; dueAt: Date; explanation: string }>>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [activeTab, setActiveTab] = useState<"dettagli" | "regole">("dettagli");
  const [calculating, setCalculating] = useState(false);
  const [popoverContainer, setPopoverContainer] = useState<HTMLElement | null>(null);

  const loadEvent = useCallback(async (id: string) => {
    setLoading(true);
    const result = await getEventById(id);
    setLoading(false);
    if (result.success && result.data) {
      const e = result.data;
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
      });
      setSubEvents(e.subEvents ?? []);
    }
  }, []);

  useEffect(() => {
    if (mode === "edit" && eventId) loadEvent(eventId);
  }, [mode, eventId, loadEvent]);

  useEffect(() => {
    if (!form.generateSubEvents || !form.ruleTemplateId) {
      setPreviewSubEvents([]);
      return;
    }
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
        ...(form.ruleTemplateId === "atto-giuridico" && {
          macroType: "ATTO_GIURIDICO",
          actionType: form.actionType,
          actionMode: form.actionMode,
          inputs: serializeInputsForServer(form.inputs),
        }),
      };
      const result = await getSubEventsPreview(payload);
      if (result.success && result.data) {
        setPreviewSubEvents(
          result.data.map((c) => ({
            title: c.title,
            dueAt: new Date(c.dueAt),
            explanation: c.explanation,
          }))
        );
      } else {
        setPreviewSubEvents([]);
      }
    })();
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
        ...(form.ruleTemplateId === "atto-giuridico" && {
          macroType: "ATTO_GIURIDICO",
          actionType: form.actionType,
          actionMode: form.actionMode,
          inputs: serializeInputsForServer(form.inputs),
        }),
      };
      const result = await getSubEventsPreview(payload);
      if (result.success && result.data) {
        setPreviewSubEvents(
          result.data.map((c) => ({
            title: c.title,
            dueAt: new Date(c.dueAt),
            explanation: c.explanation,
          }))
        );
        setError(null);
      } else {
        setPreviewSubEvents([]);
        setError(!result.success ? normalizeDisplayError(result.error) : "Impossibile calcolare i sottoeventi");
      }
      setActiveTab("regole");
    } finally {
      setCalculating(false);
    }
  }, [form]);

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
          color: form.color ?? undefined,
        });
        if (!result.success) {
          setError(result.error);
          return;
        }
        if (result.data && form.generateSubEvents) {
          const regen = await regenerateSubEvents(result.data.id);
          if (!regen.success) {
            setError(regen.error ?? "Errore creazione sottoeventi. Riprova o rigenera dalla tab Regole.");
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
          color: form.color ?? undefined,
        });
        if (!result.success) {
          setError(normalizeDisplayError(result.error));
          return;
        }
        if (form.generateSubEvents) {
          const regen = await regenerateSubEvents(eventId);
          if (!regen.success) {
            setError(normalizeDisplayError(regen.error) ?? "Errore rigenerazione sottoeventi.");
            return;
          }
          const subResult = await getEventById(eventId);
          if (subResult.success && subResult.data?.subEvents) {
            setSubEvents(subResult.data.subEvents);
          }
        }
      }
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
        color: form.color ?? undefined,
      });
      if (!up.success) {
        setError(normalizeDisplayError(up.error));
        return;
      }
      const result = await regenerateSubEvents(eventId);
      if (result.success && result.data) {
        setSubEvents(result.data);
      } else if (!result.success) {
        setError(normalizeDisplayError(result.error) ?? "Errore rigenerazione");
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
      const result = await deleteEvent(eventId);
      if (result.success) {
        setShowDeleteConfirm(false);
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
    <Dialog open onOpenChange={() => onClose()}>
      <DialogContent
        ref={setPopoverContainer}
        className="max-w-2xl max-h-[90vh] flex flex-col bg-white event-modal-light"
      >
        <PopoverContainerContext.Provider value={popoverContainer}>
        <DialogHeader>
          <DialogTitle className="text-[var(--calendar-brown)]">{mode === "create" ? "Nuovo evento" : "Dettaglio evento"}</DialogTitle>
        </DialogHeader>
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "dettagli" | "regole")} className="flex-1 min-h-0 flex flex-col">
          <TabsList className="bg-zinc-100 dark:bg-zinc-100 dark:text-zinc-600 p-1">
            <TabsTrigger value="dettagli" className="data-[state=active]:bg-white data-[state=active]:text-zinc-900 dark:data-[state=active]:bg-white dark:data-[state=active]:text-zinc-900 data-[state=active]:shadow-sm">Dettagli</TabsTrigger>
            <TabsTrigger value="regole" className="data-[state=active]:bg-white data-[state=active]:text-zinc-900 dark:data-[state=active]:bg-white dark:data-[state=active]:text-zinc-900 data-[state=active]:shadow-sm">Regole & Sottoeventi</TabsTrigger>
          </TabsList>
          <TabsContent value="dettagli" className="flex-1 overflow-auto mt-2">
            <div className="space-y-4">
              {/* 1. Titolo */}
              <div>
                <Label>Titolo</Label>
                <Input
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  placeholder="Titolo evento"
                />
              </div>

              {/* Data e ora inizio/fine: solo per Evento generico. Per Atto Giuridico (e altre categorie in MACRO_TYPES_WITH_CALCULATION_DATE_ONLY) la data è quella del blocco "Dati per il calcolo" sotto. */}
              {!usesCalculationDateOnly(form.macroType) && (
                <>
                  <div>
                    <Label>Data e ora inizio</Label>
                    {mode === "create" && (
                      <p className="text-xs text-zinc-500 mb-1">Se hai cliccato su un giorno, qui vedi una data suggerita; modificala come vuoi: l’evento userà le date che imposti qui.</p>
                    )}
                    <DateTimePicker
                      value={form.startAt}
                      onChange={(d) => setForm((f) => ({ ...f, startAt: d }))}
                      placeholder="Data e ora inizio"
                    />
                  </div>
                  <div>
                    <Label>Data e ora fine</Label>
                    <DateTimePicker
                      value={form.endAt}
                      onChange={(d) => setForm((f) => ({ ...f, endAt: d }))}
                      placeholder="Data e ora fine"
                    />
                  </div>
                </>
              )}

              {/* Colore tag: applicato a evento e sottoeventi in calendario */}
              <div>
                <Label>Colore tag</Label>
                <div className="flex flex-wrap gap-2 mt-1.5">
                  <button
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, color: null }))}
                    className={`h-8 w-8 rounded-full border-2 shrink-0 transition-all ${
                      form.color === null
                        ? "border-[var(--calendar-brown)] ring-2 ring-[var(--calendar-brown)] ring-offset-2"
                        : "border-zinc-300 hover:border-zinc-400 bg-zinc-100"
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
                          ? "border-zinc-900 ring-2 ring-[var(--calendar-brown)] ring-offset-2"
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
                      ruleTemplateId: isAtto ? "atto-giuridico" : RULE_TEMPLATES[0].id,
                      generateSubEvents: isAtto,
                      ...(isAtto ? {} : { actionType: ACTION_TYPES[0], actionMode: ACTION_MODES[0], inputs: {} }),
                    }));
                  }}
                >
                  <SelectTrigger className="bg-white border-zinc-200 text-zinc-900">
                    <SelectValue placeholder="Seleziona tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="generico">Evento generico</SelectItem>
                    <SelectItem value="ATTO_GIURIDICO">Atto Giuridico</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* 3a. Se Atto Giuridico: secondo menu (Sotto-categoria) e terzo menu (Modalità) */}
              {form.macroType === "ATTO_GIURIDICO" && (
                <>
                  <div>
                    <Label>Sotto-categoria</Label>
                    <Select
                      value={form.actionType}
                      onValueChange={(v) => setForm((f) => ({ ...f, actionType: v as ActionType }))}
                    >
                      <SelectTrigger>
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
                      <SelectTrigger className="bg-white dark:bg-white border-zinc-200 dark:border-zinc-200 text-zinc-900 dark:text-zinc-900">
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

              {/* 3b. Se Evento generico: tipo evento + opzione sottoeventi */}
              {form.macroType !== "ATTO_GIURIDICO" && (
                <>
                  <div>
                    <Label>Tipo evento</Label>
                    <Select
                      value={form.type}
                      onValueChange={(v) => setForm((f) => ({ ...f, type: v as EventType }))}
                    >
<SelectTrigger className="bg-white dark:bg-white border-zinc-200 dark:border-zinc-200 text-zinc-900 dark:text-zinc-900">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {EVENT_TYPES.map((t) => (
                          <SelectItem key={t} value={t}>
                            {t}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="gen-sub"
                      checked={form.generateSubEvents}
                      onCheckedChange={(c) =>
                        setForm((f) => ({ ...f, generateSubEvents: c === true }))
                      }
                    />
                    <Label htmlFor="gen-sub">Genera sottoeventi automaticamente</Label>
                  </div>
                  {form.generateSubEvents && (
                    <div>
                      <Label>Template regole</Label>
                      <Select
                        value={form.ruleTemplateId}
                        onValueChange={(v) => setForm((f) => ({ ...f, ruleTemplateId: v }))}
                      >
                        <SelectTrigger className="bg-white border-zinc-200 text-zinc-900 dark:bg-white dark:border-zinc-200 dark:text-zinc-900">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {RULE_TEMPLATES.filter((t) => t.id !== "atto-giuridico").map((t) => (
                            <SelectItem key={t.id} value={t.id}>
                              {t.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </>
              )}

              <div>
                <Label>Note / Descrizione</Label>
                <textarea
                  className="flex min-h-[80px] w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 ring-offset-white placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--calendar-brown)] focus-visible:ring-offset-2"
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  placeholder="Note o descrizione"
                />
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
                        {(mode === "edit" && subEvents.length > 0 ? subEvents : previewSubEvents.map((p, i) => ({ id: `preview-${i}`, title: p.title, dueAt: p.dueAt, explanation: p.explanation }))).map((s, idx) => (
                          <li key={"id" in s ? s.id : `preview-${idx}`} className="border-b pb-2">
                            <div className="font-medium">{s.title}</div>
                            <div className="text-sm text-zinc-500">
                              {formatDateTime(s.dueAt)}
                            </div>
                            <div className="text-xs text-zinc-500 mt-1">
                              Calcolo: {(s as { explanation?: string | null }).explanation ?? ""}
                            </div>
                          </li>
                        ))}
                      </ul>
                    </ScrollArea>
                  )}
                  {mode === "edit" && eventId && (
                    <Button variant="outline" className="border-[var(--calendar-brown)] text-[var(--calendar-brown)] hover:bg-[var(--calendar-brown-pale)]" onClick={handleRigenera} disabled={saving}>
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
        </Tabs>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <DialogFooter className="dialog-footer-light flex-row justify-between">
          <div className="flex gap-2">
            {mode === "edit" && eventId && (
              <Button
                type="button"
                variant="outline"
                className="border-red-200 text-red-700 hover:bg-red-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950"
                onClick={() => setShowDeleteConfirm(true)}
                disabled={saving}
              >
                Rimuovi evento
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose} disabled={saving || calculating}>
              Annulla
            </Button>
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
