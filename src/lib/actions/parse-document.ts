"use server";

import OpenAI from "openai";
import { z } from "zod";
const OPENAI_MODEL = "gpt-4o-mini";

const ACTION_TYPE_VALUES = ["CITAZIONE", "RICORSO_OPPOSIZIONE", "RICORSO_TRIBUTARIO", "APPELLO_CIVILE", "APPELLO_TRIBUTARIO", "RICORSO_CASSAZIONE"] as const;
const ACTION_MODE_VALUES = ["COSTITUZIONE", "DA_NOTIFICARE"] as const;

const MACRO_AREA_VALUES = ["CIVILE_CONTENZIOSO", "PROCEDIMENTI_SPECIALI", "ESECUZIONI", "LAVORO", "TRIBUTARIO", "CASSAZIONE", "STRAGIUDIZIALE", "AMMINISTRATIVO"] as const;
const PROCEDIMENTO_VALUES = [
  "CITAZIONE_CIVILE", "RICORSO_RITO_SEMPLIFICATO", "OPPOSIZIONE_DECRETO_INGIUNTIVO", "APPELLO_CIVILE",
  "RIASSUNZIONE_PROCESSO", "INTERRUZIONE_RIASSUNZIONE", "REGOLAMENTO_COMPETENZA",
  "DECRETO_INGIUNTIVO", "OPPOSIZIONE_DECRETO_INGIUNTIVO_SPEC", "PROCEDIMENTO_CAUTELARE",
  "ATP", "PROCEDIMENTO_SOMMARIO", "CONVALIDA_SFRATTO",
  "PIGNORAMENTO_MOBILIARE", "PIGNORAMENTO_IMMOBILIARE", "PIGNORAMENTO_PRESSO_TERZI",
  "OPPOSIZIONE_ESECUZIONE", "OPPOSIZIONE_ATTI_ESECUTIVI",
  "RICORSO_LAVORO", "APPELLO_LAVORO",
  "RICORSO_TRIBUTARIO", "APPELLO_TRIBUTARIO",
  "RICORSO_CASSAZIONE", "CONTRORICORSO",
  "DIFFIDA", "MEDIAZIONE", "NEGOZIAZIONE_ASSISTITA", "TRANSAZIONE",
  "RICORSO_TAR", "MOTIVI_AGGIUNTI", "RICORSO_INCIDENTALE", "APPELLO_CONSIGLIO_STATO",
  "REVOCAZIONE", "OPPOSIZIONE_TERZO", "OTTEMPERANZA",
] as const;
const PARTE_PROCESSUALE_VALUES = ["ATTORE", "CONVENUTO"] as const;

/** Risposta strutturata dall'AI per precompilare il form Atto Giuridico */
const parsedDocumentSchema = z.object({
  title: z.string().optional().default(""),
  description: z.string().optional().default(""),
  type: z.enum(["udienza", "notifica", "deposito", "scadenza", "altro"]).optional().default("altro"),
  macroArea: z.enum(MACRO_AREA_VALUES).optional(),
  procedimento: z.enum(PROCEDIMENTO_VALUES).optional(),
  parteProcessuale: z.enum(PARTE_PROCESSUALE_VALUES).optional(),
  eventoCode: z.string().optional(),
  actionType: z.enum(ACTION_TYPE_VALUES).optional(),
  actionMode: z.enum(ACTION_MODE_VALUES).optional(),
  inputs: z.record(z.unknown()).optional().default({}),
  notes: z.string().optional().default(""),
});

export type ParsedDocumentResult = z.infer<typeof parsedDocumentSchema>;

export type ParseDocumentActionResult =
  | { success: true; data: ParsedDocumentResult }
  | { success: false; error: string };

const EXTRACT_PROMPT = `Sei un assistente che estrae dati da documenti legali italiani (citazioni, ricorsi, opposizioni, appelli, decreti ingiuntivi, sentenze, ecc.).
Dal testo del documento estrai TUTTI i dati utili per un calendario legale, in particolare LE DATE.

REGOLA FONDAMENTALE: Cerca sempre nel testo ogni data (udienza, notifica, deposito, scadenza, pubblicazione, ecc.) e inseriscila in "inputs" con la chiave corretta. Le date in Italia sono spesso scritte come gg/mm/aaaa, "il 15 marzo 2024", "udienza del 20/04/2024", "data notifica 10.05.2024". Converti SEMPRE in formato ISO: YYYY-MM-DD (es. 2024-03-15). Se è indicata anche l'ora, usa YYYY-MM-DDTHH:mm:ss.

Restituisci SOLO un JSON valido, senza markdown né testo prima/dopo, con queste chiavi:
- title: stringa breve che riassume la pratica (es. "Citazione Tizio vs Caio"); se presente nel documento, includi anche l'autorità giudiziaria (es. Tribunale di Napoli, Giudice di pace di Salerno) e il numero di RG (Ruolo Generale)
- description: stringa opzionale con dettagli o adempimenti
- type: uno tra "udienza", "notifica", "deposito", "scadenza", "altro"
- macroArea: la macro area del procedimento, uno tra: "CIVILE_CONTENZIOSO" (civile ordinario), "PROCEDIMENTI_SPECIALI" (decreto ingiuntivo, cautelari, ATP, sommario, sfratto), "ESECUZIONI" (pignoramenti, opposizioni esecuzione), "LAVORO" (ricorso/appello lavoro), "TRIBUTARIO" (ricorso/appello tributario), "CASSAZIONE" (ricorso cassazione, controricorso), "STRAGIUDIZIALE" (diffida, mediazione, negoziazione assistita, transazione), "AMMINISTRATIVO" (TAR, Consiglio di Stato, revocazione)
- procedimento: il tipo specifico, uno tra: "CITAZIONE_CIVILE", "RICORSO_RITO_SEMPLIFICATO", "OPPOSIZIONE_DECRETO_INGIUNTIVO", "APPELLO_CIVILE", "RIASSUNZIONE_PROCESSO", "INTERRUZIONE_RIASSUNZIONE", "REGOLAMENTO_COMPETENZA", "DECRETO_INGIUNTIVO", "OPPOSIZIONE_DECRETO_INGIUNTIVO_SPEC", "PROCEDIMENTO_CAUTELARE", "ATP", "PROCEDIMENTO_SOMMARIO", "CONVALIDA_SFRATTO", "PIGNORAMENTO_MOBILIARE", "PIGNORAMENTO_IMMOBILIARE", "PIGNORAMENTO_PRESSO_TERZI", "OPPOSIZIONE_ESECUZIONE", "OPPOSIZIONE_ATTI_ESECUTIVI", "RICORSO_LAVORO", "APPELLO_LAVORO", "RICORSO_TRIBUTARIO", "APPELLO_TRIBUTARIO", "RICORSO_CASSAZIONE", "CONTRORICORSO", "DIFFIDA", "MEDIAZIONE", "NEGOZIAZIONE_ASSISTITA", "TRANSAZIONE", "RICORSO_TAR", "MOTIVI_AGGIUNTI", "RICORSO_INCIDENTALE", "APPELLO_CONSIGLIO_STATO", "REVOCAZIONE", "OPPOSIZIONE_TERZO", "OTTEMPERANZA"
- parteProcessuale: "ATTORE" se il documento riguarda la parte attiva (attore, ricorrente, appellante, creditore), "CONVENUTO" se riguarda la parte passiva (convenuto, resistente, appellato, debitore)
- eventoCode: (opzionale) l'evento specifico del procedimento. Per CITAZIONE_CIVILE usa ESATTAMENTE uno tra:
  "NOTIFICA_CITAZIONE",
  "ISCRIZIONE_RUOLO",
  "COSTITUZIONE_CONVENUTO",
  "SLITTAMENTO_UDIENZA",
  "MEMORIA_171TER_1",
  "MEMORIA_171TER_2",
  "MEMORIA_171TER_3",
  "UDIENZA_ISTRUTTORIA",
  "UDIENZA_CONCLUSIONI",
  "NOTE_PRECISAZIONE_CONCLUSIONI",
  "COMPARSA_CONCLUSIONALE",
  "MEMORIA_REPLICA",
  "SENTENZA",
  "NOTIFICA_SENTENZA".
  Scegli l'evento più rilevante in base al contenuto del documento. Se non riesci a individuarlo con sufficiente certezza, NON valorizzare eventoCode.
- actionType: (legacy, opzionale) uno tra "CITAZIONE", "RICORSO_OPPOSIZIONE", "RICORSO_TRIBUTARIO", "APPELLO_CIVILE", "APPELLO_TRIBUTARIO", "RICORSO_CASSAZIONE"
- actionMode: (legacy, opzionale) "COSTITUZIONE" o "DA_NOTIFICARE"
- inputs: OGGETTO OBBLIGATORIO con le date trovate nel documento. Usa ESATTAMENTE queste chiavi quando applicabile:
  * Per citazione/notifica: dataPrimaNotificaCitazione, dataPrimaUdienza, dataNotifica, dataNotificaCitazione
  * Per udienza: dataUdienzaComparizione, dataUdienzaRiferimentoMemorie (usa dataPrimaUdienza per la data dell'udienza/comparizione nella citazione civile)
  * Per decreto/opposizione: dataNotificaDecretoIngiuntivo
  * Per ricorso/sentenza: dataNotificaRicorso, dataNotificaSentenza, dataPubblicazioneSentenza, dataNotificaAttoImpugnato
  * Per appello: dataNotificaAppello, dataNotificaSentenza, dataPubblicazioneSentenza
  * Per esecuzioni: dataNotificaPrecetto, dataNotificaPignoramento
  * Altri: giorniOpposizione, giorniIscrizioneRuolo, giorniCostituzione (numero), sceltaTermineImpugnazione ("BREVE" o "LUNGO")
  Ogni data deve essere in formato ISO (YYYY-MM-DD o YYYY-MM-DDTHH:mm:ss). Inserisci in inputs TUTTE le date che trovi nel testo.
- notes: stringa opzionale con note

Esempio: se nel testo c'è "udienza fissata per il 15/04/2025 alle 9:30" e "data notifica 10 marzo 2025", inputs deve contenere almeno: { "dataPrimaUdienza": "2025-04-15T09:30:00", "dataPrimaNotificaCitazione": "2025-03-10" } (e altre chiavi se le riconosci). Il JSON deve essere parsabile.`;

// ── Rinvio (verbale / comunicazione cancelleria) ─────────────────────

const adempimentoEstrattoSchema = z.object({
  titolo: z.string(),
  scadenza: z.string(), // ISO date YYYY-MM-DD
});

const TIPI_UDIENZA_RINVIO = ["TRATTAZIONE", "PRIMA_COMPARIZIONE", "PROVA_TESTIMONIALE", "INTERROGATORIO_FORMALE", "GIURAMENTO_CTU", "CHIARIMENTI_CTU", "PRECISAZIONE_CONCLUSIONI", "DISCUSSIONE_ORALE", "TENTATIVO_CONCILIAZIONE", "COMPARIZIONE_PERSONALE", "ALTRO"] as const;

const parsedRinvioSchema = z.object({
  dataUdienza: z.string().optional(), // ISO date (YYYY-MM-DD) o datetime
  tipoUdienza: z.enum(TIPI_UDIENZA_RINVIO).optional(),
  adempimenti: z.array(adempimentoEstrattoSchema).optional().default([]),
});

export type ParsedRinvioResult = z.infer<typeof parsedRinvioSchema>;

export type ParseDocumentForRinvioResult =
  | { success: true; data: ParsedRinvioResult }
  | { success: false; error: string };

const EXTRACT_RINVIO_PROMPT = `Sei un assistente che estrae dati da verbali di udienza o comunicazioni della cancelleria italiana.
Dal testo estrai:
1) La DATA DI RINVIO (nuova data di udienza fissata) – in formato ISO YYYY-MM-DD (es. 2025-05-20). Se è indicata l'ora, usa YYYY-MM-DDTHH:mm:ss.
2) Il TIPO di udienza, se riconoscibile: uno tra TRATTAZIONE, PRIMA_COMPARIZIONE, PROVA_TESTIMONIALE, INTERROGATORIO_FORMALE, GIURAMENTO_CTU, CHIARIMENTI_CTU, PRECISAZIONE_CONCLUSIONI, DISCUSSIONE_ORALE, TENTATIVO_CONCILIAZIONE, COMPARIZIONE_PERSONALE. Se non chiaro, usa ALTRO.
3) Gli ADEMPIMENTI con i rispettivi TERMINI: ogni voce del tipo "deposito memorie entro il 15/05/2025", "deposito documenti entro il 20 maggio 2025", "note di trattazione scritta entro il 10/06/2025", ecc. Va estratta come oggetto con "titolo" (es. "Deposito memorie") e "scadenza" in formato ISO YYYY-MM-DD.

Restituisci SOLO un JSON valido, senza markdown né testo prima/dopo:
{
  "dataUdienza": "YYYY-MM-DD" o "YYYY-MM-DDTHH:mm:ss",
  "tipoUdienza": "TRATTAZIONE" | "PRIMA_COMPARIZIONE" | ... | "ALTRO",
  "adempimenti": [
    { "titolo": "Deposito memorie", "scadenza": "2025-05-15" },
    ...
  ]
}
Se non trovi la data di rinvio o gli adempimenti, restituisci comunque il JSON con dataUdienza e adempimenti vuoti o parziali. Le date in Italia sono spesso gg/mm/aaaa: convertile in YYYY-MM-DD.`;

async function extractTextFromPdf(buffer: Buffer): Promise<string> {
  // pdf-parse@1.1.1: API legacy senza worker (evita errore pdf.worker.mjs su Railway/Next server)
  const { default: pdfParse } = await import("pdf-parse-debugging-disabled");
  const data = await pdfParse(buffer);
  const text = (data?.text ?? "").trim();
  return text || "(Nessun testo estratto dal PDF)";
}

function parseJsonFromResponse(content: string): unknown {
  const trimmed = content.trim();
  const start = trimmed.indexOf("{");
  const end = trimmed.lastIndexOf("}") + 1;
  if (start === -1 || end <= start) throw new Error("Nessun JSON trovato nella risposta");
  return JSON.parse(trimmed.slice(start, end)) as unknown;
}

export async function parseDocumentForEvent(formData: FormData): Promise<ParseDocumentActionResult> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey?.trim()) {
    return { success: false, error: "OPENAI_API_KEY non configurata. Aggiungila in .env.local." };
  }

  const file = formData.get("file");
  if (!file || !(file instanceof File)) {
    return { success: false, error: "Nessun file allegato." };
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const mime = file.type?.toLowerCase() ?? "";
  const isPdf = mime === "application/pdf" || file.name?.toLowerCase().endsWith(".pdf");
  const isImage = /^image\/(jpeg|png|gif|webp)$/.test(mime);

  let textToSend: string;
  let imagePart: { type: "image_url"; image_url: { url: string } } | null = null;

  if (isPdf) {
    try {
      textToSend = await extractTextFromPdf(buffer);
      if (!textToSend || textToSend === "(Nessun testo estratto dal PDF)") {
        return { success: false, error: "Impossibile estrarre testo dal PDF. Prova con un PDF con testo selezionabile (non solo scansione)." };
      }
    } catch (e) {
      return {
        success: false,
        error: e instanceof Error ? e.message : "Errore durante la lettura del PDF.",
      };
    }
  } else if (isImage) {
    const base64 = buffer.toString("base64");
    const dataUrl = `data:${mime};base64,${base64}`;
    imagePart = { type: "image_url", image_url: { url: dataUrl } };
    textToSend = "Estrai i dati dal seguente documento legale (immagine).";
  } else {
    return {
      success: false,
      error: "Formato non supportato. Usa un PDF o un'immagine (JPEG, PNG, WebP).",
    };
  }

  const openai = new OpenAI({ apiKey });

  const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
    { role: "system", content: EXTRACT_PROMPT },
    {
      role: "user",
      content: imagePart
        ? ([{ type: "text", text: textToSend }, imagePart] as OpenAI.Chat.Completions.ChatCompletionContentPart[])
        : `Testo del documento:\n\n${textToSend.slice(0, 120000)}`,
    },
  ];

  try {
    const completion = await openai.chat.completions.create({
      model: OPENAI_MODEL,
      messages,
      response_format: { type: "json_object" },
      temperature: 0.2,
    });

    const raw = completion.choices[0]?.message?.content?.trim();
    if (!raw) {
      return { success: false, error: "L'AI non ha restituito una risposta valida." };
    }

    const parsed = parseJsonFromResponse(raw) as Record<string, unknown>;
    const validated = parsedDocumentSchema.safeParse({
      title: parsed.title ?? "",
      description: parsed.description ?? "",
      type: parsed.type ?? "altro",
      macroArea: parsed.macroArea ?? undefined,
      procedimento: parsed.procedimento ?? undefined,
      parteProcessuale: parsed.parteProcessuale ?? undefined,
      eventoCode: parsed.eventoCode ?? undefined,
      actionType: parsed.actionType ?? undefined,
      actionMode: parsed.actionMode ?? undefined,
      inputs: parsed.inputs ?? {},
      notes: parsed.notes ?? "",
    });

    if (!validated.success) {
      return {
        success: false,
        error: "Dati estratti non validi. Verifica e inserisci manualmente se necessario.",
      };
    }

    return { success: true, data: validated.data };
  } catch (e) {
    const message = e instanceof Error ? e.message : "Errore durante l'analisi del documento.";
    return { success: false, error: message };
  }
}

export async function parseDocumentForRinvio(formData: FormData): Promise<ParseDocumentForRinvioResult> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey?.trim()) {
    return { success: false, error: "OPENAI_API_KEY non configurata. Aggiungila in .env.local." };
  }

  const file = formData.get("file");
  if (!file || !(file instanceof File)) {
    return { success: false, error: "Nessun file allegato." };
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const mime = file.type?.toLowerCase() ?? "";
  const isPdf = mime === "application/pdf" || file.name?.toLowerCase().endsWith(".pdf");
  const isImage = /^image\/(jpeg|png|gif|webp)$/.test(mime);

  let textToSend: string;
  let imagePart: { type: "image_url"; image_url: { url: string } } | null = null;

  if (isPdf) {
    try {
      textToSend = await extractTextFromPdf(buffer);
      if (!textToSend || textToSend === "(Nessun testo estratto dal PDF)") {
        return { success: false, error: "Impossibile estrarre testo dal PDF. Prova con un PDF con testo selezionabile (non solo scansione)." };
      }
    } catch (e) {
      return {
        success: false,
        error: e instanceof Error ? e.message : "Errore durante la lettura del PDF.",
      };
    }
  } else if (isImage) {
    const base64 = buffer.toString("base64");
    const dataUrl = `data:${mime};base64,${base64}`;
    imagePart = { type: "image_url", image_url: { url: dataUrl } };
    textToSend = "Estrai data di rinvio e adempimenti con termini dal seguente verbale o comunicazione (immagine).";
  } else {
    return {
      success: false,
      error: "Formato non supportato. Usa un PDF o un'immagine (JPEG, PNG, WebP).",
    };
  }

  const openai = new OpenAI({ apiKey });

  const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
    { role: "system", content: EXTRACT_RINVIO_PROMPT },
    {
      role: "user",
      content: imagePart
        ? ([{ type: "text", text: textToSend }, imagePart] as OpenAI.Chat.Completions.ChatCompletionContentPart[])
        : `Testo del documento:\n\n${textToSend.slice(0, 120000)}`,
    },
  ];

  try {
    const completion = await openai.chat.completions.create({
      model: OPENAI_MODEL,
      messages,
      response_format: { type: "json_object" },
      temperature: 0.2,
    });

    const raw = completion.choices[0]?.message?.content?.trim();
    if (!raw) {
      return { success: false, error: "L'AI non ha restituito una risposta valida." };
    }

    const parsed = parseJsonFromResponse(raw) as Record<string, unknown>;
    const validated = parsedRinvioSchema.safeParse({
      dataUdienza: parsed.dataUdienza ?? undefined,
      tipoUdienza: parsed.tipoUdienza ?? undefined,
      adempimenti: Array.isArray(parsed.adempimenti) ? parsed.adempimenti : [],
    });

    if (!validated.success) {
      return {
        success: false,
        error: "Dati estratti non validi. Verifica e inserisci manualmente se necessario.",
      };
    }

    return { success: true, data: validated.data };
  } catch (e) {
    const message = e instanceof Error ? e.message : "Errore durante l'analisi del documento.";
    return { success: false, error: message };
  }
}
