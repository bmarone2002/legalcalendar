import { getSiteUrl } from "@/lib/site-url";

export type LaunchStep = 0 | 1 | 2;

type LaunchEmailContent = {
  subject: string;
  text: string;
  html: string;
};

function renderShell(title: string, bodyHtml: string, ctaLabel: string, ctaUrl: string): string {
  return `
    <div style="background:#f5f7fb;padding:24px;font-family:Arial,sans-serif;color:#1f2937">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:640px;margin:0 auto;background:#ffffff;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden">
        <tr>
          <td style="background:#0f172a;color:#ffffff;padding:20px 24px">
            <h1 style="margin:0;font-size:22px;line-height:1.3">Legal Calendar</h1>
            <p style="margin:6px 0 0 0;font-size:14px;opacity:.9">Organizzazione affidabile delle scadenze legali</p>
          </td>
        </tr>
        <tr>
          <td style="padding:24px">
            <h2 style="margin:0 0 14px 0;font-size:20px;line-height:1.3;color:#111827">${title}</h2>
            ${bodyHtml}
            <div style="margin:24px 0 8px 0">
              <a href="${ctaUrl}" style="display:inline-block;background:#1d4ed8;color:#ffffff;text-decoration:none;padding:12px 18px;border-radius:8px;font-weight:700">
                ${ctaLabel}
              </a>
            </div>
            <p style="margin:18px 0 0 0;font-size:13px;color:#6b7280">
              Ricevi questa comunicazione perche hai mostrato interesse al prodotto. Puoi interrompere le comunicazioni rispondendo a questa email.
            </p>
          </td>
        </tr>
      </table>
    </div>
  `.trim();
}

export function getLaunchEmail(step: LaunchStep): LaunchEmailContent {
  const appUrl = getSiteUrl();
  const demoUrl = `${appUrl}/guida?utm_source=email&utm_medium=launch&utm_campaign=product_launch`;

  if (step === 0) {
    const subject = "Legal Calendar: meno rischio, piu controllo sulle scadenze";
    const text =
      "Legal Calendar aiuta professionisti e studi a gestire in modo affidabile scadenze e adempimenti, evitando dimenticanze e riducendo il rischio operativo. Scopri la guida prodotto.";
    const html = renderShell(
      "Controllo delle scadenze con un metodo affidabile",
      `
        <p style="margin:0 0 12px 0;line-height:1.6">
          Legal Calendar nasce per ridurre il rischio di scadenze perse e migliorare il controllo operativo.
          Centralizzi eventi, promemoria e attivita in un unico flusso, con una vista chiara e ordinata.
        </p>
        <p style="margin:0;line-height:1.6">
          In fase di lancio stiamo supportando i primi utenti con onboarding guidato e best practice operative.
        </p>
      `,
      "Scopri il prodotto",
      demoUrl
    );
    return { subject, text, html };
  }

  if (step === 1) {
    const subject = "Come ridurre errori e urgenze nel calendario legale";
    const text =
      "Un calendario affidabile non e solo agenda: e processo. Legal Calendar aiuta a standardizzare passaggi, evitare urgenze e mantenere continuita operativa.";
    const html = renderShell(
      "Dal promemoria al processo: piu affidabilita nel lavoro quotidiano",
      `
        <p style="margin:0 0 12px 0;line-height:1.6">
          Nei contesti legali, una dimenticanza costa tempo, reputazione e margine operativo.
          Per questo il calendario deve essere strutturato come processo, non solo come elenco date.
        </p>
        <p style="margin:0;line-height:1.6">
          Con Legal Calendar puoi mantenere una gestione coerente di eventi e attivita collegate,
          riducendo improvvisazioni e richieste urgenti dell'ultimo minuto.
        </p>
      `,
      "Vedi come funziona",
      demoUrl
    );
    return { subject, text, html };
  }

  const subject = "Vuoi una demo rapida di Legal Calendar?";
  const text =
    "Se vuoi valutare Legal Calendar con il tuo flusso reale, possiamo mostrarti una demo rapida con casi pratici. Prenota ora.";
  const html = renderShell(
    "Sessione demo breve e concreta",
    `
      <p style="margin:0 0 12px 0;line-height:1.6">
        Se vuoi capire rapidamente l'impatto sul tuo metodo di lavoro, possiamo fare una demo focalizzata
        sui casi operativi piu frequenti.
      </p>
      <p style="margin:0;line-height:1.6">
        In 20 minuti vedrai la configurazione base, il flusso eventi e la gestione delle scadenze in modo pratico.
      </p>
    `,
    "Richiedi demo",
    demoUrl
  );
  return { subject, text, html };
}
