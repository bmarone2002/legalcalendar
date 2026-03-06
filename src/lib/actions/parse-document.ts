"use server";

import OpenAI from "openai";
import { z } from "zod";
const OPENAI_MODEL = "gpt-4o-mini";

const ACTION_TYPE_VALUES = ["CITAZIONE", "RICORSO_OPPOSIZIONE", "RICORSO_TRIBUTARIO", "APPELLO_CIVILE", "APPELLO_TRIBUTARIO", "RICORSO_CASSAZIONE"] as const;
const ACTION_MODE_VALUES = ["COSTITUZIONE", "DA_NOTIFICARE"] as const;

/** Risposta strutturata dall'AI per precompilare il form Atto Giuridico */
const parsedDocumentSchema = z.object({
  title: z.string().optional().default(""),
  description: z.string().optional().default(""),
  type: z.enum(["udienza", "notifica", "deposito", "scadenza", "altro"]).optional().default("altro"),
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
Dal testo del documento (o dalla descrizione dell'immagine) estrai i dati per compilare un evento in un calendario legale.

Restituisci SOLO un JSON valido, senza markdown né testo prima/dopo, con queste chiavi:
- title: stringa breve che riassume la pratica (es. "Citazione Tizio vs Caio", "Opposizione decreto ingiuntivo n. 123/2024")
- description: stringa opzionale con dettagli o adempimenti
- type: uno tra "udienza", "notifica", "deposito", "scadenza", "altro"
- actionType: uno tra "CITAZIONE", "RICORSO_OPPOSIZIONE", "RICORSO_TRIBUTARIO", "APPELLO_CIVILE", "APPELLO_TRIBUTARIO", "RICORSO_CASSAZIONE"
- actionMode: uno tra "COSTITUZIONE", "DA_NOTIFICARE"
- inputs: oggetto con le date e i campi richiesti per questo tipo di atto. Usa formato ISO per le date: YYYY-MM-DD o YYYY-MM-DDTHH:mm:ss.
  Chiavi possibili a seconda del tipo: dataNotifica, dataUdienzaComparizione, dataUdienzaRiferimentoMemorie, dataNotificaCitazione, dataNotificaDecretoIngiuntivo, dataUdienzaOpposizione, dataUdienza, dataNotificaAttoImpugnato, dataNotificaRicorso, dataNotificaSentenza, dataPubblicazioneSentenza, dataNotificaAppello, dataNotificaSentenzaTributaria, dataPubblicazioneSentenzaTributaria, notificaEstero (boolean), giorniOpposizione, giorniIscrizioneRuolo, giorniCostituzione (number), sceltaTermineImpugnazione ("BREVE" o "LUNGO"), memorieLibere (array di { titolo: string, scadenza: "YYYY-MM-DD" }).
  Inserisci solo i campi che riesci a ricavare dal documento.
- notes: stringa opzionale con note

Se non riesci a determinare actionType o actionMode, omettili o usa null. Il JSON deve essere parsabile.`;

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
