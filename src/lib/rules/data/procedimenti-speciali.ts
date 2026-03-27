/**
 * Regole per la macro area: PROCEDIMENTI SPECIALI
 * - Decreto ingiuntivo – post Riforma Cartabia
 * - Accertamento tecnico preventivo (ATP) ex art. 696 c.p.c.
 */

import type { ExcelRuleRow } from "@/lib/rules/excel-import";
import { fromExcelJson } from "@/lib/rules/excel-import";
import { registerEventRules } from "@/types/macro-areas";

const DECRETO_INGIUNTIVO_ROWS: ExcelRuleRow[] = [
  {
    macroArea: "PROCEDIMENTI_SPECIALI",
    procedimento: "DECRETO_INGIUNTIVO",
    parteProcessuale: "ATTORE", // Ricorrente
    eventoLabel: "Deposito ricorso",
    eventoCode: "DEPOSITO_RICORSO_DI",
    eventoBaseKey: null,
    direzioneCalcolo: null,
    numero: null,
    unita: null,
    tipoTermine: "manuale",
    isTermine: false,
    isSospensioneFeriale: false,
    isPromemoriaFestivi: false,
    norma: "Art. 638 c.p.c.",
    noteOperative:
      "Evento iniziale del procedimento monitorio: deposito del ricorso con i documenti.",
    ordine: 1,
  },
  {
    macroArea: "PROCEDIMENTI_SPECIALI",
    procedimento: "DECRETO_INGIUNTIVO",
    parteProcessuale: "ATTORE", // Ricorrente
    eventoLabel: "Notifica decreto",
    eventoCode: "NOTIFICA_DECRETO_DI",
    eventoBaseKey: "dataEmissioneDecreto",
    direzioneCalcolo: "+",
    numero: 60,
    unita: "giorni",
    tipoTermine: "perentorio",
    isTermine: true,
    isSospensioneFeriale: true,
    isPromemoriaFestivi: true,
    norma: "Art. 644 c.p.c.",
    noteOperative:
      "Il decreto diventa inefficace se non è notificato entro 60 giorni dalla pronuncia; se la notifica deve avvenire all'estero il termine va parametrizzato a 90 giorni.",
    ordine: 2,
  },
  {
    macroArea: "PROCEDIMENTI_SPECIALI",
    procedimento: "DECRETO_INGIUNTIVO",
    parteProcessuale: "CONVENUTO", // Intimato
    eventoLabel: "Termine opposizione",
    eventoCode: "TERMINE_OPPOSIZIONE_DI",
    eventoBaseKey: "dataNotificaDecreto",
    direzioneCalcolo: "+",
    numero: 40,
    unita: "giorni",
    tipoTermine: "perentorio",
    isTermine: true,
    isSospensioneFeriale: true,
    isPromemoriaFestivi: true,
    norma: "Art. 641 c.p.c.",
    noteOperative:
      "Termine ordinario per proporre opposizione: 40 giorni dalla notifica del decreto, salvo termini diversi fissati dal giudice o previsti per intimato residente all'estero.",
    ordine: 3,
  },
  {
    macroArea: "PROCEDIMENTI_SPECIALI",
    procedimento: "DECRETO_INGIUNTIVO",
    parteProcessuale: "ATTORE", // Ricorrente
    eventoLabel: "Scadenza del Termine per l'opposizione",
    eventoCode: "NOTIFICA_OPPOSIZIONE_DI",
    eventoBaseKey: "dataNotificaDecreto",
    direzioneCalcolo: "+",
    numero: 40,
    unita: "giorni",
    tipoTermine: "perentorio",
    isTermine: true,
    isSospensioneFeriale: true,
    isPromemoriaFestivi: true,
    norma: "Art. 645 c.p.c.",
    noteOperative:
      "L'opposizione, di regola proposta con atto di citazione, va notificata al ricorrente entro il termine utile di opposizione.",
    ordine: 4,
  },
  {
    macroArea: "PROCEDIMENTI_SPECIALI",
    procedimento: "DECRETO_INGIUNTIVO",
    parteProcessuale: "ATTORE", // Ricorrente
    eventoLabel: "Esecutività decreto per mancata opposizione",
    eventoCode: "ESECUTIVITA_DECRETO_DI",
    eventoBaseKey: null,
    direzioneCalcolo: null,
    numero: null,
    unita: null,
    tipoTermine: "manuale",
    isTermine: false,
    isSospensioneFeriale: false,
    isPromemoriaFestivi: false,
    norma: "Art. 641 c.p.c. e Art. 647 c.p.c.",
    noteOperative:
      "Non è un effetto puramente automatico di calendario: il giudice, su istanza anche verbale del ricorrente, dichiara esecutivo il decreto se non è stata fatta opposizione nel termine.",
    ordine: 5,
  },
  {
    macroArea: "PROCEDIMENTI_SPECIALI",
    procedimento: "DECRETO_INGIUNTIVO",
    parteProcessuale: "COMUNE",
    eventoLabel: "Il giudizio di opposizione continua come Procedimento citazione civile",
    eventoCode: "PONTE_OPPOSIZIONE_DI",
    eventoBaseKey: null,
    direzioneCalcolo: null,
    numero: null,
    unita: null,
    tipoTermine: "manuale",
    isTermine: false,
    isSospensioneFeriale: false,
    isPromemoriaFestivi: false,
    norma: "Art. 645 c.p.c.",
    noteOperative:
      "Evento-ponte: se viene proposta opposizione, la pratica va agganciata al workflow del procedimento 'citazione civile' o alla scheda dedicata all'opposizione a decreto ingiuntivo.",
    ordine: 6,
  },
];

const { eventRules: DECRETO_INGIUNTIVO_RULES } = fromExcelJson(
  DECRETO_INGIUNTIVO_ROWS,
);

// ── Accertamento tecnico preventivo (ATP) ex art. 696 c.p.c. ────────────────

const ATP_ROWS: ExcelRuleRow[] = [
  {
    macroArea: "PROCEDIMENTI_SPECIALI",
    procedimento: "ATP",
    parteProcessuale: "ATTORE", // Ricorrente
    eventoLabel: "Deposito ricorso",
    eventoCode: "DEPOSITO_RICORSO_ATP",
    eventoBaseKey: null,
    direzioneCalcolo: null,
    numero: null,
    unita: null,
    tipoTermine: "manuale",
    isTermine: false,
    isSospensioneFeriale: false,
    isPromemoriaFestivi: false,
    norma: "Art. 696 c.p.c.",
    noteOperative:
      "Evento iniziale del procedimento: il ricorso si propone al giudice competente con indicazione dell'urgenza e dell'accertamento richiesto.",
    ordine: 1,
  },
  {
    macroArea: "PROCEDIMENTI_SPECIALI",
    procedimento: "ATP",
    parteProcessuale: "ATTORE", // Ricorrente
    eventoLabel: "Emissione decreto",
    eventoCode: "EMISSIONE_DECRETO_ATP",
    eventoBaseKey: null,
    direzioneCalcolo: null,
    numero: null,
    unita: null,
    tipoTermine: "manuale",
    isTermine: false,
    isSospensioneFeriale: false,
    isPromemoriaFestivi: false,
    norma: "Art. 696 c.p.c.",
    noteOperative:
      "Nel procedimento ATP il giudice emette il provvedimento di fissazione dell'udienza e/o di nomina del consulente. Non esiste un termine fisso legale come nel decreto ingiuntivo; va gestito come evento manuale.",
    ordine: 2,
  },
  {
    macroArea: "PROCEDIMENTI_SPECIALI",
    procedimento: "ATP",
    parteProcessuale: "ATTORE", // Ricorrente
    eventoLabel: "Notifica ricorso e decreto",
    eventoCode: "NOTIFICA_RICORSO_DECRETO_ATP",
    eventoBaseKey: null,
    direzioneCalcolo: null,
    numero: null,
    unita: null,
    tipoTermine: "manuale",
    isTermine: false,
    isSospensioneFeriale: false,
    isPromemoriaFestivi: false,
    norma: "Art. 696 c.p.c.",
    noteOperative:
      "La notificazione del ricorso e del decreto alla controparte è necessaria per l'instaurazione del contraddittorio, salvo casi di eccezionale urgenza.",
    ordine: 3,
  },
  {
    macroArea: "PROCEDIMENTI_SPECIALI",
    procedimento: "ATP",
    parteProcessuale: "COMUNE",
    eventoLabel: "Data inizio operazioni peritali",
    eventoCode: "INIZIO_OPERAZIONI_PERITALI_ATP",
    eventoBaseKey: null,
    direzioneCalcolo: null,
    numero: null,
    unita: null,
    tipoTermine: "da_parametrizzare",
    isTermine: false,
    isSospensioneFeriale: false,
    isPromemoriaFestivi: false,
    norma: "Art. 698 c.p.c.",
    noteOperative:
      "Nell'ATP non c'è un giudizio di opposizione. Dopo l'espletamento dell'accertamento, la parte può promuovere il giudizio di merito, da agganciare al workflow del procedimento ordinario di citazione civile se coerente col caso concreto.",
    ordine: 4,
  },
];

const { eventRules: ATP_RULES } = fromExcelJson(ATP_ROWS);

registerEventRules(DECRETO_INGIUNTIVO_RULES);
registerEventRules(ATP_RULES);

export { DECRETO_INGIUNTIVO_RULES, ATP_RULES };
