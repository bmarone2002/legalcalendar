import { CalendarView } from "@/components/calendar/CalendarView";
import { AppShell } from "@/components/layout/AppShell";
import { SignedIn, SignedOut, SignInButton, SignUpButton } from "@clerk/nextjs";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <SignedIn>
        <AppShell>
          <CalendarView />
        </AppShell>
      </SignedIn>

      <SignedOut>
        <LandingPage />
      </SignedOut>
    </>
  );
}

function LandingPage() {
  return (
    <div className="min-h-screen bg-[var(--surface)]">
      {/* Top nav */}
      <header className="border-b border-[var(--gold)]/20 bg-[var(--navy)]">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo-agenda-legale.png"
              alt="Agenda Legale"
              className="h-14 w-auto object-contain sm:h-16 lg:h-18"
            />
            <div className="hidden sm:block">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--gold)]">
                Agenda Legale
              </p>
              <p className="text-xs text-zinc-100/90">
                Organizza il tuo studio in modo intelligente
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/guida"
              className="hidden text-xs font-medium text-zinc-100/80 underline-offset-4 hover:text-white hover:underline sm:inline"
            >
              Come funziona
            </Link>
            <SignInButton mode="modal">
              <button
                type="button"
                className="rounded-md border border-[var(--gold)] px-3 py-1.5 text-xs font-medium text-[var(--gold)] hover:bg-[var(--gold)]/10 sm:text-sm"
              >
                Accedi
              </button>
            </SignInButton>
            <SignUpButton mode="redirect">
              <button
                type="button"
                className="hidden rounded-md bg-[var(--gold)] px-3 py-1.5 text-xs font-semibold text-[var(--navy)] shadow-sm hover:bg-[var(--gold-light)] sm:inline-block sm:text-sm"
              >
                Registrati
              </button>
            </SignUpButton>
          </div>
        </div>
      </header>

      {/* Hero */}
      <main>
        <section className="border-b border-zinc-200 bg-gradient-to-b from-[#f5f0e6] via-[#f8f4ec] to-[var(--surface)]">
          <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 py-10 sm:px-6 sm:py-14 lg:flex-row lg:items-center lg:py-18">
            {/* Text column */}
            <div className="max-w-xl text-left text-[var(--navy)]">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--gold)]">
                Software per studi legali
              </p>
              <h1 className="mb-4 text-3xl font-semibold leading-tight sm:text-4xl lg:text-5xl">
                Il tuo studio legale,{" "}
                <span className="text-[var(--gold)]">organizzato in un&apos;unica schermata</span>.
              </h1>
              <p className="mb-6 text-sm text-zinc-700 sm:text-base">
                Con <span className="font-medium">Agenda Legale</span> crei nuove pratiche, le segui
                in tutte le loro fasi e non perdi mai una scadenza. L&apos;AI estrae i dati dai
                documenti, ti suggerisce i passaggi da seguire, compila per te e calcola
                automaticamente i termini, mentre il calendario resta condivisibile e sempre al
                sicuro grazie ai backup scaricabili.
              </p>
              <div className="mb-6 grid gap-3 text-sm sm:grid-cols-2">
                <FeatureBullet title="Estrazione automatica con AI">
                  Carica i tuoi atti e lascia che l&apos;intelligenza artificiale estragga in
                  autonomia date, termini e dati di pratica da inserire in agenda.
                </FeatureBullet>
                <FeatureBullet title="Pratiche e fasi di lavoro">
                  Inserisci pratiche e segui tutte le loro fasi nel tempo, con procedure già
                  predisposte per gli avvocati e possibilità di personalizzare ogni passaggio.
                </FeatureBullet>
                <FeatureBullet title="Gestione promemoria chiara">
                  Promemoria per udienze, scadenze e appuntamenti con viste dedicate per elementi da
                  fare, in scadenza e completati.
                </FeatureBullet>
                <FeatureBullet title="Calcolo automatico dei termini">
                  Calcolo automatico delle scadenze in base ai principali termini processuali, con
                  regole già pronte per le procedure più frequenti.
                </FeatureBullet>
                <FeatureBullet title="Calendario condivisibile e backup">
                  Condividi il calendario con chi vuoi e scarica periodicamente un backup completo
                  per conservare una copia aggiornata anche in locale.
                </FeatureBullet>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <SignUpButton mode="redirect">
                  <button
                    type="button"
                    className="rounded-md bg-[var(--gold)] px-5 py-2.5 text-sm font-semibold text-[var(--navy)] shadow-md shadow-black/10 hover:bg-[var(--gold-light)]"
                  >
                    Prova Agenda Legale gratis per 30 giorni
                  </button>
                </SignUpButton>
                <SignInButton mode="redirect">
                  <button
                    type="button"
                    className="rounded-md border border-[var(--navy)]/15 px-4 py-2 text-sm font-medium text-[var(--navy)] hover:bg-[var(--navy)] hover:text-white"
                  >
                    Ho già un account
                  </button>
                </SignInButton>
                <Link
                  href="/guida"
                  className="text-xs font-medium text-[var(--gold)] underline-offset-4 hover:underline"
                >
                  Guarda una panoramica veloce
                </Link>
              </div>
              <p className="mt-3 text-xs text-zinc-600 sm:text-sm">
                Provalo gratuitamente per 30 giorni. Poi, un unico piano chiaro a partire da{" "}
                <span className="font-semibold">€ 10 al mese</span>, senza vincoli, molto meno dei
                tradizionali software da studio.
              </p>
            </div>

            {/* Calendar preview / card column */}
            <div className="flex flex-1 items-center justify-center">
              <div className="relative w-full max-w-xl rounded-2xl border border-[var(--gold)]/30 bg-[var(--surface-card)]/95 p-4 shadow-2xl shadow-black/10">
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-[var(--navy)] text-[var(--gold)] shadow">
                      <span className="text-lg font-semibold">✓</span>
                    </span>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--navy)]">
                        Vista Calendario
                      </p>
                      <p className="text-xs text-zinc-600">
                        Tutti i tuoi impegni in un&apos;unica schermata
                      </p>
                    </div>
                  </div>
                  <span className="rounded-full bg-[var(--gold)]/15 px-3 py-1 text-[10px] font-medium uppercase tracking-wide text-[var(--gold)]">
                    Studio Legale
                  </span>
                </div>
                <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/screenshot-calendario.png"
                    alt="Calendario di Agenda Legale"
                    className="h-auto w-full object-cover"
                  />
                </div>
                <p className="mt-3 text-xs text-zinc-600">
                  Vista Mese, Settimana, Giorno e Agenda con colori e filtri personalizzati per
                  udienze, scadenze e appuntamenti.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Funzionalità principali */}
        <section className="border-b border-zinc-200 bg-[var(--surface)]">
          <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
            <div className="mb-8 text-center">
              <h2 className="text-2xl font-semibold text-[var(--navy)]">
                Scopri tutte le funzioni di Agenda Legale
              </h2>
              <p className="mt-2 text-sm text-zinc-600">
                Pensata per gli studi legali che vogliono avere pratiche, calendario, promemoria e
                termini in un unico strumento, senza fogli e agende sparse.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
              <FeatureCard
                title="Pratiche e fasi procedurali"
                description="Inserisci pratiche e segui le fasi preimpostate pensate per gli avvocati, personalizzando i passaggi in base al tuo modo di lavorare."
              />
              <FeatureCard
                title="Gestione Promemoria"
                description="Imposta promemoria per non perdere mai più una scadenza e visualizza in modo distinto cosa è da fare, cosa è in scadenza e cosa hai già completato."
              />
              <FeatureCard
                title="Calcolo dei termini"
                description="Inserisci la data di riferimento e lascia che Agenda Legale calcoli per te i termini processuali più utilizzati, con regole già pronte."
              />
              <FeatureCard
                title="Backup sempre tuo"
                description="Scarica in pochi clic una copia completa del tuo calendario legale per conservarla nei tuoi archivi interni e mantenere sempre il controllo sui dati."
              />
            </div>
          </div>
        </section>

        {/* Come funziona in pratica */}
        <section className="border-b border-zinc-200 bg-white">
          <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
            <div className="mb-8 text-center">
              <h2 className="text-2xl font-semibold text-[var(--navy)]">
                Come funziona nella pratica quotidiana
              </h2>
              <p className="mt-2 text-sm text-zinc-600">
                In pochi passaggi passi dal caos di email e fogli a un calendario legale ordinato e
                condivisibile.
              </p>
            </div>

            <ol className="grid gap-5 md:grid-cols-4">
              <StepCard
                step="1"
                title="Crea il tuo account"
                description="Accedi o registrati e imposta lo studio legale, così ogni evento è collegato al tuo profilo."
              />
              <StepCard
                step="2"
                title="Inserisci impegni e cause"
                description="Aggiungi udienze, appuntamenti, termini processuali e note in modo strutturato."
              />
              <StepCard
                step="3"
                title="Ricevi promemoria mirati"
                description="Decidi quando ricevere i promemoria e controlla in un colpo d’occhio cosa è ancora da fare."
              />
              <StepCard
                step="4"
                title="Scarica il backup"
                description="Ogni tanto scarica il backup completo e archivialo nei tuoi sistemi interni per massima sicurezza."
              />
            </ol>
          </div>
        </section>

        {/* Per chi è */}
        <section className="bg-[var(--surface)]">
          <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
            <div className="mb-8 text-center">
              <h2 className="text-2xl font-semibold text-[var(--navy)]">
                Pensata per chi vive il diritto ogni giorno
              </h2>
            </div>
            <div className="grid gap-5 md:grid-cols-3">
              <AudienceCard
                title="Studi legali"
                description="Coordina il lavoro di più professionisti, condividendo lo stesso calendario di studio."
              />
              <AudienceCard
                title="Uffici legali interni"
                description="Monitora scadenze e contenziosi aziendali con una vista unica e ordinata."
              />
              <AudienceCard
                title="Professionisti autonomi"
                description="Tieni sotto controllo udienze, appuntamenti e termini senza dover incrociare più strumenti."
              />
            </div>
          </div>
        </section>

        {/* CTA finale */}
        <section className="border-t border-[var(--gold)]/20 bg-[var(--navy)]">
          <div className="mx-auto max-w-6xl px-4 py-10 text-center sm:px-6 lg:px-8">
            <h2 className="text-2xl font-semibold text-white">
              Inizia a usare Agenda Legale oggi stesso
            </h2>
            <p className="mt-2 text-sm text-zinc-100/80">
              Bastano pochi minuti per creare l&apos;account e inserire i primi impegni. Il tuo
              calendario legale ti aspetta.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <SignUpButton mode="redirect">
                <button
                  type="button"
                  className="rounded-md bg-[var(--gold)] px-6 py-2.5 text-sm font-semibold text-[var(--navy)] shadow-md hover:bg-[var(--gold-light)]"
                >
                  Registrati ora
                </button>
              </SignUpButton>
              <Link
                href="/guida"
                className="text-sm font-medium text-[var(--gold)] underline-offset-4 hover:underline"
              >
                Scopri come funziona nel dettaglio
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

function FeatureBullet(props: { title: string; children: React.ReactNode }) {
  const { title, children } = props;
  return (
    <div className="flex gap-3 rounded-lg bg-white/90 p-3 shadow-sm">
      <div className="mt-1 h-6 w-6 shrink-0 rounded-full border border-[var(--gold)]/70 bg-[var(--gold)]/15 text-center text-[13px] font-semibold text-[var(--gold)]">
        ·
      </div>
      <div>
        <p className="text-sm font-semibold text-[var(--navy)]">{title}</p>
        <p className="mt-1 text-xs text-zinc-700">{children}</p>
      </div>
    </div>
  );
}

function FeatureCard(props: { title: string; description: string }) {
  const { title, description } = props;
  return (
    <div className="flex h-full flex-col rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
      <div className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-md bg-[var(--gold)]/15 text-[var(--gold)]">
        <span className="text-lg">★</span>
      </div>
      <h3 className="text-sm font-semibold text-[var(--navy)]">{title}</h3>
      <p className="mt-2 text-sm text-zinc-600">{description}</p>
    </div>
  );
}

function StepCard(props: { step: string; title: string; description: string }) {
  const { step, title, description } = props;
  return (
    <li className="relative flex h-full flex-col rounded-xl border border-zinc-200 bg-[var(--surface-card)] p-5">
      <div className="absolute -top-3 left-4 flex h-7 w-7 items-center justify-center rounded-full bg-[var(--navy)] text-xs font-semibold text-[var(--gold)] shadow">
        {step}
      </div>
      <h3 className="mt-2 text-sm font-semibold text-[var(--navy)]">{title}</h3>
      <p className="mt-2 text-sm text-zinc-600">{description}</p>
    </li>
  );
}

function AudienceCard(props: { title: string; description: string }) {
  const { title, description } = props;
  return (
    <div className="flex h-full flex-col rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
      <h3 className="text-sm font-semibold text-[var(--navy)]">{title}</h3>
      <p className="mt-2 text-sm text-zinc-600">{description}</p>
    </div>
  );
}

