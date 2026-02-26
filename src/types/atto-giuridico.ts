/**
 * ATTO GIURIDICO: macro-tipo con sottocategorie, modalità e inputs per il rule engine.
 * Ogni combinazione (actionType + actionMode) definisce campi richiesti e sottoeventi.
 */

export const ACTION_TYPES = [
  "CITAZIONE",
  "RICORSO_OPPOSIZIONE",
  "RICORSO_TRIBUTARIO",
  "APPELLO_CIVILE",
  "APPELLO_TRIBUTARIO",
  "RICORSO_CASSAZIONE",
] as const;

export type ActionType = (typeof ACTION_TYPES)[number];

export const ACTION_MODES = ["COSTITUZIONE", "DA_NOTIFICARE"] as const;
export type ActionMode = (typeof ACTION_MODES)[number];

export const SCELTA_TERMINE_IMPUGNAZIONE = ["BREVE", "LUNGO"] as const;
export type SceltaTermineImpugnazione = (typeof SCELTA_TERMINE_IMPUGNAZIONE)[number];

// ---------- Memoria libera (campo note con scadenza custom) ----------

export interface MemoriaLibera {
  titolo: string;
  scadenza: string; // ISO date
}

// ---------- Inputs per combinazione (campi richiesti in modale) ----------

/** CITAZIONE - DA NOTIFICARE (ATTORE: Notifica Citazione) */
export interface CitazioneDaNotificareInputs {
  dataNotifica: string; // ISO Date – data notifica citazione
  dataUdienzaComparizione: string; // ISO DateTime – data udienza (>= notifica + 120gg)
  dataUdienzaRiferimentoMemorie?: string; // ISO Date – per memorie 171 ter (default = udienza, editabile)
  notificaEstero: boolean;
  memorieLibere?: MemoriaLibera[];
}

/** CITAZIONE - COSTITUZIONE (CONVENUTO: Costituzione) */
export interface CitazioneCostituzioneInputs {
  dataNotificaCitazione: string; // ISO Date
  dataUdienzaComparizione?: string; // ISO DateTime – per termine costituzione e memorie
  dataUdienzaRiferimentoMemorie?: string; // ISO Date – per memorie 171 ter (editabile)
  memorieLibere?: MemoriaLibera[];
}

/** RICORSO OPPOSIZIONE - DA NOTIFICARE (RICORRENTE: Notifica Opposizione) */
export interface RicorsoOpposizioneDaNotificareInputs {
  dataNotificaDecretoIngiuntivo: string;
  giorniOpposizione?: number; // giorni per opposizione (campo aperto)
  giorniIscrizioneRuolo?: number; // giorni iscrizione a ruolo (campo aperto)
  dataUdienzaOpposizione?: string; // opzionale
  memorieLibere?: MemoriaLibera[];
}

/** RICORSO OPPOSIZIONE - COSTITUZIONE (OPPOSTO: Costituzione in Giudizio) */
export interface RicorsoOpposizioneCostituzioneInputs {
  dataUdienza: string; // ISO Date – data udienza fissata
  giorniCostituzione?: number; // giorni per costituzione (campo aperto)
  memorieLibere?: MemoriaLibera[];
}

/** RICORSO TRIBUTARIO - DA NOTIFICARE (RICORRENTE: Notificare Ricorso) */
export interface RicorsoTributarioDaNotificareInputs {
  dataNotificaAttoImpugnato: string;
  dataNotificaRicorso?: string; // per iscrizione a ruolo (30gg dalla notifica)
  dataUdienza?: string; // per memorie (inserita manualmente dopo comunicazione giudice)
  memorieLibere?: MemoriaLibera[];
}

/** RICORSO TRIBUTARIO - COSTITUZIONE (ENTE OPPOSTO: Costituzione) */
export interface RicorsoTributarioCostituzioneInputs {
  dataNotificaRicorso: string; // data notifica del ricorso
  dataUdienza?: string; // per memorie (inserita manualmente)
  memorieLibere?: MemoriaLibera[];
}

/** APPELLO CIVILE - DA NOTIFICARE (APPELLANTE: Notifica Appello) */
export interface AppelloCivileDaNotificareInputs {
  sceltaTermineImpugnazione: SceltaTermineImpugnazione;
  dataNotificaSentenza?: string;   // se BREVE
  dataPubblicazioneSentenza?: string; // se LUNGO
  dataNotificaAppello?: string; // per iscrizione a ruolo (10gg)
  memorieLibere?: MemoriaLibera[];
}

/** APPELLO CIVILE - COSTITUZIONE (APPELLATO: Costituzione) */
export interface AppelloCivileCostituzioneInputs {
  dataUdienza: string; // ISO Date – data udienza
  memorieLibere?: MemoriaLibera[];
}

/** APPELLO TRIBUTARIO - DA NOTIFICARE (APPELLANTE: Notifica Appello) */
export interface AppelloTributarioDaNotificareInputs {
  sceltaTermineImpugnazione: SceltaTermineImpugnazione;
  dataNotificaSentenzaTributaria?: string;
  dataPubblicazioneSentenzaTributaria?: string;
  dataNotificaAppello?: string; // per iscrizione a ruolo (30gg)
  dataUdienza?: string; // per memorie (inserita manualmente)
  memorieLibere?: MemoriaLibera[];
}

/** APPELLO TRIBUTARIO - COSTITUZIONE (APPELLATO: Costituzione) */
export interface AppelloTributarioCostituzioneInputs {
  dataNotificaRicorso: string; // data notifica ricorso/appello
  dataUdienza?: string; // per memorie
  memorieLibere?: MemoriaLibera[];
}

/** RICORSO CASSAZIONE - DA NOTIFICARE (RICORRENTE: Notifica Ricorso) */
export interface RicorsoCassazioneDaNotificareInputs {
  sceltaTermineImpugnazione: SceltaTermineImpugnazione;
  dataNotificaSentenza?: string;
  dataPubblicazioneSentenza?: string;
  dataNotificaRicorso?: string; // per iscrizione a ruolo (20gg)
  dataUdienza?: string; // per memorie (inserita manualmente)
  memorieLibere?: MemoriaLibera[];
}

/** RICORSO CASSAZIONE - COSTITUZIONE (CONTRORICORRENTE: Costituzione) */
export interface RicorsoCassazioneCostituzioneInputs {
  dataNotificaRicorso: string; // data notifica del ricorso per cassazione
  dataUdienza?: string; // per memorie
  memorieLibere?: MemoriaLibera[];
}

/** Union di tutti gli input possibili (per tipo/modalità) */
export type AttoGiuridicoInputs =
  | CitazioneDaNotificareInputs
  | CitazioneCostituzioneInputs
  | RicorsoOpposizioneDaNotificareInputs
  | RicorsoOpposizioneCostituzioneInputs
  | RicorsoTributarioDaNotificareInputs
  | RicorsoTributarioCostituzioneInputs
  | AppelloCivileDaNotificareInputs
  | AppelloCivileCostituzioneInputs
  | AppelloTributarioDaNotificareInputs
  | AppelloTributarioCostituzioneInputs
  | RicorsoCassazioneDaNotificareInputs
  | RicorsoCassazioneCostituzioneInputs;

/** Per la modale: inputs come record generico (date come stringhe ISO) */
export type AttoGiuridicoInputsRecord = Record<string, unknown>;

export const ACTION_TYPE_LABELS: Record<ActionType, string> = {
  CITAZIONE: "Citazione",
  RICORSO_OPPOSIZIONE: "Ricorso in opposizione (decreto ingiuntivo)",
  RICORSO_TRIBUTARIO: "Ricorso tributario (primo grado)",
  APPELLO_CIVILE: "Appello civile",
  APPELLO_TRIBUTARIO: "Appello tributario",
  RICORSO_CASSAZIONE: "Ricorso Cassazione (civile)",
};

export const ACTION_MODE_LABELS: Record<ActionMode, string> = {
  COSTITUZIONE: "Costituzione",
  DA_NOTIFICARE: "Da notificare",
};
