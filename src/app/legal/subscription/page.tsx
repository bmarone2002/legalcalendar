export default function SubscriptionPage() {
  return (
    <article className="space-y-4">
      <header className="rounded-xl border border-zinc-200 bg-zinc-50/70 p-4 sm:p-5">
        <h2 className="text-xl font-semibold text-[var(--navy)]">Condizioni Abbonamento e Recesso</h2>
        <p className="mt-1 text-sm text-zinc-500">Versione 2026-04-21</p>
      </header>

      <section className="rounded-xl border border-zinc-200 bg-white p-4 sm:p-5">
        <h3 className="text-base font-semibold text-[var(--navy)]">Prezzo del piano</h3>
        <p className="mt-2 text-sm leading-relaxed text-zinc-700">
          Il piano è unico: 9,99 €/mese. Non si tratta di un prezzo "a partire da".
        </p>
      </section>

      <section className="rounded-xl border border-zinc-200 bg-white p-4 sm:p-5">
        <h3 className="text-base font-semibold text-[var(--navy)]">Rinnovo automatico</h3>
        <p className="mt-2 text-sm leading-relaxed text-zinc-700">
          I piani in abbonamento si rinnovano automaticamente alla scadenza del periodo, salvo disdetta prima del rinnovo.
        </p>
      </section>

      <section className="rounded-xl border border-zinc-200 bg-white p-4 sm:p-5">
        <h3 className="text-base font-semibold text-[var(--navy)]">Disdetta</h3>
        <p className="mt-2 text-sm leading-relaxed text-zinc-700">
          La disdetta si effettua dal Customer Portal Stripe e blocca i rinnovi futuri; il servizio resta attivo fino alla fine
          del periodo gia&apos; pagato.
        </p>
      </section>

      <section className="rounded-xl border border-zinc-200 bg-white p-4 sm:p-5">
        <h3 className="text-base font-semibold text-[var(--navy)]">Diritto di recesso</h3>
        <p className="mt-2 text-sm leading-relaxed text-zinc-700">
          Per i consumatori, ove applicabile, resta fermo il diritto di recesso entro 14 giorni, con eventuali eccezioni previste
          dalla normativa sui contenuti digitali.
        </p>
      </section>
    </article>
  );
}
