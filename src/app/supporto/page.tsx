import Link from "next/link";
import { SignedIn, SignedOut, SignInButton, SignUpButton } from "@clerk/nextjs";
import { SupportContactCard } from "@/components/support/SupportContactCard";

export default function SupportoPage() {
  return (
    <div className="min-h-screen bg-[var(--surface)]">
      <header className="border-b border-[var(--gold)]/20 bg-[var(--navy)]">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo-agenda-legale.png"
              alt="Agenda Legale"
              className="h-[4.875rem] w-auto object-contain sm:h-24 lg:h-[6.75rem]"
            />
            <div className="hidden sm:block">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--gold)]">
                Supporto
              </p>
              <p className="text-xs text-zinc-100/85">
                Ti aiutiamo prima e dopo l&apos;attivazione
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="text-xs font-medium text-zinc-100/80 underline-offset-4 hover:text-white hover:underline sm:text-sm"
            >
              Torna alla home
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <section className="relative overflow-hidden rounded-2xl border border-[var(--gold)]/25 bg-gradient-to-br from-white via-[#faf7f1] to-[#f5efe3] px-5 py-8 shadow-sm sm:px-8 sm:py-10">
          <div className="pointer-events-none absolute -right-14 -top-16 h-48 w-48 rounded-full bg-[var(--gold)]/15 blur-2xl" />
          <div className="pointer-events-none absolute -bottom-16 -left-10 h-40 w-40 rounded-full bg-[var(--navy)]/10 blur-2xl" />
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--gold)]">
            Assistenza ibrida
          </p>
          <h1 className="mt-2 text-2xl font-bold text-[var(--navy)] sm:text-3xl">
            Un unico punto di supporto, per nuovi utenti e clienti attivi
          </h1>
          <p className="mt-3 max-w-3xl text-sm text-zinc-700 sm:text-base">
            Se stai valutando Agenda Legale puoi chiederci una demo o informazioni sui piani. Se hai
            già un account, apri una richiesta tecnica e ricevi un codice pratica via email.
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-3 text-xs sm:text-sm">
            <span className="inline-flex items-center rounded-full border border-[var(--navy)]/15 bg-white px-3 py-1.5 font-medium text-[var(--navy)]">
              Risposta media 24/48h lavorative
            </span>
            <span className="inline-flex items-center rounded-full border border-[var(--navy)]/15 bg-white px-3 py-1.5 font-medium text-[var(--navy)]">
              Ticket ID automatico
            </span>
            <span className="inline-flex items-center rounded-full border border-[var(--navy)]/15 bg-white px-3 py-1.5 font-medium text-[var(--navy)]">
              Accessibile anche senza login
            </span>
          </div>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm sm:p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--gold)]">
              Non sei ancora cliente?
            </p>
            <h2 className="mt-2 text-xl font-semibold text-[var(--navy)]">
              Ricevi informazioni e valutiamo insieme il fit
            </h2>
            <p className="mt-2 text-sm text-zinc-700">
              Scrivici per demo, chiarimenti sui piani o domande prima dell&apos;attivazione.
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <SignUpButton mode="redirect">
                <button
                  type="button"
                  className="rounded-md bg-[var(--gold)] px-4 py-2 text-sm font-semibold text-[var(--navy)] shadow-sm hover:bg-[var(--gold-light)]"
                >
                  Attiva prova gratuita
                </button>
              </SignUpButton>
              <SignInButton mode="redirect">
                <button
                  type="button"
                  className="rounded-md border border-[var(--navy)]/20 bg-white px-4 py-2 text-sm font-medium text-[var(--navy)] hover:bg-[var(--navy)] hover:text-white"
                >
                  Ho già un account
                </button>
              </SignInButton>
            </div>
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm sm:p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--gold)]">
              Hai già un account?
            </p>
            <h2 className="mt-2 text-xl font-semibold text-[var(--navy)]">
              Apri un ticket e ricevi supporto operativo
            </h2>
            <p className="mt-2 text-sm text-zinc-700">
              Prima controlla la guida rapida, poi invia la richiesta con i dettagli del problema.
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <Link
                href="/guida"
                className="rounded-md border border-[var(--navy)]/20 bg-white px-4 py-2 text-sm font-medium text-[var(--navy)] hover:bg-[var(--navy)] hover:text-white"
              >
                Apri la guida
              </Link>
              <SignedIn>
                <Link
                  href="/"
                  className="rounded-md bg-[var(--gold)] px-4 py-2 text-sm font-semibold text-[var(--navy)] shadow-sm hover:bg-[var(--gold-light)]"
                >
                  Vai al calendario
                </Link>
              </SignedIn>
              <SignedOut>
                <SignInButton mode="redirect">
                  <button
                    type="button"
                    className="rounded-md bg-[var(--gold)] px-4 py-2 text-sm font-semibold text-[var(--navy)] shadow-sm hover:bg-[var(--gold-light)]"
                  >
                    Accedi
                  </button>
                </SignInButton>
              </SignedOut>
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-2">
          <SupportContactCard
            audience="prospect"
            title="Contatto commerciale / pre-attivazione"
            subtitle="Compila il form se vuoi una demo o informazioni prima di creare il tuo account."
            formId="supporto-prospect-form"
          />
          <SupportContactCard
            audience="customer"
            title="Supporto tecnico clienti"
            subtitle="Descrivi il problema in modo preciso: riceverai conferma automatica con codice pratica."
            formId="supporto-customer-form"
          />
        </section>
      </main>
    </div>
  );
}

