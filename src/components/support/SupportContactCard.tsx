"use client";

import { FormEvent, useMemo, useState } from "react";

type Category = "accesso" | "calendario" | "pagamenti" | "bug" | "altro";
type Priority = "normale" | "urgente";

const categoryOptions: { value: Category; label: string }[] = [
  { value: "accesso", label: "Accesso / Account" },
  { value: "calendario", label: "Calendario / Scadenze" },
  { value: "pagamenti", label: "Pagamenti" },
  { value: "bug", label: "Bug tecnico" },
  { value: "altro", label: "Altro" },
];

const faqByCategory: Record<Category, { question: string; href: string }[]> = {
  accesso: [
    { question: "Posso usare Agenda Legale da più dispositivi?", href: "#faq" },
    { question: "Non vedo più un evento che avevo inserito, cosa posso fare?", href: "#faq" },
  ],
  calendario: [
    { question: "Qual è la differenza tra 'Da fare' e 'Completati'?", href: "#faq" },
    { question: "Qual è l'ordine corretto di lavoro in Agenda Legale?", href: "#faq" },
  ],
  pagamenti: [
    { question: "Controlla la sezione profilo e stato piano per la fatturazione.", href: "/profilo" },
    { question: "Se non risolvi, invia una richiesta con oggetto dettagliato.", href: "#supporto-form" },
  ],
  bug: [
    { question: "Non vedo più un evento che avevo inserito, cosa posso fare?", href: "#faq" },
    { question: "Inserisci nel ticket pagina e passaggi per riprodurre il problema.", href: "#supporto-form" },
  ],
  altro: [
    { question: "Consulta prima le domande frequenti qui sotto.", href: "#faq" },
    { question: "Se non trovi risposta, apri una richiesta dal form.", href: "#supporto-form" },
  ],
};

export function SupportContactCard() {
  const [email, setEmail] = useState("");
  const [category, setCategory] = useState<Category>("calendario");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [priority, setPriority] = useState<Priority>("normale");
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successTicketId, setSuccessTicketId] = useState<string | null>(null);

  const suggestedFaq = useMemo(() => faqByCategory[category], [category]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage(null);
    setSuccessTicketId(null);
    setSubmitting(true);

    try {
      const response = await fetch("/api/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          category,
          subject,
          message,
          priority,
          privacyAccepted,
          pageUrl: window.location.href,
        }),
      });

      const data = (await response.json()) as { success: boolean; ticketId?: string; error?: string };
      if (!response.ok || !data.success || !data.ticketId) {
        throw new Error(data.error ?? "Errore durante l'invio.");
      }

      setSuccessTicketId(data.ticketId);
      setSubject("");
      setMessage("");
      setPriority("normale");
      setPrivacyAccepted(false);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Errore inatteso.";
      setErrorMessage(message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section
      id="supporto-form"
      className="rounded-2xl border border-[var(--gold)]/30 bg-white p-5 shadow-sm sm:p-6"
    >
      <h3 className="text-lg font-semibold text-[var(--navy)]">Non hai risolto? Contatta il supporto</h3>
      <p className="mt-1 text-sm text-zinc-700">
        Prima di inviare la richiesta, controlla i suggerimenti rapidi in base alla categoria selezionata.
      </p>

      <div className="mt-4 rounded-xl border border-zinc-200 bg-zinc-50 p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--gold)]">
          Suggerimenti guida
        </p>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-xs text-zinc-700 sm:text-sm">
          {suggestedFaq.map((item) => (
            <li key={item.question}>
              <a className="underline-offset-4 hover:underline" href={item.href}>
                {item.question}
              </a>
            </li>
          ))}
        </ul>
      </div>

      <form onSubmit={onSubmit} className="mt-5 grid gap-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="grid gap-1 text-sm text-zinc-700">
            Email
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none ring-[var(--gold)]/30 focus:ring"
              placeholder="nome@studio.it"
            />
          </label>

          <label className="grid gap-1 text-sm text-zinc-700">
            Categoria
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as Category)}
              className="rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none ring-[var(--gold)]/30 focus:ring"
            >
              {categoryOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <label className="grid gap-1 text-sm text-zinc-700">
          Oggetto
          <input
            type="text"
            required
            maxLength={120}
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none ring-[var(--gold)]/30 focus:ring"
            placeholder="Es. non riesco ad accedere al calendario"
          />
        </label>

        <label className="grid gap-1 text-sm text-zinc-700">
          Descrizione
          <textarea
            required
            maxLength={2000}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="min-h-28 rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none ring-[var(--gold)]/30 focus:ring"
            placeholder="Descrivi il problema e i passaggi effettuati."
          />
        </label>

        <div className="grid gap-2 text-sm text-zinc-700">
          <span>Priorita</span>
          <div className="flex items-center gap-5">
            <label className="inline-flex items-center gap-2">
              <input
                type="radio"
                name="priority"
                value="normale"
                checked={priority === "normale"}
                onChange={() => setPriority("normale")}
              />
              Normale
            </label>
            <label className="inline-flex items-center gap-2">
              <input
                type="radio"
                name="priority"
                value="urgente"
                checked={priority === "urgente"}
                onChange={() => setPriority("urgente")}
              />
              Urgente
            </label>
          </div>
        </div>

        <label className="inline-flex items-start gap-2 text-xs text-zinc-700 sm:text-sm">
          <input
            type="checkbox"
            required
            checked={privacyAccepted}
            onChange={(e) => setPrivacyAccepted(e.target.checked)}
            className="mt-0.5"
          />
          Dichiaro di aver letto l&apos;informativa privacy e autorizzo il trattamento dei dati per gestire
          la richiesta di assistenza.
        </label>

        <button
          type="submit"
          disabled={submitting}
          className="inline-flex w-fit items-center rounded-md bg-[var(--gold)] px-4 py-2 text-sm font-semibold text-[var(--navy)] shadow-sm hover:bg-[var(--gold-light)] disabled:cursor-not-allowed disabled:opacity-65"
        >
          {submitting ? "Invio in corso..." : "Invia richiesta"}
        </button>

        {errorMessage ? (
          <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700 sm:text-sm">
            {errorMessage}
          </p>
        ) : null}

        {successTicketId ? (
          <p className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-700 sm:text-sm">
            Richiesta inviata correttamente. Codice pratica: <strong>{successTicketId}</strong>.
          </p>
        ) : null}
      </form>
    </section>
  );
}

