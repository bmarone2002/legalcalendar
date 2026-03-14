import type { RuleDefinition } from "../types";
import { addDays, setHours, setMinutes } from "date-fns";

export const genericDeadlineRule: RuleDefinition = {
  id: "generic-deadline",
  label: "Scadenza generica",
  run(input) {
    const daysAfter = (input.userSelections.deadlineDays as number) ?? 30;
    const timeStr = (input.userSelections.deadlineTime as string) ?? "18:00";
    const [h, m] = timeStr.split(":").map(Number);
    const eventEnd = new Date(input.event.endAt);
    const dueDate = addDays(eventEnd, daysAfter);
    const dueAt = setMinutes(setHours(dueDate, h ?? 18), m ?? 0);
    return {
      subEvents: [
        {
          title: `Scadenza: ${input.event.title} (T+${daysAfter})`,
          kind: "termine" as const,
          dueAt,
          status: "pending" as const,
          priority: 1,
          ruleId: "generic-deadline",
          ruleParams: { daysAfter, time: timeStr },
          explanation: `Scadenza ${daysAfter} giorni dopo la fine dell'evento (${dueAt.toLocaleDateString("it-IT")} alle ${timeStr})`,
          createdBy: "automatico" as const,
        },
      ],
    };
  },
};
