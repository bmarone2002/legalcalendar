/**
 * RINVIO DI UDIENZA: tipi predefiniti, adempimenti suggeriti e interfacce
 * per la prosecuzione del giudizio dopo l'atto iniziale.
 */

// ── Tipi di udienza ─────────────────────────────────────────────────

export const TIPI_UDIENZA = [
  "TRATTAZIONE",
  "PRIMA_COMPARIZIONE",
  "PROVA_TESTIMONIALE",
  "INTERROGATORIO_FORMALE",
  "GIURAMENTO_CTU",
  "CHIARIMENTI_CTU",
  "PRECISAZIONE_CONCLUSIONI",
  "DISCUSSIONE_ORALE",
  "TENTATIVO_CONCILIAZIONE",
  "COMPARIZIONE_PERSONALE",
  "ALTRO",
] as const;

export type TipoUdienza = (typeof TIPI_UDIENZA)[number];

export const TIPO_UDIENZA_LABELS: Record<TipoUdienza, string> = {
  TRATTAZIONE: "Trattazione",
  PRIMA_COMPARIZIONE: "Prima comparizione",
  PROVA_TESTIMONIALE: "Prova testimoniale",
  INTERROGATORIO_FORMALE: "Interrogatorio formale",
  GIURAMENTO_CTU: "Giuramento CTU",
  CHIARIMENTI_CTU: "Chiarimenti CTU",
  PRECISAZIONE_CONCLUSIONI: "Precisazione delle conclusioni",
  DISCUSSIONE_ORALE: "Discussione orale",
  TENTATIVO_CONCILIAZIONE: "Tentativo di conciliazione",
  COMPARIZIONE_PERSONALE: "Comparizione personale delle parti",
  ALTRO: "Altro (specificare)",
};

// ── Adempimenti suggeriti ───────────────────────────────────────────

export const ADEMPIMENTI_SUGGERITI = [
  "DEPOSITO_MEMORIE",
  "DEPOSITO_DOCUMENTI",
  "DEPOSITO_LISTA_TESTI",
  "CITAZIONE_TESTIMONI",
  "DEPOSITO_RELAZIONE_CTU",
  "OSSERVAZIONI_CTU",
  "NOTE_TRATTAZIONE_SCRITTA",
  "COMPARSA_CONCLUSIONALE",
  "MEMORIE_REPLICA",
  "ALTRO",
] as const;

export type AdempimentoSuggerito = (typeof ADEMPIMENTI_SUGGERITI)[number];

export const ADEMPIMENTO_SUGGERITO_LABELS: Record<AdempimentoSuggerito, string> = {
  DEPOSITO_MEMORIE: "Deposito memorie",
  DEPOSITO_DOCUMENTI: "Deposito documenti",
  DEPOSITO_LISTA_TESTI: "Deposito lista testi",
  CITAZIONE_TESTIMONI: "Citazione testimoni (art. 250 c.p.c.)",
  DEPOSITO_RELAZIONE_CTU: "Deposito relazione CTU",
  OSSERVAZIONI_CTU: "Osservazioni alla CTU",
  NOTE_TRATTAZIONE_SCRITTA: "Note di trattazione scritta",
  COMPARSA_CONCLUSIONALE: "Comparsa conclusionale",
  MEMORIE_REPLICA: "Memorie di replica",
  ALTRO: "Altro (specificare)",
};

// ── Interfacce dati ─────────────────────────────────────────────────

export const DEFAULT_GIORNI_ALERT = 5;
export const DEFAULT_GIORNI_ALERT_UDIENZA = 3;

export interface Adempimento {
  id: string;
  titolo: string;
  scadenza: string; // ISO date (yyyy-MM-dd)
  giorniAlert: number;
  note?: string;
}

export interface Rinvio {
  id: string;
  parentEventId: string;
  numero: number;
  dataUdienza: Date;
  tipoUdienza: string;
  tipoUdienzaCustom?: string | null;
  note?: string | null;
  adempimenti: Adempimento[];
  /**
   * Promemoria udienza (giorni prima) ricostruiti dai sottoeventi già presenti.
   * Non viene persistito in una colonna dedicata.
   */
  reminderOffsets?: number[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateRinvioInput {
  parentEventId: string;
  dataUdienza: Date;
  tipoUdienza: string;
  tipoUdienzaCustom?: string | null;
  note?: string | null;
  adempimenti: Adempimento[];
  /**
   * Evento/fase selezionata dalla tabella (code di EventoDisponibile),
   * già filtrata per macroArea/procedimento/parte processuale dell'evento madre.
   * Non è persistita come colonna dedicata ma usata per pilotare il motore regole.
   */
  eventoCode?: string | null;
  /**
   * Promemoria personalizzati per l'udienza di rinvio (in giorni prima).
   * Se vuoto o assente, non viene creato alcun promemoria automatico sull'udienza.
   */
  reminderOffsets?: number[];
}

export interface UpdateRinvioInput {
  dataUdienza?: Date;
  tipoUdienza?: string;
  tipoUdienzaCustom?: string | null;
  note?: string | null;
  adempimenti?: Adempimento[];
  reminderOffsets?: number[];
}
