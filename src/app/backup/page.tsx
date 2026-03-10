import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";

export default function BackupPage() {
  const [isDownloading, setIsDownloading] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [confirmOverwrite, setConfirmOverwrite] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  async function handleDownloadBackup() {
    setMessage(null);
    setIsDownloading(true);
    try {
      const res = await fetch("/api/backup", {
        method: "GET",
      });
      if (!res.ok) {
        throw new Error("Risposta non valida dal server");
      }
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const disposition = res.headers.get("Content-Disposition") ?? "";
      const match = disposition.match(/filename=\"?([^\";]+)\"?/i);
      const filename = match?.[1] ?? "backup-calendario.json";
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      setMessage({
        type: "success",
        text: "Backup scaricato correttamente sul tuo computer.",
      });
    } catch (error) {
      console.error(error);
      setMessage({
        type: "error",
        text: "Non è stato possibile generare il backup. Riprova più tardi.",
      });
    } finally {
      setIsDownloading(false);
    }
  }

  async function handleRestore(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);

    const form = event.currentTarget;
    const fileInput = form.elements.namedItem("backupFile") as HTMLInputElement | null;
    const file = fileInput?.files?.[0];

    if (!file) {
      setMessage({
        type: "error",
        text: "Seleziona prima un file di backup JSON.",
      });
      return;
    }

    if (!confirmOverwrite) {
      setMessage({
        type: "error",
        text: "Devi confermare di voler sovrascrivere completamente il calendario.",
      });
      return;
    }

    const ok = window.confirm(
      "Questa operazione sovrascriverà completamente il tuo calendario attuale con i dati presenti nel file di backup selezionato. Vuoi procedere?"
    );
    if (!ok) {
      return;
    }

    setIsRestoring(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/backup/restore", {
        method: "POST",
        body: formData,
      });

      const json = (await res.json()) as { success?: boolean; error?: string; importedEvents?: number };

      if (!res.ok || !json.success) {
        throw new Error(json.error || "Errore durante il ripristino del backup.");
      }

      setMessage({
        type: "success",
        text: `Backup ripristinato con successo. Eventi importati: ${json.importedEvents ?? 0}.`,
      });
    } catch (error) {
      console.error(error);
      setMessage({
        type: "error",
        text:
          error instanceof Error
            ? error.message
            : "Non è stato possibile ripristinare il backup. Riprova più tardi.",
      });
    } finally {
      setIsRestoring(false);
    }
  }

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    setSelectedFileName(file ? file.name : null);
    setMessage(null);
  }

  const canRestore = !!selectedFileName && confirmOverwrite && !isRestoring;

  return (
    <AppShell headerTitle={<span>Backup</span>}>
      <SignedIn>
        <div className="mx-auto max-w-2xl space-y-8">
          <section className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
            <h1 className="mb-2 text-xl font-semibold text-[var(--navy)]">
              Backup del calendario
            </h1>
            <p className="text-sm text-zinc-700">
              Questa sezione ti permette di salvare una copia di sicurezza del tuo calendario
              sul tuo computer e di ripristinarla in qualsiasi momento. Il file contiene tutti
              gli eventi e sottoeventi presenti nel tuo account al momento del salvataggio.
            </p>
          </section>

          {message && (
            <div
              className={`rounded-md border px-4 py-3 text-sm ${
                message.type === "success"
                  ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                  : "border-red-200 bg-red-50 text-red-800"
              }`}
            >
              {message.text}
            </div>
          )}

          <section className="space-y-3 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
            <div className="space-y-1">
              <h2 className="text-base font-semibold text-[var(--navy)]">
                Scarica un backup del tuo calendario
              </h2>
              <p className="text-sm text-zinc-700">
                Cliccando su questo pulsante scaricherai un file JSON con tutti gli eventi e
                sottoeventi attualmente presenti nel tuo calendario. Conserva questo file in un
                luogo sicuro: potrai usarlo per ripristinare il calendario in caso di problemi o
                perdita di dati.
              </p>
            </div>
            <button
              type="button"
              className="inline-flex items-center rounded-md bg-[var(--navy)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--navy-light)]"
              onClick={handleDownloadBackup}
              disabled={isDownloading}
            >
              {isDownloading ? "Generazione in corso..." : "Scarica backup (JSON)"}
            </button>
            <p className="text-xs text-zinc-600">
              Per creare un nuovo backup, ripeti semplicemente il download quando il calendario è
              aggiornato. Il file scaricato fotografa la situazione al momento dello
              scaricamento.
            </p>
          </section>

          <section className="space-y-4 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
            <div className="space-y-1">
              <h2 className="text-base font-semibold text-[var(--navy)]">
                Ripristina il calendario da un backup
              </h2>
              <p className="text-sm text-zinc-700">
                Se hai precedentemente scaricato un file di backup (JSON), puoi caricarlo per
                ripristinare il tuo calendario. Il sistema leggerà il file e sostituirà gli
                eventi attuali con quelli contenuti nel backup.
              </p>
              <p className="text-sm font-medium text-red-700">
                Attenzione: il ripristino da backup sovrascrive completamente il calendario
                attuale. Gli eventi e sottoeventi presenti oggi verranno sostituiti con quelli
                presenti nel file di backup.
              </p>
            </div>

            <form className="space-y-4" onSubmit={handleRestore}>
              <div className="space-y-2">
              <label className="block text-sm font-medium text-[var(--navy)]">
                File di backup (JSON)
              </label>
              <input
                type="file"
                name="backupFile"
                accept="application/json"
                className="block w-full cursor-pointer text-sm text-zinc-700 file:mr-3 file:rounded-md file:border-0 file:bg-[var(--navy)] file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-[var(--navy-light)]"
                onChange={handleFileChange}
              />
              {selectedFileName && (
                <p className="text-xs text-zinc-700">
                  File selezionato: <span className="font-medium">{selectedFileName}</span>
                </p>
              )}
              <p className="text-xs text-zinc-600">
                Non caricare file ricevuti da terzi o di cui non conosci l&apos;origine. Il file
                di backup dovrebbe provenire solo dal tuo calendario.
              </p>
              </div>

              <div className="space-y-2">
              <label className="inline-flex items-start gap-2 text-sm text-zinc-700">
                <input
                  type="checkbox"
                  className="mt-0.5 h-4 w-4 rounded border-zinc-300 text-[var(--navy)] focus:ring-[var(--navy-light)]"
                  checked={confirmOverwrite}
                  onChange={(e) => {
                    setConfirmOverwrite(e.target.checked);
                    setMessage(null);
                  }}
                />
                <span>
                  Confermo di voler sovrascrivere completamente il mio calendario attuale con i
                  dati presenti nel file di backup.
                </span>
              </label>
              </div>

              <div className="space-y-1">
                <button
                  type="submit"
                  className="inline-flex items-center rounded-md border border-[var(--gold)] bg-white px-4 py-2 text-sm font-medium text-[var(--gold)] hover:bg-[var(--gold)]/10 disabled:cursor-not-allowed disabled:opacity-60"
                  disabled={!canRestore}
                >
                  {isRestoring ? "Ripristino in corso..." : "Ripristina calendario"}
                </button>
                <ul className="ml-5 list-disc text-xs text-zinc-600">
                  <li>1. Clicca su &quot;Seleziona file di backup&quot; e scegli il file JSON.</li>
                  <li>
                    2. Verifica che si tratti del backup corretto (controlla la data del file sul
                    tuo computer).
                  </li>
                  <li>3. Spunta la casella di conferma per autorizzare la sovrascrittura.</li>
                  <li>4. Clicca su &quot;Ripristina calendario&quot; e attendi la conferma.</li>
                </ul>
              </div>
            </form>
          </section>
        </div>
      </SignedIn>
      <SignedOut>
        <div className="mx-auto max-w-xl rounded-xl border border-zinc-200 bg-white p-6 text-center shadow-sm">
          <h2 className="mb-2 text-lg font-semibold text-[var(--navy)]">
            Accedi per gestire i backup
          </h2>
          <p className="mb-4 text-sm text-zinc-600">
            Crea un account o accedi per poter salvare e ripristinare il tuo calendario.
          </p>
          <SignInButton mode="redirect">
            <button className="rounded-md bg-[var(--navy)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--navy-light)]">
              Vai al login
            </button>
          </SignInButton>
        </div>
      </SignedOut>
    </AppShell>
  );
}

