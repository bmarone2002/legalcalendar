import Link from "next/link";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";

export default function GuidaPage() {
  return (
    <div className="min-h-screen bg-[var(--surface)]">
      <header className="border-b border-[var(--gold)]/20 bg-[var(--navy)]/95">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo-agenda-legale.png"
              alt="Agenda Legale"
              className="h-9 w-auto object-contain sm:h-11"
            />
            <div className="hidden sm:block">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--gold)]">
                Guida rapida
              </p>
              <p className="text-xs text-zinc-100/85">
                Tutto quello che puoi fare con Agenda Legale
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
        {/* Intro semplice */}
        <section className="mb-8">
          <h1 className="text-2xl font-semibold text-[var(--navy)] sm:text-3xl">
            Tutto quello che puoi fare con <span className="text-[var(--gold)]">Agenda Legale</span>
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-zinc-700 sm:text-base">
            Questa guida ti accompagna nell&apos;uso del calendario, dei promemoria, del calcolo dei
            termini, dei backup e dell&apos;
            <span className="font-medium">estrazione automatica delle informazioni con l&apos;AI</span>,
            così puoi gestire il tuo studio legale in modo ordinato e sicuro.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-xs sm:text-sm">
            <SignedIn>
              <Link
                href="/"
                className="inline-flex items-center rounded-md bg-[var(--gold)] px-4 py-2 font-semibold text-[var(--navy)] shadow-sm hover:bg-[var(--gold-light)]"
              >
                Vai al tuo calendario
              </Link>
            </SignedIn>
            <SignedOut>
              <SignInButton mode="redirect">
                <button
                  type="button"
                  className="inline-flex items-center rounded-md bg-[var(--gold)] px-4 py-2 font-semibold text-[var(--navy)] shadow-sm hover:bg-[var(--gold-light)]"
                >
                  Accedi per usare il calendario
                </button>
              </SignInButton>
            </SignedOut>
            <Link
              href="#calendario"
              className="text-[var(--navy)] underline-offset-4 hover:underline"
            >
              Vai subito alla sezione Calendario
            </Link>
            <Link
              href="#backup"
              className="text-[var(--navy)] underline-offset-4 hover:underline"
            >
              Scopri come fare il backup
            </Link>
          </div>
        </section>

        {/* Sezione 0 – Estrazione automatica con AI */}
        <section id="ai" className="mb-10 scroll-mt-20">
          <h2 className="mb-3 text-xl font-semibold text-[var(--navy)]">
            0. Estrazione automatica di date e procedimenti con l&apos;AI
          </h2>
          <p className="mb-3 text-sm text-zinc-700">
            Una delle funzioni più importanti di Agenda Legale è la capacità di{" "}
            <span className="font-medium">leggere i documenti e proporre automaticamente eventi e scadenze</span>.
            In questo modo riduci al minimo l&apos;inserimento manuale.
          </p>
          <ul className="grid gap-3 text-sm text-zinc-700 md:grid-cols-3">
            <li className="rounded-xl border border-zinc-200 bg-white p-4">
              <p className="mb-1 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--gold)]">
                Come funziona
              </p>
              <p className="text-xs">
                Fornisci i dati o i documenti di partenza e l&apos;AI identifica termini, date e
                riferimenti procedurali rilevanti.
              </p>
            </li>
            <li className="rounded-xl border border-zinc-200 bg-white p-4">
              <p className="mb-1 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--gold)]">
                Cosa ottieni
              </p>
              <p className="text-xs">
                Proposte di eventi e scadenze già pronte per essere inserite nel calendario, con
                meno errori e molto meno tempo impiegato.
              </p>
            </li>
            <li className="rounded-xl border border-zinc-200 bg-white p-4">
              <p className="mb-1 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--gold)]">
                Controllo sempre tuo
              </p>
              <p className="text-xs">
                Puoi sempre verificare e confermare le informazioni suggerite, mantenendo il pieno
                controllo sulle scadenze del tuo studio.
              </p>
            </li>
          </ul>
        </section>

        {/* Sezione 1 – Calendario */}
        <section id="calendario" className="mb-10 scroll-mt-20">
          <h2 className="mb-1 text-xl font-semibold text-[var(--navy)]">
            1. Il calendario: il cuore di Agenda Legale
          </h2>
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.18em] text-[var(--gold)]">
            Vista calendario
          </p>
          <p className="mb-4 text-sm text-zinc-700">
            Dal menu laterale clicca su <span className="font-medium">Calendario</span>. Qui trovi
            tutte le udienze, gli appuntamenti e le scadenze del tuo studio con viste{" "}
            <span className="font-medium">Giorno, Settimana, Mese e Agenda</span>. Puoi cambiare
            rapidamente vista e periodo, filtrare i promemoria per stato e tenere sempre sotto
            controllo cosa ti aspetta.
          </p>
          <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/screenshot-calendario.png"
              alt="Calendario di Agenda Legale"
              className="h-auto w-full object-cover"
            />
          </div>
          <ul className="mt-3 grid gap-2 text-xs text-zinc-700 sm:grid-cols-3 sm:text-sm">
            <li>• Usa il selettore in alto a destra per passare da Giorno, Settimana, Mese, Agenda.</li>
            <li>• Clicca su un giorno o su &quot;Nuovo evento&quot; per aggiungere un impegno.</li>
            <li>• Attiva i filtri a destra per vedere solo i promemoria &quot;Da fare&quot; o &quot;Completati&quot;.</li>
          </ul>
        </section>

        {/* Sezione 2 – Creare eventi */}
        <section id="eventi" className="mb-10 scroll-mt-20">
          <h2 className="mb-3 text-xl font-semibold text-[var(--navy)]">
            2. Come creare un evento o una scadenza
          </h2>
          <p className="mb-4 text-sm text-zinc-700">
            Per inserire un nuovo impegno, clicca su{" "}
            <span className="font-medium">Nuovo evento</span> o fai doppio clic su un giorno/ora
            nella vista desiderata. Si apre una scheda in cui puoi indicare tipo di evento,
            descrizione, collegamento alla pratica, data, orario e promemoria.
          </p>
          <ol className="grid gap-4 text-sm text-zinc-700 md:grid-cols-3">
            <li className="rounded-xl border border-zinc-200 bg-white p-4">
              <p className="mb-1 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--gold)]">
                Step 1
              </p>
              <p className="font-medium text-[var(--navy)]">Apri la scheda &quot;Nuovo evento&quot;</p>
              <p className="mt-1 text-xs text-zinc-700">
                Dal calendario clicca su &quot;Nuovo evento&quot; oppure seleziona direttamente il
                giorno e l&apos;orario.
              </p>
            </li>
            <li className="rounded-xl border border-zinc-200 bg-white p-4">
              <p className="mb-1 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--gold)]">
                Step 2
              </p>
              <p className="font-medium text-[var(--navy)]">Compila i dettagli legali</p>
              <p className="mt-1 text-xs text-zinc-700">
                Indica causa, cliente, sezione e ogni informazione utile a riconoscere l&apos;evento
                anche a distanza di tempo.
              </p>
            </li>
            <li className="rounded-xl border border-zinc-200 bg-white p-4">
              <p className="mb-1 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--gold)]">
                Step 3
              </p>
              <p className="font-medium text-[var(--navy)]">Imposta data, orario e promemoria</p>
              <p className="mt-1 text-xs text-zinc-700">
                Scegli quando si terrà l&apos;udienza o la scadenza e imposta uno o più promemoria
                per non dimenticarla.
              </p>
            </li>
          </ol>
        </section>

        {/* Sezione 3 – Promemoria */}
        <section id="promemoria" className="mb-10 scroll-mt-20">
          <h2 className="mb-3 text-xl font-semibold text-[var(--navy)]">
            3. Gestione dei promemoria: Da fare e Completati
          </h2>
          <p className="mb-3 text-sm text-zinc-700">
            Ogni evento può avere uno o più <span className="font-medium">promemoria</span>. Dal
            calendario puoi filtrare rapidamente cosa è ancora da svolgere e cosa è già stato
            gestito, così non perdi tempo a scorrere l&apos;agenda.
          </p>
          <ul className="mb-3 grid gap-3 text-sm text-zinc-700 md:grid-cols-2">
            <li className="rounded-xl border border-zinc-200 bg-white p-4">
              <p className="font-medium text-[var(--navy)]">Promemoria &quot;Da fare&quot;</p>
              <p className="mt-1 text-xs text-zinc-700">
                Mostrano tutte le attività che richiedono ancora una tua azione. Usa questo filtro
                per pianificare la giornata.
              </p>
            </li>
            <li className="rounded-xl border border-zinc-200 bg-white p-4">
              <p className="font-medium text-[var(--navy)]">Promemoria &quot;Completati&quot;</p>
              <p className="mt-1 text-xs text-zinc-700">
                Quando hai gestito un evento, segna il promemoria come completato: resterà a
                disposizione come storico ma non ti disturberà più.
              </p>
            </li>
          </ul>
          <p className="text-xs text-zinc-700">
            Usa i filtri in alto a destra nel calendario per passare velocemente da una vista
            all&apos;altra.
          </p>
        </section>

        {/* Sezione 4 – Calcolo dei termini */}
        <section id="termini" className="mb-10 scroll-mt-20">
          <h2 className="mb-3 text-xl font-semibold text-[var(--navy)]">
            4. Calcolo automatico dei termini processuali
          </h2>
          <p className="mb-4 text-sm text-zinc-700">
            Agenda Legale ti aiuta a calcolare rapidamente le scadenze partendo da una{" "}
            <span className="font-medium">data di riferimento</span> (es. deposito di un atto) e dal
            relativo <span className="font-medium">tipo di termine</span>. In questo modo riduci il
            rischio di errore nei conteggi manuali.
          </p>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-zinc-200 bg-white p-4 text-sm text-zinc-700">
              <p className="font-medium text-[var(--navy)]">Come funziona</p>
              <ul className="mt-2 space-y-1 text-xs">
                <li>• Inserisci la data di partenza (es. notifica o deposito dell&apos;atto).</li>
                <li>• Seleziona il tipo di termine che vuoi calcolare.</li>
                <li>• Il sistema restituisce la data di scadenza corrispondente.</li>
              </ul>
            </div>
            <div className="rounded-xl border border-zinc-200 bg-white p-4 text-sm text-zinc-700">
              <p className="font-medium text-[var(--navy)]">Esempi di termini utili</p>
              <ul className="mt-2 space-y-1 text-xs">
                <li>• Termini per memorie ex art. 171-ter c.p.c.</li>
                <li>• Scadenze per impugnazioni o opposizioni.</li>
                <li>• Altri termini procedurali tipici della tua attività.</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Sezione 5 – Backup */}
        <section id="backup" className="mb-10 scroll-mt-20">
          <h2 className="mb-3 text-xl font-semibold text-[var(--navy)]">
            5. Backup e sicurezza dei dati
          </h2>
          <p className="mb-3 text-sm text-zinc-700">
            Dal menu laterale clicca su <span className="font-medium">Backup</span>. Qui puoi
            scaricare un file JSON con tutti gli eventi presenti nel tuo calendario e, se
            necessario, ripristinarlo in futuro.
          </p>
          <div className="grid gap-4 md:grid-cols-[1.8fr,1.2fr]">
            <div className="rounded-xl border border-zinc-200 bg-white p-4 text-sm text-zinc-700">
              <p className="font-medium text-[var(--navy)]">Scaricare un backup</p>
              <ul className="mt-2 space-y-1 text-xs">
                <li>1. Vai nella sezione &quot;Backup&quot; dal menu laterale.</li>
                <li>2. Clicca su &quot;Scarica backup (JSON)&quot;.</li>
                <li>3. Conserva il file nei tuoi archivi interni o nel sistema dello studio.</li>
              </ul>
              <p className="mt-3 text-xs text-zinc-700">
                Il messaggio giallo in alto nel calendario ti ricorda periodicamente di scaricare un
                nuovo backup aggiornato.
              </p>
            </div>
            <div className="rounded-xl border border-zinc-200 bg-white p-4 text-sm text-zinc-700">
              <p className="font-medium text-[var(--navy)]">Ripristinare da un backup</p>
              <ul className="mt-2 space-y-1 text-xs">
                <li>• Seleziona il file JSON di backup che hai salvato in precedenza.</li>
                <li>• Conferma che vuoi sovrascrivere il calendario attuale.</li>
                <li>• Attendi il messaggio di conferma degli eventi importati.</li>
              </ul>
              <p className="mt-3 text-xs font-medium text-red-700">
                Attenzione: il ripristino sovrascrive completamente gli eventi attuali con quelli
                contenuti nel file.
              </p>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="mb-12 scroll-mt-20">
          <h2 className="mb-4 text-xl font-semibold text-[var(--navy)]">
            Domande frequenti
          </h2>
          <div className="space-y-3">
            <FaqItem
              question="Non vedo più un evento che avevo inserito, cosa posso fare?"
              answer="Verifica innanzitutto di essere nel periodo corretto (mese/settimana/giorno) e di non avere filtri attivi sui promemoria. Se hai più calendari condivisi, controlla che sia selezionato quello giusto."
            />
            <FaqItem
              question="Posso usare Agenda Legale da più dispositivi?"
              answer="Sì, ti basta accedere con il tuo account da qualsiasi computer connesso a Internet. Il calendario si sincronizza automaticamente."
            />
            <FaqItem
              question="Cosa succede se perdo il backup?"
              answer="Puoi sempre generarne uno nuovo dalla sezione &quot;Backup&quot;. Ti consigliamo comunque di conservare i file di backup in un luogo sicuro gestito dallo studio."
            />
            <FaqItem
              question="Ho bisogno di assistenza, come vi contatto?"
              answer="Se incontri difficoltà puoi contattare il referente indicato nel materiale di attivazione del servizio oppure usare i canali di supporto comunicati al momento dell'adesione."
            />
          </div>
        </section>

        {/* CTA finale */}
        <section className="rounded-2xl border border-[var(--gold)]/25 bg-[var(--navy)] px-5 py-7 text-center text-white shadow-sm sm:px-8 sm:py-9">
          <h2 className="text-xl font-semibold sm:text-2xl">
            Sei pronto a mettere ordine nel tuo calendario legale?
          </h2>
          <p className="mt-2 text-sm text-zinc-100/85">
            Accedi al tuo account per iniziare subito a lavorare con Agenda Legale oppure registra un
            nuovo profilo in pochi minuti.
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-3 text-sm">
            <SignedIn>
              <Link
                href="/"
                className="inline-flex items-center rounded-md bg-[var(--gold)] px-5 py-2 font-semibold text-[var(--navy)] shadow-sm hover:bg-[var(--gold-light)]"
              >
                Vai al calendario
              </Link>
            </SignedIn>
            <SignedOut>
              <SignInButton mode="redirect">
                <button
                  type="button"
                  className="inline-flex items-center rounded-md bg-[var(--gold)] px-5 py-2 font-semibold text-[var(--navy)] shadow-sm hover:bg-[var(--gold-light)]"
                >
                  Accedi / Registrati
                </button>
              </SignInButton>
            </SignedOut>
          </div>
        </section>
      </main>
    </div>
  );
}

function FaqItem(props: { question: string; answer: string }) {
  const { question, answer } = props;
  return (
    <details className="group rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-800">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3">
        <span className="font-medium text-[var(--navy)]">{question}</span>
        <span className="text-xs text-[var(--gold)] group-open:rotate-180 transition-transform">
          ▼
        </span>
      </summary>
      <p className="mt-2 text-xs text-zinc-700">{answer}</p>
    </details>
  );
}

