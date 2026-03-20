import type { RuleDefinition } from "../types";
import { addDays, setHours, setMinutes } from "date-fns";
import { buildLinkedEventCandidates, parseLinkedEvents } from "@/lib/linked-events";

function parseTime(timeStr: string): { hours: number; minutes: number } {
  const [h, m] = timeStr.split(":").map(Number);
  return { hours: h ?? 9, minutes: m ?? 0 };
}

export const reminderRule: RuleDefinition = {
  id: "reminder",
  label: "Promemoria standard",
  run(input) {
    const offsets: number[] =
      (input.userSelections.reminderOffsets as number[]) ??
      input.settings.defaultReminderOffsets ??
      [7, 1];
    const timeStr =
      (input.userSelections.reminderTime as string) ??
      input.settings.defaultReminderTime ??
      "09:00";
    const { hours, minutes } = parseTime(timeStr);
    const eventStart = new Date(input.event.startAt);
    // Normalizza alla data locale dell'evento (ignorando l'ora per il calcolo dei giorni)
    const eventDateOnly = new Date(
      eventStart.getFullYear(),
      eventStart.getMonth(),
      eventStart.getDate()
    );
    const subEvents = offsets.map((daysBefore) => {
      const dueDate = addDays(eventDateOnly, -daysBefore);
      const dueAt = setMinutes(setHours(dueDate, hours), minutes);
      return {
        title: `Promemoria: ${input.event.title} (T-${daysBefore})`,
        kind: "promemoria" as const,
        dueAt,
        status: "pending" as const,
        priority: 0,
        ruleId: "reminder",
        ruleParams: { daysBefore, time: timeStr },
        explanation: `Promemoria ${daysBefore} giorni prima dell'evento (${dueAt.toLocaleDateString("it-IT")} alle ${timeStr})`,
        createdBy: "automatico" as const,
      };
    });

    const mergedInputs = {
      ...(input.userSelections ?? {}),
      ...(input.event.inputs ?? {}),
    } as Record<string, unknown>;
    const linkedSpecs = parseLinkedEvents(mergedInputs.linkedEvents);
    const refAtMidday = new Date(
      eventStart.getFullYear(),
      eventStart.getMonth(),
      eventStart.getDate(),
      12,
      0,
      0,
      0,
    );
    const linked = buildLinkedEventCandidates(
      linkedSpecs,
      refAtMidday,
      input.settings,
      "reminder",
      {},
    );

    return { subEvents: [...subEvents, ...linked] };
  },
};
