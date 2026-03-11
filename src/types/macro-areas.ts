/**
 * Gerarchia a 4 livelli per la creazione eventi:
 *   MACRO AREA -> PROCEDIMENTO -> PARTE PROCESSUALE -> EVENTI / SCADENZE
 *
 * Le regole sono dati (EventRule[]), non codice. Il rule engine le legge
 * e genera i sotto-eventi automaticamente.
 */

// ── Macro Aree ──────────────────────────────────────────────────────

export const MACRO_AREAS = [
  "CIVILE_CONTENZIOSO",
  "PROCEDIMENTI_SPECIALI",
  "ESECUZIONI",
  "LAVORO",
  "TRIBUTARIO",
  "CASSAZIONE",
  "STRAGIUDIZIALE",
  "AMMINISTRATIVO",
] as const;

export type MacroAreaCode = (typeof MACRO_AREAS)[number];

export const MACRO_AREA_LABELS: Record<MacroAreaCode, string> = {
  CIVILE_CONTENZIOSO: "Civile – Contenzioso ordinario",
  PROCEDIMENTI_SPECIALI: "Procedimenti speciali",
  ESECUZIONI: "Esecuzioni",
  LAVORO: "Lavoro",
  TRIBUTARIO: "Tributario",
  CASSAZIONE: "Cassazione",
  STRAGIUDIZIALE: "Stragiudiziale",
  AMMINISTRATIVO: "Amministrativo",
};

// ── Procedimenti per macro area ─────────────────────────────────────

export const PROCEDIMENTI_PER_MACRO_AREA = {
  CIVILE_CONTENZIOSO: [
    "CITAZIONE_CIVILE",
    "RICORSO_RITO_SEMPLIFICATO",
    "OPPOSIZIONE_DECRETO_INGIUNTIVO",
    "APPELLO_CIVILE",
    "RIASSUNZIONE_PROCESSO",
    "INTERRUZIONE_RIASSUNZIONE",
    "REGOLAMENTO_COMPETENZA",
  ],
  PROCEDIMENTI_SPECIALI: [
    "DECRETO_INGIUNTIVO",
    "OPPOSIZIONE_DECRETO_INGIUNTIVO_SPEC",
    "PROCEDIMENTO_CAUTELARE",
    "ATP",
    "PROCEDIMENTO_SOMMARIO",
    "CONVALIDA_SFRATTO",
  ],
  ESECUZIONI: [
    "PIGNORAMENTO_MOBILIARE",
    "PIGNORAMENTO_IMMOBILIARE",
    "PIGNORAMENTO_PRESSO_TERZI",
    "OPPOSIZIONE_ESECUZIONE",
    "OPPOSIZIONE_ATTI_ESECUTIVI",
  ],
  LAVORO: [
    "RICORSO_LAVORO",
    "APPELLO_LAVORO",
  ],
  TRIBUTARIO: [
    "RICORSO_TRIBUTARIO",
    "APPELLO_TRIBUTARIO",
  ],
  CASSAZIONE: [
    "RICORSO_CASSAZIONE",
    "CONTRORICORSO",
  ],
  STRAGIUDIZIALE: [
    "DIFFIDA",
    "MEDIAZIONE",
    "NEGOZIAZIONE_ASSISTITA",
    "TRANSAZIONE",
  ],
  AMMINISTRATIVO: [
    "RICORSO_TAR",
    "MOTIVI_AGGIUNTI",
    "RICORSO_INCIDENTALE",
    "APPELLO_CONSIGLIO_STATO",
    "REVOCAZIONE",
    "OPPOSIZIONE_TERZO",
    "OTTEMPERANZA",
  ],
} as const;

/** Union di tutti i codici procedimento */
export type ProcedimentoCode =
  (typeof PROCEDIMENTI_PER_MACRO_AREA)[MacroAreaCode][number];

export const PROCEDIMENTO_LABELS: Record<ProcedimentoCode, string> = {
  // Civile – Contenzioso ordinario
  CITAZIONE_CIVILE: "Citazione civile",
  RICORSO_RITO_SEMPLIFICATO: "Ricorso (rito semplificato)",
  OPPOSIZIONE_DECRETO_INGIUNTIVO: "Opposizione a decreto ingiuntivo",
  APPELLO_CIVILE: "Appello civile",
  RIASSUNZIONE_PROCESSO: "Riassunzione del processo",
  INTERRUZIONE_RIASSUNZIONE: "Interruzione e riassunzione",
  REGOLAMENTO_COMPETENZA: "Regolamento di competenza",
  // Procedimenti speciali
  DECRETO_INGIUNTIVO: "Decreto ingiuntivo",
  OPPOSIZIONE_DECRETO_INGIUNTIVO_SPEC: "Opposizione a decreto ingiuntivo",
  PROCEDIMENTO_CAUTELARE: "Procedimento cautelare",
  ATP: "Accertamento tecnico preventivo (ATP)",
  PROCEDIMENTO_SOMMARIO: "Procedimento sommario",
  CONVALIDA_SFRATTO: "Convalida di sfratto",
  // Esecuzioni
  PIGNORAMENTO_MOBILIARE: "Pignoramento mobiliare",
  PIGNORAMENTO_IMMOBILIARE: "Pignoramento immobiliare",
  PIGNORAMENTO_PRESSO_TERZI: "Pignoramento presso terzi",
  OPPOSIZIONE_ESECUZIONE: "Opposizione all'esecuzione",
  OPPOSIZIONE_ATTI_ESECUTIVI: "Opposizione agli atti esecutivi",
  // Lavoro
  RICORSO_LAVORO: "Ricorso lavoro",
  APPELLO_LAVORO: "Appello lavoro",
  // Tributario
  RICORSO_TRIBUTARIO: "Ricorso tributario",
  APPELLO_TRIBUTARIO: "Appello tributario",
  // Cassazione
  RICORSO_CASSAZIONE: "Ricorso per cassazione",
  CONTRORICORSO: "Controricorso",
  // Stragiudiziale
  DIFFIDA: "Diffida",
  MEDIAZIONE: "Mediazione",
  NEGOZIAZIONE_ASSISTITA: "Negoziazione assistita",
  TRANSAZIONE: "Transazione",
  // Amministrativo
  RICORSO_TAR: "Ricorso al TAR",
  MOTIVI_AGGIUNTI: "Motivi aggiunti",
  RICORSO_INCIDENTALE: "Ricorso incidentale",
  APPELLO_CONSIGLIO_STATO: "Appello al Consiglio di Stato",
  REVOCAZIONE: "Revocazione",
  OPPOSIZIONE_TERZO: "Opposizione di terzo",
  OTTEMPERANZA: "Ottemperanza",
};

// ── Parte processuale ───────────────────────────────────────────────

export const PARTI_PROCESSUALI = ["ATTORE", "CONVENUTO", "COMUNE"] as const;
export type ParteProcessuale = (typeof PARTI_PROCESSUALI)[number];

/**
 * Etichette per la parte processuale variano per macro area.
 * "COMUNE" è sempre "Comune (entrambe le parti)".
 */
export const PARTI_LABELS: Record<MacroAreaCode, Record<ParteProcessuale, string>> = {
  CIVILE_CONTENZIOSO: {
    ATTORE: "Attore",
    CONVENUTO: "Convenuto",
    COMUNE: "Comune (entrambe le parti)",
  },
  PROCEDIMENTI_SPECIALI: {
    ATTORE: "Ricorrente",
    CONVENUTO: "Resistente",
    COMUNE: "Comune (entrambe le parti)",
  },
  ESECUZIONI: {
    ATTORE: "Creditore procedente",
    CONVENUTO: "Debitore esecutato",
    COMUNE: "Comune (entrambe le parti)",
  },
  LAVORO: {
    ATTORE: "Ricorrente",
    CONVENUTO: "Convenuto",
    COMUNE: "Comune (entrambe le parti)",
  },
  TRIBUTARIO: {
    ATTORE: "Ricorrente",
    CONVENUTO: "Ente impositore",
    COMUNE: "Comune (entrambe le parti)",
  },
  CASSAZIONE: {
    ATTORE: "Ricorrente",
    CONVENUTO: "Controricorrente",
    COMUNE: "Comune (entrambe le parti)",
  },
  STRAGIUDIZIALE: {
    ATTORE: "Parte attiva",
    CONVENUTO: "Controparte",
    COMUNE: "Comune (entrambe le parti)",
  },
  AMMINISTRATIVO: {
    ATTORE: "Ricorrente",
    CONVENUTO: "Amministrazione resistente",
    COMUNE: "Comune (entrambe le parti)",
  },
};

// ── EventoDisponibile: voce nel dropdown "Evento" ──────────────────

export interface EventoDisponibile {
  code: string;
  label: string;
  /** Chiave input che questo evento fornisce quando l'utente inserisce la data */
  inputKey: string;
  parteProcessuale: ParteProcessuale;
  ordine: number;
}

export const EVENTI_PER_PROCEDIMENTO: Partial<Record<ProcedimentoCode, EventoDisponibile[]>> = {
  CITAZIONE_CIVILE: [
    { code: "PRIMA_UDIENZA", label: "Prima udienza", inputKey: "dataPrimaUdienza", parteProcessuale: "COMUNE", ordine: 1 },
    { code: "NOTIFICA_CITAZIONE", label: "Notifica atto di citazione", inputKey: "dataPrimaNotificaCitazione", parteProcessuale: "ATTORE", ordine: 2 },
    { code: "SLITTAMENTO_UDIENZA", label: "Eventuale slittamento prima udienza", inputKey: "dataSlittamentoUdienza", parteProcessuale: "COMUNE", ordine: 3 },
    { code: "UDIENZA_ISTRUTTORIA", label: "Udienza istruttoria", inputKey: "dataUdienzaIstruttoria", parteProcessuale: "COMUNE", ordine: 4 },
    { code: "UDIENZA_CONCLUSIONI", label: "Udienza conclusioni", inputKey: "dataUdienzaConclusioni", parteProcessuale: "COMUNE", ordine: 5 },
    { code: "SENTENZA", label: "Sentenza", inputKey: "dataPubblicazioneSentenza", parteProcessuale: "COMUNE", ordine: 6 },
    { code: "NOTIFICA_SENTENZA", label: "Notifica sentenza", inputKey: "dataNotificaSentenza", parteProcessuale: "COMUNE", ordine: 7 },
  ],
};

/** Restituisce gli eventi disponibili nel dropdown, filtrati per parte + COMUNE, ordinati. */
export function getEventiDisponibili(
  _macroArea: MacroAreaCode,
  procedimento: ProcedimentoCode,
  parteProcessuale: ParteProcessuale,
): EventoDisponibile[] {
  const all = EVENTI_PER_PROCEDIMENTO[procedimento] ?? [];
  return all
    .filter((e) => e.parteProcessuale === parteProcessuale || e.parteProcessuale === "COMUNE")
    .sort((a, b) => a.ordine - b.ordine);
}

/** Trova un EventoDisponibile per code all'interno di un procedimento. */
export function getEventoByCode(
  procedimento: ProcedimentoCode,
  code: string,
): EventoDisponibile | undefined {
  return (EVENTI_PER_PROCEDIMENTO[procedimento] ?? []).find((e) => e.code === code);
}

// ── EventRule: singola riga dell'Excel → dato per il rule engine ────

export type TipoTermine = "perentorio" | "ordinatorio" | "manuale" | "da_parametrizzare";
export type UnitaCalcolo = "giorni" | "mesi" | "anno";

export interface EventRule {
  macroArea: MacroAreaCode;
  procedimento: ProcedimentoCode;
  parteProcessuale: ParteProcessuale;
  /** Chiave dell'input base da cui si calcola (col D Excel). Se null, è un evento manuale senza formula. */
  eventoBaseKey: string | null;
  /** Titolo del sotto-evento generato (col E Excel) */
  eventoLabel: string;
  /** Direzione calcolo: "+" avanti, "-" a ritroso, null per eventi manuali */
  direzioneCalcolo: "+" | "-" | null;
  /** Quantità numerica (col G) */
  numero: number | null;
  /** Unità di calcolo (col H) */
  unita: UnitaCalcolo | null;
  /** Tipo di termine (col I) */
  tipoTermine: TipoTermine;
  /** Se genera un sotto-evento con scadenza calcolata (col J) */
  isTermine: boolean;
  /** Se si applica la sospensione feriale 1-31 agosto (col K) */
  isSospensioneFeriale: boolean;
  /** Se gestire lo slittamento per festivi (col L) */
  isPromemoriaFestivi: boolean;
  /** Norma di riferimento (col M) */
  norma: string | null;
  /** Note operative (col N) */
  noteOperative: string | null;
  /** Ordine di visualizzazione nella timeline */
  ordine: number;
  /** Se la regola, una volta calcolata, fornisce un input per altre regole (chaining) */
  providesInputKey?: string | null;
}

// ── Registry delle regole (data-driven) ─────────────────────────────

const _ruleRegistry: EventRule[] = [];

export function registerEventRules(rules: EventRule[]): void {
  _ruleRegistry.push(...rules);
}

export function getEventRulesFor(
  macroArea: MacroAreaCode,
  procedimento: ProcedimentoCode,
  parteProcessuale: ParteProcessuale
): EventRule[] {
  return _ruleRegistry
    .filter(
      (r) =>
        r.macroArea === macroArea &&
        r.procedimento === procedimento &&
        (r.parteProcessuale === parteProcessuale || r.parteProcessuale === "COMUNE")
    )
    .sort((a, b) => a.ordine - b.ordine);
}

/** Restituisce le chiavi input richieste dall'utente per una combinazione (macroArea, procedimento, parte). */
export function getRequiredInputKeys(
  macroArea: MacroAreaCode,
  procedimento: ProcedimentoCode,
  parteProcessuale: ParteProcessuale
): string[] {
  const rules = getEventRulesFor(macroArea, procedimento, parteProcessuale);
  const keys = new Set<string>();
  for (const r of rules) {
    if (r.eventoBaseKey) keys.add(r.eventoBaseKey);
  }
  return Array.from(keys);
}

/** Restituisce tutti i procedimenti che hanno almeno una regola registrata. */
export function getRegisteredProcedimenti(): Set<ProcedimentoCode> {
  const set = new Set<ProcedimentoCode>();
  for (const r of _ruleRegistry) {
    set.add(r.procedimento);
  }
  return set;
}

/** Mappatura legacy: converte vecchi actionType/actionMode in nuova gerarchia. */
export const LEGACY_ACTION_TYPE_MAP: Record<string, { macroArea: MacroAreaCode; procedimento: ProcedimentoCode }> = {
  CITAZIONE: { macroArea: "CIVILE_CONTENZIOSO", procedimento: "CITAZIONE_CIVILE" },
  RICORSO_OPPOSIZIONE: { macroArea: "CIVILE_CONTENZIOSO", procedimento: "OPPOSIZIONE_DECRETO_INGIUNTIVO" },
  RICORSO_TRIBUTARIO: { macroArea: "TRIBUTARIO", procedimento: "RICORSO_TRIBUTARIO" },
  APPELLO_CIVILE: { macroArea: "CIVILE_CONTENZIOSO", procedimento: "APPELLO_CIVILE" },
  APPELLO_TRIBUTARIO: { macroArea: "TRIBUTARIO", procedimento: "APPELLO_TRIBUTARIO" },
  RICORSO_CASSAZIONE: { macroArea: "CASSAZIONE", procedimento: "RICORSO_CASSAZIONE" },
};

export const LEGACY_ACTION_MODE_MAP: Record<string, ParteProcessuale> = {
  DA_NOTIFICARE: "ATTORE",
  COSTITUZIONE: "CONVENUTO",
};
