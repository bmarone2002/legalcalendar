"use client";

import React, { useCallback, useRef, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import interactionPlugin from "@fullcalendar/interaction";
import itLocale from "@fullcalendar/core/locales/it";
import type { EventClickArg, DateSelectArg, EventDropArg, EventContentArg } from "@fullcalendar/core";
import { getEvents, updateEvent } from "@/lib/actions/events";
import { regenerateSubEvents, updateSubEvent } from "@/lib/actions/sub-events";
import type { Event as AppEvent, SubEvent } from "@/types";
import { EventModal } from "@/components/event-modal/EventModal";
import { Button } from "@/components/ui/button";

// Brown & white theme – event type colors (solo per eventi madre; sottoeventi usano rosso/verde)
const EVENT_TYPE_COLORS: Record<string, string> = {
  udienza: "#5D4037",
  notifica: "#4E342E",
  deposito: "#3E2723",
  scadenza: "#4E342E",
  altro: "#5D4037",
};

// Sottoeventi: rosso di default (pending), verde quando completati (done). Eventi madre senza questa logica.
const SUB_EVENT_COLOR_PENDING = "#C62828";
const SUB_EVENT_COLOR_DONE = "#2E7D32";

function filterEventsFromToday(events: Array<Record<string, unknown>>): Array<Record<string, unknown>> {
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  return events.filter((ev) => {
    const evStart = ev.start as Date | string | undefined;
    if (!evStart) return false;
    const d =
      typeof evStart === "string"
        ? new Date(evStart)
        : new Date(evStart.getTime());
    return d >= todayStart;
  });
}

// Modalità mock: usa eventi di esempio lato frontend quando il DB non è disponibile.
const USE_MOCK_EVENTS = process.env.NEXT_PUBLIC_USE_MOCK_EVENTS === "true";

const MOCK_EVENTS: Array<Record<string, unknown>> = [
  // Evento madre 1: Udienza con due sottoeventi (uno fatto, uno da fare)
  {
    id: "e-1",
    title: "Udienza Tribunale Roma - Rossi c. Bianchi",
    start: "2026-02-10T09:30:00",
    end: "2026-02-10T11:00:00",
    allDay: false,
    backgroundColor: "#ffffff",
    borderColor: EVENT_TYPE_COLORS.udienza,
    extendedProps: {
      type: "udienza",
      tags: ["Civile", "Roma"],
      isSubEvent: false,
    },
  },
  {
    id: "se-1-1",
    title: "Deposito comparsa conclusionale",
    start: "2026-02-05T12:00:00",
    end: "2026-02-05T12:00:00",
    allDay: false,
    backgroundColor: SUB_EVENT_COLOR_DONE,
    borderColor: SUB_EVENT_COLOR_DONE,
    editable: false,
    extendedProps: {
      isSubEvent: true,
      parentEventId: "e-1",
      parentTitle: "Udienza Tribunale Roma - Rossi c. Bianchi",
      kind: "Deposito",
      status: "done",
    },
  },
  {
    id: "se-1-2",
    title: "Notifica sentenza a cliente",
    start: "2026-02-20T10:00:00",
    end: "2026-02-20T10:00:00",
    allDay: false,
    backgroundColor: SUB_EVENT_COLOR_PENDING,
    borderColor: SUB_EVENT_COLOR_PENDING,
    editable: false,
    extendedProps: {
      isSubEvent: true,
      parentEventId: "e-1",
      parentTitle: "Udienza Tribunale Roma - Rossi c. Bianchi",
      kind: "Notifica",
      status: "pending",
    },
  },
  // Evento madre 2: Scadenza con un sottoevento
  {
    id: "e-2",
    title: "Termine appello sentenza Milano",
    start: "2026-03-01T00:00:00",
    end: "2026-03-01T23:59:59",
    allDay: true,
    backgroundColor: "#ffffff",
    borderColor: EVENT_TYPE_COLORS.scadenza,
    extendedProps: {
      type: "scadenza",
      tags: ["Appello", "Milano"],
      isSubEvent: false,
    },
  },
  {
    id: "se-2-1",
    title: "Promemoria: valutazione strategia appello",
    start: "2026-02-15T09:00:00",
    end: "2026-02-15T09:00:00",
    allDay: false,
    backgroundColor: SUB_EVENT_COLOR_PENDING,
    borderColor: SUB_EVENT_COLOR_PENDING,
    editable: false,
    extendedProps: {
      isSubEvent: true,
      parentEventId: "e-2",
      parentTitle: "Termine appello sentenza Milano",
      kind: "Promemoria",
      status: "pending",
    },
  },
];

function toFullCalendarEvents(e: AppEvent): Array<Record<string, unknown>> {
  // Evento madre: se è stato scelto un colore tag, usiamo quello; altrimenti nessun tag (sfondo neutro)
  const rawColor = (e.color ?? "").trim();
  const normalized = rawColor.toLowerCase();
  const isWhiteLike =
    normalized === "#fff" || normalized === "#ffffff" || normalized === "white";
  const tagColor = rawColor && !isWhiteLike ? rawColor : null;
  const mainBackground = tagColor ?? "#ffffff";
  const mainBorder = tagColor ?? "#E5E5E5";
  const out: Array<Record<string, unknown>> = [
    {
      id: e.id,
      title: e.title,
      start: e.startAt,
      end: e.endAt,
      allDay: false,
      backgroundColor: mainBackground,
      borderColor: mainBorder,
      extendedProps: { type: e.type, tags: e.tags, isSubEvent: false },
    },
  ];
  (e.subEvents ?? []).forEach((se: SubEvent) => {
    const isDone = se.status === "done";
    const subBg = isDone ? SUB_EVENT_COLOR_DONE : SUB_EVENT_COLOR_PENDING;
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
        parentTitle: e.title,
        kind: se.kind,
        status: se.status,
      },
    });
  });
  return out;
}

export function CalendarView() {
  const calendarRef = useRef<InstanceType<typeof FullCalendar> | null>(null);
  const [currentView, setCurrentView] = useState<string>("dayGridMonth");
  const [viewTitle, setViewTitle] = useState<string>("");
  const [modalState, setModalState] = useState<
    | { mode: "create"; start?: Date; end?: Date }
    | { mode: "edit"; eventId: string }
    | null
  >(null);
  const [mockEvents, setMockEvents] = useState<Array<Record<string, unknown>>>(MOCK_EVENTS);

  const handleDatesSet = useCallback(
    (arg: { start: Date; end: Date; view: { type: string; title: string } }) => {
      setCurrentView(arg.view.type);
      setViewTitle(arg.view.title);
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

      if (USE_MOCK_EVENTS) {
        const base =
          viewType === "listFromToday"
            ? filterEventsFromToday(mockEvents)
            : mockEvents;
        successCallback(base);
        return;
      }

      const start = new Date(info.start);
      start.setDate(start.getDate() - 1);
      const end = new Date(info.end);
      end.setDate(end.getDate() + 1);
      getEvents(start, end)
        .then((result) => {
          if (result.success && result.data) {
            let events = result.data.flatMap(toFullCalendarEvents);
            // In Agenda: mostrare solo eventi a partire dal giorno corrente (incluso)
            if (viewType === "listFromToday") {
              events = filterEventsFromToday(events);
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
    [mockEvents]
  );

  const handleSelect = useCallback((arg: DateSelectArg) => {
    setModalState({ mode: "create", start: arg.start, end: arg.end });
  }, []);

  const handleEventClick = useCallback((arg: EventClickArg) => {
    arg.jsEvent.preventDefault();
    const isSub = arg.event.extendedProps.isSubEvent as boolean | undefined;
    const eventId = isSub
      ? (arg.event.extendedProps.parentEventId as string)
      : (arg.event.id as string);
    setModalState({ mode: "edit", eventId });
  }, []);

  const handleEventDrop = useCallback(
    async (arg: EventDropArg) => {
      if (arg.event.extendedProps.isSubEvent) return;
      const id = arg.event.id as string;
      const result = await updateEvent(id, {
        startAt: arg.event.start ?? new Date(),
        endAt: arg.event.end ?? new Date(),
      });
      if (result.success && result.data?.generateSubEvents) {
        await regenerateSubEvents(id);
      }
      calendarRef.current?.getApi()?.refetchEvents();
    },
    []
  );

  const handleModalClose = useCallback(() => {
    setModalState(null);
  }, []);

  const handleModalChanged = useCallback(() => {
    const api = calendarRef.current?.getApi();
    if (!api) return;
    const viewType = api.view.type;
    // In Agenda non forziamo il refetch immediato per evitare che gli eventi spariscano
    if (viewType !== "listFromToday") {
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

  const handleChangeView = useCallback((view: string) => {
    const api = calendarRef.current?.getApi();
    if (!api) return;
    api.changeView(view);
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
      return (
        <div
          className="fc-event-main-frame flex items-center gap-2 rounded border-l-4 pl-1"
          style={{ borderLeftColor: borderColor ?? undefined }}
        >
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
              if (USE_MOCK_EVENTS) {
                const newBg =
                  nextStatus === "done" ? SUB_EVENT_COLOR_DONE : SUB_EVENT_COLOR_PENDING;
                arg.event.setExtendedProp("status", nextStatus);
                arg.event.setProp("backgroundColor", newBg);
                arg.event.setProp("borderColor", newBg);
                setMockEvents((prev) =>
                  prev.map((ev) => {
                    if (ev.id === id) {
                      const extendedProps = {
                        ...(ev.extendedProps as Record<string, unknown> | undefined),
                        status: nextStatus,
                      };
                      return {
                        ...ev,
                        backgroundColor: newBg,
                        borderColor: newBg,
                        extendedProps,
                      };
                    }
                    return ev;
                  })
                );
                return;
              }
              const result = await updateSubEvent(id, { status: nextStatus as "pending" | "done" });
              if (result.success && result.data) {
                const newStatus = result.data.status;
                const newBg =
                  newStatus === "done" ? SUB_EVENT_COLOR_DONE : SUB_EVENT_COLOR_PENDING;
                arg.event.setExtendedProp("status", newStatus);
                arg.event.setProp("backgroundColor", newBg);
                arg.event.setProp("borderColor", newBg);
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
          <span className="fc-list-event-dot" style={{ borderColor: arg.event.backgroundColor }} />
          <span className="fc-list-event-title flex-1 truncate" style={{ color: "#171717" }}>{arg.event.title}</span>
          {kind && (
            <span className="text-calendar-muted text-xs shrink-0">{kind}</span>
          )}
          {parentTitle && (
            <span className="text-calendar-muted text-xs truncate max-w-[120px]" title={parentTitle}>
              ← {parentTitle}
            </span>
          )}
        </div>
      );
    }
    if (isSub) {
      const borderColor = arg.event.borderColor as string | undefined;
      return (
        <div
          className="fc-event-main-frame flex items-center gap-1 rounded border-l-4 pl-0.5"
          style={{ borderLeftColor: borderColor ?? undefined }}
        >
          <span className="text-calendar-sub-event-icon shrink-0" aria-hidden>↳</span>
          <span className="truncate" style={{ color: "#171717" }}>{arg.event.title}</span>
        </div>
      );
    }
    // Evento madre in vista Agenda: testo scuro per leggibilità
    if (isListView) {
      return (
        <div className="fc-event-main-frame flex items-center gap-2">
          <span className="fc-list-event-dot" style={{ borderColor: arg.event.backgroundColor }} />
          <span className="fc-list-event-title flex-1 truncate font-medium" style={{ color: "#171717" }}>{arg.event.title}</span>
        </div>
      );
    }
    return true;
  }, []);

  return (
    <div className="flex h-full flex-col gap-2 sm:gap-3 calendar-theme">
      <div className="flex flex-col gap-2 sm:gap-3 mb-1">
        {/* Prima riga: Nuovo evento + viste + filtro + azioni (stile ribbon) */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-200 pb-2">
          <div className="flex items-center gap-2">
            <Button
              variant="default"
              size="sm"
              className="h-9 rounded-md bg-[#0b5fff] px-4 text-sm font-medium text-white shadow-sm hover:bg-[#0a55e5]"
              onClick={() => setModalState({ mode: "create" })}
            >
              <span className="mr-1">Nuovo evento</span>
              <span className="text-xs">▾</span>
            </Button>
          </div>
          <div className="flex flex-wrap items-center gap-2 justify-end">
            <div className="flex items-center gap-1 rounded-md border border-zinc-300 bg-white p-0.5 shadow-sm">
              {[
                { id: "timeGridDay", label: "Giorno" },
                { id: "timeGridWeek", label: "Settimana" },
                { id: "dayGridMonth", label: "Mese" },
                { id: "listFromToday", label: "Agenda" },
              ].map((view) => (
                <Button
                  key={view.id}
                  type="button"
                  variant="ghost"
                  size="sm"
                  className={`h-8 px-3 text-xs sm:text-sm rounded-md border ${
                    currentView === view.id
                      ? "border-[#0b5fff] bg-[#e7f1ff] text-[#0b5fff]"
                      : "border-transparent text-zinc-700 hover:bg-zinc-100"
                  }`}
                  onClick={() => handleChangeView(view.id)}
                >
                  {view.label}
                </Button>
              ))}
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 px-3 text-xs sm:text-sm text-zinc-700 hover:bg-zinc-100"
            >
              Condividi
            </Button>
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-md border border-zinc-300 bg-white px-3 text-xs sm:text-sm font-normal text-zinc-700 h-8 hover:bg-zinc-100"
              onClick={handleToday}
            >
              Oggi
            </button>
            <div className="flex overflow-hidden rounded-md border border-zinc-300 bg-white">
              <button
                type="button"
                className="h-8 w-8 text-sm text-zinc-700 hover:bg-zinc-100"
                onClick={handlePrev}
                aria-label="Mese precedente"
              >
                ‹
              </button>
              <button
                type="button"
                className="h-8 w-8 text-sm text-zinc-700 hover:bg-zinc-100 border-l border-zinc-200"
                onClick={handleNext}
                aria-label="Mese successivo"
              >
                ›
              </button>
            </div>
          </div>
          <div className="text-sm sm:text-base font-semibold text-[var(--calendar-brown)]">
            {viewTitle}
          </div>
        </div>
      </div>
      <div className="flex-1 w-full min-h-0 calendar-month-container" style={{ minHeight: 'min(600px, calc(100vh - 10rem))' }}>
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]}
          initialView="dayGridMonth"
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
          editable
          selectable
          selectMirror
          dayMaxEvents
          weekends
          datesSet={handleDatesSet}
          select={handleSelect}
          eventClick={handleEventClick}
          eventDrop={handleEventDrop}
          eventContent={renderEventContent}
          eventClassNames={(arg) => (arg.event.extendedProps.isSubEvent as boolean) ? ["fc-event-sub"] : ["fc-event-madre"]}
          height="100%"
          expandRows={true}
          slotMinTime="00:00:00"
          slotMaxTime="24:00:00"
          slotDuration="01:00:00"
          slotLabelInterval="01:00:00"
        />
      </div>
      {modalState && (
        <EventModal
          mode={modalState.mode}
          initialStart={modalState.mode === "create" ? modalState.start : undefined}
          initialEnd={modalState.mode === "create" ? modalState.end : undefined}
          eventId={modalState.mode === "edit" ? modalState.eventId : undefined}
          onClose={handleModalClose}
          onChanged={handleModalChanged}
          onDeleted={handleModalDeleted}
          onDeleteMock={
            USE_MOCK_EVENTS && modalState.mode === "edit"
              ? () => {
                  const id = modalState.eventId;
                  setMockEvents((prev) =>
                    prev.filter((ev) => {
                      const parentId =
                        (ev.extendedProps as { parentEventId?: string } | undefined)
                          ?.parentEventId;
                      return ev.id !== id && parentId !== id;
                    })
                  );
                }
              : undefined
          }
        />
      )}
    </div>
  );
}
