import { PrismaClient } from "../src/generated/prisma";

const prisma = new PrismaClient();

async function main() {
  const start = new Date();
  start.setHours(10, 0, 0, 0);
  const end = new Date(start);
  end.setHours(11, 30, 0, 0);

  const e = await prisma.event.upsert({
    where: { id: "seed-event-1" },
    create: {
      id: "seed-event-1",
      title: "Udienza civile - Causa Rossi",
      description: "Prima udienza",
      startAt: start,
      endAt: end,
      type: "udienza",
      tags: JSON.stringify(["civile", "urgente"]),
      generateSubEvents: true,
      ruleTemplateId: "reminder",
      ruleParams: JSON.stringify({}),
    },
    update: {},
  });

  await prisma.subEvent.createMany({
    data: [
      {
        parentEventId: e.id,
        title: "Promemoria: Udienza civile - Causa Rossi (T-7)",
        kind: "promemoria",
        dueAt: new Date(start.getTime() - 7 * 24 * 60 * 60 * 1000),
        ruleId: "reminder",
        explanation: "Promemoria 7 giorni prima dell'evento",
        createdBy: "automatico",
      },
      {
        parentEventId: e.id,
        title: "Promemoria: Udienza civile - Causa Rossi (T-1)",
        kind: "promemoria",
        dueAt: new Date(start.getTime() - 1 * 24 * 60 * 60 * 1000),
        ruleId: "reminder",
        explanation: "Promemoria 1 giorno prima dell'evento",
        createdBy: "automatico",
      },
    ],
    });

  console.log("Seed completato.");
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
