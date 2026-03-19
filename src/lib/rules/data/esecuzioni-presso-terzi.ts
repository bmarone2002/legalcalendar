/**
 * Regole per la macro area: ESECUZIONI
 * Procedimento: Pignoramento presso terzi – post Riforma Cartabia
 */

import type { ExcelRuleRow } from "@/lib/rules/excel-import";
import { fromExcelJson } from "@/lib/rules/excel-import";
import { registerEventRules } from "@/types/macro-areas";

const PIGNORAMENTO_PRESSO_TERZI_ROWS: ExcelRuleRow[] = [
  // 1) Creditore: Notifica precetto
  {
    macroArea: "ESECUZIONI",
    procedimento: "PIGNORAMENTO_PRESSO_TERZI",
    parteProcessuale: "ATTORE", // Creditore
    eventoLabel: "Notifica precetto",
    eventoCode: "NOTIFICA_PRECETTO_PRESO_TERZI",
    eventoBaseKey: null,
    direzioneCalcolo: null,
    numero: null,
    unita: null,
    tipoTermine: "manuale",
    isTermine: false,
    isSospensioneFeriale: false,
    isPromemoriaFestivi: false,
    norma: "Art. 480 c.p.c.",
    noteOperative:
      "Evento iniziale dell'esecuzione: il precetto intima di adempiere entro almeno 10 giorni.",
    ordine: 1,
  },

  // 2) Comune: Termine efficacia precetto (+90 giorni)
  {
    macroArea: "ESECUZIONI",
    procedimento: "PIGNORAMENTO_PRESSO_TERZI",
    parteProcessuale: "COMUNE",
    eventoLabel: "Termine efficacia precetto",
    eventoCode: "TERMINE_EFFICACIA_PRECETTO_PRESO_TERZI",
    eventoBaseKey: "dataNotificaPrecettoPressoTerzi",
    direzioneCalcolo: "+",
    numero: 90,
    unita: "giorni",
    tipoTermine: "perentorio",
    isTermine: true,
    isSospensioneFeriale: false,
    isPromemoriaFestivi: false,
    norma: "Art. 481 c.p.c.",
    noteOperative:
      "Il precetto diventa inefficace se nel termine di 90 giorni dalla sua notificazione non è iniziata l'esecuzione.",
    ordine: 2,
  },

  // 3) Creditore: Notifica pignoramento (+10 giorni da precetto)
  {
    macroArea: "ESECUZIONI",
    procedimento: "PIGNORAMENTO_PRESSO_TERZI",
    parteProcessuale: "ATTORE",
    eventoLabel: "Notifica pignoramento",
    eventoCode: "NOTIFICA_PIGNORAMENTO_PRESO_TERZI",
    eventoBaseKey: "dataNotificaPrecettoPressoTerzi",
    direzioneCalcolo: "+",
    numero: 10,
    unita: "giorni",
    tipoTermine: "da_parametrizzare",
    isTermine: true,
    isSospensioneFeriale: false,
    isPromemoriaFestivi: false,
    norma: "Artt. 480, 482 e 543 c.p.c.",
    noteOperative:
      "Il pignoramento presso terzi può essere notificato dopo il termine dilatorio di 10 giorni dal precetto, salvo autorizzazione del presidente del tribunale ex art. 482 c.p.c.; deve comunque intervenire entro i 90 giorni di efficacia del precetto.",
    ordine: 3,
  },

  // 4) Creditore: Iscrizione a ruolo (+30 giorni da ultima notifica pignoramento)
  {
    macroArea: "ESECUZIONI",
    procedimento: "PIGNORAMENTO_PRESSO_TERZI",
    parteProcessuale: "ATTORE",
    eventoLabel: "Iscrizione a ruolo esecuzione",
    eventoCode: "ISCRIZIONE_RUOLO_ESECUZIONE_PRESO_TERZI",
    eventoBaseKey: "dataUltimaNotificaPignoramentoPressoTerzi",
    direzioneCalcolo: "+",
    numero: 30,
    unita: "giorni",
    tipoTermine: "perentorio",
    isTermine: true,
    isSospensioneFeriale: false,
    isPromemoriaFestivi: false,
    norma: "Art. 543 c.p.c.",
    noteOperative:
      "Il creditore deve iscrivere a ruolo la procedura entro 30 giorni dalla notifica dell'atto di pignoramento; altrimenti il pignoramento perde efficacia.",
    ordine: 4,
  },

  // 5) Comune: Udienza comparizione (manuale)
  {
    macroArea: "ESECUZIONI",
    procedimento: "PIGNORAMENTO_PRESSO_TERZI",
    parteProcessuale: "COMUNE",
    eventoLabel: "Udienza comparizione",
    eventoCode: "UDIENZA_COMPARIZIONE_PRESO_TERZI",
    eventoBaseKey: null,
    direzioneCalcolo: null,
    numero: null,
    unita: null,
    tipoTermine: "manuale",
    isTermine: false,
    isSospensioneFeriale: false,
    isPromemoriaFestivi: false,
    norma: "Art. 543 c.p.c.",
    noteOperative:
      "Udienza di comparizione delle parti e del terzo, indicata nell'atto di pignoramento o poi gestita secondo l'iter del fascicolo.",
    ordine: 5,
  },

  // 6) Creditore: Notifica avvenuta iscrizione a ruolo al terzo (-1 giorno)
  {
    macroArea: "ESECUZIONI",
    procedimento: "PIGNORAMENTO_PRESSO_TERZI",
    parteProcessuale: "ATTORE",
    eventoLabel: "Notifica avvenuta iscrizione a ruolo al terzo",
    eventoCode: "NOTIFICA_AVVENUTA_ISCRIZIONE_RUOLO_TERZO_PRESO_TERZI",
    eventoBaseKey: "dataUdienzaIndicataAttoPignoramentoPressoTerzi",
    direzioneCalcolo: "-",
    numero: 1,
    unita: "giorni",
    tipoTermine: "perentorio",
    isTermine: true,
    isSospensioneFeriale: false,
    isPromemoriaFestivi: false,
    norma: "Art. 543 c.p.c.",
    noteOperative:
      "Entro la data dell'udienza indicata nell'atto di pignoramento il creditore deve notificare al terzo e al debitore l'avviso di avvenuta iscrizione a ruolo.",
    ordine: 6,
  },

  // 7) Comune: Ordinanza assegnazione (manuale)
  {
    macroArea: "ESECUZIONI",
    procedimento: "PIGNORAMENTO_PRESSO_TERZI",
    parteProcessuale: "COMUNE",
    eventoLabel: "Ordinanza assegnazione",
    eventoCode: "ORDINANZA_ASSEGNAZIONE_PRESO_TERZI",
    eventoBaseKey: null,
    direzioneCalcolo: null,
    numero: null,
    unita: null,
    tipoTermine: "manuale",
    isTermine: false,
    isSospensioneFeriale: false,
    isPromemoriaFestivi: false,
    norma: "Art. 553 c.p.c.",
    noteOperative:
      "Provvedimento tipico nel pignoramento di crediti: il giudice può assegnare le somme pignorate al creditore.",
    ordine: 7,
  },

  // 8) Creditore: Notifica Ordinanza assegnazione (da parametrizzare)
  {
    macroArea: "ESECUZIONI",
    procedimento: "PIGNORAMENTO_PRESSO_TERZI",
    parteProcessuale: "ATTORE",
    eventoLabel: "Notifica Ordinanza assegnazione",
    eventoCode: "NOTIFICA_ORDINANZA_ASSEGNAZIONE_PRESO_TERZI",
    eventoBaseKey: null,
    direzioneCalcolo: null,
    numero: null,
    unita: null,
    tipoTermine: "da_parametrizzare",
    isTermine: false,
    isSospensioneFeriale: false,
    isPromemoriaFestivi: false,
    norma: null,
    noteOperative:
      "Evento utile solo se si vuole tracciare la notificazione dell'ordinanza al terzo o alle parti per l'esecuzione del provvedimento.",
    ordine: 8,
  },

  // 9) Opponente: Notifica citazione in opposizione 615, comma 1 (manuale)
  {
    macroArea: "ESECUZIONI",
    procedimento: "PIGNORAMENTO_PRESSO_TERZI",
    parteProcessuale: "CONVENUTO",
    eventoLabel: "Notifica citazione in opposizione esecuzione 615, comma 1",
    eventoCode: "NOTIFICA_CITAZIONE_OPPOSIZIONE_615_1_PRESO_TERZI",
    eventoBaseKey: null,
    direzioneCalcolo: null,
    numero: null,
    unita: null,
    tipoTermine: "manuale",
    isTermine: false,
    isSospensioneFeriale: false,
    isPromemoriaFestivi: false,
    norma: "Art. 615, comma 1, c.p.c.",
    noteOperative:
      "Prima che l'esecuzione sia iniziata, l'opposizione all'esecuzione si propone con citazione davanti al giudice competente per materia o valore e territorio.",
    ordine: 9,
  },

  // 10) Opponente: Deposito Ricorso in opposizione 615, comma 2 (manuale)
  {
    macroArea: "ESECUZIONI",
    procedimento: "PIGNORAMENTO_PRESSO_TERZI",
    parteProcessuale: "CONVENUTO",
    eventoLabel: "Deposito Ricorso in opposizione esecuzione 615, comma 2",
    eventoCode: "DEPOSITO_RICORSO_OPPOSIZIONE_615_2_PRESO_TERZI",
    eventoBaseKey: null,
    direzioneCalcolo: null,
    numero: null,
    unita: null,
    tipoTermine: "manuale",
    isTermine: false,
    isSospensioneFeriale: false,
    isPromemoriaFestivi: false,
    norma: "Art. 615, comma 2, c.p.c.",
    noteOperative:
      "Quando l'esecuzione è già iniziata, l'opposizione all'esecuzione si propone con ricorso al giudice dell'esecuzione.",
    ordine: 10,
  },

  // 11) Comune: Udienza comparizione (615 c.2) (manuale)
  {
    macroArea: "ESECUZIONI",
    procedimento: "PIGNORAMENTO_PRESSO_TERZI",
    parteProcessuale: "COMUNE",
    eventoLabel: "Udienza comparizione",
    eventoCode: "UDIENZA_COMPARIZIONE_615_2_PRESO_TERZI",
    eventoBaseKey: null,
    direzioneCalcolo: null,
    numero: null,
    unita: null,
    tipoTermine: "manuale",
    isTermine: false,
    isSospensioneFeriale: false,
    isPromemoriaFestivi: false,
    norma: "Art. 615, comma 2, c.p.c.",
    noteOperative:
      "Udienza fissata nel procedimento di opposizione all'esecuzione già iniziata.",
    ordine: 11,
  },

  // 12) Comune: Decreto fissazione udienza (615 c.2) (manuale)
  {
    macroArea: "ESECUZIONI",
    procedimento: "PIGNORAMENTO_PRESSO_TERZI",
    parteProcessuale: "COMUNE",
    eventoLabel: "Decreto fissazione udienza comparizione",
    eventoCode: "DECRETO_FISSAZIONE_UDIENZA_615_2_PRESO_TERZI",
    eventoBaseKey: null,
    direzioneCalcolo: null,
    numero: null,
    unita: null,
    tipoTermine: "manuale",
    isTermine: false,
    isSospensioneFeriale: false,
    isPromemoriaFestivi: false,
    norma: "Art. 615, comma 2, c.p.c.",
    noteOperative:
      "Il giudice dell'esecuzione fissa con decreto l'udienza di comparizione delle parti.",
    ordine: 12,
  },

  // 13) Opponente: Notifica Ricorso e Decreto (615 c.2) (manuale)
  {
    macroArea: "ESECUZIONI",
    procedimento: "PIGNORAMENTO_PRESSO_TERZI",
    parteProcessuale: "CONVENUTO",
    eventoLabel: "Notifica Ricorso e Decreto fissazione udienza di comparizione",
    eventoCode: "NOTIFICA_RICORSO_DECRETO_615_2_PRESO_TERZI",
    eventoBaseKey: null,
    direzioneCalcolo: null,
    numero: null,
    unita: null,
    tipoTermine: "manuale",
    isTermine: false,
    isSospensioneFeriale: false,
    isPromemoriaFestivi: false,
    norma: "Art. 615, comma 2, c.p.c.",
    noteOperative:
      "Il ricorso e il decreto devono essere notificati alla controparte nel termine assegnato dal giudice.",
    ordine: 13,
  },

  // 14) Opponente: Notifica citazione in opposizione atti 617, comma 1 (+20 giorni)
  {
    macroArea: "ESECUZIONI",
    procedimento: "PIGNORAMENTO_PRESSO_TERZI",
    parteProcessuale: "CONVENUTO",
    eventoLabel: "Notifica citazione in opposizione atti 617, comma 1",
    eventoCode: "NOTIFICA_CITAZIONE_OPPOSIZIONE_ATTI_617_1_PRESO_TERZI",
    eventoBaseKey: "dataNotificaPrecettoPressoTerzi",
    direzioneCalcolo: "+",
    numero: 20,
    unita: "giorni",
    tipoTermine: "perentorio",
    isTermine: true,
    isSospensioneFeriale: true,
    isPromemoriaFestivi: true,
    norma: "Art. 617, comma 1, c.p.c.",
    noteOperative:
      "Prima dell'inizio dell'esecuzione l'opposizione agli atti esecutivi si propone con citazione entro 20 giorni dalla notificazione del precetto o dal primo atto di esecuzione, se anteriore.",
    ordine: 14,
  },

  // 15) Opponente: Deposito Ricorso in opposizione atti 617, comma 2 (+20 giorni)
  {
    macroArea: "ESECUZIONI",
    procedimento: "PIGNORAMENTO_PRESSO_TERZI",
    parteProcessuale: "CONVENUTO",
    eventoLabel: "Deposito Ricorso in opposizione atti 617, comma 2",
    eventoCode: "DEPOSITO_RICORSO_OPPOSIZIONE_ATTI_617_2_PRESO_TERZI",
    eventoBaseKey: "dataConoscenzaAttoEsecutivoPressoTerzi",
    direzioneCalcolo: "+",
    numero: 20,
    unita: "giorni",
    tipoTermine: "perentorio",
    isTermine: true,
    isSospensioneFeriale: true,
    isPromemoriaFestivi: true,
    norma: "Art. 617, comma 2, c.p.c.",
    noteOperative:
      "Se l'esecuzione è già iniziata, l'opposizione agli atti esecutivi si propone con ricorso al giudice dell'esecuzione entro 20 giorni dal primo atto o dalla sua conoscenza legale.",
    ordine: 15,
  },

  // 16) Comune: Udienza comparizione (617 c.2) (manuale)
  {
    macroArea: "ESECUZIONI",
    procedimento: "PIGNORAMENTO_PRESSO_TERZI",
    parteProcessuale: "COMUNE",
    eventoLabel: "Udienza comparizione",
    eventoCode: "UDIENZA_COMPARIZIONE_617_2_PRESO_TERZI",
    eventoBaseKey: null,
    direzioneCalcolo: null,
    numero: null,
    unita: null,
    tipoTermine: "manuale",
    isTermine: false,
    isSospensioneFeriale: false,
    isPromemoriaFestivi: false,
    norma: "Art. 617, comma 2, c.p.c.",
    noteOperative:
      "Udienza fissata nel procedimento di opposizione agli atti esecutivi.",
    ordine: 16,
  },

  // 17) Comune: Decreto fissazione udienza (617 c.2) (manuale)
  {
    macroArea: "ESECUZIONI",
    procedimento: "PIGNORAMENTO_PRESSO_TERZI",
    parteProcessuale: "COMUNE",
    eventoLabel: "Decreto fissazione udienza comparizione",
    eventoCode: "DECRETO_FISSAZIONE_UDIENZA_617_2_PRESO_TERZI",
    eventoBaseKey: null,
    direzioneCalcolo: null,
    numero: null,
    unita: null,
    tipoTermine: "manuale",
    isTermine: false,
    isSospensioneFeriale: false,
    isPromemoriaFestivi: false,
    norma: "Art. 617, comma 2, c.p.c.",
    noteOperative:
      "Il giudice dell'esecuzione fissa con decreto l'udienza di comparizione delle parti.",
    ordine: 17,
  },

  // 18) Opponente: Notifica Ricorso in opposizione atti 617 c.2 (manuale)
  {
    macroArea: "ESECUZIONI",
    procedimento: "PIGNORAMENTO_PRESSO_TERZI",
    parteProcessuale: "CONVENUTO",
    eventoLabel: "Notifica Ricorso in opposizione atti esecutivi e Decreto fissazione udienza di comparizione",
    eventoCode: "NOTIFICA_RICORSO_DECRETO_617_2_PRESO_TERZI",
    eventoBaseKey: null,
    direzioneCalcolo: null,
    numero: null,
    unita: null,
    tipoTermine: "manuale",
    isTermine: false,
    isSospensioneFeriale: false,
    isPromemoriaFestivi: false,
    norma: "Art. 617, comma 2, c.p.c.",
    noteOperative:
      "Il ricorso e il decreto devono essere notificati alla controparte nel termine fissato dal giudice.",
    ordine: 18,
  },

  // 19) Comune: Notifica sentenza (termini appello) (+30 giorni)
  {
    macroArea: "ESECUZIONI",
    procedimento: "PIGNORAMENTO_PRESSO_TERZI",
    parteProcessuale: "COMUNE",
    eventoLabel: "Notifica Sentenza (per calcolare termini Appello)",
    eventoCode: "NOTIFICA_SENTENZA_APPello_PRESO_TERZI",
    eventoBaseKey: "dataNotificaSentenzaPressoTerzi",
    direzioneCalcolo: "+",
    numero: 30,
    unita: "giorni",
    tipoTermine: "manuale",
    isTermine: true,
    isSospensioneFeriale: false,
    isPromemoriaFestivi: false,
    norma: "Artt. 325 e 616 c.p.c.",
    noteOperative:
      "Data base per il termine breve dell'appello, quando la decisione è appellabile.",
    ordine: 19,
  },

  // 20) Comune: Deposito sentenza (termini appello) (+6 mesi)
  {
    macroArea: "ESECUZIONI",
    procedimento: "PIGNORAMENTO_PRESSO_TERZI",
    parteProcessuale: "COMUNE",
    eventoLabel: "Deposito Sentenza (per calcolare termini Appello)",
    eventoCode: "DEPOSITO_SENTENZA_APPello_PRESO_TERZI",
    eventoBaseKey: "dataDepositoSentenzaPressoTerzi",
    direzioneCalcolo: "+",
    numero: 6,
    unita: "mesi",
    tipoTermine: "manuale",
    isTermine: true,
    isSospensioneFeriale: false,
    isPromemoriaFestivi: false,
    norma: "Artt. 327 e 616 c.p.c.",
    noteOperative:
      "Data base per il termine lungo dell'appello, quando la decisione è appellabile.",
    ordine: 20,
  },
];

const { eventRules: PIGNORAMENTO_PRESSO_TERZI_RULES } = fromExcelJson(PIGNORAMENTO_PRESSO_TERZI_ROWS);

registerEventRules(PIGNORAMENTO_PRESSO_TERZI_RULES);

export { PIGNORAMENTO_PRESSO_TERZI_RULES };

