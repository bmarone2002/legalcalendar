import { SignUp } from "@clerk/nextjs";
import Link from "next/link";

export default function SignUpPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-b from-[#f5f0e6] via-[#f8f4ec] to-[var(--surface)] px-4 py-8 sm:py-12">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-6 h-64 w-64 -translate-x-1/2 rounded-full bg-[var(--gold)]/20 blur-3xl" />
        <div className="absolute -left-16 bottom-12 h-56 w-56 rounded-full bg-[var(--navy)]/10 blur-3xl" />
        <div className="absolute -right-16 top-1/3 h-56 w-56 rounded-full bg-[var(--gold)]/10 blur-3xl" />
      </div>

      <div className="relative grid w-full max-w-6xl gap-4 rounded-3xl border border-[var(--gold)]/20 bg-white/80 p-2 shadow-2xl shadow-[var(--navy)]/15 backdrop-blur-sm lg:grid-cols-2 lg:items-stretch lg:p-3">
        <aside className="relative hidden overflow-hidden rounded-[1.25rem] border border-white/10 bg-gradient-to-br from-[#172944] via-[#203555] to-[#2a4062] px-8 py-9 text-white lg:block">
          <div className="pointer-events-none absolute -right-12 -top-12 h-44 w-44 rounded-full bg-white/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-[var(--gold)]/10 blur-3xl" />
          <div className="inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/10 px-3 py-2">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[var(--gold)]/90 text-xs font-bold text-[var(--navy)]">
              AL
            </span>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-white/85">
              Agenda Legale
            </p>
          </div>
          <p className="mt-6 text-xs font-semibold uppercase tracking-[0.1em] text-[var(--gold)]">
            Offerta limitata
          </p>
          <h1 className="mt-3 text-3xl font-semibold leading-tight">
            30 giorni gratis.
            <br />
            Nessun vincolo.
            <br />
            Massimo controllo.
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-white/80">
            Attivi il tuo account in meno di un minuto, testi tutte le funzionalita e decidi solo dopo la prova. Nessun obbligo, nessuna sorpresa.
          </p>
          <div className="mt-5 grid grid-cols-3 gap-2">
            <div className="rounded-lg border border-white/15 bg-white/10 px-3 py-2 text-center">
              <p className="text-lg font-semibold text-[var(--gold-light)]">30</p>
              <p className="text-[11px] text-white/80">Giorni free</p>
            </div>
            <div className="rounded-lg border border-white/15 bg-white/10 px-3 py-2 text-center">
              <p className="text-lg font-semibold text-[var(--gold-light)]">0</p>
              <p className="text-[11px] text-white/80">Vincoli</p>
            </div>
            <div className="rounded-lg border border-white/15 bg-white/10 px-3 py-2 text-center">
              <p className="text-lg font-semibold text-[var(--gold-light)]">100%</p>
              <p className="text-[11px] text-white/80">Operativo</p>
            </div>
          </div>
          <ul className="mt-7 space-y-3 text-sm text-white/90">
            <li className="rounded-xl border border-white/15 bg-white/5 px-4 py-3">
              Provi subito calendario, pratiche, promemoria ed eventi.
            </li>
            <li className="rounded-xl border border-white/15 bg-white/5 px-4 py-3">
              Setup veloce, interfaccia chiara e pronta all uso.
            </li>
            <li className="rounded-xl border border-white/15 bg-white/5 px-4 py-3">
              Continui solo se percepisci valore reale per il tuo studio.
            </li>
          </ul>
          <p className="mt-5 text-xs text-white/75">
            Nessun addebito durante la prova. Trasparenza totale sui piani al termine dei 30 giorni.
          </p>
        </aside>

        <section className="rounded-[1.25rem] border border-zinc-200/80 bg-white/95 p-6 shadow-lg shadow-[var(--navy)]/5 sm:p-8 lg:p-10">
          <div className="mb-4 flex flex-wrap items-center justify-center gap-2">
            <span className="rounded-full border border-[var(--gold)]/30 bg-[var(--gold)]/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.06em] text-[var(--navy)]">
              30 giorni gratis
            </span>
            <span className="rounded-full border border-[var(--navy)]/20 bg-[var(--navy)]/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.06em] text-[var(--navy)]">
              Nessun vincolo
            </span>
          </div>
          <h2 className="mb-2 text-center text-2xl font-semibold text-[var(--navy)] sm:text-[1.75rem]">
            Crea il tuo account gratuito
          </h2>
          <p className="mb-5 text-center text-sm leading-relaxed text-zinc-500">
            Inizi adesso senza carta obbligatoria ne impegni contrattuali. Valuti con calma per 30 giorni e decidi dopo.
          </p>
          <p className="mb-6 text-center text-xs font-medium uppercase tracking-[0.08em] text-zinc-400">
            Accesso immediato - Nessun rischio - Cancelli quando vuoi
          </p>

          <div className="mx-auto w-full max-w-[520px]">
            <SignUp
              appearance={{
                elements: {
                  rootBox: "mx-auto w-full",
                  card: "w-full shadow-none border border-zinc-200 rounded-2xl bg-white",
                  headerTitle: "text-[var(--navy)] font-semibold",
                  headerSubtitle: "text-zinc-500",
                  socialButtonsBlockButton:
                    "h-11 rounded-lg border-zinc-300 text-zinc-700 hover:bg-zinc-50 hover:border-zinc-400 transition-colors",
                  dividerLine: "bg-zinc-200",
                  dividerText: "text-zinc-400",
                  formFieldInput:
                    "h-11 rounded-lg border-zinc-300 focus:border-[var(--navy)] focus:ring-2 focus:ring-[var(--navy)]/15 transition-colors",
                  formButtonPrimary:
                    "h-11 rounded-lg bg-[var(--navy)] text-white hover:bg-[var(--navy-light)] shadow-md shadow-[var(--navy)]/20 transition-all",
                  footerActionLink: "text-[var(--navy)] hover:text-[var(--navy-light)] font-medium",
                },
              }}
            />
          </div>

          <p className="mt-5 text-center text-xs leading-relaxed text-zinc-500">
            Proseguendo dichiari di aver letto{" "}
            <Link href="/legal/terms" className="font-medium text-[var(--navy)] underline underline-offset-2 hover:text-[var(--navy-light)]">
              Termini
            </Link>
            ,{" "}
            <Link href="/legal/privacy" className="font-medium text-[var(--navy)] underline underline-offset-2 hover:text-[var(--navy-light)]">
              Privacy
            </Link>{" "}
            e{" "}
            <Link href="/legal/cookie" className="font-medium text-[var(--navy)] underline underline-offset-2 hover:text-[var(--navy-light)]">
              Cookie Policy
            </Link>
            .
          </p>
        </section>
      </div>
    </div>
  );
}

