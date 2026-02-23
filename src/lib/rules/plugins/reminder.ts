import type { RuleDefinition } from "../types";
import { addDays, setHours, setMinutes } from "date-fns";

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
    const subEvents = offsets.map((daysBefore) => {
      const dueDate = addDays(eventStart, -daysBefore);
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
    return { subEvents };
  },
};
