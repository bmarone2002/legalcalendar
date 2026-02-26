/**
 * Rule: ATTO_GIURIDICO
 * Genera termini (scadenze) e promemoria in base a actionType + actionMode + inputs.
 * Ogni sottoevento ha explanation (audit) con formula e fonte normativa.
 *
 * Gestisce:
 * - Promemoria specifici per ogni sotto-evento (non generici)
 * - Festivi / weekend → slitta al primo giorno lavorativo (art. 155 c.p.c.)
 * - Sospensione feriale 1-31 agosto (L. 742/1969)
 * - Slot orari anti-accavallamento (12:00, poi 13:00, 14:00, …)
 * - Memorie libere con alert a -5 gg
 */

import type { RuleDefinition, SubEventCandidate } from "../types";
import type { AppSettings } from "../types";
import { addDays } from "date-fns";
import {
  adjustToNextBusinessDay,
  applyDeadlineTime,
  assignTimeSlots,
} from "@/lib/date-utils";
import type { MemoriaLibera } from "@/types/atto-giuridico";

// ── Helpers ─────────────────────────────────────────────────────────

function termineDate(base: Date, days: number, settings: AppSettings): Date {
  const raw = addDays(base, days);
  return adjustToNextBusinessDay(raw, settings);
}

function makeTermine(
  title: string,
  base: Date,
  days: number,
  settings: AppSettings,
  explanation: string,
  priority = 1
): SubEventCandidate {
  const dueAt = applyDeadlineTime(termineDate(base, days, settings), settings);
  return {
    title,
    kind: "termine",
    dueAt,
    status: "pending",
    priority,
    ruleId: "atto-giuridico",
    ruleParams: {},
    explanation,
    createdBy: "automatico",
  };
}

function makeTermineFromDate(
  title: string,
  deadlineDate: Date,
  settings: AppSettings,
  explanation: string,
  priority = 1
): SubEventCandidate {
  const adjusted = adjustToNextBusinessDay(deadlineDate, settings);
  const dueAt = applyDeadlineTime(adjusted, settings);
  return {
    title,
    kind: "termine",
    dueAt,
    status: "pending",
    priority,
    ruleId: "atto-giuridico",
    ruleParams: {},
    explanation,
    createdBy: "automatico",
  };
}

function addReminders(
  titlePrefix: string,
  scadenzaDate: Date,
  settings: AppSettings,
  offsets: number[]
): SubEventCandidate[] {
  return offsets.map((daysBefore) => {
    const raw = addDays(scadenzaDate, daysBefore);
    const adjusted = adjustToNextBusinessDay(raw, settings);
    const at = applyDeadlineTime(adjusted, settings);
    return {
      title: `${titlePrefix} – Promemoria (${Math.abs(daysBefore)} gg prima)`,
      kind: "promemoria" as const,
      dueAt: at,
      status: "pending" as const,
      priority: 0,
      ruleId: "atto-giuridico",
      ruleParams: { daysBefore },
      explanation: `Promemoria ${Math.abs(daysBefore)} giorni prima della scadenza`,
      createdBy: "automatico" as const,
    };
  });
}

function addMemorie171ter(
  udienza: Date,
  settings: AppSettings
): SubEventCandidate[] {
  const out: SubEventCandidate[] = [];
  const offsets: Array<{ days: number; label: string }> = [
    { days: -40, label: "1ª Memoria 171 ter c.p.c. (40 gg prima udienza)" },
    { days: -20, label: "2ª Memoria 171 ter c.p.c. (20 gg prima udienza)" },
    { days: -10, label: "3ª Memoria 171 ter c.p.c. (10 gg prima udienza)" },
  ];
  for (const o of offsets) {
    const termine = makeTermine(
      o.label,
      udienza,
      o.days,
      settings,
      `${o.label} – art. 171 ter c.p.c.`
    );
    out.push(termine);
    out.push(...addReminders(o.label, termine.dueAt, settings, [-5]));
  }
  return out;
}

function addMemorieUdienza(
  udienza: Date,
  settings: AppSettings,
  daysBefore: number[],
  reminderOffsets: number[]
): SubEventCandidate[] {
  const out: SubEventCandidate[] = [];
  for (const days of daysBefore) {
    const label = `Memoria (${Math.abs(days)} gg prima udienza)`;
    const termine = makeTermine(
      label,
      udienza,
      -days,
      settings,
      `Deposito memorie entro ${Math.abs(days)} giorni prima dell'udienza`
    );
    out.push(termine);
    out.push(...addReminders(label, termine.dueAt, settings, reminderOffsets));
  }
  return out;
}

function addMemorieLibere(
  inputs: Record<string, unknown>,
  settings: AppSettings
): SubEventCandidate[] {
  const memorieLibere = inputs.memorieLibere as MemoriaLibera[] | undefined;
  if (!Array.isArray(memorieLibere) || memorieLibere.length === 0) return [];

  const out: SubEventCandidate[] = [];
  for (const m of memorieLibere) {
    if (!m.scadenza || !m.titolo) continue;
    const scadenza = new Date(m.scadenza + "T12:00:00");
    if (isNaN(scadenza.getTime())) continue;

    out.push(
      makeTermineFromDate(
        m.titolo,
        scadenza,
        settings,
        `Memoria/nota libera: ${m.titolo}`
      )
    );
    out.push(...addReminders(m.titolo, scadenza, settings, [-5]));
  }
  return out;
}

// ── Rule definition ─────────────────────────────────────────────────

export const attoGiuridicoRule: RuleDefinition = {
  id: "atto-giuridico",
  label: "Atto giuridico (termini e promemoria)",
  run(input) {
    const event = input.event;
    const settings = input.settings;
    const inputs = (event.inputs ?? input.userSelections ?? {}) as Record<
      string,
      unknown
    >;
    const actionType = (event.actionType ?? inputs.actionType) as
      | string
      | undefined;
    const actionMode = (event.actionMode ?? inputs.actionMode) as
      | string
      | undefined;

    if (!actionType || !actionMode) return { subEvents: [] };

    const out: SubEventCandidate[] = [];

    // ════════════════════════════════════════════════════════════════
    // CITAZIONE
    // ════════════════════════════════════════════════════════════════

    if (actionType === "CITAZIONE" && actionMode === "DA_NOTIFICARE") {
      // ATTORE: NOTIFICA CITAZIONE
      const dataNotifica = inputs.dataNotifica as string | undefined;
      const dataUdienza = inputs.dataUdienzaComparizione as string | undefined;
      const dataRifMemorie = (inputs.dataUdienzaRiferimentoMemorie as string | undefined)
        || dataUdienza;

      if (dataNotifica) {
        const notifica = new Date(dataNotifica + "T12:00:00");

        // 1) Iscrizione a ruolo attore: 10 gg dalla notifica, alert -3
        const iscrizione = makeTermine(
          "Termine iscrizione a ruolo attore",
          notifica,
          10,
          settings,
          "Iscrizione a ruolo attore entro 10 giorni dalla notifica della citazione (art. 165 c.p.c.)"
        );
        out.push(iscrizione);
        out.push(...addReminders("Iscrizione a ruolo attore", iscrizione.dueAt, settings, [-3]));
      }

      // 2) Memorie 171 ter: 40/20/10 gg prima udienza
      if (dataRifMemorie) {
        const rifMemorie = new Date(dataRifMemorie.slice(0, 10) + "T12:00:00");
        if (!isNaN(rifMemorie.getTime())) {
          out.push(...addMemorie171ter(rifMemorie, settings));
        }
      }

      // 3) Memorie libere
      out.push(...addMemorieLibere(inputs, settings));
    }

    if (actionType === "CITAZIONE" && actionMode === "COSTITUZIONE") {
      // CONVENUTO: COSTITUZIONE
      const dataUdienza = inputs.dataUdienzaComparizione as string | undefined;
      const dataRifMemorie = (inputs.dataUdienzaRiferimentoMemorie as string | undefined)
        || dataUdienza;

      if (dataUdienza) {
        const udienza = new Date(dataUdienza.slice(0, 10) + "T12:00:00");

        // 1) Costituzione convenuto: 70 gg prima udienza, alert -10
        const costituzione = makeTermine(
          "Termine costituzione convenuto",
          udienza,
          -70,
          settings,
          "Costituzione convenuto almeno 70 giorni prima dell'udienza (art. 166 c.p.c.)"
        );
        out.push(costituzione);
        out.push(...addReminders("Costituzione convenuto", costituzione.dueAt, settings, [-10]));
      }

      // 2) Memorie 171 ter
      if (dataRifMemorie) {
        const rifMemorie = new Date(dataRifMemorie.slice(0, 10) + "T12:00:00");
        if (!isNaN(rifMemorie.getTime())) {
          out.push(...addMemorie171ter(rifMemorie, settings));
        }
      }

      // 3) Memorie libere
      out.push(...addMemorieLibere(inputs, settings));
    }

    // ════════════════════════════════════════════════════════════════
    // RICORSO OPPOSIZIONE
    // ════════════════════════════════════════════════════════════════

    if (actionType === "RICORSO_OPPOSIZIONE" && actionMode === "DA_NOTIFICARE") {
      // RICORRENTE: NOTIFICA OPPOSIZIONE
      const dataNotifica = inputs.dataNotificaDecretoIngiuntivo as string | undefined;
      const giorniOpp = (inputs.giorniOpposizione as number | undefined);
      const giorniIscr = (inputs.giorniIscrizioneRuolo as number | undefined);

      if (dataNotifica && giorniOpp) {
        const notifica = new Date(dataNotifica + "T12:00:00");

        // 1) Opposizione: entro N giorni dalla notifica
        const opposizione = makeTermine(
          "Termine per opposizione",
          notifica,
          giorniOpp,
          settings,
          `Opposizione entro ${giorniOpp} giorni dalla notifica del decreto`
        );
        out.push(opposizione);
        out.push(...addReminders("Opposizione", opposizione.dueAt, settings, [-10, -3]));
      }

      if (dataNotifica && giorniIscr) {
        const notifica = new Date(dataNotifica + "T12:00:00");

        // 2) Iscrizione a ruolo: entro N giorni dalla notifica
        const iscrizione = makeTermine(
          "Iscrizione a ruolo",
          notifica,
          giorniIscr,
          settings,
          `Iscrizione a ruolo entro ${giorniIscr} giorni dalla notifica`
        );
        out.push(iscrizione);
        out.push(...addReminders("Iscrizione a ruolo", iscrizione.dueAt, settings, [-10, -3]));
      }

      out.push(...addMemorieLibere(inputs, settings));
    }

    if (actionType === "RICORSO_OPPOSIZIONE" && actionMode === "COSTITUZIONE") {
      // OPPOSTO: COSTITUZIONE IN GIUDIZIO
      const dataUdienza = inputs.dataUdienza as string | undefined;
      const giorniCost = (inputs.giorniCostituzione as number | undefined);

      if (dataUdienza && giorniCost) {
        const udienza = new Date(dataUdienza + "T12:00:00");

        // 1) Costituzione opponente: N gg prima dell'udienza
        const costituzione = makeTermine(
          "Costituzione opponente",
          udienza,
          -giorniCost,
          settings,
          `Costituzione opponente entro ${giorniCost} giorni prima dell'udienza`
        );
        out.push(costituzione);
        out.push(...addReminders("Costituzione opponente", costituzione.dueAt, settings, [-10, -3]));
      }

      out.push(...addMemorieLibere(inputs, settings));
    }

    // ════════════════════════════════════════════════════════════════
    // RICORSO TRIBUTARIO (PRIMO GRADO)
    // ════════════════════════════════════════════════════════════════

    if (actionType === "RICORSO_TRIBUTARIO" && actionMode === "DA_NOTIFICARE") {
      // RICORRENTE: NOTIFICARE RICORSO
      const dataNotificaAtto = inputs.dataNotificaAttoImpugnato as string | undefined;
      const dataNotificaRicorso = inputs.dataNotificaRicorso as string | undefined;
      const dataUdienza = inputs.dataUdienza as string | undefined;

      if (dataNotificaAtto) {
        const notificaAtto = new Date(dataNotificaAtto + "T12:00:00");

        // 1) Ricorso: 60 gg dalla notifica atto impugnato
        const ricorso = makeTermine(
          "Ultimo giorno per notificare ricorso tributario",
          notificaAtto,
          60,
          settings,
          "Ricorso entro 60 giorni dalla notifica dell'atto impugnato (art. 21 D.Lgs. 546/1992)"
        );
        out.push(ricorso);
        out.push(...addReminders("Ricorso tributario", ricorso.dueAt, settings, [-15, -7, -1]));
      }

      if (dataNotificaRicorso) {
        const notificaRic = new Date(dataNotificaRicorso + "T12:00:00");

        // 2) Iscrizione a ruolo: 30 gg dalla notifica ricorso
        const iscrizione = makeTermine(
          "Iscrizione a ruolo ricorrente",
          notificaRic,
          30,
          settings,
          "Iscrizione a ruolo entro 30 giorni dalla notifica del ricorso (art. 22 D.Lgs. 546/1992)"
        );
        out.push(iscrizione);
        out.push(...addReminders("Iscrizione a ruolo", iscrizione.dueAt, settings, [-10, -5, -2]));
      }

      // 3) Memorie: 20 gg e 10 gg prima udienza
      if (dataUdienza) {
        const udienza = new Date(dataUdienza + "T12:00:00");
        out.push(...addMemorieUdienza(udienza, settings, [20, 10], [-5, -2]));
      }

      out.push(...addMemorieLibere(inputs, settings));
    }

    if (actionType === "RICORSO_TRIBUTARIO" && actionMode === "COSTITUZIONE") {
      // ENTE OPPOSTO: COSTITUZIONE
      const dataNotificaRicorso = inputs.dataNotificaRicorso as string | undefined;
      const dataUdienza = inputs.dataUdienza as string | undefined;

      if (dataNotificaRicorso) {
        const notificaRic = new Date(dataNotificaRicorso + "T12:00:00");

        // 1) Costituzione: 60 gg dalla notifica ricorso
        const costituzione = makeTermine(
          "Costituzione ente opposto",
          notificaRic,
          60,
          settings,
          "Costituzione entro 60 giorni dalla notifica del ricorso (art. 23 D.Lgs. 546/1992)"
        );
        out.push(costituzione);
        out.push(...addReminders("Costituzione ente opposto", costituzione.dueAt, settings, [-7, -1]));
      }

      // 2) Memorie: 20 gg e 10 gg prima udienza
      if (dataUdienza) {
        const udienza = new Date(dataUdienza + "T12:00:00");
        out.push(...addMemorieUdienza(udienza, settings, [20, 10], [-5, -2]));
      }

      out.push(...addMemorieLibere(inputs, settings));
    }

    // ════════════════════════════════════════════════════════════════
    // APPELLO CIVILE
    // ════════════════════════════════════════════════════════════════

    if (actionType === "APPELLO_CIVILE" && actionMode === "DA_NOTIFICARE") {
      // APPELLANTE: NOTIFICA APPELLO
      const scelta = inputs.sceltaTermineImpugnazione as string | undefined;

      if (scelta === "BREVE") {
        const dataNotifica = inputs.dataNotificaSentenza as string | undefined;
        if (dataNotifica) {
          const notifica = new Date(dataNotifica + "T12:00:00");
          const termine = makeTermine(
            "Ultimo giorno per notificare appello (termine breve)",
            notifica,
            30,
            settings,
            "Termine breve per appello: 30 giorni dalla notificazione della sentenza (art. 325 c.p.c.)"
          );
          out.push(termine);
          out.push(...addReminders("Appello civile", termine.dueAt, settings, [-20, -7, -3]));
        }
      } else if (scelta === "LUNGO") {
        const dataPubb = inputs.dataPubblicazioneSentenza as string | undefined;
        if (dataPubb) {
          const pubb = new Date(dataPubb + "T12:00:00");
          const termine = makeTermine(
            "Ultimo giorno per notificare appello (termine lungo)",
            pubb,
            180,
            settings,
            "Termine lungo: 6 mesi dalla pubblicazione (art. 327 c.p.c.)"
          );
          out.push(termine);
          out.push(...addReminders("Appello civile", termine.dueAt, settings, [-20, -7, -3]));
        }
      }

      // Iscrizione a ruolo: 10 gg dalla notifica appello
      const dataNotificaAppello = inputs.dataNotificaAppello as string | undefined;
      if (dataNotificaAppello) {
        const notificaApp = new Date(dataNotificaAppello + "T12:00:00");
        const iscrizione = makeTermine(
          "Termine iscrizione a ruolo appellante",
          notificaApp,
          10,
          settings,
          "Iscrizione a ruolo entro 10 giorni dalla notifica dell'appello (art. 347 c.p.c.)"
        );
        out.push(iscrizione);
        out.push(...addReminders("Iscrizione a ruolo appellante", iscrizione.dueAt, settings, [-3]));
      }

      // Memorie libere
      out.push(...addMemorieLibere(inputs, settings));
    }

    if (actionType === "APPELLO_CIVILE" && actionMode === "COSTITUZIONE") {
      // APPELLATO: COSTITUZIONE
      const dataUdienza = inputs.dataUdienza as string | undefined;

      if (dataUdienza) {
        const udienza = new Date(dataUdienza + "T12:00:00");

        // 1) Costituzione appellato: 20 gg prima udienza
        const costituzione = makeTermine(
          "Termine costituzione appellato",
          udienza,
          -20,
          settings,
          "Costituzione appellato almeno 20 giorni prima dell'udienza (art. 347 c.p.c.)"
        );
        out.push(costituzione);
        out.push(...addReminders("Costituzione appellato", costituzione.dueAt, settings, [-10, -5]));
      }

      // 2) Memorie libere
      out.push(...addMemorieLibere(inputs, settings));
    }

    // ════════════════════════════════════════════════════════════════
    // APPELLO TRIBUTARIO
    // ════════════════════════════════════════════════════════════════

    if (actionType === "APPELLO_TRIBUTARIO" && actionMode === "DA_NOTIFICARE") {
      // APPELLANTE: NOTIFICA APPELLO
      const scelta = inputs.sceltaTermineImpugnazione as string | undefined;

      if (scelta === "BREVE") {
        const dataNotifica = inputs.dataNotificaSentenzaTributaria as string | undefined;
        if (dataNotifica) {
          const notifica = new Date(dataNotifica + "T12:00:00");
          const termine = makeTermine(
            "Ultimo giorno per notificare appello tributario (termine breve)",
            notifica,
            60,
            settings,
            "Appello tributario: 60 giorni dalla notificazione della sentenza (termine breve)"
          );
          out.push(termine);
          out.push(...addReminders("Appello tributario", termine.dueAt, settings, [-20, -7, -1]));
        }
      } else if (scelta === "LUNGO") {
        const dataPubb = inputs.dataPubblicazioneSentenzaTributaria as string | undefined;
        if (dataPubb) {
          const pubb = new Date(dataPubb + "T12:00:00");
          const termine = makeTermine(
            "Ultimo giorno appello tributario (termine lungo)",
            pubb,
            180,
            settings,
            "In assenza di notifica: 6 mesi dalla pubblicazione (termine lungo ex art. 327 c.p.c.)"
          );
          out.push(termine);
          out.push(...addReminders("Appello tributario", termine.dueAt, settings, [-20, -7, -1]));
        }
      }

      // Iscrizione a ruolo: 30 gg dalla notifica appello
      const dataNotificaAppello = inputs.dataNotificaAppello as string | undefined;
      if (dataNotificaAppello) {
        const notificaApp = new Date(dataNotificaAppello + "T12:00:00");
        const iscrizione = makeTermine(
          "Iscrizione a ruolo appellante",
          notificaApp,
          30,
          settings,
          "Iscrizione a ruolo entro 30 giorni dalla notifica dell'appello"
        );
        out.push(iscrizione);
        out.push(...addReminders("Iscrizione a ruolo", iscrizione.dueAt, settings, [-10, -5, -2]));
      }

      // Memorie: 20 gg e 10 gg prima udienza
      const dataUdienza = inputs.dataUdienza as string | undefined;
      if (dataUdienza) {
        const udienza = new Date(dataUdienza + "T12:00:00");
        out.push(...addMemorieUdienza(udienza, settings, [20, 10], [-5, -2]));
      }

      out.push(...addMemorieLibere(inputs, settings));
    }

    if (actionType === "APPELLO_TRIBUTARIO" && actionMode === "COSTITUZIONE") {
      // APPELLATO: COSTITUZIONE
      const dataNotificaRicorso = inputs.dataNotificaRicorso as string | undefined;
      const dataUdienza = inputs.dataUdienza as string | undefined;

      if (dataNotificaRicorso) {
        const notificaRic = new Date(dataNotificaRicorso + "T12:00:00");

        // 1) Costituzione: 60 gg dalla notifica ricorso
        const costituzione = makeTermine(
          "Costituzione appellato",
          notificaRic,
          60,
          settings,
          "Appellato: controdeduzioni/costituzione entro 60 giorni dalla notifica dell'appello"
        );
        out.push(costituzione);
        out.push(...addReminders("Costituzione appellato", costituzione.dueAt, settings, [-7, -1]));
      }

      // 2) Memorie: 20 gg e 10 gg prima udienza
      if (dataUdienza) {
        const udienza = new Date(dataUdienza + "T12:00:00");
        out.push(...addMemorieUdienza(udienza, settings, [20, 10], [-5, -2]));
      }

      out.push(...addMemorieLibere(inputs, settings));
    }

    // ════════════════════════════════════════════════════════════════
    // RICORSO PER CASSAZIONE
    // ════════════════════════════════════════════════════════════════

    if (actionType === "RICORSO_CASSAZIONE" && actionMode === "DA_NOTIFICARE") {
      // RICORRENTE: NOTIFICA RICORSO
      const scelta = inputs.sceltaTermineImpugnazione as string | undefined;

      if (scelta === "BREVE") {
        const dataNotifica = inputs.dataNotificaSentenza as string | undefined;
        if (dataNotifica) {
          const notifica = new Date(dataNotifica + "T12:00:00");
          const termine = makeTermine(
            "Ultimo giorno per notificare ricorso per cassazione",
            notifica,
            60,
            settings,
            "Ricorso per cassazione: termine breve 60 giorni dalla notificazione (art. 325 c.p.c.)"
          );
          out.push(termine);
          out.push(...addReminders("Ricorso Cassazione", termine.dueAt, settings, [-20, -5, -2]));
        }
      } else if (scelta === "LUNGO") {
        const dataPubb = inputs.dataPubblicazioneSentenza as string | undefined;
        if (dataPubb) {
          const pubb = new Date(dataPubb + "T12:00:00");
          const termine = makeTermine(
            "Ultimo giorno ricorso per cassazione (termine lungo)",
            pubb,
            180,
            settings,
            "Termine lungo: 6 mesi dalla pubblicazione (art. 327 c.p.c.)"
          );
          out.push(termine);
          out.push(...addReminders("Ricorso Cassazione", termine.dueAt, settings, [-20, -5, -2]));
        }
      }

      // Iscrizione a ruolo: 20 gg dalla notifica ricorso
      const dataNotificaRicorso = inputs.dataNotificaRicorso as string | undefined;
      if (dataNotificaRicorso) {
        const notificaRic = new Date(dataNotificaRicorso + "T12:00:00");
        const iscrizione = makeTermine(
          "Iscrizione a ruolo ricorrente (Cassazione)",
          notificaRic,
          20,
          settings,
          "Deposito del ricorso entro 20 giorni dall'ultima notificazione (art. 369 c.p.c.)"
        );
        out.push(iscrizione);
        out.push(...addReminders("Iscrizione a ruolo Cassazione", iscrizione.dueAt, settings, [-10, -5, -2]));
      }

      // Memorie: 10 gg prima udienza
      const dataUdienza = inputs.dataUdienza as string | undefined;
      if (dataUdienza) {
        const udienza = new Date(dataUdienza + "T12:00:00");
        out.push(...addMemorieUdienza(udienza, settings, [10], [-10, -5]));
      }

      out.push(...addMemorieLibere(inputs, settings));
    }

    if (actionType === "RICORSO_CASSAZIONE" && actionMode === "COSTITUZIONE") {
      // CONTRORICORRENTE: COSTITUZIONE
      const dataNotificaRicorso = inputs.dataNotificaRicorso as string | undefined;
      const dataUdienza = inputs.dataUdienza as string | undefined;

      if (dataNotificaRicorso) {
        const notificaRic = new Date(dataNotificaRicorso + "T12:00:00");

        // 1) Costituzione: 40 gg dalla notifica ricorso
        const costituzione = makeTermine(
          "Costituzione controricorrente",
          notificaRic,
          40,
          settings,
          "Costituzione entro 40 giorni dalla notifica del ricorso (art. 370 c.p.c.)"
        );
        out.push(costituzione);
        out.push(...addReminders("Costituzione controricorrente", costituzione.dueAt, settings, [-20, -10, -5]));
      }

      // 2) Memorie: 10 gg prima udienza
      if (dataUdienza) {
        const udienza = new Date(dataUdienza + "T12:00:00");
        out.push(...addMemorieUdienza(udienza, settings, [10], [-10, -5]));
      }

      out.push(...addMemorieLibere(inputs, settings));
    }

    // ── Post-processing: slot orari anti-accavallamento ─────────
    const scheduled = assignTimeSlots(out, settings);

    return { subEvents: scheduled };
  },
};
