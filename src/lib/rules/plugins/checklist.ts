import type { RuleDefinition } from "../types";

const DEFAULT_ITEMS = [
  { title: "Preparazione documenti", order: 0 },
  { title: "Verifica citazioni", order: 1 },
];

export const checklistRule: RuleDefinition = {
  id: "checklist",
  label: "Checklist",
  run(input) {
    const items =
      (input.userSelections.checklistItems as Array<{ title: string; order: number }>) ??
      DEFAULT_ITEMS;
    const eventStart = new Date(input.event.startAt);
    return {
      subEvents: items.map((item, i) => ({
        title: item.title,
        kind: "attivita" as const,
        dueAt: eventStart,
        status: "pending" as const,
        priority: i,
        ruleId: "checklist",
        ruleParams: { order: item.order },
        explanation: `Attività collegata all'evento del ${eventStart.toLocaleDateString("it-IT")}`,
        createdBy: "automatico" as const,
      })),
    };
  },
};
