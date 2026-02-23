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
import { regenerateSubEvents } from "@/lib/actions/sub-events";
import type { Event as AppEvent, SubEvent } from "@/types";
import { EventModal } from "@/components/event-modal/EventModal";
import { Button } from "@/components/ui/button";

// Brown & white theme – event type colors (contrasto alto, testo bianco leggibile)
const EVENT_TYPE_COLORS: Record<string, string> = {
  udienza: "#5D4037",
  notifica: "#4E342E",
  deposito: "#3E2723",
  scadenza: "#4E342E",
  altro: "#5D4037",
};

const SUB_EVENT_BORDER = "#8D6E63";

function toFullCalendarEvents(e: AppEvent): Array<Record<string, unknown>> {
  // Colore tag: se impostato, stesso colore per evento madre e tutti i sottoeventi
  const tagColor = (e.color != null && e.color !== "") ? e.color : null;
  const mainColor = tagColor ?? (EVENT_TYPE_COLORS[e.type] ?? EVENT_TYPE_COLORS.altro);
  const subColor = tagColor ?? "#FFF8E7";
  const subBorder = tagColor ?? SUB_EVENT_BORDER;
  const out: Array<Record<string, unknown>> = [
    {
      id: e.id,
      title: e.title,
      start: e.startAt,
      end: e.endAt,
      allDay: false,
      backgroundColor: mainColor,
      borderColor: mainColor,
      extendedProps: { type: e.type, tags: e.tags, isSubEvent: false },
    },
  ];
  (e.subEvents ?? []).forEach((se: SubEvent) => {
    out.push({
      id: se.id,
      title: se.title,
      start: se.dueAt,
      end: se.dueAt,
      allDay: false,
      backgroundColor: subColor,
      borderColor: subBorder,
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
  const [viewStart, setViewStart] = useState<Date | null>(null);
  const [viewEnd, setViewEnd] = useState<Date | null>(null);
  const [events, setEvents] = useState<Array<Record<string, unknown>>>([]);
  const [modalState, setModalState] = useState<
    | { mode: "create"; start?: Date; end?: Date }
    | { mode: "edit"; eventId: string }
    | null
  >(null);

  const fetchEvents = useCallback(async (start: Date, end: Date) => {
    const result = await getEvents(start, end);
    if (result.success && result.data) {
      setEvents(result.data.flatMap(toFullCalendarEvents));
    }
    setViewStart(start);
    setViewEnd(end);
  }, []);

  const handleDatesSet = useCallback(
    (arg: { start: Date; end: Date }) => {
      fetchEvents(arg.start, arg.end);
    },
    [fetchEvents]
  );

  const eventsSource = useCallback(
    (info: { start: Date; end: Date }, successCallback: (events: Array<Record<string, unknown>>) => void) => {
      const start = new Date(info.start);
      start.setDate(start.getDate() - 1);
      const end = new Date(info.end);
      end.setDate(end.getDate() + 1);
      getEvents(start, end).then((result) => {
        if (result.success && result.data) {
          successCallback(result.data.flatMap(toFullCalendarEvents));
        } else {
          successCallback([]);
        }
      }).catch(() => successCallback([]));
    },
    []
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
    calendarRef.current?.getApi()?.refetchEvents();
  }, []);

  const renderEventContent = useCallback((arg: EventContentArg) => {
    const isSub = arg.event.extendedProps.isSubEvent as boolean | undefined;
    const parentTitle = arg.event.extendedProps.parentTitle as string | undefined;
    const kind = arg.event.extendedProps.kind as string | undefined;
    const isListView = (arg.view.type === "list" || arg.view.type === "listWeek" || arg.view.type === "listDay" || arg.view.type === "listMonth" || arg.view.type === "listFromToday");

    if (isSub && isListView) {
      const borderColor = arg.event.borderColor as string | undefined;
      return (
        <div
          className="fc-event-main-frame flex items-center gap-2 rounded border-l-4 pl-1"
          style={{ borderLeftColor: borderColor ?? undefined }}
        >
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
    // Evento madre in vista Agenda: render esplicito, testo bianco su sfondo colore
    if (isListView) {
      return (
        <div className="fc-event-main-frame flex items-center gap-2">
          <span className="fc-list-event-dot" style={{ borderColor: arg.event.backgroundColor }} />
          <span className="fc-list-event-title flex-1 truncate font-medium" style={{ color: "#ffffff", textShadow: "0 0 1px rgba(0,0,0,0.4)" }}>{arg.event.title}</span>
        </div>
      );
    }
    return true;
  }, []);

  return (
    <div className="flex h-full flex-col gap-2 sm:gap-3 calendar-theme">
      <div className="flex items-center justify-end">
        <div className="rounded-lg border-2 border-[var(--calendar-brown)] bg-[var(--calendar-brown-pale)] px-3 py-1.5">
          <Button
            variant="ghost"
            size="default"
            className="h-11 px-5 text-base font-medium text-[var(--calendar-brown)] hover:bg-[var(--calendar-brown)]/10 hover:text-[var(--calendar-brown)]"
            onClick={() => setModalState({ mode: "create" })}
          >
            Aggiungi evento
          </Button>
        </div>
      </div>
      <div className="flex-1 w-full min-h-0 calendar-month-container" style={{ minHeight: 'min(600px, calc(100vh - 10rem))' }}>
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,listFromToday",
          }}
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
        />
      )}
    </div>
  );
}
