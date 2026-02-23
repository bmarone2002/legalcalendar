/**
 * Test deterministici sui calcoli ATTO_GIURIDICO.
 * Esegui con: npx tsx src/lib/rules/plugins/atto-giuridico.calcolo.test.ts
 */

import { attoGiuridicoRule } from "./atto-giuridico";
import type { Event } from "@/types";
import type { AppSettings } from "../types";
import { addDays } from "date-fns";

const baseSettings: AppSettings = {
  defaultReminderTime: "09:00",
  defaultReminderOffsets: [7, 1],
  defaultTimeForDeadlines: "18:00",
  defaultReminderOffsetsAtto: [-30, -7, -1],
  notificaEsteroDefault: false,
  termineComparizioneCitazioneItalia: 120,
  termineComparizioneCitazioneEstero: 150,
};

const baseEvent: Event = {
  id: "test",
  title: "Test",
  description: null,
  startAt: new Date(),
  endAt: new Date(),
  type: "udienza",
  tags: [],
  caseId: null,
  notes: null,
  generateSubEvents: true,
  ruleTemplateId: "atto-giuridico",
  ruleParams: null,
  macroType: "ATTO_GIURIDICO",
  actionType: undefined,
  actionMode: undefined,
  inputs: undefined,
  createdAt: new Date(),
  updatedAt: new Date(),
};

function run(
  actionType: string,
  actionMode: string,
  inputs: Record<string, unknown>
): ReturnType<typeof attoGiuridicoRule.run> {
  return attoGiuridicoRule.run({
    event: { ...baseEvent, actionType, actionMode, inputs },
    settings: baseSettings,
    userSelections: inputs,
  });
}

// CITAZIONE COSTITUZIONE: Costituzione attore = dataNotificaCitazione + 10
const udienza = new Date("2026-06-15T10:00:00");
const dataNotificaCitazione = "2026-05-01";
const outCitCost = run("CITAZIONE", "COSTITUZIONE", {
  dataNotificaCitazione,
});
const termineCostituzione = outCitCost.subEvents.find((s) => s.title.includes("Costituzione attore"));
const attesoCostituzione = addDays(new Date(dataNotificaCitazione), 10);

// RICORSO OPPOSIZIONE DA NOTIFICARE: Ultimo giorno = dataNotificaDecreto + 40
const dataNotificaDec = "2026-04-01";
const outOpp = run("RICORSO_OPPOSIZIONE", "DA_NOTIFICARE", {
  dataNotificaDecretoIngiuntivo: dataNotificaDec,
});
const termineOpposizione = outOpp.subEvents.find((s) => s.title.includes("Ultimo giorno"));
const attesoOpposizione = addDays(new Date(dataNotificaDec), 40);

// APPELLO CIVILE DA NOTIFICARE BREVE: 30 gg da notifica sentenza
const dataNotificaSentenza = "2026-03-01";
const outApp = run("APPELLO_CIVILE", "DA_NOTIFICARE", {
  sceltaTermineImpugnazione: "BREVE",
  dataNotificaSentenza,
});
const termineAppello = outApp.subEvents.find((s) => s.title.includes("Ultimo giorno") && s.title.includes("appello"));
const attesoAppello = addDays(new Date(dataNotificaSentenza), 30);

// CITAZIONE DA NOTIFICARE: Ultima notifica = udienza - 120 (Italia)
const dataUdienza = "2026-06-15T10:00:00";
const outCitNot = run("CITAZIONE", "DA_NOTIFICARE", {
  dataUdienzaComparizione: dataUdienza,
  notificaEstero: false,
});
const termineNotifica = outCitNot.subEvents.find((s) => s.title.includes("Ultimo giorno") && s.title.includes("notificare"));
const attesoNotifica = addDays(new Date(dataUdienza), -120);

let ok = 0;
let fail = 0;

function assert(cond: boolean, msg: string) {
  if (cond) {
    console.log("OK:", msg);
    ok++;
  } else {
    console.error("FAIL:", msg);
    fail++;
  }
}

assert(termineCostituzione != null, "CITAZIONE COSTITUZIONE: esiste sottoevento Costituzione attore");
assert(
  termineCostituzione?.dueAt.getTime() === attesoCostituzione.getTime() ||
    (termineCostituzione?.dueAt.getDate() === attesoCostituzione.getDate() &&
      termineCostituzione?.dueAt.getMonth() === attesoCostituzione.getMonth()),
  "CITAZIONE COSTITUZIONE: data = dataNotifica + 10 giorni"
);
assert(
  (termineCostituzione?.explanation ?? "").includes("165"),
  "CITAZIONE COSTITUZIONE: audit contiene art. 165"
);

assert(termineOpposizione != null, "RICORSO OPPOSIZIONE: esiste termine Ultimo giorno");
assert(
  termineOpposizione?.dueAt.getDate() === attesoOpposizione.getDate() &&
    termineOpposizione?.dueAt.getMonth() === attesoOpposizione.getMonth(),
  "RICORSO OPPOSIZIONE: data = dataNotifica + 40 giorni"
);
assert(
  (termineOpposizione?.explanation ?? "").includes("40"),
  "RICORSO OPPOSIZIONE: audit contiene 40 giorni"
);

assert(termineAppello != null, "APPELLO CIVILE BREVE: esiste termine appello");
assert(
  termineAppello?.dueAt.getDate() === attesoAppello.getDate() &&
    termineAppello?.dueAt.getMonth() === attesoAppello.getMonth(),
  "APPELLO CIVILE BREVE: data = notifica sentenza + 30"
);
assert(
  (termineAppello?.explanation ?? "").includes("325"),
  "APPELLO CIVILE: audit contiene art. 325"
);

assert(termineNotifica != null, "CITAZIONE DA NOTIFICARE: esiste termine ultima notifica");
assert(
  termineNotifica?.dueAt.getDate() === attesoNotifica.getDate() &&
    termineNotifica?.dueAt.getMonth() === attesoNotifica.getMonth(),
  "CITAZIONE DA NOTIFICARE: data = udienza - 120 giorni"
);
assert(
  (termineNotifica?.explanation ?? "").includes("120"),
  "CITAZIONE DA NOTIFICARE: audit contiene 120"
);

// Promemoria creati
const promemoriaCit = outCitCost.subEvents.filter((s) => s.kind === "promemoria");
assert(promemoriaCit.length >= 2, "CITAZIONE COSTITUZIONE: almeno 2 promemoria (-7, -1)");

console.log("\nRisultato:", ok, "OK,", fail, "FAIL");
process.exit(fail > 0 ? 1 : 0);
