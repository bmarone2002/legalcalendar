import type {
  EventRule,
  EventoDisponibile,
  MacroAreaCode,
  ProcedimentoCode,
  ParteProcessuale,
} from "@/types/macro-areas";

/**
 * Formato JSON intermedio che rappresenta una singola riga della tabella Excel.
 * È volutamente vicino alla struttura di business (colonne viste dall'utente),
 * e viene poi tradotto in:
 *   - EventRule (per il motore data-driven)
 *   - EventoDisponibile (per il dropdown Evento)
 */
export interface ExcelRuleRow {
  macroArea: MacroAreaCode;
  procedimento: ProcedimentoCode;
  parteProcessuale: ParteProcessuale | "COMUNE";

  /** Colonna: "EVENTO / SCADENZE" */
  eventoLabel: string;
  /** Codice tecnico per il dropdown Evento (es. "NOTIFICA_CITAZIONE") */
  eventoCode: string;

  /** Colonna: "EVENTO BASE INSERITO DALL'UTENTE" (es. "dataPrimaUdienza") */
  eventoBaseKey: string | null;

  /** Colonne: segno (+/-), numero, unità (giorni/mesi/anno) */
  direzioneCalcolo: "+" | "-" | null;
  numero: number | null;
  unita: "giorni" | "mesi" | "anno" | null;

  /** Colonna: "TIPO TERMINE" (perentorio/ordinatorio/manuale/da parametrizzare) */
  tipoTermine: "perentorio" | "ordinatorio" | "manuale" | "da_parametrizzare";

  /** Flag: genera una scadenza calcolata (true) o solo attività/promemoria (false) */
  isTermine: boolean;

  /** Flag sospensione feriale */
  isSospensioneFeriale: boolean;
  /** Flag slittamento per festivi */
  isPromemoriaFestivi: boolean;

  /** Colonna: "NORMA" */
  norma: string | null;
  /** Colonna: "NOTE OPERATIVE" */
  noteOperative: string | null;

  /** Ordine di visualizzazione nella timeline / dropdown */
  ordine: number;

  /**
   * Se valorizzato, indica che la data calcolata da questa riga deve diventare
   * un nuovo input (es. "dataPrimaNotificaCitazione") che potrà essere usato
   * come EVENTO BASE in altre righe.
   */
  providesInputKey?: string | null;

  /**
   * Se true, questa riga deve comparire anche nel dropdown "Evento".
   * In molti casi tutte le righe sono selezionabili; in altri casi solo
   * alcune righe (es. righe tecniche di appoggio) non vanno mostrate.
   */
  selectableInDropdown?: boolean;
}

export interface ExcelImportResult {
  eventRules: EventRule[];
  eventiDisponibili: EventoDisponibile[];
}

/**
 * Converte un array di righe Excel normalizzate in:
 *   - EventRule[] per il motore data-driven
 *   - EventoDisponibile[] per popolare il dropdown Evento per un singolo procedimento
 *
 * La funzione è pura: non registra direttamente le regole né modifica lo stato globale.
 */
export function fromExcelJson(rows: ExcelRuleRow[]): ExcelImportResult {
  const eventRules: EventRule[] = [];
  const eventiDisponibili: EventoDisponibile[] = [];

  for (const row of rows) {
    eventRules.push({
      macroArea: row.macroArea,
      procedimento: row.procedimento,
      parteProcessuale: row.parteProcessuale as ParteProcessuale,
      eventoBaseKey: row.eventoBaseKey,
      eventoLabel: row.eventoLabel,
      direzioneCalcolo: row.direzioneCalcolo,
      numero: row.numero,
      unita: row.unita,
      tipoTermine: row.tipoTermine,
      isTermine: row.isTermine,
      isSospensioneFeriale: row.isSospensioneFeriale,
      isPromemoriaFestivi: row.isPromemoriaFestivi,
      norma: row.norma,
      noteOperative: row.noteOperative,
      ordine: row.ordine,
      providesInputKey: row.providesInputKey ?? null,
    });

    if (row.selectableInDropdown !== false) {
      eventiDisponibili.push({
        code: row.eventoCode,
        label: row.eventoLabel,
        inputKey: row.eventoBaseKey ?? (row.providesInputKey || row.eventoCode),
        parteProcessuale: row.parteProcessuale as ParteProcessuale,
        ordine: row.ordine,
      });
    }
  }

  return { eventRules, eventiDisponibili };
}

