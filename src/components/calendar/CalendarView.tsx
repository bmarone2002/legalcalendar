"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import interactionPlugin from "@fullcalendar/interaction";
import itLocale from "@fullcalendar/core/locales/it";
import type { EventClickArg, DateSelectArg, EventDropArg, EventContentArg } from "@fullcalendar/core";
import { getEvents, updateEvent, deleteEvent } from "@/lib/actions/events";
import { regenerateSubEvents, updateSubEvent, deleteSubEvent } from "@/lib/actions/sub-events";
import type { Event as AppEvent, SubEvent } from "@/types";
import { EventModal } from "@/components/event-modal/EventModal";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

// Sottoeventi: rosso (pending), verde (done), neutro per promemoria futuri (prima del giorno).
const SUB_EVENT_COLOR_PENDING = "#C62828";
const SUB_EVENT_COLOR_DONE = "#2E7D32";
const SUB_EVENT_COLOR_FUTURE = "#e4e4e7"; // nessun colore fino al giorno del promemoria

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
      extendedProps: { type: e.type, tags: e.tags, isSubEvent: false, status: e.status ?? "pending" },
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
    const subBg = isFutureReminder
      ? SUB_EVENT_COLOR_FUTURE
      : isDone
        ? SUB_EVENT_COLOR_DONE
        : SUB_EVENT_COLOR_PENDING;
    out.push({
      id: se.id,
      title: se.title,
      start: se.dueAt,
      end: se.dueAt,
      allDay: false,
      backgroundColor: subBg,
      borderColor: subBg,
      editable: false,
      extendedProps: {
        isSubEvent: true,
        parentEventId: e.id,
        parentTitle: mainTitle,
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
  const [hideSubEvents, setHideSubEvents] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return window.localStorage.getItem("calendar:hideSubEvents") === "true";
  });
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
  const handleDatesSet = useCallback(
    (arg: { start: Date; end: Date; view: { type: string; title: string } }) => {
      setCurrentView(arg.view.type);
      setViewTitle(arg.view.title);
      if (typeof window !== "undefined") {
        window.localStorage.setItem("calendar:lastView", arg.view.type);
      }
    },
    []
  );

  const eventsSource = useCallback(
    (
      info: { start: Date; end: Date; view?: { type: string } },
      successCallback: (events: Array<Record<string, unknown>>) => void,
      failureCallback: (error: Error) => void
    ) => {
      const viewType =
        info.view?.type ?? calendarRef.current?.getApi()?.view?.type ?? "";

      getEvents(info.start, info.end, targetUserId)
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
                  status: f.status ?? "pending",
                },
              } as Record<string, unknown>;
            });
            events = events.concat(draftFcEvents);
            // Filtro stato: rossi (da fare) / verdi (completati)
            events = events.filter((ev) => {
              const ext = ev.extendedProps as { status?: string } | undefined;
              const status = ext?.status === "done" ? "done" : "pending";
              if (status === "done") {
                return showDone;
              }
              return showPending;
            });
            // Filtro "Solo eventi principali": nasconde promemoria e sottoeventi
            if (hideSubEvents) {
              events = events.filter((ev) => !(ev.extendedProps as { isSubEvent?: boolean }).isSubEvent);
            }
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
    [isSearchActive, searchFilterEventId, hideSubEvents, draftEvents, showPending, showDone, targetUserId]
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
        const titleMatch = (ev.title ?? "").toLowerCase().includes(trimmed);
        const promemoriaMatches =
          ev.subEvents?.filter(
            (se) =>
              se.kind === "promemoria" &&
              (se.title ?? "").toLowerCase().includes(trimmed)
          ) ?? [];

        if (titleMatch) {
          suggestions.push({
            eventId: ev.id,
            label: ev.title ?? "",
            matchType: "titolo",
          });
          continue;
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

  const handleToggleHideSubEvents = useCallback(() => {
    setHideSubEvents((prev) => {
      const next = !prev;
      if (typeof window !== "undefined") {
        window.localStorage.setItem("calendar:hideSubEvents", String(next));
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
                const newBg =
                  newStatus === "done" ? SUB_EVENT_COLOR_DONE : SUB_EVENT_COLOR_PENDING;
                arg.event.setExtendedProp("status", newStatus);
                arg.event.setProp("backgroundColor", newBg);
                arg.event.setProp("borderColor", newBg);
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
              className={`inline-block h-3 w-3 rounded-full shrink-0 ${isFutureReminder ? "bg-zinc-400" : isDone ? "bg-emerald-500" : "bg-red-500"}`}
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
          <span className={`${arrowColorClass} shrink-0 text-[10px] leading-none opacity-90`} aria-hidden title="Promemoria">↳</span>
          <span className="truncate min-w-0 flex-1 text-[inherit]" style={{ color: "#171717" }}>{arg.event.title}</span>
        </div>
      );
    }
    // Evento madre in vista Agenda: mostra spunta verde se completato + icona cestino per eliminare
    if (isListView) {
      const evStatus = arg.event.extendedProps.status as string | undefined;
      const isDoneEv = evStatus === "done";
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
            <span aria-hidden className="mr-1" style={{ color: dotColor }}>•</span>
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
      <div className="flex h-full min-w-0 flex-col gap-2 sm:gap-3 calendar-theme">
      <div className="flex flex-col gap-2 sm:gap-3 mb-1">
        {/* Riga 1: Nuovo evento + ricerca + filtri (layout ottimizzato per mobile) */}
        <div className="flex flex-col gap-2 border-b border-zinc-200 pb-3 sm:flex-row sm:items-center sm:justify-between">
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
                  <span className="mr-1">Nuovo evento</span>
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
          {/* Filtri Promemoria + Stato */}
          <div className="flex flex-wrap items-center gap-3 sm:justify-end">
            {/* Toggle promemoria */}
            <button
              type="button"
              onClick={handleToggleHideSubEvents}
              className="flex items-center gap-2 select-none"
              title={hideSubEvents ? "Promemoria nascosti. Clicca per mostrarli." : "Promemoria visibili. Clicca per nasconderli."}
            >
              <span className="text-xs sm:text-sm text-zinc-600 whitespace-nowrap">Promemoria</span>
              <span
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border transition-colors ${
                  hideSubEvents
                    ? "bg-zinc-300 border-zinc-400"
                    : "bg-[var(--navy)] border-[var(--navy)]"
                }`}
              >
                <span
                  className="inline-block h-3.5 w-3.5 rounded-full bg-white shadow-sm transition-transform"
                  style={{ transform: hideSubEvents ? "translateX(2px)" : "translateX(18px)" }}
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
      <div className="w-full min-w-0 max-w-full overflow-x-auto calendar-month-container">
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
              duration: { years: 1 },
              visibleRange: (currentDate: Date) => {
                const start = new Date();
                start.setHours(0, 0, 0, 0);
                const end = new Date(start);
                end.setFullYear(end.getFullYear() + 1);
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
          select={handleSelect}
          eventClick={handleEventClick}
          eventDrop={handleEventDrop}
          eventContent={renderEventContent}
          eventClassNames={(arg) => (arg.event.extendedProps.isSubEvent as boolean) ? ["fc-event-sub"] : ["fc-event-madre"]}
          height="auto"
          expandRows={false}
          slotMinTime="00:00:00"
          slotMaxTime="24:00:00"
          slotDuration="01:00:00"
          slotLabelInterval="01:00:00"
        />
        )}
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
