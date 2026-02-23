/**
 * Rule: ATTO_GIURIDICO
 * Genera termini (scadenze) e promemoria in base a actionType + actionMode + inputs.
 * Ogni sottoevento ha explanation (audit) con formula e fonte normativa.
 */

import type { RuleDefinition, SubEventCandidate } from "../types";
import type { AppSettings } from "../types";
import { addDays, setHours, setMinutes, startOfDay } from "date-fns";

function parseTime(timeStr: string): { hours: number; minutes: number } {
  const [h, m] = timeStr.split(":").map(Number);
  return { hours: h ?? 18, minutes: m ?? 0 };
}

function toDeadlineTime(d: Date, settings: AppSettings): Date {
  const { hours, minutes } = parseTime(settings.defaultTimeForDeadlines ?? "18:00");
  return setMinutes(setHours(startOfDay(d), hours), minutes);
}

function addReminders(
  titlePrefix: string,
  dueAt: Date,
  settings: AppSettings,
  ruleId: string,
  ruleParams: Record<string, unknown>,
  offsets: number[]
): SubEventCandidate[] {
  const timeStr = settings.defaultTimeForDeadlines ?? "18:00";
  const { hours, minutes } = parseTime(timeStr);
  return offsets.map((daysBefore) => {
    const reminderDate = addDays(dueAt, daysBefore);
    const at = setMinutes(setHours(reminderDate, hours), minutes);
    return {
      title: `${titlePrefix} – Promemoria (T${daysBefore})`,
      kind: "promemoria" as const,
      dueAt: at,
      status: "pending" as const,
      priority: 0,
      ruleId,
      ruleParams: { ...ruleParams, daysBefore },
      explanation: `Promemoria ${Math.abs(daysBefore)} giorni prima della scadenza (${at.toLocaleDateString("it-IT")} alle ${timeStr})`,
      createdBy: "automatico" as const,
    };
  });
}

const REMINDER_OFFSETS_STANDARD = [-7, -1];
const REMINDER_OFFSETS_LONG = [-30, -7, -1];
const REMINDER_OFFSETS_TRIBUTARIO = [-15, -7, -1];

export const attoGiuridicoRule: RuleDefinition = {
  id: "atto-giuridico",
  label: "Atto giuridico (termini e promemoria)",
  run(input) {
    const event = input.event;
    const settings = input.settings;
    const inputs = (event.inputs ?? input.userSelections ?? {}) as Record<string, unknown>;
    const actionType = (event.actionType ?? inputs.actionType) as string | undefined;
    const actionMode = (event.actionMode ?? inputs.actionMode) as string | undefined;

    if (!actionType || !actionMode) return { subEvents: [] };

    const reminderOffsets = settings.defaultReminderOffsetsAtto ?? [-30, -7, -1];

    const out: SubEventCandidate[] = [];

    // ---- CITAZIONE ----
    if (actionType === "CITAZIONE" && actionMode === "DA_NOTIFICARE") {
      const dataUdienza = inputs.dataUdienzaComparizione as string | undefined;
      const notificaEstero = (inputs.notificaEstero as boolean) ?? settings.notificaEsteroDefault ?? false;
      const giorni = notificaEstero
        ? (settings.termineComparizioneCitazioneEstero ?? 150)
        : (settings.termineComparizioneCitazioneItalia ?? 120);
      if (dataUdienza) {
        const udienza = new Date(dataUdienza);
        const ultimoGiorno = addDays(udienza, -giorni);
        const dueAt = toDeadlineTime(ultimoGiorno, settings);
        out.push({
          title: "Ultimo giorno per notificare citazione",
          kind: "termine",
          dueAt,
          status: "pending",
          priority: 1,
          ruleId: "atto-giuridico",
          ruleParams: { actionType, actionMode, giorni, notificaEstero },
          explanation: `Termine a comparire: tra notifica citazione e udienza devono intercorrere almeno ${giorni} giorni (${notificaEstero ? "estero" : "Italia"}) → ultima notifica = Udienza − ${giorni} giorni (art. 163-bis c.p.c. e ss.).`,
          createdBy: "automatico",
        });
        out.push(...addReminders("Notifica citazione", dueAt, settings, "atto-giuridico", { actionType, actionMode }, reminderOffsets));
      }
    }

    if (actionType === "CITAZIONE" && actionMode === "COSTITUZIONE") {
      const dataNotifica = inputs.dataNotificaCitazione as string | undefined;
      if (dataNotifica) {
        const costituzione = addDays(new Date(dataNotifica), 10);
        const dueAt = toDeadlineTime(costituzione, settings);
        out.push({
          title: "Costituzione attore",
          kind: "termine",
          dueAt,
          status: "pending",
          priority: 1,
          ruleId: "atto-giuridico",
          ruleParams: { actionType, actionMode },
          explanation: "Costituzione attore entro 10 giorni dalla notificazione della citazione (art. 165 c.p.c.).",
          createdBy: "automatico",
        });
        out.push(...addReminders("Costituzione attore", dueAt, settings, "atto-giuridico", { actionType, actionMode }, REMINDER_OFFSETS_STANDARD));
      }
      const dataUdienza = inputs.dataUdienzaComparizione as string | undefined;
      if (dataUdienza) {
        const termineConvenuto = addDays(new Date(dataUdienza), -70);
        const dueAt = toDeadlineTime(termineConvenuto, settings);
        out.push({
          title: "Termine costituzione convenuto (indicazione)",
          kind: "termine",
          dueAt,
          status: "pending",
          priority: 0,
          ruleId: "atto-giuridico",
          ruleParams: { actionType, actionMode, info: "convenuto" },
          explanation: "Invito a costituirsi nel termine di 70 giorni prima dell'udienza (richiamo nel contenuto dell'atto di citazione).",
          createdBy: "automatico",
        });
      }
    }

    // ---- RICORSO OPPOSIZIONE ----
    if (actionType === "RICORSO_OPPOSIZIONE" && actionMode === "DA_NOTIFICARE") {
      const dataNotifica = inputs.dataNotificaDecretoIngiuntivo as string | undefined;
      if (dataNotifica) {
        const ultimoGiorno = addDays(new Date(dataNotifica), 40);
        const dueAt = toDeadlineTime(ultimoGiorno, settings);
        out.push({
          title: "Ultimo giorno per proporre/notificare opposizione",
          kind: "termine",
          dueAt,
          status: "pending",
          priority: 1,
          ruleId: "atto-giuridico",
          ruleParams: { actionType, actionMode },
          explanation: "Opposizione entro 40 giorni dalla notifica del decreto ingiuntivo (termine ordinario, art. 645 c.p.c.).",
          createdBy: "automatico",
        });
        out.push(...addReminders("Opposizione", dueAt, settings, "atto-giuridico", { actionType, actionMode }, REMINDER_OFFSETS_STANDARD));
      }
      const dataUdienza = inputs.dataUdienzaOpposizione as string | undefined;
      if (dataUdienza) {
        const costituzione = addDays(new Date(dataUdienza), -10);
        const dueAt = toDeadlineTime(costituzione, settings);
        out.push({
          title: "Costituzione opposto",
          kind: "termine",
          dueAt,
          status: "pending",
          priority: 1,
          ruleId: "atto-giuridico",
          ruleParams: { actionType, actionMode },
          explanation: "Nel giudizio di opposizione il giudice assegna termine per la costituzione del convenuto sino a 10 giorni prima dell'udienza (art. 645 c.p.c.).",
          createdBy: "automatico",
        });
        out.push(...addReminders("Costituzione opposto", dueAt, settings, "atto-giuridico", { actionType, actionMode }, REMINDER_OFFSETS_STANDARD));
      }
    }

    if (actionType === "RICORSO_OPPOSIZIONE" && actionMode === "COSTITUZIONE") {
      const dataNotifica = inputs.dataNotificaAttoOpposizione as string | undefined;
      if (dataNotifica) {
        const costituzione = addDays(new Date(dataNotifica), 10);
        const dueAt = toDeadlineTime(costituzione, settings);
        out.push({
          title: "Costituzione opponente",
          kind: "termine",
          dueAt,
          status: "pending",
          priority: 1,
          ruleId: "atto-giuridico",
          ruleParams: { actionType, actionMode },
          explanation: "Costituzione (opponente/attore) entro 10 giorni dalla notifica dell'atto introduttivo (art. 165 c.p.c.).",
          createdBy: "automatico",
        });
        out.push(...addReminders("Costituzione opponente", dueAt, settings, "atto-giuridico", { actionType, actionMode }, REMINDER_OFFSETS_STANDARD));
      }
    }

    // ---- RICORSO TRIBUTARIO ----
    if (actionType === "RICORSO_TRIBUTARIO" && actionMode === "DA_NOTIFICARE") {
      const dataNotifica = inputs.dataNotificaAttoImpugnato as string | undefined;
      if (dataNotifica) {
        const ultimoGiorno = addDays(new Date(dataNotifica), 60);
        const dueAt = toDeadlineTime(ultimoGiorno, settings);
        out.push({
          title: "Ultimo giorno per notificare/proporre ricorso",
          kind: "termine",
          dueAt,
          status: "pending",
          priority: 1,
          ruleId: "atto-giuridico",
          ruleParams: { actionType, actionMode },
          explanation: "Ricorso entro 60 giorni dalla notifica dell'atto impugnato (art. 21 D.Lgs. 546/1992).",
          createdBy: "automatico",
        });
        out.push(...addReminders("Ricorso tributario", dueAt, settings, "atto-giuridico", { actionType, actionMode }, REMINDER_OFFSETS_TRIBUTARIO));
      }
    }

    if (actionType === "RICORSO_TRIBUTARIO" && actionMode === "COSTITUZIONE") {
      const dataProposizione = inputs.dataProposizioneRicorso as string | undefined;
      if (dataProposizione) {
        const costituzione = addDays(new Date(dataProposizione), 30);
        const dueAt = toDeadlineTime(costituzione, settings);
        out.push({
          title: "Costituzione ricorrente (deposito)",
          kind: "termine",
          dueAt,
          status: "pending",
          priority: 1,
          ruleId: "atto-giuridico",
          ruleParams: { actionType, actionMode },
          explanation: "Costituzione ricorrente entro 30 giorni dalla proposizione del ricorso (art. 22 D.Lgs. 546/1992).",
          createdBy: "automatico",
        });
        out.push(...addReminders("Costituzione ricorrente", dueAt, settings, "atto-giuridico", { actionType, actionMode }, REMINDER_OFFSETS_STANDARD));
      }
      const dataNotificaRicorso = inputs.dataNotificaRicorso as string | undefined;
      if (dataNotificaRicorso) {
        const costituzioneResistente = addDays(new Date(dataNotificaRicorso), 60);
        const dueAt = toDeadlineTime(costituzioneResistente, settings);
        out.push({
          title: "Costituzione resistente (indicativa)",
          kind: "termine",
          dueAt,
          status: "pending",
          priority: 0,
          ruleId: "atto-giuridico",
          ruleParams: { actionType, actionMode },
          explanation: "Costituzione resistente entro 60 giorni dalla notifica del ricorso (regola informativa).",
          createdBy: "automatico",
        });
      }
    }

    // ---- APPELLO CIVILE ----
    if (actionType === "APPELLO_CIVILE" && actionMode === "DA_NOTIFICARE") {
      const scelta = inputs.sceltaTermineImpugnazione as string | undefined;
      if (scelta === "BREVE") {
        const dataNotifica = inputs.dataNotificaSentenza as string | undefined;
        if (dataNotifica) {
          const ultimoGiorno = addDays(new Date(dataNotifica), 30);
          const dueAt = toDeadlineTime(ultimoGiorno, settings);
          out.push({
            title: "Ultimo giorno per notificare appello",
            kind: "termine",
            dueAt,
            status: "pending",
            priority: 1,
            ruleId: "atto-giuridico",
            ruleParams: { actionType, actionMode, scelta },
            explanation: "Termine breve per appello: 30 giorni dalla notificazione della sentenza (art. 325 c.p.c.).",
            createdBy: "automatico",
          });
          out.push(...addReminders("Appello", dueAt, settings, "atto-giuridico", { actionType, actionMode }, REMINDER_OFFSETS_LONG));
        }
      } else if (scelta === "LUNGO") {
        const dataPubb = inputs.dataPubblicazioneSentenza as string | undefined;
        if (dataPubb) {
          const ultimoGiorno = addDays(new Date(dataPubb), 180); // 6 mesi
          const dueAt = toDeadlineTime(ultimoGiorno, settings);
          out.push({
            title: "Ultimo giorno per notificare appello (termine lungo)",
            kind: "termine",
            dueAt,
            status: "pending",
            priority: 1,
            ruleId: "atto-giuridico",
            ruleParams: { actionType, actionMode, scelta },
            explanation: "Termine lungo: 6 mesi dalla pubblicazione (art. 327 c.p.c.).",
            createdBy: "automatico",
          });
          out.push(...addReminders("Appello", dueAt, settings, "atto-giuridico", { actionType, actionMode }, REMINDER_OFFSETS_LONG));
        }
      }
    }

    if (actionType === "APPELLO_CIVILE" && actionMode === "COSTITUZIONE") {
      const dataNotifica = inputs.dataNotificaAttoAppello as string | undefined;
      if (dataNotifica) {
        const costituzione = addDays(new Date(dataNotifica), 10);
        const dueAt = toDeadlineTime(costituzione, settings);
        out.push({
          title: "Costituzione appellante",
          kind: "termine",
          dueAt,
          status: "pending",
          priority: 1,
          ruleId: "atto-giuridico",
          ruleParams: { actionType, actionMode },
          explanation: "Costituzione appellante secondo forme/termini dei procedimenti davanti al tribunale (art. 347 c.p.c.) → 10 giorni dalla notifica (art. 165 c.p.c.).",
          createdBy: "automatico",
        });
        out.push(...addReminders("Costituzione appellante", dueAt, settings, "atto-giuridico", { actionType, actionMode }, REMINDER_OFFSETS_STANDARD));
      }
    }

    // ---- APPELLO TRIBUTARIO ----
    if (actionType === "APPELLO_TRIBUTARIO" && actionMode === "DA_NOTIFICARE") {
      const scelta = inputs.sceltaTermineImpugnazione as string | undefined;
      if (scelta === "BREVE") {
        const dataNotifica = inputs.dataNotificaSentenzaTributaria as string | undefined;
        if (dataNotifica) {
          const ultimoGiorno = addDays(new Date(dataNotifica), 60);
          const dueAt = toDeadlineTime(ultimoGiorno, settings);
          out.push({
            title: "Ultimo giorno per proporre/notificare appello tributario",
            kind: "termine",
            dueAt,
            status: "pending",
            priority: 1,
            ruleId: "atto-giuridico",
            ruleParams: { actionType, actionMode, scelta },
            explanation: "Appello tributario: 60 giorni dalla notificazione della sentenza (termine breve).",
            createdBy: "automatico",
          });
          out.push(...addReminders("Appello tributario", dueAt, settings, "atto-giuridico", { actionType, actionMode }, REMINDER_OFFSETS_LONG));
        }
      } else if (scelta === "LUNGO") {
        const dataPubb = inputs.dataPubblicazioneSentenzaTributaria as string | undefined;
        if (dataPubb) {
          const ultimoGiorno = addDays(new Date(dataPubb), 180);
          const dueAt = toDeadlineTime(ultimoGiorno, settings);
          out.push({
            title: "Ultimo giorno appello tributario (termine lungo)",
            kind: "termine",
            dueAt,
            status: "pending",
            priority: 1,
            ruleId: "atto-giuridico",
            ruleParams: { actionType, actionMode, scelta },
            explanation: "In assenza di notifica: 6 mesi dalla pubblicazione (termine lungo ex art. 327 c.p.c.).",
            createdBy: "automatico",
          });
          out.push(...addReminders("Appello tributario", dueAt, settings, "atto-giuridico", { actionType, actionMode }, REMINDER_OFFSETS_LONG));
        }
      }
    }

    if (actionType === "APPELLO_TRIBUTARIO" && actionMode === "COSTITUZIONE") {
      const dataNotifica = inputs.dataNotificaAppelloTributario as string | undefined;
      if (dataNotifica) {
        const costituzione = addDays(new Date(dataNotifica), 30);
        const dueAt = toDeadlineTime(costituzione, settings);
        out.push({
          title: "Deposito/Costituzione appellante",
          kind: "termine",
          dueAt,
          status: "pending",
          priority: 1,
          ruleId: "atto-giuridico",
          ruleParams: { actionType, actionMode },
          explanation: "Appellante: deposito entro 30 giorni dalla notifica dell'appello.",
          createdBy: "automatico",
        });
        out.push(...addReminders("Costituzione appellante", dueAt, settings, "atto-giuridico", { actionType, actionMode }, REMINDER_OFFSETS_STANDARD));
      }
      const dataNotifica2 = inputs.dataNotificaAppelloTributario as string | undefined;
      if (dataNotifica2) {
        const costituzioneAppellato = addDays(new Date(dataNotifica2), 60);
        const dueAt = toDeadlineTime(costituzioneAppellato, settings);
        out.push({
          title: "Costituzione appellato",
          kind: "termine",
          dueAt,
          status: "pending",
          priority: 0,
          ruleId: "atto-giuridico",
          ruleParams: { actionType, actionMode },
          explanation: "Appellato: controdeduzioni/costituzione entro 60 giorni dalla notifica dell'appello.",
          createdBy: "automatico",
        });
        out.push(...addReminders("Costituzione appellato", dueAt, settings, "atto-giuridico", { actionType, actionMode }, REMINDER_OFFSETS_TRIBUTARIO));
      }
    }

    // ---- RICORSO CASSAZIONE ----
    if (actionType === "RICORSO_CASSAZIONE" && actionMode === "DA_NOTIFICARE") {
      const scelta = inputs.sceltaTermineImpugnazione as string | undefined;
      if (scelta === "BREVE") {
        const dataNotifica = inputs.dataNotificaSentenza as string | undefined;
        if (dataNotifica) {
          const ultimoGiorno = addDays(new Date(dataNotifica), 60);
          const dueAt = toDeadlineTime(ultimoGiorno, settings);
          out.push({
            title: "Ultimo giorno per notificare ricorso per cassazione",
            kind: "termine",
            dueAt,
            status: "pending",
            priority: 1,
            ruleId: "atto-giuridico",
            ruleParams: { actionType, actionMode, scelta },
            explanation: "Ricorso per cassazione: termine breve 60 giorni dalla notificazione (art. 325 c.p.c.).",
            createdBy: "automatico",
          });
          out.push(...addReminders("Ricorso Cassazione", dueAt, settings, "atto-giuridico", { actionType, actionMode }, REMINDER_OFFSETS_LONG));
        }
      } else if (scelta === "LUNGO") {
        const dataPubb = inputs.dataPubblicazioneSentenza as string | undefined;
        if (dataPubb) {
          const ultimoGiorno = addDays(new Date(dataPubb), 180);
          const dueAt = toDeadlineTime(ultimoGiorno, settings);
          out.push({
            title: "Ultimo giorno ricorso per cassazione (termine lungo)",
            kind: "termine",
            dueAt,
            status: "pending",
            priority: 1,
            ruleId: "atto-giuridico",
            ruleParams: { actionType, actionMode, scelta },
            explanation: "Termine lungo: 6 mesi dalla pubblicazione (art. 327 c.p.c.).",
            createdBy: "automatico",
          });
          out.push(...addReminders("Ricorso Cassazione", dueAt, settings, "atto-giuridico", { actionType, actionMode }, REMINDER_OFFSETS_LONG));
        }
      }
    }

    if (actionType === "RICORSO_CASSAZIONE" && actionMode === "COSTITUZIONE") {
      const dataUltima = inputs.dataUltimaNotificaRicorsoCassazione as string | undefined;
      if (dataUltima) {
        const deposito = addDays(new Date(dataUltima), 20);
        const dueAt = toDeadlineTime(deposito, settings);
        out.push({
          title: "Deposito ricorso in Cassazione",
          kind: "termine",
          dueAt,
          status: "pending",
          priority: 1,
          ruleId: "atto-giuridico",
          ruleParams: { actionType, actionMode },
          explanation: "Deposito del ricorso entro 20 giorni dall'ultima notificazione (art. 369 c.p.c.).",
          createdBy: "automatico",
        });
        out.push(...addReminders("Deposito ricorso Cassazione", dueAt, settings, "atto-giuridico", { actionType, actionMode }, REMINDER_OFFSETS_STANDARD));
      }
    }

    return { subEvents: out };
  },
};
