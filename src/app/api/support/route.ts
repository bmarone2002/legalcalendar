import { NextResponse } from "next/server";
import { z } from "zod";

const supportSchema = z.object({
  email: z.string().trim().email("Email non valida"),
  category: z.enum(["commerciale", "accesso", "calendario", "pagamenti", "bug", "altro"]),
  subject: z.string().trim().min(3, "Oggetto troppo corto").max(120, "Oggetto troppo lungo"),
  message: z
    .string()
    .trim()
    .min(10, "Descrizione troppo corta")
    .max(2000, "Descrizione troppo lunga"),
  pageUrl: z.string().trim().url("URL pagina non valida").optional(),
  priority: z.enum(["normale", "urgente"]).default("normale"),
  privacyAccepted: z.literal(true),
});

const CATEGORY_LABEL: Record<z.infer<typeof supportSchema>["category"], string> = {
  commerciale: "Commerciale/Pre-iscrizione",
  accesso: "Accesso/Account",
  calendario: "Calendario/Scadenze",
  pagamenti: "Pagamenti",
  bug: "Bug tecnico",
  altro: "Altro",
};

function getTicketId(now = new Date()): string {
  const y = now.getUTCFullYear();
  const m = String(now.getUTCMonth() + 1).padStart(2, "0");
  const d = String(now.getUTCDate()).padStart(2, "0");
  const rand = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0");
  return `LC-${y}${m}${d}-${rand}`;
}

function escapeHtml(input: string): string {
  return input
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

async function sendResendEmail(params: {
  to: string | string[];
  from: string;
  subject: string;
  text: string;
  html: string;
  replyTo?: string;
}) {
  const resendApiKey = process.env.RESEND_API_KEY;
  if (!resendApiKey) {
    throw new Error("RESEND_API_KEY non configurata");
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: params.from,
      to: params.to,
      subject: params.subject,
      text: params.text,
      html: params.html,
      reply_to: params.replyTo,
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Invio email fallito (${response.status}): ${body}`);
  }
}

export async function POST(req: Request) {
  try {
    const payload = supportSchema.parse(await req.json());
    const supportToEmail = process.env.SUPPORT_TO_EMAIL;
    const supportFromEmail = process.env.SUPPORT_FROM_EMAIL;

    if (!supportToEmail || !supportFromEmail) {
      return NextResponse.json(
        { success: false, error: "Configurazione supporto incompleta sul server." },
        { status: 500 }
      );
    }

    const ticketId = getTicketId();
    const receivedAt = new Date().toISOString();
    const categoryLabel = CATEGORY_LABEL[payload.category];
    const safeMessage = escapeHtml(payload.message);
    const safeSubject = escapeHtml(payload.subject);

    const internalSubject = `[Legal Calendar][${categoryLabel}][${payload.priority}] ${payload.subject}`;
    const internalText = [
      `Ticket ID: ${ticketId}`,
      `Ricevuto: ${receivedAt}`,
      `Email utente: ${payload.email}`,
      `Categoria: ${categoryLabel}`,
      `Priorità: ${payload.priority}`,
      `Pagina: ${payload.pageUrl ?? "n/d"}`,
      `Oggetto: ${payload.subject}`,
      "",
      "Messaggio:",
      payload.message,
    ].join("\n");

    const internalHtml = `
      <p><strong>Ticket ID:</strong> ${ticketId}</p>
      <p><strong>Ricevuto:</strong> ${receivedAt}</p>
      <p><strong>Email utente:</strong> ${escapeHtml(payload.email)}</p>
      <p><strong>Categoria:</strong> ${escapeHtml(categoryLabel)}</p>
      <p><strong>Priorita:</strong> ${escapeHtml(payload.priority)}</p>
      <p><strong>Pagina:</strong> ${escapeHtml(payload.pageUrl ?? "n/d")}</p>
      <p><strong>Oggetto:</strong> ${safeSubject}</p>
      <p><strong>Messaggio:</strong></p>
      <pre style="white-space:pre-wrap;font-family:inherit">${safeMessage}</pre>
    `;

    await sendResendEmail({
      from: supportFromEmail,
      to: supportToEmail,
      replyTo: payload.email,
      subject: internalSubject,
      text: internalText,
      html: internalHtml,
    });

    const userSubject = `Abbiamo ricevuto la tua richiesta (${ticketId})`;
    const userText = [
      "Ciao,",
      "",
      `abbiamo ricevuto la tua richiesta di assistenza con codice ${ticketId}.`,
      "Ti risponderemo entro 24/48 ore lavorative.",
      "",
      "Se vuoi aggiungere dettagli, rispondi a questa email indicando il codice pratica.",
      "",
      "Supporto Legal Calendar",
    ].join("\n");

    const userHtml = `
      <p>Ciao,</p>
      <p>abbiamo ricevuto la tua richiesta di assistenza con codice <strong>${ticketId}</strong>.</p>
      <p>Ti risponderemo entro <strong>24/48 ore lavorative</strong>.</p>
      <p>Se vuoi aggiungere dettagli, rispondi a questa email indicando il codice pratica.</p>
      <p>Supporto Legal Calendar</p>
    `;

    await sendResendEmail({
      from: supportFromEmail,
      to: payload.email,
      subject: userSubject,
      text: userText,
      html: userHtml,
    });

    return NextResponse.json({ success: true, ticketId });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: "Dati non validi",
          details: error.flatten(),
        },
        { status: 400 }
      );
    }

    console.error("Errore invio richiesta supporto:", error);
    return NextResponse.json(
      { success: false, error: "Non è stato possibile inviare la richiesta." },
      { status: 500 }
    );
  }
}

