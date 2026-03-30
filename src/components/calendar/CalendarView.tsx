"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import interactionPlugin from "@fullcalendar/interaction";
import itLocale from "@fullcalendar/core/locales/it";
import type {
  EventClickArg,
  DateSelectArg,
  EventDropArg,
  EventContentArg,
  EventMountArg,
  EventChangeArg,
} from "@fullcalendar/core";
import { getEvents, updateEvent, deleteEvent } from "@/lib/actions/events";
import { regenerateSubEvents, updateSubEvent, deleteSubEvent } from "@/lib/actions/sub-events";
import type { Event as AppEvent, SubEvent } from "@/types";
import { EventModal } from "@/components/event-modal/EventModal";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  EVENT_TAG_COLORS,
  paletteKeyForFilter,
  allCalendarFilterColorKeys,
  COLOR_FILTER_NONE,
  COLOR_FILTER_OTHER,
} from "@/constants/event-tag-colors";
import { getFaseDisplayString, getFaseDisplayFromFields } from "@/lib/event-fase";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Gavel, ListChecks, type LucideIcon } from "lucide-react";

/** Focus del resoconto sotto calendario/agenda (non filtra la vista principale). */
type SmartPanelFocus = "udienze" | "adempimenti";

const SMART_PANEL_TABS: Array<{ id: SmartPanelFocus; shortLabel: string; Icon: LucideIcon }> = [
  { id: "udienze", shortLabel: "Udienze", Icon: Gavel },
  { id: "adempimenti", shortLabel: "Adempimenti", Icon: ListChecks },
];

// Sottoeventi: rosso (pending), verde (done), neutro per promemoria futuri (prima del giorno).
const SUB_EVENT_COLOR_PENDING = "#C62828";
const SUB_EVENT_COLOR_DONE = "#2E7D32";
const SUB_EVENT_COLOR_FUTURE = "#e4e4e7"; // nessun colore fino al giorno del promemoria

/** Pallino colonna grafica (lista FullCalendar `.fc-list-event-dot`): colore tag evento madre, non rosso/verde stato */
const LIST_SUB_DOT_NEUTRAL = "#a1a1aa";

function paintListSubEventDotFromParentTag(el: HTMLElement, parentTagColor: string | null | undefined) {
  const dot = el.querySelector(".fc-list-event-dot") as HTMLElement | null;
  if (!dot) return;
  const trimmed = parentTagColor?.trim();
  if (trimmed) {
    dot.style.borderColor = trimmed;
    dot.style.backgroundColor = trimmed;
  } else {
    dot.style.borderColor = LIST_SUB_DOT_NEUTRAL;
    dot.style.backgroundColor = LIST_SUB_DOT_NEUTRAL;
  }
}

function isListViewType(viewType: string): boolean {
  return (
    viewType === "list" ||
    viewType === "listWeek" ||
    viewType === "listDay" ||
    viewType === "listMonth" ||
    viewType === "listFromToday"
  );
}

function blendWithWhite(hex: string, whiteAmount: number): string {
  const h = hex.replace("#", "").trim();
  if (h.length !== 6) return hex;
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  const t = Math.min(1, Math.max(0, whiteAmount));
  const rr = Math.round(r + (255 - r) * t);
  const gg = Math.round(g + (255 - g) * t);
  const bb = Math.round(b + (255 - b) * t);
  return `#${rr.toString(16).padStart(2, "0")}${gg.toString(16).padStart(2, "0")}${bb.toString(16).padStart(2, "0")}`;
}

const STORAGE_TAG_COLOR_LABELS = "calendar:tagColorLabels";

function loadTagColorLabels(): Record<string, string> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_TAG_COLOR_LABELS);
    if (!raw) return {};
    const o = JSON.parse(raw) as Record<string, unknown>;
    if (!o || typeof o !== "object") return {};
    const out: Record<string, string> = {};
    for (const [k, v] of Object.entries(o)) {
      if (typeof v === "string" && v.trim() !== "") out[k] = v;
    }
    return out;
  } catch {
    return {};
  }
}

function persistTagColorLabels(next: Record<string, string>) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_TAG_COLOR_LABELS, JSON.stringify(next));
}

type SearchSuggestion = {
  eventId: string;
  label: string;
  matchType: "titolo" | "promemoria";
  detail?: string;
};

type DraftEvent = {
  id: string;
  form: any;
};

/** Fase (testo UI): contiene «udienza» o «udienze» (il plurale non include «udienza» come sottostringa). */
/**
 * True se il nome/testo della fase contiene «udienza» o «udienze» come parola, con qualsiasi
 * testo attorno (es. «Udienza Rossi», «Mario udienza», «prima udienza»). Confini di parola
 * per evitare suffissi tipo «udienzario».
 */
function faseContieneParolaUdienza(text: string | null | undefined): boolean {
  if (text == null) return false;
  const s = String(text).trim();
  if (!s) return false;
  return /\b(udienza|udienze)\b/i.test(s);
}

/**
 * «Aggiungi adempimento collegato» dalla modale pratica: i sottoeventi generati hanno
 * `ruleParams.linkedEvent: true` (ruleId `data-driven` o `reminder`, vedi `buildLinkedEventCandidates`).
 * Flusso rinvio udienza: `tipo: "evento-collegato"` in ruleParams.
 */
function isAdempimentoCollegatoLinkedSubEvent(se: SubEvent): boolean {
  if (se.kind !== "attivita") return false;
  const p = (se.ruleParams ?? {}) as Record<string, unknown>;
  if (p.linkedEvent === true || p.linkedEvent === "true") return true;
  const tipo = typeof p.tipo === "string" ? p.tipo : null;
  return tipo === "evento-collegato";
}

function TrashIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 6h18" />
      <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
      <path d="M5 6l1 14a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2l1-14" />
    </svg>
  );
}

function toFullCalendarEvents(e: AppEvent): Array<Record<string, unknown>> {
  // Evento madre: se è stato scelto un colore tag, usiamo quello; altrimenti nessun tag (sfondo neutro)
  const rawColor = (e.color ?? "").trim();
  const normalized = rawColor.toLowerCase();
  const isWhiteLike =
    normalized === "#fff" || normalized === "#ffffff" || normalized === "white";
  const tagColor = rawColor && !isWhiteLike ? rawColor : null;
  const filterColorKey = paletteKeyForFilter(e.color);
  const faseFiltroText = getFaseDisplayString(e);
  const mainBackground = tagColor ?? "#ffffff";
  const mainBorder = tagColor ?? "#E5E5E5";
  const rawTitle = (e.title ?? "").trimStart();
  const titleWithoutNumber = rawTitle.replace(/^\d+\s*[-–.)]?\s*/, "").trimStart();
  const mainTitleCore = titleWithoutNumber.length > 0 ? titleWithoutNumber : rawTitle;
  const mainTitle = mainTitleCore;
  const out: Array<Record<string, unknown>> = [
    {
      id: e.id,
      title: mainTitle,
      start: e.startAt,
      end: e.endAt,
      allDay: false,
      backgroundColor: mainBackground,
      borderColor: mainBorder,
      extendedProps: {
        type: e.type,
        tags: e.tags,
        isSubEvent: false,
        status: e.status ?? "pending",
        filterColorKey,
        parentTagColor: tagColor,
        faseFiltroText,
      },
    },
  ];
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  (e.subEvents ?? []).forEach((se: SubEvent) => {
    if (se.isPlaceholder || !se.dueAt || (se.dueAt instanceof Date && se.dueAt.getTime() === 0)) return;
    const isDone = se.status === "done";
    const isPromemoria = se.kind === "promemoria";
    const dueDate = new Date(se.dueAt);
    dueDate.setHours(0, 0, 0, 0);
    const isFutureReminder = isPromemoria && dueDate > todayStart;

    let subBg: string;
    let subBorder: string;
    if (tagColor) {
      if (isFutureReminder) {
        subBg = blendWithWhite(tagColor, 0.74);
        subBorder = blendWithWhite(tagColor, 0.35);
      } else if (isDone) {
        subBg = tagColor;
        subBorder = SUB_EVENT_COLOR_DONE;
      } else {
        subBg = tagColor;
        subBorder = SUB_EVENT_COLOR_PENDING;
      }
    } else {
      subBg = isFutureReminder
        ? SUB_EVENT_COLOR_FUTURE
        : isDone
          ? SUB_EVENT_COLOR_DONE
          : SUB_EVENT_COLOR_PENDING;
      subBorder = subBg;
    }

    const seParams = (se.ruleParams ?? {}) as Record<string, unknown>;
    const seTipo = typeof seParams.tipo === "string" ? seParams.tipo : null;
    const isRinvioUdienzaSubEvent =
      se.ruleId === "rinvio-udienza" && se.kind === "termine" && seTipo === "udienza";
    const isAdempimentoCollegatoSubEvent = isAdempimentoCollegatoLinkedSubEvent(se);

    out.push({
      id: se.id,
      title: se.title,
      start: se.dueAt,
      end: se.dueAt,
      allDay: false,
      backgroundColor: subBg,
      borderColor: subBorder,
      editable: false,
      extendedProps: {
        isSubEvent: true,
        isRinvioUdienzaSubEvent,
        isAdempimentoCollegatoSubEvent,
        parentEventId: e.id,
        parentTitle: mainTitle,
        parentTagColor: tagColor,
        filterColorKey,
        faseFiltroText,
        kind: se.kind,
        status: se.status,
      },
    });
  });
  return out;
}

function findNextAvailableSlot(targetDate: Date, events: AppEvent[]): { start: Date; end: Date } {
  const dayStart = new Date(targetDate);
  dayStart.setHours(0, 0, 0, 0);
  const dayEnd = new Date(dayStart);
  dayEnd.setHours(23, 59, 59, 999);

  const occupiedHours = new Set<number>();
  for (const e of events) {
    const eStart = new Date(e.startAt);
    if (eStart < dayStart || eStart > dayEnd) continue;
    const h = eStart.getHours();
    if (h >= 8 && h < 22) occupiedHours.add(h);
  }

  let startHour = 8;
  for (let h = 8; h < 22; h++) {
    if (!occupiedHours.has(h)) {
      startHour = h;
      break;
    }
    if (h === 21) startHour = 8;
  }

  const start = new Date(dayStart);
  start.setHours(startHour, 0, 0, 0);
  const end = new Date(start);
  end.setHours(startHour + 1, 0, 0, 0);
  return { start, end };
}

interface CalendarViewProps {
  targetUserId?: string;
  permission?: "VIEW_ONLY" | "FULL";
}

export function CalendarView({ targetUserId, permission }: CalendarViewProps = {}) {
  const canEdit = !targetUserId || permission === "FULL";
  const calendarRef = useRef<InstanceType<typeof FullCalendar> | null>(null);
  const calendarContainerRef = useRef<HTMLDivElement | null>(null);
  const listEventRowElsRef = useRef<Map<string, HTMLElement>>(new Map());
  const skipFilterEffectRef = useRef(true);
  const [initialView, setInitialView] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<string>("dayGridMonth");
  const [viewTitle, setViewTitle] = useState<string>("");
  const [modalState, setModalState] = useState<
    | { mode: "create"; start?: Date; end?: Date; draftId?: string | null; initialDraftForm?: any }
    | { mode: "edit"; eventId: string; highlightSubEventId?: string }
    | null
  >(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchSuggestions, setSearchSuggestions] = useState<SearchSuggestion[]>([]);
  const [allEvents, setAllEvents] = useState<AppEvent[]>([]);
  const [isSearchActive, setIsSearchActive] = useState<boolean>(false);
  const [searchFilterEventId, setSearchFilterEventId] = useState<string | null>(null);
  /** Se false, nasconde eventi/sottoeventi il cui titolo contiene «Promemoria». */
  const [showPromemoriaTitle, setShowPromemoriaTitle] = useState<boolean>(() => {
    if (typeof window === "undefined") return true;
    const v = window.localStorage.getItem("calendar:showPromemoriaTitle");
    if (v === "false") return false;
    return true;
  });
  const [visibleTagColors, setVisibleTagColors] = useState<Set<string>>(() => {
    const all = allCalendarFilterColorKeys();
    if (typeof window === "undefined") return new Set(all);
    try {
      const raw = window.localStorage.getItem("calendar:visibleTagColors");
      if (raw) {
        const arr = JSON.parse(raw) as string[];
        if (Array.isArray(arr) && arr.length > 0) return new Set(arr);
      }
    } catch {
      /* ignore */
    }
    return new Set(all);
  });

  const [panelFocus, setPanelFocus] = useState<SmartPanelFocus>(() => {
    if (typeof window === "undefined") return "udienze";
    const stored = window.localStorage.getItem("calendar:smartPanelFocus");
    if (stored === "udienze" || stored === "adempimenti") return stored;
    const legacyPanel = window.localStorage.getItem("calendar:panelFocus");
    if (legacyPanel === "udienze" || legacyPanel === "adempimenti") return legacyPanel;
    if (window.localStorage.getItem("calendar:soloUdienze") === "true") return "udienze";
    return "udienze";
  });
  const [tagColorLabels, setTagColorLabels] = useState<Record<string, string>>(() => loadTagColorLabels());
  const [draftEvents, setDraftEvents] = useState<DraftEvent[]>([]);
  const [showPending, setShowPending] = useState<boolean>(true);
  const [showDone, setShowDone] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem("calendar:lastView");
    const allowedViews = new Set(["timeGridDay", "timeGridWeek", "dayGridMonth", "listFromToday"]);
    const viewToUse = stored && allowedViews.has(stored) ? stored : "dayGridMonth";
    setInitialView(viewToUse);
    setCurrentView(viewToUse);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const deepLinkEventId = params.get("eventId");
    if (!deepLinkEventId) return;
    setModalState({ mode: "edit", eventId: deepLinkEventId });
  }, []);

  /** Scroll interno vista Agenda: porta in vista la riga del giorno corrente (FullCalendar non espone scrollTo per list view). */
  const scrollAgendaToToday = useCallback(() => {
    const api = calendarRef.current?.getApi();
    if (!api || api.view.type !== "listFromToday") return;
    const root = calendarContainerRef.current;
    if (!root) return;
    const scroller = root.querySelector(".fc-scroller") as HTMLElement | null;
    const todayRow =
      (root.querySelector(".fc-list-day.fc-day-today") as HTMLElement | null) ??
      (root.querySelector("tr.fc-list-day.fc-day-today") as HTMLElement | null);
    if (!scroller || !todayRow) return;
    requestAnimationFrame(() => {
      const sRect = scroller.getBoundingClientRect();
      const tRect = todayRow.getBoundingClientRect();
      const nextTop = scroller.scrollTop + (tRect.top - sRect.top) - 8;
      scroller.scrollTop = Math.max(0, nextTop);
    });
  }, []);

  const handleDatesSet = useCallback(
    (arg: { start: Date; end: Date; view: { type: string; title: string } }) => {
      setCurrentView(arg.view.type);
      setViewTitle(arg.view.title);
      if (typeof window !== "undefined") {
        window.localStorage.setItem("calendar:lastView", arg.view.type);
      }
      if (arg.view.type === "listFromToday") {
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            scrollAgendaToToday();
          });
        });
      }
    },
    [scrollAgendaToToday]
  );

  const handleEventsSet = useCallback(() => {
    scrollAgendaToToday();
  }, [scrollAgendaToToday]);

  const handleEventDidMount = useCallback((info: EventMountArg) => {
    if (!isListViewType(info.view.type)) return;
    const isSub = info.event.extendedProps.isSubEvent as boolean | undefined;
    if (!isSub) return;
    const id = String(info.event.id);
    listEventRowElsRef.current.set(id, info.el);
    const parentTag = info.event.extendedProps.parentTagColor as string | null | undefined;
    paintListSubEventDotFromParentTag(info.el, parentTag);
  }, []);

  const handleEventWillUnmount = useCallback((info: EventMountArg) => {
    const isSub = info.event.extendedProps.isSubEvent as boolean | undefined;
    if (!isSub) return;
    listEventRowElsRef.current.delete(String(info.event.id));
  }, []);

  const handleEventChange = useCallback((arg: EventChangeArg) => {
    const isSub = arg.event.extendedProps.isSubEvent as boolean | undefined;
    if (!isSub) return;
    const el = listEventRowElsRef.current.get(String(arg.event.id));
    if (!el) return;
    const parentTag = arg.event.extendedProps.parentTagColor as string | null | undefined;
    paintListSubEventDotFromParentTag(el, parentTag);
  }, []);

  useEffect(() => {
    if (skipFilterEffectRef.current) {
      skipFilterEffectRef.current = false;
      return;
    }
    calendarRef.current?.getApi()?.refetchEvents();
  }, [visibleTagColors, showPromemoriaTitle]);

  const toggleTagColorFilter = useCallback((key: string) => {
    setVisibleTagColors((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      if (typeof window !== "undefined") {
        window.localStorage.setItem("calendar:visibleTagColors", JSON.stringify([...next]));
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

  const selectAllTagColors = useCallback(() => {
    setVisibleTagColors(() => {
      const next = new Set(allCalendarFilterColorKeys());
      if (typeof window !== "undefined") {
        window.localStorage.setItem("calendar:visibleTagColors", JSON.stringify([...next]));
      }
      return next;
    });
  }, []);

  const deselectAllTagColors = useCallback(() => {
    setVisibleTagColors(() => {
      const next = new Set<string>();
      if (typeof window !== "undefined") {
        window.localStorage.setItem("calendar:visibleTagColors", JSON.stringify([]));
      }
      return next;
    });
  }, []);

  const handleSetPanelFocus = useCallback((next: SmartPanelFocus) => {
    setPanelFocus(next);
    if (typeof window !== "undefined") {
      window.localStorage.setItem("calendar:smartPanelFocus", next);
    }
  }, []);

  type SmartPanelItem = {
    id: string;
    date: Date;
    dateLabel: string;
    title: string;
    subtitle: string;
    badgeLabel: string;
    badgeClass: string;
    status: "pending" | "done";
  };

  const smartPanelItems = useMemo<SmartPanelItem[]>(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayTs = today.getTime();

    const dateLabel = (d: Date) =>
      d.toLocaleDateString("it-IT", { day: "numeric", month: "short" }).toUpperCase();

    /** Nome fase con «udienza»/«udienze» (anche con altro testo prima/dopo); oppure tipo udienza in modale. */
    const madreNelPannelloUdienze = (ev: AppEvent) =>
      faseContieneParolaUdienza(getFaseDisplayString(ev)) || ev.type === "udienza";

    const out: SmartPanelItem[] = [];

    const addUdienzaMother = (ev: AppEvent) => {
      if (!madreNelPannelloUdienze(ev)) return;
      const title = (ev.title ?? "").trim();
      if (!title) return;
      const status: "pending" | "done" = ev.status === "done" ? "done" : "pending";
      const startAt = new Date(ev.startAt);
      const fase = getFaseDisplayString(ev);
      out.push({
        id: `sp-u-m-${ev.id}`,
        date: startAt,
        dateLabel: dateLabel(startAt),
        title,
        subtitle: fase,
        badgeLabel: "Udienza",
        badgeClass: "bg-blue-50 text-blue-700 ring-blue-200",
        status,
      });
    };

    const addUdienzaSubEvent = (parent: AppEvent, se: SubEvent) => {
      if (se.isPlaceholder || !se.dueAt || se.dueAt.getTime() === 0) return;
      if (isAdempimentoCollegatoLinkedSubEvent(se)) return;

      const params = (se.ruleParams ?? {}) as Record<string, unknown>;
      const seTipo = typeof params.tipo === "string" ? params.tipo : null;
      const isRinvioUdienzaSubEvent =
        se.ruleId === "rinvio-udienza" && se.kind === "termine" && seTipo === "udienza";

      const parentUdienzaCtx = madreNelPannelloUdienze(parent);
      if (!isRinvioUdienzaSubEvent && !parentUdienzaCtx) return;

      const title = (se.title ?? "").trim();
      if (!title) return;
      const status: "pending" | "done" = se.status === "done" ? "done" : "pending";
      const fase = getFaseDisplayString(parent);
      out.push({
        id: `sp-u-se-${se.id}`,
        date: se.dueAt,
        dateLabel: dateLabel(se.dueAt),
        title,
        subtitle: fase,
        badgeLabel: "Udienza",
        badgeClass: "bg-blue-50 text-blue-700 ring-blue-200",
        status,
      });
    };

    const addEventoCollegato = (parent: AppEvent, se: SubEvent) => {
      if (se.isPlaceholder || !se.dueAt || se.dueAt.getTime() === 0) return;
      if (!isAdempimentoCollegatoLinkedSubEvent(se)) return;
      const title = (se.title ?? "").trim();
      if (!title) return;
      const status: "pending" | "done" = se.status === "done" ? "done" : "pending";
      const fase = getFaseDisplayString(parent);
      const sotto = fase ? `Evento collegato · ${fase}` : "Evento collegato";
      out.push({
        id: `sp-a-se-${se.id}`,
        date: se.dueAt,
        dateLabel: dateLabel(se.dueAt),
        title,
        subtitle: sotto,
        badgeLabel: "Ev. collegato",
        badgeClass: "bg-amber-50 text-amber-700 ring-amber-200",
        status,
      });
    };

    for (const ev of allEvents) {
      if (panelFocus === "udienze") {
        addUdienzaMother(ev);
        for (const se of ev.subEvents ?? []) addUdienzaSubEvent(ev, se);
      } else {
        for (const se of ev.subEvents ?? []) addEventoCollegato(ev, se);
      }
    }

    out.sort((a, b) => {
      const da = Math.abs(a.date.getTime() - todayTs);
      const db = Math.abs(b.date.getTime() - todayTs);
      if (da !== db) return da - db;
      return a.date.getTime() - b.date.getTime();
    });
    return out;
  }, [allEvents, panelFocus]);

  const filterColorKeyCount = allCalendarFilterColorKeys().length;
  const visibleTagColorCount = visibleTagColors.size;
  const isTagFilterActive = visibleTagColors.size !== filterColorKeyCount;

  const orderedVisibleTagKeys = useMemo(() => {
    const ordered = [...EVENT_TAG_COLORS.map((c) => c.toLowerCase()), COLOR_FILTER_NONE, COLOR_FILTER_OTHER];
    return ordered.filter((k) => visibleTagColors.has(k));
  }, [visibleTagColors]);

  const renderTagSwatch = (key: string) => {
    const lower = key.toLowerCase();
    if (lower === COLOR_FILTER_NONE.toLowerCase()) {
      return <span className="h-3.5 w-3.5 rounded-full border border-dashed border-zinc-300 bg-white" title="Senza tag" />;
    }
    if (lower === COLOR_FILTER_OTHER.toLowerCase()) {
      return <span className="h-3.5 w-3.5 rounded-full bg-zinc-200 border border-zinc-300" title="Altri colori" />;
    }
    const hex = EVENT_TAG_COLORS.find((c) => c.toLowerCase() === lower) ?? null;
    if (!hex) return null;
    return <span className="h-3.5 w-3.5 rounded-full border border-zinc-200" style={{ backgroundColor: hex }} title={hex} />;
  };

  const eventsSource = useCallback(
    (
      info: { start: Date; end: Date; view?: { type: string } },
      successCallback: (events: Array<Record<string, unknown>>) => void,
      failureCallback: (error: Error) => void
    ) => {
      const viewType =
        info.view?.type ?? calendarRef.current?.getApi()?.view?.type ?? "";

      // Finestra ampia per `allEvents` (pannello intelligente + ricerca). getEvents() restituisce
      // solo pratiche con almeno un’intersezione col range: se la finestra è stretta, spariscono
      // udienze/adempimenti lontani nel tempo (anche se la pratica ha altre date dentro).
      const YEAR_MS = 365.25 * 24 * 60 * 60 * 1000;
      const wideStart = new Date(Date.now() - 12 * YEAR_MS);
      const wideEnd = new Date(Date.now() + 20 * YEAR_MS);
      const fetchStart = new Date(Math.min(info.start.getTime(), wideStart.getTime()));
      const fetchEnd = new Date(Math.max(info.end.getTime(), wideEnd.getTime()));
      getEvents(fetchStart, fetchEnd, targetUserId)
        .then((result) => {
          if (result.success && result.data) {
            let eventsData = result.data;
            setAllEvents(eventsData);

            if (viewType === "listFromToday" && isSearchActive && searchFilterEventId) {
              eventsData = eventsData.filter((e) => e.id === searchFilterEventId);
            }

            let events = eventsData.flatMap(toFullCalendarEvents);
            // Eventi bozza (solo lato client, evidenziati in giallo)
            const draftFcEvents = draftEvents.map((draft) => {
              const f = draft.form || {};
              const start = f.startAt ? new Date(f.startAt) : new Date();
              const end =
                f.endAt != null
                  ? new Date(f.endAt)
                  : new Date(start.getTime() + 60 * 60 * 1000);
              const rawTitle = (f.title as string | undefined)?.trim() || "Evento senza titolo";
              const draftColor = f.color as string | null | undefined;
              const tag = paletteKeyForFilter(draftColor);
              const faseFiltroText = getFaseDisplayFromFields(
                (f.eventoCode as string | null | undefined) ?? null,
                (f.procedimento as string | null | undefined) ?? null
              );
              return {
                id: draft.id,
                title: `BOZZA – ${rawTitle}`,
                start,
                end,
                allDay: false,
                backgroundColor: "#FFF9C4",
                borderColor: "#FBC02D",
                extendedProps: {
                  isSubEvent: false,
                  isDraft: true,
                  type: (f.type as string | undefined) ?? "altro",
                  status: f.status ?? "pending",
                  filterColorKey: tag,
                  parentTagColor: null,
                  faseFiltroText,
                },
              } as Record<string, unknown>;
            });
            events = events.concat(draftFcEvents);
            // Filtro colore tag (palette + senza tag + altri)
            events = events.filter((ev) => {
              const key = (ev.extendedProps as { filterColorKey?: string }).filterColorKey;
              if (!key) return true;
              return visibleTagColors.has(key);
            });
            // Titolo con «Promemoria»: se disattivato, nascondi quelle voci
            if (!showPromemoriaTitle) {
              events = events.filter((ev) => {
                const t = ((ev.title as string) ?? "").toLowerCase();
                return !t.includes("promemoria");
              });
            }
            // Filtro stato: rossi (da fare) / verdi (completati)
            events = events.filter((ev) => {
              const ext = ev.extendedProps as { status?: string } | undefined;
              const status = ext?.status === "done" ? "done" : "pending";
              if (status === "done") {
                return showDone;
              }
              return showPending;
            });
            successCallback(events);
          } else {
            failureCallback(
              new Error(
                !result.success && result.error
                  ? result.error
                  : "Errore caricamento eventi"
              )
            );
          }
        })
        .catch((err) =>
          failureCallback(
            err instanceof Error
              ? err
              : new Error("Errore sconosciuto caricamento eventi")
          )
        );
    },
    [
      isSearchActive,
      searchFilterEventId,
      draftEvents,
      showPending,
      showDone,
      targetUserId,
      visibleTagColors,
      showPromemoriaTitle,
    ]
  );

  const applySuggestionSelection = useCallback(
    (eventId: string, label?: string) => {
      setSearchFilterEventId(eventId);
      setIsSearchActive(true);
      if (label) {
        setSearchQuery(label);
      }
      setSearchSuggestions([]);
      const api = calendarRef.current?.getApi();
      if (api) {
        api.changeView("listFromToday");
        api.refetchEvents();
      }
    },
    []
  );

  const handleSearchChange = useCallback(
    (value: string) => {
      const query = value;
      setSearchQuery(query);

      const trimmed = query.trim().toLowerCase();
      if (trimmed.length < 2) {
        setSearchSuggestions([]);
        return;
      }

      const suggestions: SearchSuggestion[] = [];
      for (const ev of allEvents) {
        const rawTitle = (ev.title ?? "").toString();
        const titleMatch = rawTitle.toLowerCase().includes(trimmed);

        const savedInputs = ev.inputs as Record<string, unknown> | null | undefined;
        const practiceIdentity = (savedInputs?.practiceIdentity as Record<string, unknown> | null | undefined) ?? {};
        const parti = typeof practiceIdentity.parti === "string" ? (practiceIdentity.parti as string) : "";
        const rg = typeof practiceIdentity.rg === "string" ? (practiceIdentity.rg as string) : "";
        const autorita = typeof practiceIdentity.autorita === "string" ? (practiceIdentity.autorita as string) : "";
        const luogo = typeof practiceIdentity.luogo === "string" ? (practiceIdentity.luogo as string) : "";
        const practiceTitle = [parti, rg, autorita, luogo].map((v) => v.trim()).filter((v) => v.length > 0).join(" - ");
        const practiceMatch = practiceTitle.toLowerCase().includes(trimmed);

        const promemoriaMatches =
          ev.subEvents?.filter(
            (se) =>
              se.kind === "promemoria" &&
              (se.title ?? "").toLowerCase().includes(trimmed)
          ) ?? [];

        if (titleMatch) {
          suggestions.push({
            eventId: ev.id,
            label: rawTitle,
            matchType: "titolo",
          });
          continue;
        }

        if (practiceMatch) {
          suggestions.push({
            eventId: ev.id,
            label: practiceTitle,
            matchType: "titolo",
          });
        }

        if (promemoriaMatches.length > 0) {
          const first = promemoriaMatches[0];
          suggestions.push({
            eventId: ev.id,
            label: first.title ?? "",
            matchType: "promemoria",
            detail: ev.title ?? "",
          });
        }

        if (suggestions.length >= 10) break;
      }

      setSearchSuggestions(suggestions);
    },
    [allEvents]
  );

  const handleSearchKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        e.preventDefault();
        if (searchSuggestions.length > 0) {
          const first = searchSuggestions[0];
          applySuggestionSelection(first.eventId, first.label);
        }
      }
    },
    [searchSuggestions, applySuggestionSelection]
  );

  const handleSuggestionClick = useCallback(
    (suggestion: SearchSuggestion) => {
      applySuggestionSelection(suggestion.eventId, suggestion.label);
    },
    [applySuggestionSelection]
  );

  const handleClearSearch = useCallback(() => {
    setSearchQuery("");
    setSearchSuggestions([]);
    setIsSearchActive(false);
    setSearchFilterEventId(null);
    const api = calendarRef.current?.getApi();
    if (api) {
      api.refetchEvents();
    }
  }, []);

  const handleToggleShowPromemoriaTitle = useCallback(() => {
    setShowPromemoriaTitle((prev) => {
      const next = !prev;
      if (typeof window !== "undefined") {
        window.localStorage.setItem("calendar:showPromemoriaTitle", String(next));
      }
      calendarRef.current?.getApi()?.refetchEvents();
      return next;
    });
  }, []);

  const handleSelect = useCallback((arg: DateSelectArg) => {
    if (!canEdit) return;
    let start = new Date(arg.start);
    let end = arg.end ? new Date(arg.end) : new Date(start.getTime() + 60 * 60 * 1000);

    const isMidnight = start.getHours() === 0 && start.getMinutes() === 0;
    if (isMidnight) {
      const slot = findNextAvailableSlot(arg.start, allEvents);
      start = slot.start;
      end = slot.end;
    }

    setModalState({ mode: "create", start, end });
  }, [canEdit, allEvents]);

  const handleEventClick = useCallback(
    (arg: EventClickArg) => {
      arg.jsEvent.preventDefault();
      const ext = arg.event.extendedProps as any;
      if (ext.isDraft) {
        const draftId = arg.event.id as string;
        const draft = draftEvents.find((d) => d.id === draftId);
        if (draft) {
          const form = draft.form || {};
          const start =
            form.startAt != null
              ? new Date(form.startAt)
              : (arg.event.start as Date | null) ?? new Date();
          const end =
            form.endAt != null
              ? new Date(form.endAt)
              : (arg.event.end as Date | null) ?? new Date(start.getTime() + 60 * 60 * 1000);
          setModalState({
            mode: "create",
            start,
            end,
            draftId,
            initialDraftForm: form,
          });
        }
        return;
      }
      const isSub = ext.isSubEvent as boolean | undefined;
      const eventId = isSub ? (ext.parentEventId as string) : (arg.event.id as string);
      const highlightSubEventId = isSub ? (arg.event.id as string) : undefined;
      setModalState({ mode: "edit", eventId, highlightSubEventId });
    },
    [draftEvents]
  );

  const handleEventDrop = useCallback(
    async (arg: EventDropArg) => {
      if (!canEdit) return;
      if (arg.event.extendedProps.isSubEvent) return;
      const id = arg.event.id as string;
      const result = await updateEvent(id, {
        startAt: arg.event.start ?? new Date(),
        endAt: arg.event.end ?? new Date(),
      }, targetUserId);
      if (result.success && result.data?.generateSubEvents) {
        await regenerateSubEvents(id, targetUserId);
      }
      calendarRef.current?.getApi()?.refetchEvents();
    },
    [canEdit, targetUserId]
  );

  const handleModalClose = useCallback(() => {
    setModalState(null);
  }, []);

  const handleModalChanged = useCallback((newEventId?: string) => {
    const api = calendarRef.current?.getApi();
    if (newEventId) {
      // Dopo creazione: resta aperta la modale in modalità modifica (es. per aggiungere prosecuzione)
      setModalState({ mode: "edit", eventId: newEventId });
    }
    if (api) {
      api.refetchEvents();
    }
  }, []);

  const handleModalDeleted = useCallback((deletedId: string) => {
    const api = calendarRef.current?.getApi();
    if (!api) return;
    const events = api.getEvents();
    events.forEach((ev) => {
      const isSub = ev.extendedProps.isSubEvent as boolean | undefined;
      const parentId = ev.extendedProps.parentEventId as string | undefined;
      if (ev.id === deletedId || (isSub && parentId === deletedId)) {
        ev.remove();
      }
    });
  }, []);

  const handleDraftFromModal = useCallback(
    (draftId: string | null, form: any) => {
      const id =
        draftId ??
        `draft-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
      const snapshot = {
        ...form,
        startAt: form.startAt instanceof Date ? form.startAt.toISOString() : form.startAt,
        endAt: form.endAt instanceof Date ? form.endAt.toISOString() : form.endAt,
      };
      setDraftEvents((prev) => {
        const without = prev.filter((d) => d.id !== id);
        return [...without, { id, form: snapshot }];
      });
    },
    []
  );

  const handleClearDraftFromModal = useCallback(
    (draftId: string | null) => {
      if (!draftId) {
        setDraftEvents([]);
        return;
      }
      setDraftEvents((prev) => prev.filter((d) => d.id !== draftId));
    },
    []
  );

  const handleChangeView = useCallback((view: string) => {
    const api = calendarRef.current?.getApi();
    if (!api) return;
    api.changeView(view);
    if (typeof window !== "undefined") {
      window.localStorage.setItem("calendar:lastView", view);
    }
  }, []);

  const handleToday = useCallback(() => {
    const api = calendarRef.current?.getApi();
    if (!api) return;
    api.today();
  }, []);

  const handlePrev = useCallback(() => {
    const api = calendarRef.current?.getApi();
    if (!api) return;
    api.prev();
  }, []);

  const handleNext = useCallback(() => {
    const api = calendarRef.current?.getApi();
    if (!api) return;
    api.next();
  }, []);

  const renderEventContent = useCallback((arg: EventContentArg) => {
    const isSub = arg.event.extendedProps.isSubEvent as boolean | undefined;
    const parentTitle = arg.event.extendedProps.parentTitle as string | undefined;
    const kind = arg.event.extendedProps.kind as string | undefined;
    const isListView = (arg.view.type === "list" || arg.view.type === "listWeek" || arg.view.type === "listDay" || arg.view.type === "listMonth" || arg.view.type === "listFromToday");

    if (isSub && isListView) {
      const borderColor = arg.event.borderColor as string | undefined;
      const status = arg.event.extendedProps.status as string | undefined;
      const isDone = status === "done";
      const isReminder = kind === "promemoria";
      const evStart = arg.event.start;
      const evDay = evStart ? new Date(typeof evStart === "string" ? evStart : evStart.getTime()) : null;
      if (evDay) evDay.setHours(0, 0, 0, 0);
      const todayList = new Date();
      todayList.setHours(0, 0, 0, 0);
      const isFutureReminder = isReminder && evDay != null && evDay > todayList;
      return (
        <div
          className="fc-event-main-frame flex items-center gap-2 rounded border-l-4 pl-1"
          style={{ borderLeftColor: borderColor ?? undefined }}
        >
          {canEdit && !isFutureReminder ? (
          <button
            type="button"
            aria-label={isDone ? "Segna come non fatto" : "Segna come fatto"}
            className={`h-5 w-9 rounded-full border flex items-center px-0.5 transition-colors ${
              isDone
                ? "bg-emerald-500 border-emerald-600"
                : "bg-red-500 border-red-600"
            }`}
            onClick={async (e) => {
              e.stopPropagation();
              const id = arg.event.id as string;
              const nextStatus = isDone ? "pending" : "done";
              const result = await updateSubEvent(id, { status: nextStatus as "pending" | "done" }, targetUserId);
              if (result.success && result.data) {
                const newStatus = result.data.status;
                const parentTag = arg.event.extendedProps.parentTagColor as string | null | undefined;
                const newBg = parentTag
                  ? parentTag
                  : newStatus === "done"
                    ? SUB_EVENT_COLOR_DONE
                    : SUB_EVENT_COLOR_PENDING;
                const newBorder = parentTag
                  ? newStatus === "done"
                    ? SUB_EVENT_COLOR_DONE
                    : SUB_EVENT_COLOR_PENDING
                  : newBg;
                arg.event.setExtendedProp("status", newStatus);
                arg.event.setProp("backgroundColor", newBg);
                arg.event.setProp("borderColor", newBorder);
                requestAnimationFrame(() => {
                  const row = listEventRowElsRef.current.get(id);
                  if (row) {
                    paintListSubEventDotFromParentTag(
                      row,
                      arg.event.extendedProps.parentTagColor as string | null | undefined
                    );
                  }
                });
                if (newStatus === "done" && !showDone) {
                  arg.event.remove();
                }
                if (newStatus === "pending" && !showPending) {
                  arg.event.remove();
                }
              }
            }}
          >
            <span
              className="h-4 w-4 rounded-full bg-white shadow-sm transform transition-transform"
              style={{
                transform: isDone ? "translateX(12px)" : "translateX(0px)",
              }}
            />
          </button>
          ) : (
            <span
              className={`inline-block h-3 w-3 rounded-full shrink-0 ${isFutureReminder ? "bg-zinc-400" : ""}`}
              style={
                isFutureReminder
                  ? undefined
                  : (() => {
                      const pt = (arg.event.extendedProps.parentTagColor as string | undefined)?.trim();
                      if (pt) return { backgroundColor: pt };
                      return { backgroundColor: isDone ? SUB_EVENT_COLOR_DONE : SUB_EVENT_COLOR_PENDING };
                    })()
              }
            />
          )}
          <span className="fc-list-event-title flex-1 truncate" style={{ color: "#171717" }}>{arg.event.title}</span>
          {kind && (
            <span className="text-calendar-muted text-xs shrink-0">{kind}</span>
          )}
          {parentTitle && (
            <span className="text-calendar-muted text-xs truncate max-w-[45vw]" title={parentTitle}>
              ← {parentTitle}
            </span>
          )}
          {canEdit && (
            <button
              type="button"
              aria-label="Rimuovi sottoevento"
              title="Rimuovi questo elemento"
              className="ml-1 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-full h-6 w-6 flex items-center justify-center shrink-0"
              onClick={async (e) => {
                e.stopPropagation();
                const id = arg.event.id as string;
                const parentTitleSafe = parentTitle || "questa pratica";
                const titleSafe = arg.event.title || "questo promemoria";
                const confirmed = window.confirm(
                  `Stai per eliminare il promemoria “${titleSafe}” collegato alla pratica “${parentTitleSafe}”. Vuoi continuare?`
                );
                if (!confirmed) return;
                const result = await deleteSubEvent(id, targetUserId);
                if (result.success) {
                  arg.event.remove();
                }
              }}
            >
              <TrashIcon className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      );
    }
    if (isSub) {
      const borderColor = arg.event.borderColor as string | undefined;
      const status = arg.event.extendedProps.status as string | undefined;
      const isDone = status === "done";
      const isPromemoriaSub = kind === "promemoria";
      const parentTagColorRaw = arg.event.extendedProps.parentTagColor as string | undefined;
      const parentTagColor = parentTagColorRaw?.trim() ? parentTagColorRaw.trim() : null;
      const evStart = arg.event.start;
      const evDay = evStart ? new Date(typeof evStart === "string" ? evStart : evStart.getTime()) : null;
      if (evDay) evDay.setHours(0, 0, 0, 0);
      const todaySub = new Date();
      todaySub.setHours(0, 0, 0, 0);
      const isFutureReminderSub = isPromemoriaSub && evDay != null && evDay > todaySub;
      const arrowColorClass = isFutureReminderSub
        ? "text-zinc-400"
        : isDone
          ? "text-emerald-500"
          : "text-red-500";
      return (
        <div
          className="fc-event-main-frame flex items-center gap-1 rounded border-l-2 pl-1"
          style={{ borderLeftColor: borderColor ?? undefined }}
        >
          {parentTagColor && (
            <span
              aria-hidden
              className="inline-block h-2 w-2 rounded-full shrink-0"
              style={{ backgroundColor: parentTagColor }}
              title="Colore tag pratica"
            />
          )}
          <span className={`${arrowColorClass} shrink-0 text-[10px] leading-none opacity-90`} aria-hidden title="Promemoria">↳</span>
          <span className="truncate min-w-0 flex-1 text-[inherit]" style={{ color: "#171717" }}>{arg.event.title}</span>
        </div>
      );
    }
    // Evento madre in vista Agenda: mostra spunta verde se completato + icona cestino per eliminare
    if (isListView) {
      const evStatus = arg.event.extendedProps.status as string | undefined;
      const isDoneEv = evStatus === "done";
        const titleSafe = arg.event.title || "questa pratica";
      return (
        <div className="fc-event-main-frame flex items-center gap-2">
          {isDoneEv && (
            <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-green-500 shrink-0">
              <svg viewBox="0 0 16 16" fill="none" className="w-3 h-3">
                <path d="M3 8l3.5 3.5L13 5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          )}
          <span
            className={`fc-list-event-title flex-1 truncate font-medium ${isDoneEv ? "line-through text-zinc-400" : ""}`}
            style={{ color: isDoneEv ? undefined : "#171717" }}
          >
            {arg.event.title}
          </span>
          {canEdit && (
            <button
              type="button"
              aria-label="Rimuovi evento"
              title="Rimuovi evento principale e relativi sottoeventi"
              className="ml-1 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-full h-6 w-6 flex items-center justify-center shrink-0"
              onClick={async (e) => {
                e.stopPropagation();
                const id = arg.event.id as string;
                  const confirmed = window.confirm(
                    `Stai per eliminare la pratica “${titleSafe}” e tutti i promemoria collegati. Vuoi continuare?`
                  );
                  if (!confirmed) return;
                const result = await deleteEvent(id, targetUserId);
                if (result.success) {
                  const api = calendarRef.current?.getApi();
                  if (!api) {
                    arg.event.remove();
                    return;
                  }
                  const events = api.getEvents();
                  events.forEach((ev) => {
                    const isSub = ev.extendedProps.isSubEvent as boolean | undefined;
                    const parentId = ev.extendedProps.parentEventId as string | undefined;
                    if (ev.id === id || (isSub && parentId === id)) {
                      ev.remove();
                    }
                  });
                }
              }}
            >
              <TrashIcon className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      );
    }
    // Evento madre in vista Mese/Giorno/Settimana: pallino (o spunta verde se completato) + titolo
    if (!isSub && arg.view.type.startsWith("dayGrid")) {
      const evStatus = arg.event.extendedProps.status as string | undefined;
      const isDoneEv = evStatus === "done";
      const bgColor = arg.event.backgroundColor as string | undefined;
      const hasTagColor = bgColor && bgColor !== "#ffffff";
      const dotColor = hasTagColor ? bgColor : "#171717";
      return (
        <div className="fc-event-main-frame flex items-center gap-1">
          {isDoneEv ? (
            <span className="inline-flex items-center justify-center w-3.5 h-3.5 rounded-full bg-green-500 shrink-0 mr-0.5">
              <svg viewBox="0 0 16 16" fill="none" className="w-2.5 h-2.5">
                <path d="M3 8l3.5 3.5L13 5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          ) : (
            <span
              aria-hidden
              className="mr-1.5 inline-block h-3 w-3 rounded-full shrink-0"
              style={{ backgroundColor: dotColor }}
            />
          )}
          <span className={`truncate ${isDoneEv ? "line-through text-zinc-400" : ""}`} style={{ color: isDoneEv ? undefined : "#171717" }}>
            {arg.event.title}
          </span>
        </div>
      );
    }
    return true;
  }, [canEdit, targetUserId, showPending, showDone]);

  return (
      <div className="flex min-h-0 flex-1 min-w-0 flex-col gap-2 sm:gap-3 calendar-theme">
      <div className="flex flex-col gap-2 sm:gap-3 mb-1 shrink-0">
        {/* Riga 1: Nuovo evento + ricerca + filtri (layout ottimizzato per mobile) */}
        <div className="flex flex-col gap-2 pb-3 sm:flex-row sm:items-center sm:justify-between">
          {/* Nuovo evento + ricerca */}
          <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
            <div className="flex items-center">
              {canEdit && (
                <Button
                  type="button"
                  size="sm"
                  className="h-9 rounded-md px-4 text-sm font-medium bg-[var(--navy)] text-white hover:bg-[var(--navy-light)] border-0 shadow-sm transition-colors"
                  onClick={() => {
                    const slot = findNextAvailableSlot(new Date(), allEvents);
                    setModalState({ mode: "create", start: slot.start, end: slot.end });
                  }}
                >
                  <span className="mr-1">Nuova pratica</span>
                  <span className="text-xs">▾</span>
                </Button>
              )}
            </div>
            {/* Ricerca (a destra del bottone su mobile, come campo full-width) */}
            <div className="relative w-full sm:w-auto sm:min-w-[200px]">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                onKeyDown={handleSearchKeyDown}
                placeholder="Cerca per titolo o promemoria…"
                className={`h-8 w-full sm:w-64 rounded-md border bg-white px-2 pr-7 text-xs sm:text-sm text-zinc-800 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-[var(--navy)] focus:border-[var(--navy)] ${
                  isSearchActive ? "border-[var(--navy)] ring-1 ring-[var(--navy)]" : "border-zinc-300"
                }`}
              />
              {(isSearchActive || searchQuery.length > 0) && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 flex items-center justify-center h-5 w-5 rounded-full text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors"
                  title="Annulla ricerca"
                  aria-label="Annulla ricerca"
                >
                  <svg viewBox="0 0 16 16" fill="none" className="h-3.5 w-3.5">
                    <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </button>
              )}
              {searchSuggestions.length > 0 && (
                <div className="absolute z-20 mt-1 w-full sm:w-72 rounded-lg border border-zinc-200 bg-white shadow-md max-h-60 overflow-auto text-xs sm:text-sm">
                  {searchSuggestions.map((s) => (
                    <button
                      key={`${s.eventId}-${s.label}-${s.matchType}`}
                      type="button"
                      className="flex w-full flex-col items-start px-3 py-2 text-left hover:bg-[var(--surface)] transition-colors"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        handleSuggestionClick(s);
                      }}
                    >
                      <span className="font-medium text-zinc-800 truncate">
                        {s.label}
                      </span>
                      <span className="text-[10px] uppercase tracking-wide text-zinc-500">
                        {s.matchType === "titolo" ? "Titolo evento" : "Promemoria"}
                      </span>
                      {s.detail && (
                        <span className="text-[11px] text-zinc-500 truncate">
                          Evento: {s.detail}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          {/* Filtri colore tag, modalità, Promemoria + Stato */}
          <div className="flex flex-wrap items-center gap-3 sm:justify-end">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className={`h-8 gap-1.5 px-2 text-xs sm:text-sm border-zinc-300 bg-white transition-colors ${
                    isTagFilterActive ? "text-white bg-[var(--navy)] border-[var(--navy)] hover:bg-[var(--navy-light)]" : "text-zinc-700"
                  }`}
                >
                  Colore tag
                  <span className="text-zinc-500 text-[10px] sm:text-xs tabular-nums">
                    ({visibleTagColorCount}/{filterColorKeyCount})
                  </span>
                </Button>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-[min(100vw-2rem,26rem)] p-3 sm:w-96">
                <p className="text-xs font-medium text-zinc-700 mb-1">Mostra per colore tag</p>
                <p className="text-[11px] text-zinc-500 mb-2">
                  I promemoria e gli adempimenti usano il colore dell&apos;evento madre. Puoi dare un nome a ogni colore
                  (solo per te, salvato nel browser). Deseleziona i colori da nascondere.
                </p>
                <div className="flex gap-2 mb-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-7 flex-1 text-[11px] sm:text-xs"
                    onClick={selectAllTagColors}
                  >
                    Seleziona tutti
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-7 flex-1 text-[11px] sm:text-xs"
                    onClick={deselectAllTagColors}
                  >
                    Deseleziona tutti
                  </Button>
                </div>
                <div className="max-h-56 overflow-y-auto space-y-1.5 pr-1">
                  {EVENT_TAG_COLORS.map((hex) => {
                    const k = hex.toLowerCase();
                    return (
                      <div
                        key={hex}
                        className="flex items-center gap-2 rounded px-1 py-0.5 hover:bg-zinc-50"
                      >
                        <Checkbox
                          checked={visibleTagColors.has(k)}
                          onCheckedChange={() => toggleTagColorFilter(k)}
                          className="h-3.5 w-3.5 shrink-0"
                        />
                        <span
                          className="h-4 w-4 rounded border border-zinc-200/80 shrink-0"
                          style={{ backgroundColor: hex }}
                          title={hex}
                        />
                        <Input
                          value={tagColorLabels[k] ?? ""}
                          onChange={(e) => updateTagColorLabel(k, e.target.value)}
                          placeholder={hex}
                          className="h-7 text-xs py-0.5 px-2 flex-1 min-w-0"
                          aria-label={`Nome personalizzato colore ${hex}`}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                    );
                  })}
                  <div className="flex items-center gap-2 rounded px-1 py-0.5 hover:bg-zinc-50">
                    <Checkbox
                      checked={visibleTagColors.has(COLOR_FILTER_NONE)}
                      onCheckedChange={() => toggleTagColorFilter(COLOR_FILTER_NONE)}
                      className="h-3.5 w-3.5 shrink-0"
                    />
                    <span
                      className="h-4 w-4 rounded border border-dashed border-zinc-300 bg-white shrink-0"
                      title="Senza tag"
                    />
                    <Input
                      value={tagColorLabels[COLOR_FILTER_NONE] ?? ""}
                      onChange={(e) => updateTagColorLabel(COLOR_FILTER_NONE, e.target.value)}
                      placeholder="Senza tag"
                      className="h-7 text-xs py-0.5 px-2 flex-1 min-w-0"
                      aria-label="Nome personalizzato: senza tag"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                  <div className="flex items-center gap-2 rounded px-1 py-0.5 hover:bg-zinc-50">
                    <Checkbox
                      checked={visibleTagColors.has(COLOR_FILTER_OTHER)}
                      onCheckedChange={() => toggleTagColorFilter(COLOR_FILTER_OTHER)}
                      className="h-3.5 w-3.5 shrink-0"
                    />
                    <span
                      className="h-4 w-4 rounded border border-zinc-400 bg-zinc-100 shrink-0"
                      title="Altri colori"
                    />
                    <Input
                      value={tagColorLabels[COLOR_FILTER_OTHER] ?? ""}
                      onChange={(e) => updateTagColorLabel(COLOR_FILTER_OTHER, e.target.value)}
                      placeholder="Altri colori (fuori palette)"
                      className="h-7 text-xs py-0.5 px-2 flex-1 min-w-0"
                      aria-label="Nome personalizzato: altri colori"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                </div>
              </PopoverContent>
            </Popover>

            {/* Toggle promemoria */}
            <button
              type="button"
              onClick={handleToggleShowPromemoriaTitle}
              className="flex items-center gap-2 select-none"
              title={
                showPromemoriaTitle
                  ? "Disattiva per nascondere eventi/sottoeventi che nel titolo contengono «Promemoria»"
                  : "Attiva per mostrare anche quelle voci con «Promemoria» nel titolo"
              }
            >
              <span className="text-xs sm:text-sm text-zinc-600 whitespace-nowrap">Promemoria</span>
              <span
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border transition-colors ${
                  showPromemoriaTitle
                    ? "bg-[var(--navy)] border-[var(--navy)]"
                    : "bg-zinc-300 border-zinc-400"
                }`}
              >
                <span
                  className="inline-block h-3.5 w-3.5 rounded-full bg-white shadow-sm transition-transform"
                  style={{ transform: showPromemoriaTitle ? "translateX(18px)" : "translateX(2px)" }}
                />
              </span>
            </button>
            {/* Filtro stato eventi */}
            <div className="flex items-center gap-2">
              <span className="text-xs sm:text-sm text-zinc-600 whitespace-nowrap">Stato</span>
              <button
                type="button"
                onClick={() => setShowPending((v) => !v)}
                className="flex items-center gap-1 rounded-md border border-zinc-300 bg-white px-2 py-1 text-[11px] sm:text-xs text-zinc-700 hover:bg-zinc-50"
              >
                <Checkbox
                  checked={showPending}
                  onCheckedChange={(v) => setShowPending(Boolean(v))}
                  className="h-3.5 w-3.5 pointer-events-none"
                />
                <span className="inline-flex items-center gap-1">
                  <span className="inline-block h-2.5 w-2.5 rounded-full bg-red-500" />
                  <span>Da fare</span>
                </span>
              </button>
              <button
                type="button"
                onClick={() => setShowDone((v) => !v)}
                className="flex items-center gap-1 rounded-md border border-zinc-300 bg-white px-2 py-1 text-[11px] sm:text-xs text-zinc-700 hover:bg-zinc-50"
              >
                <Checkbox
                  checked={showDone}
                  onCheckedChange={(v) => setShowDone(Boolean(v))}
                  className="h-3.5 w-3.5 pointer-events-none"
                />
                <span className="inline-flex items-center gap-1">
                  <span className="inline-block h-2.5 w-2.5 rounded-full bg-emerald-500" />
                  <span>Completati</span>
                </span>
              </button>
            </div>
          </div>
        </div>

        {isTagFilterActive && (
          <div className="flex flex-wrap items-center justify-between gap-3 mt-1 rounded-2xl border border-zinc-200 bg-white px-4 py-2 shadow-sm">
            <div className="flex items-center gap-3 min-w-0">
              <span className="inline-flex items-center gap-2 rounded-full bg-zinc-50 border border-zinc-200 px-2.5 py-1 text-xs font-medium text-zinc-700 shrink-0">
                Filtri attivi
              </span>
              <div className="min-w-0">
                <p className="text-xs text-zinc-700 font-medium">
                  Colore tag: {visibleTagColorCount}/{filterColorKeyCount}
                </p>
                {visibleTagColorCount === 0 && (
                  <p className="text-[11px] text-zinc-500">
                    Stai nascondendo tutti gli eventi: usa “Mostra tutti”.
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                {orderedVisibleTagKeys.slice(0, 5).map((k) => (
                  <span key={k} className="inline-flex items-center justify-center">
                    {renderTagSwatch(k)}
                  </span>
                ))}
                {orderedVisibleTagKeys.length > 5 && (
                  <span className="text-[11px] text-zinc-500 font-medium">+{orderedVisibleTagKeys.length - 5}</span>
                )}
              </div>
              <Button type="button" size="sm" variant="outline" className="h-8 px-3" onClick={selectAllTagColors}>
                Mostra tutti
              </Button>
            </div>
          </div>
        )}

        {/* Riga 2: Oggi + frecce + titolo + viste */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-md border border-zinc-300 bg-white px-3 text-xs sm:text-sm font-normal text-zinc-700 h-8 hover:bg-zinc-50 hover:border-[var(--navy)]/30 transition-colors"
              onClick={handleToday}
            >
              Oggi
            </button>
            <div className="flex overflow-hidden rounded-md border border-zinc-300 bg-white">
              <button
                type="button"
                className="h-8 w-8 text-sm text-zinc-700 hover:bg-zinc-50"
                onClick={handlePrev}
                aria-label="Periodo precedente"
              >
                ‹
              </button>
              <button
                type="button"
                className="h-8 w-8 text-sm text-zinc-700 hover:bg-zinc-50 border-l border-zinc-200"
                onClick={handleNext}
                aria-label="Periodo successivo"
              >
                ›
              </button>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-sm sm:text-base font-semibold text-[var(--navy)]">
              {viewTitle}
            </div>
          </div>
          <div className="flex items-center gap-2 justify-end">
            <div className="flex items-center gap-0.5 rounded-lg border border-zinc-200 bg-white p-0.5 shadow-sm">
              {[
                { id: "timeGridDay", label: "Giorno" },
                { id: "timeGridWeek", label: "Settimana" },
                { id: "dayGridMonth", label: "Mese" },
                { id: "listFromToday", label: "Agenda" },
              ].map((view) => (
                <Button
                  key={view.id}
                  type="button"
                  variant="outline"
                  size="sm"
                  className={`h-8 px-3 text-xs sm:text-sm rounded-md font-medium transition-colors ${
                    currentView === view.id
                      ? "bg-[var(--navy)] text-white border-[var(--navy)] hover:bg-[var(--navy-light)] hover:text-white"
                      : "bg-transparent text-zinc-700 border-transparent hover:bg-zinc-100 hover:border-zinc-200"
                  }`}
                  onClick={() => handleChangeView(view.id)}
                >
                  {view.label}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="flex min-h-0 w-full min-w-0 flex-1 flex-col gap-6">
      <div
        ref={calendarContainerRef}
        className={
          currentView === "listFromToday"
            ? "calendar-agenda-scroll-container calendar-month-container flex min-h-0 w-full min-w-0 max-w-full flex-1 flex-col overflow-x-auto"
            : "calendar-month-container w-full min-w-0 max-w-full shrink-0 overflow-x-auto"
        }
      >
        {currentView === "listFromToday" && (
          <div className="mb-1 px-1 sm:hidden">
            <p className="text-[11px] text-zinc-500 flex items-center gap-1">
              <span className="inline-block h-1 w-8 rounded-full bg-zinc-300" />
              Schermata ampia: scorri in orizzontale per vedere tutti i dettagli.
            </p>
          </div>
        )}
        {initialView && (
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]}
          initialView={initialView}
          headerToolbar={false}
          buttonText={{
            today: "Oggi",
            month: "Mese",
            week: "Settimana",
            list: "Agenda",
          }}
          locale={itLocale}
          allDaySlot={false}
          slotLabelFormat={{
            hour: "2-digit",
            minute: "2-digit",
            omitZeroMinute: true,
            hour12: false,
          }}
          views={{
            timeGridWeek: {
              dayHeaderContent: (arg: { date: Date }) => {
                const d = arg.date;
                const dayNum = String(d.getDate()).padStart(2, "0");
                const dayName = d.toLocaleDateString("it-IT", { weekday: "short" });
                return {
                  html: `<span class="fc-day-num">${dayNum}</span> <span class="fc-day-name">${dayName}</span>`,
                };
              },
            },
            listFromToday: {
              type: "list",
              duration: { years: 2 },
              visibleRange: (currentDate: Date) => {
                const start = new Date(currentDate);
                start.setFullYear(start.getFullYear() - 1);
                start.setHours(0, 0, 0, 0);
                const end = new Date(currentDate);
                end.setFullYear(end.getFullYear() + 1);
                end.setHours(0, 0, 0, 0);
                return { start, end };
              },
              buttonText: "Agenda",
            },
          }}
          events={eventsSource}
          editable={canEdit}
          selectable={canEdit}
          selectMirror={canEdit}
          dayMaxEvents
          weekends
          datesSet={handleDatesSet}
          eventsSet={handleEventsSet}
          select={handleSelect}
          eventClick={handleEventClick}
          eventDrop={handleEventDrop}
          eventContent={renderEventContent}
          eventDidMount={handleEventDidMount}
          eventWillUnmount={handleEventWillUnmount}
          eventChange={handleEventChange}
          eventClassNames={(arg) => (arg.event.extendedProps.isSubEvent as boolean) ? ["fc-event-sub"] : ["fc-event-madre"]}
          height={currentView === "listFromToday" ? "100%" : "auto"}
          expandRows={false}
          slotMinTime="00:00:00"
          slotMaxTime="24:00:00"
          slotDuration="01:00:00"
          slotLabelInterval="01:00:00"
        />
        )}
        </div>

        <aside className="w-full shrink-0" aria-label="Pannello intelligente: resoconto udienze o adempimenti">
          <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
            <div className="flex flex-col gap-3 bg-[var(--navy)] px-5 py-4 text-white sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-300">
                  Pannello intelligente
                </p>
                <h3 className="mt-1 text-lg font-semibold tracking-tight">
                  {panelFocus === "adempimenti" ? "Eventi collegati" : "Prossime udienze"}
                </h3>
              </div>
              <div className="flex shrink-0 gap-1 rounded-full bg-white/10 p-1" role="tablist" aria-label="Tipo di resoconto">
                {SMART_PANEL_TABS.map((tab) => {
                  const active = panelFocus === tab.id;
                  const Icon = tab.Icon;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      role="tab"
                      aria-selected={active}
                      onClick={() => handleSetPanelFocus(tab.id)}
                      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-xs font-medium transition-all sm:px-4 ${
                        active
                          ? "bg-white text-[var(--navy)] shadow-sm"
                          : "text-white/80 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden />
                      {tab.shortLabel}
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="max-h-[min(28rem,55vh)] overflow-y-auto border-t border-zinc-100 p-4">
              {smartPanelItems.length === 0 ? (
                <p className="py-6 text-center text-sm text-slate-500">
                  Nessuna voce in questo resoconto. Il pannello elenca tutte le udienze rilevate (fase o tipo) e tutti gli
                  eventi collegati, senza i filtri colore/promemoria/stato del calendario. Se è vuoto, non ci sono voci che
                  rientrano nei criteri oppure i dati non sono ancora stati ricaricati.
                </p>
              ) : (
                <ul className="space-y-3">
                  {smartPanelItems.map((item) => (
                    <li
                      key={item.id}
                      className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                            {item.dateLabel}
                          </p>
                          <p
                            className={`mt-1 text-sm font-semibold text-slate-900 ${
                              item.status === "done" ? "line-through text-slate-400" : ""
                            }`}
                          >
                            {item.title}
                          </p>
                          {item.subtitle ? (
                            <p className="mt-1 truncate text-xs text-slate-500" title={item.subtitle}>
                              {item.subtitle}
                            </p>
                          ) : null}
                        </div>
                        <span
                          className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ring-inset ${item.badgeClass}`}
                        >
                          {item.badgeLabel}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </aside>
      </div>
      {modalState && (
        <EventModal
          mode={modalState.mode}
          initialStart={modalState.mode === "create" ? modalState.start : undefined}
          initialEnd={modalState.mode === "create" ? modalState.end : undefined}
          draftId={modalState.mode === "create" ? modalState.draftId ?? null : undefined}
          initialDraft={modalState.mode === "create" ? modalState.initialDraftForm : undefined}
          eventId={modalState.mode === "edit" ? modalState.eventId : undefined}
          highlightSubEventId={modalState.mode === "edit" ? modalState.highlightSubEventId : undefined}
          onClose={handleModalClose}
          onChanged={handleModalChanged}
          onDeleted={handleModalDeleted}
          onDraft={handleDraftFromModal}
          onDraftCleared={handleClearDraftFromModal}
          targetUserId={targetUserId}
          readOnly={!canEdit}
        />
      )}
    </div>
  );
}
