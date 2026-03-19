/**
 * Regole per la macro area: PROCEDIMENTI SPECIALI
 * Procedimento: Decreto ingiuntivo – post Riforma Cartabia
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
    parteProcessuale: "CONVENUTO", // Intimato
    eventoLabel: "Notifica opposizione al ricorrente",
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

registerEventRules(DECRETO_INGIUNTIVO_RULES);

export { DECRETO_INGIUNTIVO_RULES };
