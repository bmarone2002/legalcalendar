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

// ---------- Inputs per combinazione (campi richiesti in modale) ----------

/** CITAZIONE - DA NOTIFICARE */
export interface CitazioneDaNotificareInputs {
  dataUdienzaComparizione: string; // ISO DateTime (evento in calendario)
  notificaEstero: boolean;
}

/** CITAZIONE - COSTITUZIONE */
export interface CitazioneCostituzioneInputs {
  dataNotificaCitazione: string; // ISO Date
  dataUdienzaComparizione?: string; // opzionale per "termine costituzione convenuto"
}

/** RICORSO OPPOSIZIONE - DA NOTIFICARE */
export interface RicorsoOpposizioneDaNotificareInputs {
  dataNotificaDecretoIngiuntivo: string;
  dataUdienzaOpposizione?: string; // opzionale
}

/** RICORSO OPPOSIZIONE - COSTITUZIONE */
export interface RicorsoOpposizioneCostituzioneInputs {
  dataNotificaAttoOpposizione: string;
}

/** RICORSO TRIBUTARIO - DA NOTIFICARE */
export interface RicorsoTributarioDaNotificareInputs {
  dataNotificaAttoImpugnato: string;
}

/** RICORSO TRIBUTARIO - COSTITUZIONE */
export interface RicorsoTributarioCostituzioneInputs {
  dataProposizioneRicorso: string;
  dataNotificaRicorso?: string; // opzionale per costituzione resistente
}

/** APPELLO CIVILE - DA NOTIFICARE */
export interface AppelloCivileDaNotificareInputs {
  sceltaTermineImpugnazione: SceltaTermineImpugnazione;
  dataNotificaSentenza?: string;   // se BREVE
  dataPubblicazioneSentenza?: string; // se LUNGO
}

/** APPELLO CIVILE - COSTITUZIONE */
export interface AppelloCivileCostituzioneInputs {
  dataNotificaAttoAppello: string;
}

/** APPELLO TRIBUTARIO - DA NOTIFICARE */
export interface AppelloTributarioDaNotificareInputs {
  sceltaTermineImpugnazione: SceltaTermineImpugnazione;
  dataNotificaSentenzaTributaria?: string;
  dataPubblicazioneSentenzaTributaria?: string;
}

/** APPELLO TRIBUTARIO - COSTITUZIONE */
export interface AppelloTributarioCostituzioneInputs {
  dataNotificaAppelloTributario: string;
}

/** RICORSO CASSAZIONE - DA NOTIFICARE */
export interface RicorsoCassazioneDaNotificareInputs {
  sceltaTermineImpugnazione: SceltaTermineImpugnazione;
  dataNotificaSentenza?: string;
  dataPubblicazioneSentenza?: string;
}

/** RICORSO CASSAZIONE - COSTITUZIONE */
export interface RicorsoCassazioneCostituzioneInputs {
  dataUltimaNotificaRicorsoCassazione: string;
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
