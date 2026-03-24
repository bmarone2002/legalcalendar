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
    "APPELLO_CIVILE",
  ],
  PROCEDIMENTI_SPECIALI: [
    "DECRETO_INGIUNTIVO",
    "ATP",
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
  APPELLO_CIVILE: "Appello civile",
  // Procedimenti speciali
  DECRETO_INGIUNTIVO: "Decreto ingiuntivo",
  ATP: "Accertamento tecnico preventivo (ATP) 696 c.p.c.",
  // Esecuzioni
  PIGNORAMENTO_MOBILIARE: "Pignoramento mobiliare",
  PIGNORAMENTO_IMMOBILIARE: "Pignoramento immobiliare - post Riforma Cartabia",
  PIGNORAMENTO_PRESSO_TERZI: "Pignoramento presso terzi",
  OPPOSIZIONE_ESECUZIONE: "Opposizione all'esecuzione - post Riforma Cartabia",
  OPPOSIZIONE_ATTI_ESECUTIVI: "Opposizione agli atti esecutivi - post Riforma Cartabia",
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
    ATTORE: "Ricorrente / Appellante",
    CONVENUTO: "Resistente / Appellato",
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
    // ATTORE: gli eventi selezionabili sono quelli della colonna \"EVENTO / SCADENZE\".
    // La data inserita viene salvata:
    // - se la riga ha un EVENTO BASE, sulla chiave dell'EVENTO BASE (eventoBaseKey)
    // - altrimenti su una chiave che rappresenta la data dell'evento stesso.
    { code: "NOTIFICA_CITAZIONE", label: "Notifica atto di citazione", inputKey: "dataPrimaNotificaCitazione", parteProcessuale: "ATTORE", ordine: 1 },
    { code: "ISCRIZIONE_RUOLO", label: "Iscrizione a ruolo/Costituzione attore", inputKey: "dataPrimaNotificaCitazione", parteProcessuale: "ATTORE", ordine: 2 },

    // CONVENUTO: data prima udienza → Costituzione convenuto (-70 gg)
    { code: "COSTITUZIONE_CONVENUTO", label: "Costituzione convenuto", inputKey: "dataPrimaUdienza", parteProcessuale: "CONVENUTO", ordine: 3 },

    // COMUNE (eventi condivisi tra le parti)
    { code: "SLITTAMENTO_UDIENZA", label: "Eventuale slittamento Prima udienza", inputKey: "dataPrimaUdienza", parteProcessuale: "COMUNE", ordine: 4 },

    // Memorie 171-ter: usano come base la data prima udienza (eventoBaseKey = "dataPrimaUdienza")
    { code: "MEMORIA_171TER_1", label: "Memoria 171-ter n.1", inputKey: "dataPrimaUdienza", parteProcessuale: "COMUNE", ordine: 5 },
    { code: "MEMORIA_171TER_2", label: "Memoria 171-ter n.2", inputKey: "dataPrimaUdienza", parteProcessuale: "COMUNE", ordine: 6 },
    { code: "MEMORIA_171TER_3", label: "Memoria 171-ter n.3", inputKey: "dataPrimaUdienza", parteProcessuale: "COMUNE", ordine: 7 },

    // Eventi successivi manuali / da parametrizzare
    { code: "UDIENZA_ISTRUTTORIA", label: "Udienza istruttoria", inputKey: "dataUdienzaIstruttoria", parteProcessuale: "COMUNE", ordine: 8 },
    { code: "UDIENZA_CONCLUSIONI", label: "Udienza conclusioni", inputKey: "dataUdienzaConclusioni", parteProcessuale: "COMUNE", ordine: 9 },
    { code: "NOTE_PRECISAZIONE_CONCLUSIONI", label: "Note precisazione conclusioni", inputKey: "dataNotePrecisazioneConclusioni", parteProcessuale: "COMUNE", ordine: 10 },
    { code: "COMPARSA_CONCLUSIONALE", label: "Comparsa conclusionale", inputKey: "dataComparsaConclusionale", parteProcessuale: "COMUNE", ordine: 11 },
    { code: "MEMORIA_REPLICA", label: "Memoria di replica", inputKey: "dataMemoriaReplica", parteProcessuale: "COMUNE", ordine: 12 },
    { code: "SENTENZA", label: "Sentenza (per calcolare termini Appello)", inputKey: "dataPubblicazioneSentenza", parteProcessuale: "COMUNE", ordine: 13 },
    { code: "NOTIFICA_SENTENZA", label: "Notifica sentenza (per calcolare termini Appello)", inputKey: "dataNotificaSentenza", parteProcessuale: "COMUNE", ordine: 14 },
  ],
  RICORSO_RITO_SEMPLIFICATO: [
    // ATTORE / RICORRENTE
    { code: "RICORSO_ISCRIZIONE_RUOLO", label: "Iscrizione a ruolo/Costituzione attore", inputKey: "dataDepositoRicorso", parteProcessuale: "ATTORE", ordine: 1 },
    { code: "NOTIFICA_RICORSO_DECRETO", label: "Notifica Ricorso e decreto", inputKey: "dataPrimaUdienzaRicorso", parteProcessuale: "ATTORE", ordine: 2 },

    // CONVENUTO / RESISTENTE
    { code: "COSTITUZIONE_CONVENUTO_RICORSO", label: "Costituzione convenuto", inputKey: "dataPrimaUdienzaRicorso", parteProcessuale: "CONVENUTO", ordine: 3 },

    // COMUNE (eventi condivisi tra le parti)
    { code: "PRIMA_UDIENZA_RICORSO", label: "Prima udienza", inputKey: "dataPrimaUdienzaRicorso", parteProcessuale: "COMUNE", ordine: 4 },

    // Eventuali memorie 171-ter su richiesta del giudice (inserimento manuale)
    { code: "MEMORIA_171TER_1_RICORSO", label: "Memoria 171 ter n.1", inputKey: "dataMemoria171ter1Ricorso", parteProcessuale: "COMUNE", ordine: 5 },
    { code: "MEMORIA_171TER_2_RICORSO", label: "Memoria 171 ter n.2", inputKey: "dataMemoria171ter2Ricorso", parteProcessuale: "COMUNE", ordine: 6 },
    { code: "MEMORIA_171TER_3_RICORSO", label: "Memoria 171 ter n.3", inputKey: "dataMemoria171ter3Ricorso", parteProcessuale: "COMUNE", ordine: 7 },

    // Udienze e fasi successive
    { code: "UDIENZA_ISTRUTTORIA_RICORSO", label: "Udienza istruttoria", inputKey: "dataUdienzaIstruttoriaRicorso", parteProcessuale: "COMUNE", ordine: 8 },
    { code: "UDIENZA_CONCLUSIONI_RICORSO", label: "Udienza conclusioni", inputKey: "dataUdienzaConclusioniRicorso", parteProcessuale: "COMUNE", ordine: 9 },
    { code: "NOTE_CONCLUSIONI_RICORSO", label: "Note conclusionali", inputKey: "dataNoteConclusionaliRicorso", parteProcessuale: "COMUNE", ordine: 10 },
    { code: "MEMORIA_REPLICA_RICORSO", label: "Memoria di replica", inputKey: "dataMemoriaReplicaRicorso", parteProcessuale: "COMUNE", ordine: 11 },

    // Sentenza e notifica sentenza
    { code: "SENTENZA_RICORSO", label: "Sentenza (per calcolare termini appello/Ric Cassazione)", inputKey: "dataPubblicazioneSentenzaRicorso", parteProcessuale: "COMUNE", ordine: 12 },
    { code: "NOTIFICA_SENTENZA_RICORSO", label: "Notifica Sentenza (per calcolare termini appello/Ric Cassazione)", inputKey: "dataNotificaSentenzaRicorso", parteProcessuale: "COMUNE", ordine: 13 },
  ],
  RICORSO_TRIBUTARIO: [
    // RICORRENTE
    {
      code: "NOTIFICA_RICORSO_TRIBUTARIO",
      label: "Notifica ricorso",
      inputKey: "dataNotificaAttoImpugnatoTrib",
      parteProcessuale: "ATTORE",
      ordine: 1,
    },
    {
      code: "DEPOSITO_RICORSO_TRIBUTARIO",
      label: "Deposito ricorso",
      inputKey: "dataNotificaRicorsoTrib",
      parteProcessuale: "ATTORE",
      ordine: 2,
    },

    // RESISTENTE
    {
      code: "COSTITUZIONE_ENTE_TRIBUTARIO",
      label: "Costituzione resistente",
      inputKey: "dataRicezioneRicorsoEnteTrib",
      parteProcessuale: "CONVENUTO",
      ordine: 3,
    },

    // COMUNE (eventi condivisi)
    {
      code: "UDIENZA_SOSPENSIVA_TRIBUTARIO",
      label: "Udienza sospensiva",
      inputKey: "dataUdienzaCautelareTrib",
      parteProcessuale: "COMUNE",
      ordine: 4,
    },
    {
      code: "UDIENZA_TRATTAZIONE_TRIBUTARIO",
      label: "Udienza trattazione",
      inputKey: "dataUdienzaTrattazioneTrib",
      parteProcessuale: "COMUNE",
      ordine: 5,
    },
    {
      code: "DEPOSITO_MEMORIE_20_TRIBUTARIO",
      label: "Deposito memorie 20 gg prima trattazione",
      inputKey: "dataUdienzaTrattazioneTrib",
      parteProcessuale: "COMUNE",
      ordine: 6,
    },
    {
      code: "DEPOSITO_MEMORIE_10_TRIBUTARIO",
      label: "Deposito memorie 10 gg prima trattazione",
      inputKey: "dataUdienzaTrattazioneTrib",
      parteProcessuale: "COMUNE",
      ordine: 7,
    },
    {
      code: "SENTENZA_RICORSO_TRIBUTARIO",
      label: "Sentenza (per calcolare termine lungo Appello)",
      inputKey: "dataPubblicazioneSentenzaTrib",
      parteProcessuale: "COMUNE",
      ordine: 8,
    },
    {
      code: "NOTIFICA_SENTENZA_RICORSO_TRIBUTARIO",
      label: "Notifica Sentenza (per calcolare termine breve appello/Ric Cassazione)",
      inputKey: "dataNotificaSentenzaTrib",
      parteProcessuale: "COMUNE",
      ordine: 9,
    },
  ],
  APPELLO_TRIBUTARIO: [
    // APPELLANTE
    {
      code: "NOTIFICA_APPELLO_TRIB_BREVE",
      label: "Notifica appello (termine breve)",
      inputKey: "dataNotificaSentenzaPrimoTrib",
      parteProcessuale: "ATTORE",
      ordine: 1,
    },
    {
      code: "NOTIFICA_APPELLO_TRIB_LUNGO",
      label: "Notifica appello (termine lungo 6 mesi)",
      inputKey: "dataDepositoSentenzaPrimoTrib",
      parteProcessuale: "ATTORE",
      ordine: 2,
    },
    {
      code: "DEPOSITO_APPELLO_TRIBUTARIO",
      label: "Deposito appello",
      inputKey: "dataProposizioneAppelloTrib",
      parteProcessuale: "ATTORE",
      ordine: 3,
    },

    // ENTE RESISTENTE / APPELLATO
    {
      code: "COSTITUZIONE_APPELLATO_TRIB",
      label: "Costituzione appellato",
      inputKey: "dataNotificaAppelloTrib",
      parteProcessuale: "CONVENUTO",
      ordine: 4,
    },

    // COMUNE (eventi condivisi)
    {
      code: "UDIENZA_SOSPENSIVA_APPELLO_TRIB",
      label: "Udienza sospensiva",
      inputKey: "dataIstanzaCautelareAppelloTrib",
      parteProcessuale: "COMUNE",
      ordine: 6,
    },
    {
      code: "UDIENZA_TRATTAZIONE_APPELLO_TRIB",
      label: "Udienza trattazione",
      inputKey: "dataUdienzaTrattazioneAppelloTrib",
      parteProcessuale: "COMUNE",
      ordine: 7,
    },
    {
      code: "DEPOSITO_MEMORIE_20_APPELLO_TRIB",
      label: "Deposito memorie 20 gg prima trattazione",
      inputKey: "dataUdienzaTrattazioneAppelloTrib",
      parteProcessuale: "COMUNE",
      ordine: 8,
    },
    {
      code: "DEPOSITO_MEMORIE_10_APPELLO_TRIB",
      label: "Deposito memorie 10 gg prima trattazione",
      inputKey: "dataUdienzaTrattazioneAppelloTrib",
      parteProcessuale: "COMUNE",
      ordine: 9,
    },
    {
      code: "SENTENZA_APPELLO_TRIB",
      label: "Sentenza (per calcolare termine lungo per Ricorso in Cassazione)",
      inputKey: "dataPubblicazioneSentenzaAppelloTrib",
      parteProcessuale: "COMUNE",
      ordine: 10,
    },
    {
      code: "NOTIFICA_SENTENZA_APPELLO_TRIB",
      label: "Notifica Sentenza (per calcolare termine breve per Ricorso in Cassazione)",
      inputKey: "dataNotificaSentenzaAppelloTrib",
      parteProcessuale: "COMUNE",
      ordine: 11,
    },
  ],
  APPELLO_CIVILE: [
    // ATTORE / APPELLANTE
    {
      code: "NOTIFICA_APPELLO_CIVILE",
      label: "Notifica atto di citazione",
      inputKey: "dataNotificaAppelloCivile",
      parteProcessuale: "ATTORE",
      ordine: 1,
    },
    {
      code: "ISCRIZIONE_RUOLO_APPELLO_CIVILE",
      label: "Iscrizione a ruolo/Costituzione attore",
      inputKey: "dataNotificaAppelloCivile",
      parteProcessuale: "ATTORE",
      ordine: 2,
    },

    // CONVENUTO / APPELLATO
    {
      code: "COSTITUZIONE_APPELLATO_CIVILE",
      label: "Costituzione appellato",
      inputKey: "dataUdienzaAppelloCivile",
      parteProcessuale: "CONVENUTO",
      ordine: 3,
    },

    // COMUNE (eventi condivisi tra le parti)
    {
      code: "PRIMA_UDIENZA_APPELLO_CIVILE",
      label: "Prima udienza",
      inputKey: "dataUdienzaAppelloCivile",
      parteProcessuale: "COMUNE",
      ordine: 4,
    },
    {
      code: "UDIENZA_ISTRUTTORIA_APPELLO_CIVILE",
      label: "Udienza istruttoria",
      inputKey: "dataUdienzaIstruttoriaAppelloCivile",
      parteProcessuale: "COMUNE",
      ordine: 5,
    },
    {
      code: "NOTE_CONCLUSIONI_APPELLO_CIVILE_60",
      label: "Note conclusionali (60 gg prima udienza conclusioni)",
      inputKey: "dataUdienzaConclusioniAppelloCivile",
      parteProcessuale: "COMUNE",
      ordine: 6,
    },
    {
      code: "NOTE_CONCLUSIONI_APPELLO_CIVILE_30",
      label: "Note conclusionali (30 gg prima udienza conclusioni)",
      inputKey: "dataUdienzaConclusioniAppelloCivile",
      parteProcessuale: "COMUNE",
      ordine: 7,
    },
    {
      code: "MEMORIA_REPLICA_APPELLO_CIVILE_15",
      label: "Memoria di replica (15 gg prima udienza conclusioni)",
      inputKey: "dataUdienzaConclusioniAppelloCivile",
      parteProcessuale: "COMUNE",
      ordine: 8,
    },
    {
      code: "SENTENZA_APPELLO_CIVILE",
      label: "Sentenza (per calcolare termini Ric Cassazione)",
      inputKey: "dataPubblicazioneSentenzaAppelloCivile",
      parteProcessuale: "COMUNE",
      ordine: 9,
    },
    {
      code: "NOTIFICA_SENTENZA_APPELLO_CIVILE",
      label: "Notifica Sentenza (per calcolare termini Ric Cassazione)",
      inputKey: "dataNotificaSentenzaAppelloCivile",
      parteProcessuale: "COMUNE",
      ordine: 10,
    },
  ],
  DECRETO_INGIUNTIVO: [
    // RICORRENTE
    {
      code: "DEPOSITO_RICORSO_DI",
      label: "Deposito ricorso",
      inputKey: "dataDepositoRicorsoDI",
      parteProcessuale: "ATTORE",
      ordine: 1,
    },
    {
      code: "NOTIFICA_DECRETO_DI",
      label: "Notifica decreto",
      inputKey: "dataEmissioneDecreto",
      parteProcessuale: "ATTORE",
      ordine: 2,
    },
    // INTIMATO
    {
      code: "TERMINE_OPPOSIZIONE_DI",
      label: "Termine opposizione",
      inputKey: "dataNotificaDecreto",
      parteProcessuale: "CONVENUTO",
      ordine: 3,
    },
    {
      code: "NOTIFICA_OPPOSIZIONE_DI",
      label: "Notifica opposizione al ricorrente",
      inputKey: "dataNotificaDecreto",
      parteProcessuale: "CONVENUTO",
      ordine: 4,
    },
    // RICORRENTE
    {
      code: "ESECUTIVITA_DECRETO_DI",
      label: "Esecutività decreto per mancata opposizione",
      inputKey: "dataScadenzaTermineOpposizione",
      parteProcessuale: "ATTORE",
      ordine: 5,
    },
    // COMUNE
    {
      code: "PONTE_OPPOSIZIONE_DI",
      label: "Il giudizio di opposizione continua come Procedimento citazione civile",
      inputKey: "dataNotificaOpposizione",
      parteProcessuale: "COMUNE",
      ordine: 6,
    },
  ],
  ATP: [
    // RICORRENTE
    {
      code: "DEPOSITO_RICORSO_ATP",
      label: "Deposito ricorso",
      inputKey: "dataDepositoRicorsoATP",
      parteProcessuale: "ATTORE",
      ordine: 1,
    },
    {
      code: "EMISSIONE_DECRETO_ATP",
      label: "Emissione decreto",
      inputKey: "dataDepositoRicorsoATP",
      parteProcessuale: "ATTORE",
      ordine: 2,
    },
    {
      code: "NOTIFICA_RICORSO_DECRETO_ATP",
      label: "Notifica ricorso e decreto",
      inputKey: "dataEmissioneDecretoATP",
      parteProcessuale: "ATTORE",
      ordine: 3,
    },
    // COMUNE
    {
      code: "INIZIO_OPERAZIONI_PERITALI_ATP",
      label: "Data inizio operazioni peritali",
      inputKey: "dataOperazioniPeritaliATP",
      parteProcessuale: "COMUNE",
      ordine: 4,
    },
  ],
  PIGNORAMENTO_MOBILIARE: [
    // ATTORE / creditore
    {
      code: "NOTIFICA_PRECETTO_MOBILIARE",
      label: "Notifica precetto",
      inputKey: "dataNotificaPrecettoMobiliare",
      parteProcessuale: "ATTORE",
      ordine: 1,
    },
    {
      code: "NOTIFICA_PIGNORAMENTO_MOBILIARE",
      label: "Notifica pignoramento",
      inputKey: "dataNotificaPrecettoMobiliare",
      parteProcessuale: "ATTORE",
      ordine: 2,
    },
    {
      code: "ISCRIZIONE_RUOLO_ESECUZIONE_MOBILIARE",
      label: "Iscrizione a ruolo esecuzione",
      inputKey: "dataRestituzioneVerbalePignoramentoMobiliare",
      parteProcessuale: "ATTORE",
      ordine: 3,
    },

    // CONVENUTO / opponente
    {
      code: "NOTIFICA_CITAZIONE_OPPOSIZIONE_615_1_MOBILIARE",
      label: "Notifica citazione in opposizione esecuzione 615, comma 1",
      inputKey: "dataNotificaPrecettoMobiliare",
      parteProcessuale: "CONVENUTO",
      ordine: 1,
    },
    {
      code: "DEPOSITO_RICORSO_OPPOSIZIONE_615_2_MOBILIARE",
      label: "Deposito Ricorso in opposizione esecuzione 615, comma 2",
      inputKey: "dataPrimoAttoEsecuzione615Mobiliare",
      parteProcessuale: "CONVENUTO",
      ordine: 2,
    },
    {
      code: "NOTIFICA_RICORSO_DECRETO_615_2_MOBILIARE",
      label: "Notifica Ricorso e Decreto fissazione udienza (opposizione 615, c. 2)",
      inputKey: "dataDecretoFissazioneUdienza615Mobiliare",
      parteProcessuale: "CONVENUTO",
      ordine: 3,
    },
    {
      code: "NOTIFICA_CITAZIONE_OPPOSIZIONE_ATTI_617_1_MOBILIARE",
      label: "Notifica citazione in opposizione atti 617, comma 1",
      inputKey: "dataNotificaPrecettoMobiliare",
      parteProcessuale: "CONVENUTO",
      ordine: 4,
    },
    {
      code: "DEPOSITO_RICORSO_OPPOSIZIONE_ATTI_617_2_MOBILIARE",
      label: "Deposito Ricorso in opposizione atti 617, comma 2",
      inputKey: "dataConoscenzaAttoEsecutivoMobiliare",
      parteProcessuale: "CONVENUTO",
      ordine: 5,
    },
    {
      code: "NOTIFICA_RICORSO_DECRETO_617_2_MOBILIARE",
      label: "Notifica Ricorso e Decreto fissazione udienza (opposizione 617, c. 2)",
      inputKey: "dataDecretoFissazioneUdienza617Mobiliare",
      parteProcessuale: "CONVENUTO",
      ordine: 6,
    },

    // COMUNE
    {
      code: "TERMINE_EFFICACIA_PRECETTO_MOBILIARE",
      label: "Termine efficacia precetto",
      inputKey: "dataNotificaPrecettoMobiliare",
      parteProcessuale: "COMUNE",
      ordine: 1,
    },
    {
      code: "UDIENZA_COMPARIZIONE_MOBILIARE",
      label: "Udienza comparizione",
      inputKey: "dataUdienzaComparizioneMobiliare530",
      parteProcessuale: "COMUNE",
      ordine: 2,
    },
    {
      code: "ORDINANZA_ASSEGNAZIONE_MOBILIARE",
      label: "Ordinanza assegnazione",
      inputKey: "dataProvvedimentoOrdinanzaAssegnazioneMobiliare529",
      parteProcessuale: "COMUNE",
      ordine: 3,
    },
    {
      code: "NOTIFICA_ORDINANZA_ASSEGNAZIONE_MOBILIARE",
      label: "Notifica Ordinanza assegnazione",
      inputKey: "dataNotificaOrdinanzaAssegnazioneMobiliare",
      parteProcessuale: "COMUNE",
      ordine: 4,
    },
    {
      code: "VENDITA_MOBILIARE",
      label: "Vendita",
      inputKey: "dataFissataGiudiceIVGVenditaMobiliare",
      parteProcessuale: "COMUNE",
      ordine: 5,
    },
    {
      code: "UDIENZA_COMPARIZIONE_615_2_MOBILIARE",
      label: "Udienza comparizione",
      inputKey: "dataUdienzaComparizione615Mobiliare",
      parteProcessuale: "COMUNE",
      ordine: 6,
    },
    {
      code: "DECRETO_FISSAZIONE_UDIENZA_615_2_MOBILIARE",
      label: "Decreto fissazione udienza comparizione (615, c. 2)",
      inputKey: "dataDepositoRicorso615Mobiliare",
      parteProcessuale: "COMUNE",
      ordine: 7,
    },
    {
      code: "UDIENZA_COMPARIZIONE_617_2_MOBILIARE",
      label: "Udienza comparizione",
      inputKey: "dataUdienzaComparizione617Mobiliare",
      parteProcessuale: "COMUNE",
      ordine: 8,
    },
    {
      code: "DECRETO_FISSAZIONE_UDIENZA_617_2_MOBILIARE",
      label: "Decreto fissazione udienza comparizione (617, c. 2)",
      inputKey: "dataDepositoRicorso617Mobiliare",
      parteProcessuale: "COMUNE",
      ordine: 9,
    },
    {
      code: "NOTIFICA_SENTENZA_APPELLO_MOBILIARE",
      label: "Notifica Sentenza (per calcolare termini Appello)",
      inputKey: "dataNotificaSentenzaMobiliare",
      parteProcessuale: "COMUNE",
      ordine: 10,
    },
    {
      code: "DEPOSITO_SENTENZA_APPELLO_MOBILIARE",
      label: "Deposito Sentenza (per calcolare termini Appello)",
      inputKey: "dataDepositoSentenzaMobiliare",
      parteProcessuale: "COMUNE",
      ordine: 11,
    },
  ],
  PIGNORAMENTO_IMMOBILIARE: [
    // ATTORE / creditore
    {
      code: "NOTIFICA_PRECETTO_IMMOBILIARE",
      label: "Notifica precetto",
      inputKey: "dataNotificaPrecettoImmobiliare",
      parteProcessuale: "ATTORE",
      ordine: 1,
    },
    {
      code: "NOTIFICA_ATTO_PIGNORAMENTO_IMMOBILIARE",
      label: "Notificazione Atto di Pignoramento",
      inputKey: "dataNotificaAttoPignoramentoImmobiliare",
      parteProcessuale: "ATTORE",
      ordine: 3,
    },
    {
      code: "ISCRIZIONE_RUOLO_IMMOBILIARE",
      label: "Iscrizione a Ruolo",
      inputKey: "dataRestituzioneAttoPignoramentoImmobiliare",
      parteProcessuale: "ATTORE",
      ordine: 4,
    },
    {
      code: "TRASCRIZIONE_PIGNORAMENTO_IMMOBILIARE",
      label: "Trascrizione del Pignoramento",
      inputKey: "dataTrascrizionePignoramentoImmobiliare",
      parteProcessuale: "ATTORE",
      ordine: 5,
    },
    {
      code: "ISTANZA_VENDITA_DEPOSITO_IPOCATASTALE_IMMOBILIARE",
      label: "Istanza di Vendita e Deposito Documentazione Ipocatastale",
      inputKey: "dataPerfezionamentoNotificaPignoramentoImmobiliare",
      parteProcessuale: "ATTORE",
      ordine: 6,
    },
    {
      code: "PROROGA_ISTANZA_VENDITA_DEPOSITO_IMMOBILIARE",
      label: "Proroga eventuale del termine per istanza di vendita e deposito documentazione",
      inputKey: "dataScadenzaTermineOriginarioIstanzaVenditaImmobiliare",
      parteProcessuale: "ATTORE",
      ordine: 7,
    },

    // COMUNE (eventi condivisi)
    {
      code: "TERMINE_EFFICACIA_PRECETTO_IMMOBILIARE",
      label: "Termine efficacia precetto",
      inputKey: "dataNotificaPrecettoImmobiliare",
      parteProcessuale: "COMUNE",
      ordine: 2,
    },
    {
      code: "FISSAZIONE_UDIENZA_AUTORIZZAZIONE_VENDITA_IMMOBILIARE",
      label: "Fissazione Udienza per l'Autorizzazione alla Vendita (art. 569 c.p.c.)",
      inputKey: "dataNominaEspertoStimatoreImmobiliare",
      parteProcessuale: "COMUNE",
      ordine: 8,
    },
    {
      code: "PRESENTAZIONE_OFFERTE_ACQUISTO_IMMOBILIARE",
      label: "Presentazione Offerte d'Acquisto",
      inputKey: "dataPresentazioneOfferteAcquistoImmobiliare",
      parteProcessuale: "COMUNE",
      ordine: 9,
    },
    {
      code: "VERSAMENTO_SALDO_PREZZO_IMMOBILIARE",
      label: "Versamento Saldo Prezzo",
      inputKey: "dataAggiudicazioneImmobiliare",
      parteProcessuale: "COMUNE",
      ordine: 10,
    },
  ],
  OPPOSIZIONE_ESECUZIONE: [
    // CREDITORE / DEBITORE
    {
      code: "NOTIFICA_PRECETTO_OPPOSIZIONE_ESECUZIONE",
      label: "Notificazione dell'Atto di Precetto",
      inputKey: "dataNotificaPrecettoOpposizioneEsecuzione",
      parteProcessuale: "ATTORE",
      ordine: 1,
    },

    // OPPONENTE
    {
      code: "PROPOSIZIONE_OPPOSIZIONE_NOTIFICA_CITAZIONE_615_1",
      label: "Proposizione dell'Opposizione - Notifica Atto di citazione",
      inputKey: "dataProposizioneOpposizioneNotificaCitazione615_1",
      parteProcessuale: "CONVENUTO",
      ordine: 2,
    },
    {
      code: "PROPOSIZIONE_OPPOSIZIONE_DEPOSITO_RICORSO_615_2",
      label: "Proposizione dell'Opposizione - Deposito Ricorso al giudice dell'esecuzione",
      inputKey: "dataProposizioneOpposizioneDepositoRicorso615_2",
      parteProcessuale: "CONVENUTO",
      ordine: 5,
    },

    // COMUNE (eventi condivisi)
    {
      code: "PONTE_RITO_ORDINARIO_O_SPECIALE_615_1",
      label: "Il giudizio si svolgera secondo le forme ordinarie - rito ordinario o rito speciale",
      inputKey: "dataEsitoFaseIntroduttivaOpposizioneEsecuzione",
      parteProcessuale: "COMUNE",
      ordine: 3,
    },
    {
      code: "NOTIFICA_ATTO_PIGNORAMENTO_OPPOSIZIONE_ESECUZIONE",
      label: "Notificazione dell'atto di pignoramento",
      inputKey: "dataNotificaAttoPignoramentoOpposizioneEsecuzione",
      parteProcessuale: "COMUNE",
      ordine: 4,
    },
    {
      code: "UDIENZA_FISSATA_GIUDICE_DECRETO_FASE_CAUTELARE_618",
      label: "Udienza fissata dal giudice con decreto - fase cautelare",
      inputKey: "dataUdienzaFissataGiudiceDecretoFaseCautelare618",
      parteProcessuale: "COMUNE",
      ordine: 6,
    },
    {
      code: "INTRODUZIONE_GIUDIZIO_MERITO_TERMINE_FISSATO_GIUDICE_616",
      label: "Introduzione del Giudizio di Merito - termine perentorio fissato dal giudice",
      inputKey: "dataIntroduzioneGiudizioMeritoTermineFissatoGiudice616",
      parteProcessuale: "COMUNE",
      ordine: 7,
    },
    {
      code: "PONTE_GIUDIZIO_MERITO_FORME_ORDINARIE_616",
      label: "Il giudizio di merito prosegue nelle forme ordinarie",
      inputKey: "dataEsitoFaseSommariaOpposizioneEsecuzione",
      parteProcessuale: "COMUNE",
      ordine: 8,
    },
  ],
  OPPOSIZIONE_ATTI_ESECUTIVI: [
    // OPPONENTE
    {
      code: "NOTIFICA_TITOLO_O_PRECETTO_617_1",
      label: "Notificazione del Titolo Esecutivo o del Precetto",
      inputKey: "dataNotificaTitoloPrecetto617_1",
      parteProcessuale: "CONVENUTO",
      ordine: 1,
    },
    {
      code: "PROPOSIZIONE_OPPOSIZIONE_ATTI_NOTIFICA_CITAZIONE_617_1",
      label: "Proposizione dell'Opposizione - Notifica Atto di citazione",
      inputKey: "dataNotificaTitoloPrecetto617_1",
      parteProcessuale: "CONVENUTO",
      ordine: 2,
    },
    {
      code: "ATTO_ESECUTIVO_CONOSCENZA_LEGALE_FATTO_617_2",
      label: "Atto Esecutivo e Conoscenza Legale/di Fatto",
      inputKey: "dataConoscenzaMotivoOpposizione617_2",
      parteProcessuale: "CONVENUTO",
      ordine: 3,
    },
    {
      code: "RICORSO_OPPOSIZIONE_DEPOSITO_CANCELLERIA_GE_617_2",
      label: "Ricorso in opposizione - deposito in cancelleria del G.E.",
      inputKey: "dataCompimentoAttoOConoscenza617_2",
      parteProcessuale: "CONVENUTO",
      ordine: 4,
    },

    // COMUNE (eventi condivisi)
    {
      code: "ORDINANZA_DECISIONE_ISTANZA_SOSPENSIONE_624_618",
      label: "Ordinanza di decisione sull'eventuale Istanza di Sospensione",
      inputKey: "dataProvvedimentoGiudiceOrdinanzaSospensione624_618",
      parteProcessuale: "COMUNE",
      ordine: 5,
    },
    {
      code: "RECLAMO_ORDINANZA_SOSPENSIONE_669_TERDECIES",
      label: "Reclamo contro l'Ordinanza sulla Sospensione",
      inputKey: "dataProvvedimentoSospensione669Terdecies",
      parteProcessuale: "COMUNE",
      ordine: 6,
    },
    {
      code: "INTRODUZIONE_GIUDIZIO_MERITO_618",
      label: "Introduzione del Giudizio di Merito",
      inputKey: "dataFissataGEOpposizioneAtti618",
      parteProcessuale: "COMUNE",
      ordine: 7,
    },
    {
      code: "PONTE_GIUDIZIO_MERITO_FORME_ORDINARIE_618",
      label: "Il giudizio di merito prosegue nelle forme ordinarie",
      inputKey: "dataEsitoFaseSommariaOpposizioneAtti618",
      parteProcessuale: "COMUNE",
      ordine: 8,
    },
  ],
  PIGNORAMENTO_PRESSO_TERZI: [
    // ATTORE / creditore
    {
      code: "NOTIFICA_PRECETTO_PRESO_TERZI",
      label: "Notifica precetto",
      inputKey: "dataNotificaPrecettoPressoTerzi",
      parteProcessuale: "ATTORE",
      ordine: 1,
    },
    {
      code: "NOTIFICA_PIGNORAMENTO_PRESO_TERZI",
      label: "Notifica pignoramento",
      inputKey: "dataNotificaPrecettoPressoTerzi",
      parteProcessuale: "ATTORE",
      ordine: 3,
    },
    {
      code: "ISCRIZIONE_RUOLO_ESECUZIONE_PRESO_TERZI",
      label: "Iscrizione a ruolo esecuzione",
      inputKey: "dataUltimaNotificaPignoramentoPressoTerzi",
      parteProcessuale: "ATTORE",
      ordine: 4,
    },
    {
      code: "NOTIFICA_AVVENUTA_ISCRIZIONE_RUOLO_TERZO_PRESO_TERZI",
      label: "Notifica avvenuta iscrizione a ruolo al terzo",
      inputKey: "dataUdienzaIndicataAttoPignoramentoPressoTerzi",
      parteProcessuale: "ATTORE",
      ordine: 6,
    },
    {
      code: "NOTIFICA_ORDINANZA_ASSEGNAZIONE_PRESO_TERZI",
      label: "Notifica Ordinanza assegnazione",
      inputKey: "dataOrdinanzaAssegnazionePressoTerzi",
      parteProcessuale: "ATTORE",
      ordine: 8,
    },

    // CONVENUTO / opponente
    {
      code: "NOTIFICA_CITAZIONE_OPPOSIZIONE_615_1_PRESO_TERZI",
      label: "Notifica citazione in opposizione esecuzione 615, comma 1",
      inputKey: "dataNotificaPrecettoPressoTerzi",
      parteProcessuale: "CONVENUTO",
      ordine: 9,
    },
    {
      code: "DEPOSITO_RICORSO_OPPOSIZIONE_615_2_PRESO_TERZI",
      label: "Deposito Ricorso in opposizione esecuzione 615, comma 2",
      inputKey: "dataPrimoAttoEsecuzionePressoTerzi",
      parteProcessuale: "CONVENUTO",
      ordine: 10,
    },
    {
      code: "NOTIFICA_RICORSO_DECRETO_615_2_PRESO_TERZI",
      label: "Notifica Ricorso e Decreto fissazione udienza di comparizione",
      inputKey: "dataDecretoFissazioneUdienza615PressoTerzi",
      parteProcessuale: "CONVENUTO",
      ordine: 13,
    },
    {
      code: "NOTIFICA_CITAZIONE_OPPOSIZIONE_ATTI_617_1_PRESO_TERZI",
      label: "Notifica citazione in opposizione atti 617, comma 1",
      inputKey: "dataNotificaPrecettoPressoTerzi",
      parteProcessuale: "CONVENUTO",
      ordine: 14,
    },
    {
      code: "DEPOSITO_RICORSO_OPPOSIZIONE_ATTI_617_2_PRESO_TERZI",
      label: "Deposito Ricorso in opposizione atti 617, comma 2",
      inputKey: "dataConoscenzaAttoEsecutivoPressoTerzi",
      parteProcessuale: "CONVENUTO",
      ordine: 15,
    },
    {
      code: "NOTIFICA_RICORSO_DECRETO_617_2_PRESO_TERZI",
      label: "Notifica Ricorso in opposizione atti esecutivi e Decreto fissazione udienza di comparizione",
      inputKey: "dataDecretoFissazioneUdienza617PressoTerzi",
      parteProcessuale: "CONVENUTO",
      ordine: 18,
    },

    // COMUNE (condivisi)
    {
      code: "TERMINE_EFFICACIA_PRECETTO_PRESO_TERZI",
      label: "Termine efficacia precetto",
      inputKey: "dataNotificaPrecettoPressoTerzi",
      parteProcessuale: "COMUNE",
      ordine: 2,
    },
    {
      code: "UDIENZA_COMPARIZIONE_PRESO_TERZI",
      label: "Udienza comparizione",
      inputKey: "dataUdienzaComparizionePressoTerzi",
      parteProcessuale: "COMUNE",
      ordine: 5,
    },
    {
      code: "ORDINANZA_ASSEGNAZIONE_PRESO_TERZI",
      label: "Ordinanza assegnazione",
      inputKey: "dataOrdinanzaAssegnazionePressoTerzi",
      parteProcessuale: "COMUNE",
      ordine: 7,
    },
    {
      code: "UDIENZA_COMPARIZIONE_615_2_PRESO_TERZI",
      label: "Udienza comparizione",
      inputKey: "dataUdienzaComparizione615PressoTerzi",
      parteProcessuale: "COMUNE",
      ordine: 11,
    },
    {
      code: "DECRETO_FISSAZIONE_UDIENZA_615_2_PRESO_TERZI",
      label: "Decreto fissazione udienza comparizione (615, c. 2)",
      inputKey: "dataDepositoRicorso615PressoTerzi",
      parteProcessuale: "COMUNE",
      ordine: 12,
    },
    {
      code: "UDIENZA_COMPARIZIONE_617_2_PRESO_TERZI",
      label: "Udienza comparizione",
      inputKey: "dataUdienzaComparizione617PressoTerzi",
      parteProcessuale: "COMUNE",
      ordine: 16,
    },
    {
      code: "DECRETO_FISSAZIONE_UDIENZA_617_2_PRESO_TERZI",
      label: "Decreto fissazione udienza comparizione (617, c. 2)",
      inputKey: "dataDepositoRicorso617PressoTerzi",
      parteProcessuale: "COMUNE",
      ordine: 17,
    },
    {
      code: "NOTIFICA_SENTENZA_APPello_PRESO_TERZI",
      label: "Notifica Sentenza (per calcolare termini Appello)",
      inputKey: "dataNotificaSentenzaPressoTerzi",
      parteProcessuale: "COMUNE",
      ordine: 19,
    },
    {
      code: "DEPOSITO_SENTENZA_APPello_PRESO_TERZI",
      label: "Deposito Sentenza (per calcolare termini Appello)",
      inputKey: "dataDepositoSentenzaPressoTerzi",
      parteProcessuale: "COMUNE",
      ordine: 20,
    },
  ],
  RICORSO_CASSAZIONE: [
    // RICORRENTE
    {
      code: "NOTIFICA_RICORSO_CASS_BREVE",
      label: "Notifica Ricorso per Cassazione",
      inputKey: "dataNotificaSentenzaImpugnareCass",
      parteProcessuale: "ATTORE",
      ordine: 1,
    },
    {
      code: "NOTIFICA_RICORSO_CASS_LUNGO",
      label: "Notifica Ricorso per Cassazione",
      inputKey: "dataPubblicazioneSentenzaImpugnareCass",
      parteProcessuale: "ATTORE",
      ordine: 2,
    },
    {
      code: "DEPOSITO_RICORSO_CASS",
      label: "Deposito Ricorso",
      inputKey: "dataUltimaNotificaRicorsoCass",
      parteProcessuale: "ATTORE",
      ordine: 3,
    },
    {
      code: "PROPOSTA_380BIS",
      label: "Proposta 380 bis",
      inputKey: "dataComunicazioneProposta380bis",
      parteProcessuale: "COMUNE",
      ordine: 4,
    },
    {
      code: "ISTANZA_DECISIONE_380BIS",
      label: "Istanza per Decisione 380 bis c. 2",
      inputKey: "dataComunicazioneProposta380bis",
      parteProcessuale: "ATTORE",
      ordine: 5,
    },
    {
      code: "UDIENZA_CASS",
      label: "Udienza",
      inputKey: "dataUdienzaCass",
      parteProcessuale: "COMUNE",
      ordine: 6,
    },
    {
      code: "MEMORIE_378",
      label: "Memorie ex art. 378",
      inputKey: "dataUdienzaCass",
      parteProcessuale: "COMUNE",
      ordine: 7,
    },
  ],
  CONTRORICORSO: [
    // CONTRORICORRENTE
    {
      code: "DEPOSITO_CONTRORICORSO",
      label: "Deposito Controricorso",
      inputKey: "dataNotificaRicorsoCass",
      parteProcessuale: "CONVENUTO",
      ordine: 1,
    },
    {
      code: "PROPOSTA_380BIS",
      label: "Proposta 380 bis",
      inputKey: "dataComunicazioneProposta380bis",
      parteProcessuale: "COMUNE",
      ordine: 2,
    },
    {
      code: "UDIENZA_CASS",
      label: "Udienza",
      inputKey: "dataUdienzaCass",
      parteProcessuale: "COMUNE",
      ordine: 3,
    },
    {
      code: "MEMORIE_378",
      label: "Memorie ex art. 378",
      inputKey: "dataUdienzaCass",
      parteProcessuale: "COMUNE",
      ordine: 4,
    },
  ],
};

/** Ordine minimo per eventi in Prosecuzione (solo fasi successive alle memorie 171-ter n.1/2/3). */
export const ORDINE_MIN_PROSECUZIONE: Partial<Record<ProcedimentoCode, number>> = {
  CITAZIONE_CIVILE: 8,
  RICORSO_RITO_SEMPLIFICATO: 8,
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

/** Restituisce gli eventi disponibili per la Prosecuzione (solo fasi successive a Memoria 3, es. Udienza istruttoria, conclusioni, sentenza). */
export function getEventiDisponibiliPerProsecuzione(
  macroArea: MacroAreaCode,
  procedimento: ProcedimentoCode,
  parteProcessuale: ParteProcessuale,
): EventoDisponibile[] {
  const minOrdine = ORDINE_MIN_PROSECUZIONE[procedimento];
  if (minOrdine == null) return getEventiDisponibili(macroArea, procedimento, parteProcessuale);
  const all = EVENTI_PER_PROCEDIMENTO[procedimento] ?? [];
  return all
    .filter(
      (e) =>
        (e.parteProcessuale === parteProcessuale || e.parteProcessuale === "COMUNE") &&
        e.ordine >= minOrdine
    )
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
  /**
   * Chiave dell'input base da cui si calcola (colonna Excel "EVENTO BASE INSERITO DALL'UTENTE").
   * È il campo data di partenza per il calcolo (inserito dall'utente o derivato da providesInputKey di un'altra regola).
   * Se null, la riga non ha formula e l'evento viene gestito come manuale/placeholder.
   */
  eventoBaseKey: string | null;
  /** Titolo del sotto-evento generato (colonna Excel "EVENTO / SCADENZE"). */
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
  /** Ordine di visualizzazione nella timeline (cronologico: dalla prima all'ultima fase) */
  ordine: number;
  /**
   * Se valorizzato, indica che la data calcolata da questa regola deve essere salvata anche
   * come nuovo input (colonna implicita in Excel: data che diventa EVENTO BASE per altre righe).
   * Esempio: la regola "Notifica atto di citazione" può valorizzare providesInputKey="dataPrimaNotificaCitazione"
   * così che la successiva riga "Iscrizione a ruolo" usi quella data come eventoBaseKey.
   */
  providesInputKey?: string | null;
  /** Codice evento (da Excel/dropdown) per mappatura 1:1 con EventoDisponibile; opzionale se regole sono hand-written. */
  eventoCode?: string | null;
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

/**
 * Mappatura legacy: converte vecchi actionType/actionMode (pannello Atto Giuridico v1)
 * nella nuova gerarchia MacroArea/Procedimento/Parte per eventi già salvati.
 */
export const LEGACY_ACTION_TYPE_MAP: Record<string, { macroArea: MacroAreaCode; procedimento: ProcedimentoCode }> = {
  CITAZIONE: { macroArea: "CIVILE_CONTENZIOSO", procedimento: "CITAZIONE_CIVILE" },
  // In legacy, "opposizione a decreto ingiuntivo" viene agganciata al workflow del decreto ingiuntivo.
  RICORSO_OPPOSIZIONE: { macroArea: "PROCEDIMENTI_SPECIALI", procedimento: "DECRETO_INGIUNTIVO" },
  RICORSO_TRIBUTARIO: { macroArea: "TRIBUTARIO", procedimento: "RICORSO_TRIBUTARIO" },
  APPELLO_CIVILE: { macroArea: "CIVILE_CONTENZIOSO", procedimento: "APPELLO_CIVILE" },
  APPELLO_TRIBUTARIO: { macroArea: "TRIBUTARIO", procedimento: "APPELLO_TRIBUTARIO" },
  RICORSO_CASSAZIONE: { macroArea: "CASSAZIONE", procedimento: "RICORSO_CASSAZIONE" },
};

/** Mappatura legacy: converte vecchi actionMode in ParteProcessuale. */
export const LEGACY_ACTION_MODE_MAP: Record<string, ParteProcessuale> = {
  DA_NOTIFICARE: "ATTORE",
  COSTITUZIONE: "CONVENUTO",
};
