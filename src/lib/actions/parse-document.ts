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
const PARTE_PROCESSUALE_VALUES = ["ATTORE", "CONVENUTO", "COMUNE"] as const;

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

const EXTRACT_PROMPT = `Sei un assistente legale che analizza documenti italiani (citazioni, ricorsi, opposizioni, appelli, decreti ingiuntivi, verbali, sentenze, comunicazioni della cancelleria).

METODO: Analizza il documento DA CIMA A FONDO come farebbe un legale: prima il tipo di atto e l’autorità, poi le parti e il rito, poi la fase processuale in cui ci si trova, infine OGNI data menzionata. Ogni data deve essere assegnata alla chiave corretta in "inputs" in base al contesto (notifica della citazione vs data udienza vs deposito, ecc.).

PASSI OBBLIGATORI:
1) MACRO AREA e PROCEDIMENTO: dal tipo di atto (citazione, ricorso, opposizione, decreto ingiuntivo, appello, ecc.) e dall’autorità (Tribunale, GIP, TAR, ecc.) determina macroArea e procedimento.
2) MODALITÀ (parte processuale): "ATTORE" se il documento riguarda la parte attiva (attore, ricorrente, appellante, creditore), "CONVENUTO" se la parte passiva (convenuto, resistente, appellato, debitore), "COMUNE" solo se il documento è neutro o riguarda entrambe le parti (es. verbale di udienza, comunicazione del tribunale).
3) EVENTO (eventoCode): individua la FASE processuale a cui si riferisce il documento (notifica citazione, prima udienza, memorie 171-ter, udienza istruttoria, conclusioni, sentenza, notifica sentenza, ecc.) e mappa su uno dei codici evento previsti per quel procedimento.
4) DATE: cerca OGNI data nel testo (gg/mm/aaaa, "il 15 marzo 2025", "udienza del 20.04.2025", "notifica in data 10/03/2025"). Converti SEMPRE in ISO: YYYY-MM-DD o YYYY-MM-DDTHH:mm:ss. Assegna ogni data alla chiave corretta in "inputs".

REGOLA CRITICA – DUE DATE PER CITAZIONE CIVILE (Notifica citazione):
Se il procedimento è CITAZIONE_CIVILE e l’evento è NOTIFICA_CITAZIONE (o il documento parla di notifica della citazione e di udienza di comparizione), nel documento ci sono DUE date da distinguere e inserire in inputs:
- dataPrimaNotificaCitazione: la data in cui la citazione è stata (o sarà) notificata al convenuto. Cerca espressioni come "notifica in data", "notificata il", "data di notifica della citazione", "notifica effettuata il".
- dataPrimaUdienza: la data fissata per l’udienza di comparizione / prima udienza. Cerca "udienza fissata per il", "data di comparizione", "prima udienza il", "audience fixée le", "comparizione dinanzi al giudice il", "fissata per il giorno", decreto che fissa l’udienza.
Non confondere le due: la notifica è di solito PRIMA dell’udienza. Inserisci entrambe con le chiavi corrette.

Restituisci SOLO un JSON valido, senza markdown né testo prima/dopo, con queste chiavi:
- title: stringa breve (es. "Citazione Tizio vs Caio – Tribunale di Napoli R.G. 1234/2025")
- description: opzionale, dettagli o adempimenti
- type: uno tra "udienza", "notifica", "deposito", "scadenza", "altro"
- macroArea: uno tra "CIVILE_CONTENZIOSO", "PROCEDIMENTI_SPECIALI", "ESECUZIONI", "LAVORO", "TRIBUTARIO", "CASSAZIONE", "STRAGIUDIZIALE", "AMMINISTRATIVO"
- procedimento: uno tra "CITAZIONE_CIVILE", "RICORSO_RITO_SEMPLIFICATO", "OPPOSIZIONE_DECRETO_INGIUNTIVO", "APPELLO_CIVILE", "RIASSUNZIONE_PROCESSO", "INTERRUZIONE_RIASSUNZIONE", "REGOLAMENTO_COMPETENZA", "DECRETO_INGIUNTIVO", "OPPOSIZIONE_DECRETO_INGIUNTIVO_SPEC", "PROCEDIMENTO_CAUTELARE", "ATP", "PROCEDIMENTO_SOMMARIO", "CONVALIDA_SFRATTO", "PIGNORAMENTO_MOBILIARE", "PIGNORAMENTO_IMMOBILIARE", "PIGNORAMENTO_PRESSO_TERZI", "OPPOSIZIONE_ESECUZIONE", "OPPOSIZIONE_ATTI_ESECUTIVI", "RICORSO_LAVORO", "APPELLO_LAVORO", "RICORSO_TRIBUTARIO", "APPELLO_TRIBUTARIO", "RICORSO_CASSAZIONE", "CONTRORICORSO", "DIFFIDA", "MEDIAZIONE", "NEGOZIAZIONE_ASSISTITA", "TRANSAZIONE", "RICORSO_TAR", "MOTIVI_AGGIUNTI", "RICORSO_INCIDENTALE", "APPELLO_CONSIGLIO_STATO", "REVOCAZIONE", "OPPOSIZIONE_TERZO", "OTTEMPERANZA"
- parteProcessuale: "ATTORE" | "CONVENUTO" | "COMUNE"
- eventoCode: per CITAZIONE_CIVILE uno tra "NOTIFICA_CITAZIONE", "ISCRIZIONE_RUOLO", "COSTITUZIONE_CONVENUTO", "SLITTAMENTO_UDIENZA", "MEMORIA_171TER_1", "MEMORIA_171TER_2", "MEMORIA_171TER_3", "UDIENZA_ISTRUTTORIA", "UDIENZA_CONCLUSIONI", "NOTE_PRECISAZIONE_CONCLUSIONI", "COMPARSA_CONCLUSIONALE", "MEMORIA_REPLICA", "SENTENZA", "NOTIFICA_SENTENZA"; per altri procedimenti il codice evento coerente. Se incerto, non valorizzare.
- actionType: (legacy) "CITAZIONE" | "RICORSO_OPPOSIZIONE" | "RICORSO_TRIBUTARIO" | "APPELLO_CIVILE" | "APPELLO_TRIBUTARIO" | "RICORSO_CASSAZIONE"
- actionMode: (legacy) "COSTITUZIONE" | "DA_NOTIFICARE"
- inputs: OGGETTO con TUTTE le date estratte, con chiavi esatte: dataPrimaNotificaCitazione, dataPrimaUdienza, dataNotifica, dataNotificaCitazione, dataUdienzaComparizione, dataUdienzaRiferimentoMemorie, dataNotificaDecretoIngiuntivo, dataNotificaRicorso, dataNotificaSentenza, dataPubblicazioneSentenza, dataNotificaAttoImpugnato, dataNotificaAppello, dataNotificaPrecetto, dataNotificaPignoramento; numerici: giorniOpposizione, giorniIscrizioneRuolo, giorniCostituzione; sceltaTermineImpugnazione: "BREVE" | "LUNGO". Date sempre in ISO.
- notes: opzionale

Esempio citazione con due date: testo con "notifica della citazione in data 10 marzo 2025" e "udienza di comparizione fissata per il 15 aprile 2025 alle 9:30" → inputs: { "dataPrimaNotificaCitazione": "2025-03-10", "dataPrimaUdienza": "2025-04-15T09:30:00" }. Il JSON deve essere parsabile.`;

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
