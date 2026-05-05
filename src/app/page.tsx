import { CalendarView } from "@/components/calendar/CalendarView";
import { AppShell } from "@/components/layout/AppShell";
import { SignedIn, SignedOut, SignInButton, SignUpButton } from "@clerk/nextjs";
import Link from "next/link";
import Image from "next/image";

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

/* ────────────────────────────────────────────────────────────────── */
/*  Landing page (pre-login)                                        */
/* ────────────────────────────────────────────────────────────────── */

function LandingPage() {
  return (
    <div className="min-h-screen bg-[var(--surface)]">
      {/* ── Navbar ─────────────────────────────────────────────── */}
      <header className="sticky top-0 z-[60] isolate border-b border-[var(--gold)]/20 bg-[var(--navy)]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3.5 sm:px-7 lg:px-10">
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo-agenda-legale.png"
              alt="Agenda Legale"
              width={192}
              height={96}
              loading="eager"
              decoding="async"
              fetchPriority="high"
              className="h-16 w-auto object-contain sm:h-20 lg:h-24"
            />
            <div className="hidden sm:block">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--gold)]">
                Agenda Legale
              </p>
              <p className="text-[11px] text-zinc-300">
                Software per studi legali
              </p>
            </div>
          </div>

          <nav className="flex items-center gap-2 sm:gap-2.5">
            <Link
              href="#funzionalita"
              className="hidden items-center gap-1.5 rounded-full border border-zinc-400/25 px-3 py-1 text-xs font-medium text-zinc-200/90 transition-colors hover:border-[var(--gold)]/50 hover:text-[var(--gold)] md:inline-flex"
            >
              <span aria-hidden="true" className="text-[11px]">⚡</span>
              Funzionalità
            </Link>
            <Link
              href="#come-funziona"
              className="hidden items-center gap-1.5 rounded-full border border-zinc-400/25 px-3 py-1 text-xs font-medium text-zinc-200/90 transition-colors hover:border-[var(--gold)]/50 hover:text-[var(--gold)] md:inline-flex"
            >
              <span aria-hidden="true" className="text-[11px]">🔍</span>
              Come funziona
            </Link>
            <Link
              href="/guida"
              className="hidden items-center gap-1.5 rounded-full border border-zinc-400/25 px-3 py-1 text-xs font-medium text-zinc-200/90 transition-colors hover:border-[var(--gold)]/50 hover:text-[var(--gold)] sm:inline-flex"
            >
              <span aria-hidden="true" className="text-[11px]">📖</span>
              Guida
            </Link>
            <span className="mx-0.5 hidden h-4 w-px bg-zinc-500/30 sm:inline-block" />
            <SignInButton mode="modal">
              <button
                type="button"
                className="rounded-lg border border-[var(--gold)]/60 px-3.5 py-1.5 text-xs font-medium text-[var(--gold)] transition-colors hover:bg-[var(--gold)]/10 sm:text-sm"
              >
                Accedi
              </button>
            </SignInButton>
            <SignUpButton mode="redirect">
              <button
                type="button"
                className="hidden rounded-lg bg-[var(--gold)] px-4 py-1.5 text-xs font-semibold text-[var(--navy)] shadow-sm transition-colors hover:bg-[var(--gold-light)] sm:inline-block sm:text-sm"
              >
                Prova gratis
              </button>
            </SignUpButton>
          </nav>
        </div>
      </header>

      <main>
        {/* ── Hero ──────────────────────────────────────────────── */}
        <section className="relative overflow-hidden bg-gradient-to-b from-[#f5f0e6] via-[#f8f4ec] to-[var(--surface)]">
          {/* Decorative blobs */}
          <div className="pointer-events-none absolute -right-40 -top-40 h-[600px] w-[600px] rounded-full bg-[var(--gold)]/[0.07] blur-3xl" />
          <div className="pointer-events-none absolute -left-32 bottom-20 h-[400px] w-[400px] rounded-full bg-[var(--navy)]/[0.04] blur-3xl" />
          <div className="pointer-events-none absolute right-1/4 top-1/3 h-[200px] w-[200px] rounded-full bg-[var(--gold)]/[0.04] blur-2xl" />

          <div className="mx-auto max-w-7xl px-5 pb-10 pt-14 sm:px-7 sm:pt-20 lg:px-10 lg:pt-24">
            {/* Top row: text + screenshot */}
            <div className="flex flex-col gap-12 lg:flex-row lg:items-center lg:gap-16">
              {/* Text column */}
              <div className="max-w-xl shrink-0 text-left text-[var(--navy)] lg:max-w-xl">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--gold)]/30 bg-white/80 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.1em] text-[var(--gold)] shadow-sm backdrop-blur-sm">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--gold)]" />
                  Prova gratuita 30 giorni &middot; Nessun vincolo
                </span>

                <h1 className="mt-6 text-[2.25rem] font-bold leading-[1.1] tracking-tight sm:text-[3rem] lg:text-[3.7rem]">
                  Gestisci pratiche, udienze e scadenze{" "}
                  <span className="text-[var(--gold)]">senza più caos operativo</span>.
                </h1>

                <p className="mt-6 max-w-lg text-base leading-relaxed text-zinc-600 sm:text-lg">
                  Con <span className="font-semibold text-[var(--navy)]">Agenda Legale</span>{" "}
                  trasformi attività sparse in un flusso unico: apri la pratica, gestisci le fasi,
                  calcoli i termini e controlli tutto da un calendario pensato per il tuo studio.
                </p>

                {/* CTA */}
                <div className="mt-10 flex flex-wrap items-center gap-4">
                  <SignUpButton mode="redirect">
                    <button
                      type="button"
                      className="rounded-lg bg-[var(--gold)] px-7 py-3.5 text-base font-bold text-[var(--navy)] shadow-lg shadow-[var(--gold)]/25 transition-all hover:scale-[1.02] hover:bg-[var(--gold-light)] hover:shadow-xl"
                    >
                      Attiva prova gratuita
                    </button>
                  </SignUpButton>
                  <SignInButton mode="redirect">
                    <button
                      type="button"
                      className="rounded-lg border border-[var(--navy)]/15 bg-white px-6 py-3.5 text-base font-medium text-[var(--navy)] transition-colors hover:bg-[var(--navy)] hover:text-white"
                    >
                      Ho già un account
                    </button>
                  </SignInButton>
                </div>

                <p className="mt-4 text-sm text-zinc-500">
                  Attivazione immediata &middot; Piano unico{" "}
                  <span className="font-semibold text-zinc-700">9,99 €/mese</span> &middot; Prezzo
                  fisso, nessun lock-in
                </p>
              </div>

              {/* Screenshot column – grande con card flottanti */}
              <div className="relative flex flex-1 items-center justify-center lg:justify-end">
                <div className="relative w-full max-w-2xl lg:max-w-[700px]">
                  {/* Glow */}
                  <div className="pointer-events-none absolute -inset-5 rounded-3xl bg-gradient-to-br from-[var(--gold)]/20 via-transparent to-[var(--navy)]/10 blur-2xl" aria-hidden />

                  {/* Main screenshot */}
                  <div className="relative overflow-hidden rounded-2xl border border-zinc-200/60 shadow-2xl shadow-black/10">
                    <Image
                      src="/screenshot-calendario.png"
                      alt="Calendario di Agenda Legale"
                      width={1160}
                      height={760}
                      sizes="(min-width: 1024px) 580px, 100vw"
                      priority
                      className="h-auto w-full"
                    />
                  </div>

                  {/* Floating card: top-right */}
                  <div className="absolute -right-3 -top-3 z-10 rounded-xl border border-zinc-200/80 bg-white px-3.5 py-2.5 shadow-lg sm:-right-6 sm:-top-5">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--gold)]">Oggi</p>
                    <p className="mt-0.5 text-sm font-bold text-[var(--navy)]">3 udienze</p>
                    <p className="text-[10px] text-zinc-500">2 scadenze in arrivo</p>
                  </div>

                  {/* Floating card: bottom-left */}
                  <div className="absolute -bottom-3 -left-3 z-10 flex items-center gap-2 rounded-xl border border-zinc-200/80 bg-white px-3.5 py-2.5 shadow-lg sm:-bottom-5 sm:-left-6">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8.5l3 3 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </span>
                    <div>
                      <p className="text-xs font-semibold text-[var(--navy)]">Completata</p>
                      <p className="text-[10px] text-zinc-500">Memoria 171-ter depositata</p>
                    </div>
                  </div>

                  {/* Floating card: bottom-right – AI */}
                  <div className="absolute -bottom-2 -right-2 z-10 hidden rounded-xl border border-zinc-200/80 bg-white px-3 py-2 shadow-lg sm:-bottom-4 sm:right-12 sm:block">
                    <div className="flex items-center gap-1.5">
                      <span className="flex h-6 w-6 items-center justify-center rounded-md bg-[var(--gold)]/15 text-xs">🤖</span>
                      <p className="text-[10px] font-semibold text-[var(--navy)]">AI ha estratto 4 date</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Benefit strip – sotto hero, più sostanziose */}
            <div className="mt-12 grid grid-cols-2 gap-4 sm:mt-14 sm:grid-cols-4 sm:gap-5">
              <HeroBenefit
                icon={<span className="text-amber-600">⏱</span>}
                title="Meno tempo perso"
                desc="Dall'atto all'evento in pochi clic"
              />
              <HeroBenefit
                icon={<span className="text-emerald-600">✓</span>}
                title="Meno errori"
                desc="Termini calcolati automaticamente"
              />
              <HeroBenefit
                icon={<span className="text-sky-600">🔒</span>}
                title="Più controllo"
                desc="Filtri operativi e storico completo"
              />
              <HeroBenefit
                icon={<span className="text-violet-600">🤖</span>}
                title="AI integrata"
                desc="Estrae date e dati dai tuoi atti"
              />
            </div>
          </div>
        </section>

        {/* ── Stats bar – numeri per credibilità ─────────────────── */}
        <section className="relative z-10 border-b border-zinc-200 bg-[var(--navy)]">
          <div className="mx-auto grid max-w-5xl grid-cols-2 gap-px sm:grid-cols-4">
            <StatItem value="50+" label="Termini processuali gestiti" />
            <StatItem value="∞" label="Pratiche inseribili" />
            <StatItem value="4" label="Viste calendario" />
            <StatItem value="100%" label="Dati esportabili" />
          </div>
        </section>

        {/* ── Freccia scroll hint ────────────────────────────────── */}
        <div className="flex justify-center bg-[var(--surface)] pb-2 pt-6 sm:pt-8">
          <div className="flex flex-col items-center gap-1 text-zinc-400">
            <span className="text-[10px] font-medium uppercase tracking-widest">Scopri di più</span>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="animate-bounce">
              <path d="M10 4v10m0 0l-4-4m4 4l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>

        {/* ── Funzionalità ──────────────────────────────────────── */}
        <section id="funzionalita" className="scroll-mt-20 border-b border-zinc-200 bg-[var(--surface)]">
          <div className="mx-auto max-w-7xl px-5 py-16 sm:px-7 sm:py-20 lg:px-10 lg:py-24">
            <SectionHeader
              label="Funzionalità"
              title="Una piattaforma unica per il lavoro legale quotidiano"
              subtitle="Dalla pratica alla scadenza, tutto in un unico ambiente ordinato e misurabile."
            />

            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <FeatureCard
                icon="📋"
                title="Pratiche e fasi"
                description="Crea la pratica, sviluppala nelle sue fasi e mantieni lo storico completo di ogni causa."
              />
              <FeatureCard
                icon="🔔"
                title="Promemoria operativi"
                description="Imposta promemoria e usa i filtri Da fare / Completati per gestire le priorità."
              />
              <FeatureCard
                icon="⚖️"
                title="Calcolo termini"
                description="Inserisci la data di riferimento e ottieni automaticamente le scadenze processuali."
              />
              <FeatureCard
                icon="💾"
                title="Backup sempre tuo"
                description="Scarica una copia JSON completa dei tuoi dati e conservala nei tuoi sistemi."
              />
            </div>

            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <FeatureCard
                icon="🤖"
                title="Estrazione AI"
                description="Carica l'atto e l'AI estrae date, termini e parti processuali per te."
              />
              <FeatureCard
                icon="🔄"
                title="Prosecuzione"
                description="Fai avanzare la pratica alla fase successiva senza perdere lo storico."
              />
              <FeatureCard
                icon="👥"
                title="Condivisione"
                description="Condividi il calendario con colleghi e collaboratori in tempo reale."
              />
              <FeatureCard
                icon="📅"
                title="Viste multiple"
                description="Giorno, Settimana, Mese, Agenda: scegli la vista giusta per il momento."
              />
            </div>
          </div>
        </section>

        {/* ── Valore concreto ───────────────────────────────────── */}
        <section className="border-b border-zinc-200 bg-white">
          <div className="mx-auto max-w-7xl px-5 py-20 sm:px-7 sm:py-24 lg:px-10 lg:py-24">
            <SectionHeader
              label="Valore"
              title="Perché gli studi scelgono Agenda Legale"
              subtitle="Non è solo un calendario: è il sistema operativo del tuo studio."
            />

            <div className="mt-12 grid gap-6 md:grid-cols-3">
              <ValueCard
                accent="bg-amber-500"
                title="Riduci attività amministrative"
                description="Meno tempo in copia-incolla, più tempo su strategia e lavoro a valore per i clienti."
              />
              <ValueCard
                accent="bg-emerald-500"
                title="Aumenti affidabilità interna"
                description="Processi più ordinati, meno dimenticanze e migliore coordinamento del team di studio."
              />
              <ValueCard
                accent="bg-sky-500"
                title="Migliori percezione del cliente"
                description="Scadenze presidiate e operatività puntuale aumentano la fiducia nello studio."
              />
            </div>
          </div>
        </section>

        {/* ── Come funziona ──────────────────────────────────────── */}
        <section id="come-funziona" className="scroll-mt-20 border-b border-zinc-200 bg-[var(--surface)]">
          <div className="mx-auto max-w-7xl px-5 py-20 sm:px-7 sm:py-24 lg:px-10 lg:py-24">
            <SectionHeader
              label="Come funziona"
              title="Dal primo accesso alla gestione quotidiana"
              subtitle="In 4 passaggi passi dal caos a un flusso ordinato e condivisibile."
            />

            <ol className="mt-12 grid gap-6 md:grid-cols-4">
              <StepCard
                step="1"
                title="Crea il tuo account"
                description="Registrati e inizia subito, senza configurazioni complesse."
              />
              <StepCard
                step="2"
                title="Apri la pratica"
                description="Inserisci i dati del fascicolo e collega il primo evento."
              />
              <StepCard
                step="3"
                title="Lavora con i filtri"
                description="Usa Da fare, In scadenza e Completati per gestire le priorità."
              />
              <StepCard
                step="4"
                title="Avanza e archivia"
                description="Prosegui nelle fasi successive e scarica backup periodici."
              />
            </ol>
          </div>
        </section>

        {/* ── Per chi è ──────────────────────────────────────────── */}
        <section className="border-b border-zinc-200 bg-white">
          <div className="mx-auto max-w-7xl px-5 py-20 sm:px-7 sm:py-24 lg:px-10 lg:py-24">
            <SectionHeader
              label="Per chi è"
              title="Pensata per chi vive il diritto ogni giorno"
            />

            <div className="mt-12 grid gap-6 md:grid-cols-3">
              <AudienceCard
                icon="🏛️"
                title="Studi legali"
                description="Coordina il lavoro di più professionisti condividendo lo stesso calendario di studio."
              />
              <AudienceCard
                icon="🏢"
                title="Uffici legali interni"
                description="Monitora scadenze e contenziosi aziendali con una vista unica e ordinata."
              />
              <AudienceCard
                icon="💼"
                title="Professionisti autonomi"
                description="Tieni sotto controllo udienze, appuntamenti e termini senza incrociare più strumenti."
              />
            </div>
          </div>
        </section>

        {/* ── Obiezioni tipiche ──────────────────────────────────── */}
        <section className="border-b border-zinc-200 bg-[var(--surface)]">
          <div className="mx-auto max-w-7xl px-5 py-20 sm:px-7 sm:py-24 lg:px-10 lg:py-24">
            <SectionHeader
              label="Domande"
              title="Domande tipiche prima di iniziare"
            />

            <div className="mt-12 grid gap-6 md:grid-cols-3">
              <FaqMini
                question="Serve installare qualcosa?"
                answer="No. Agenda Legale è web-based: accedi da browser su qualsiasi dispositivo e inizi subito."
              />
              <FaqMini
                question="I miei dati restano sotto controllo?"
                answer="Sì. Puoi esportare backup completi e mantenere copie locali nei tuoi archivi."
              />
              <FaqMini
                question="È adatto anche a studi piccoli?"
                answer="Assolutamente. Il flusso è semplice e scalabile, dal singolo professionista al team."
              />
            </div>
          </div>
        </section>

        {/* ── CTA finale ──────────────────────────────────────────── */}
        <section className="bg-[var(--navy)]">
          <div className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6 sm:py-24">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--gold)]">
              Inizia oggi
            </p>
            <h2 className="text-2xl font-bold text-white sm:text-3xl lg:text-4xl">
              Porta ordine, velocità e controllo nel tuo studio
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-zinc-300 sm:text-base">
              Crea l&apos;account in pochi minuti, prova la piattaforma per 30 giorni e verifica
              subito il valore sul tuo lavoro quotidiano.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <SignUpButton mode="redirect">
                <button
                  type="button"
                  className="rounded-lg bg-[var(--gold)] px-8 py-3.5 text-sm font-bold text-[var(--navy)] shadow-lg shadow-[var(--gold)]/20 transition-all hover:scale-[1.02] hover:bg-[var(--gold-light)] hover:shadow-xl sm:text-base"
                >
                  Inizia la prova gratuita
                </button>
              </SignUpButton>
              <Link
                href="/guida"
                className="flex items-center gap-1.5 rounded-lg border border-zinc-500/30 px-6 py-3.5 text-sm font-medium text-zinc-200 transition-colors hover:border-[var(--gold)] hover:text-white"
              >
                Scopri come funziona
                <span aria-hidden="true">&rarr;</span>
              </Link>
            </div>
          </div>
        </section>

        {/* ── Footer ──────────────────────────────────────────── */}
        <footer className="border-t border-zinc-200 bg-[var(--surface)]">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-7 text-sm text-zinc-500 sm:px-7 lg:px-10">
            <p>&copy; {new Date().getFullYear()} Agenda Legale</p>
            <div className="flex gap-4">
              <Link href="/guida" className="hover:text-[var(--navy)]">Guida</Link>
              <Link href="/legal/terms" className="hover:text-[var(--navy)]">Termini</Link>
              <Link href="/legal/privacy" className="hover:text-[var(--navy)]">Privacy</Link>
              <Link href="/legal/cookie" className="hover:text-[var(--navy)]">Cookie</Link>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────── */
/*  Componenti riutilizzabili                                       */
/* ────────────────────────────────────────────────────────────────── */

function SectionHeader(props: { label?: string; title: string; subtitle?: string }) {
  return (
    <div className="text-center">
      {props.label && (
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--gold)]">
          {props.label}
        </p>
      )}
      <h2 className="text-3xl font-bold text-[var(--navy)] sm:text-4xl">
        {props.title}
      </h2>
      {props.subtitle && (
        <p className="mx-auto mt-4 max-w-3xl text-base text-zinc-600 sm:text-lg">
          {props.subtitle}
        </p>
      )}
    </div>
  );
}


function FeatureCard(props: { icon: string; title: string; description: string }) {
  return (
    <div className="group flex h-full flex-col rounded-2xl border border-zinc-200 bg-white p-7 shadow-sm transition-shadow hover:shadow-md">
      <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--gold)]/10 text-xl" aria-hidden="true">
        {props.icon}
      </span>
      <h3 className="text-base font-bold text-[var(--navy)]">{props.title}</h3>
      <p className="mt-2.5 text-base leading-relaxed text-zinc-600">{props.description}</p>
    </div>
  );
}

function StepCard(props: { step: string; title: string; description: string }) {
  return (
    <li className="relative flex h-full flex-col rounded-2xl border border-zinc-200 bg-white p-7 pt-9 shadow-sm">
      <div className="absolute -top-4 left-5 flex h-8 w-8 items-center justify-center rounded-full bg-[var(--navy)] text-sm font-bold text-[var(--gold)] shadow-md">
        {props.step}
      </div>
      <h3 className="text-base font-bold text-[var(--navy)]">{props.title}</h3>
      <p className="mt-2.5 text-base leading-relaxed text-zinc-600">{props.description}</p>
    </li>
  );
}

function ValueCard(props: { accent: string; title: string; description: string }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-zinc-200 bg-white p-7 shadow-sm">
      <div className={`absolute left-0 top-0 h-full w-1 ${props.accent}`} />
      <p className="pl-3 text-base font-bold text-[var(--navy)]">{props.title}</p>
      <p className="mt-2.5 pl-3 text-base leading-relaxed text-zinc-600">{props.description}</p>
    </div>
  );
}

function AudienceCard(props: { icon: string; title: string; description: string }) {
  return (
    <div className="flex h-full flex-col items-center rounded-2xl border border-zinc-200 bg-[var(--surface)] p-7 text-center shadow-sm transition-shadow hover:shadow-md">
      <span className="mb-4 text-3xl" aria-hidden="true">{props.icon}</span>
      <h3 className="text-base font-bold text-[var(--navy)]">{props.title}</h3>
      <p className="mt-2.5 text-base leading-relaxed text-zinc-600">{props.description}</p>
    </div>
  );
}

function FaqMini(props: { question: string; answer: string }) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-7 shadow-sm">
      <p className="text-base font-bold text-[var(--navy)]">{props.question}</p>
      <p className="mt-2.5 text-base leading-relaxed text-zinc-600">{props.answer}</p>
    </div>
  );
}

function HeroBenefit(props: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="rounded-xl border border-zinc-200/80 bg-white/80 px-5 py-4 shadow-sm backdrop-blur-sm">
      <div className="mb-1.5 flex items-center gap-2">
        <span className="text-base" aria-hidden="true">{props.icon}</span>
        <p className="text-sm font-bold text-[var(--navy)] sm:text-base">{props.title}</p>
      </div>
      <p className="text-xs leading-snug text-zinc-500 sm:text-sm">{props.desc}</p>
    </div>
  );
}

function StatItem(props: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-5 text-center sm:py-6">
      <p className="text-2xl font-bold text-[var(--gold)] sm:text-3xl">{props.value}</p>
      <p className="mt-1 text-[11px] leading-tight text-zinc-300 sm:text-xs">{props.label}</p>
    </div>
  );
}
