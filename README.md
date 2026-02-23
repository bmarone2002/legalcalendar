# Calendario Legale

Calendario personale per avvocato con interfaccia stile Outlook: viste Mese/Settimana, drag & drop eventi, modale evento estensibile e rule engine per sottoeventi automatici.

## Stack

- **Next.js 14+** (App Router), **React**, **TypeScript**
- **Prisma** + **SQLite**
- **FullCalendar** (viste month/week, drag & drop)
- **shadcn/ui** (Dialog, Tabs, Select, Input, ecc.)

## Requisiti

- Node.js 18+
- npm

## Installazione e avvio

```bash
# Dalla cartella legal-calendar
npm install
npx prisma generate
npx prisma migrate dev --name init   # crea il DB e le tabelle
npm run dev
```

Apri [http://localhost:3000](http://localhost:3000).

### Seed (opzionale)

Per avere un evento di esempio con sottoeventi:

```bash
npx tsx prisma/seed.ts
```

## Istruzioni di test manuale

1. **Vista calendario**
   - Passa tra **Mese** e **Settimana** con i pulsanti in alto a destra.
   - Usa **prev/next** per cambiare periodo e **Oggi** per tornare alla data corrente.
   - Verifica che gli eventi siano visibili e colorati per tipo (udienza, notifica, scadenza, ecc.).

2. **Crea evento**
   - Clicca su uno slot (giorno/ora) nel calendario.
   - Si apre la modale "Nuovo evento": compila Titolo, Tipo, date inizio/fine, eventuali tag e note.
   - Clicca **Salva**: l’evento compare in calendario.

3. **Crea evento con sottoeventi**
   - Come sopra; attiva il toggle **"Genera sottoeventi automaticamente"** e scegli un template (es. "Promemoria standard").
   - Salva: nella tab **"Regole & Sottoeventi"** vedi la lista dei sottoeventi e la colonna **"Perché questa data?"** (audit).

4. **Modifica evento**
   - Clicca su un evento nel calendario.
   - Si apre la modale in modifica: cambia titolo, date, tipo, ecc. e **Salva**.
   - Verifica che il calendario si aggiorni.

5. **Drag & drop**
   - Trascina un evento su un altro giorno/ora.
   - Verifica che la nuova data venga salvata e che, se l’evento ha sottoeventi automatici, questi vengano rigenerati (solo quelli non bloccati).

6. **Rigenera sottoeventi**
   - Apri un evento che ha sottoeventi, vai nella tab **"Regole & Sottoeventi"** e clicca **"Rigenera sottoeventi"**.
   - Verifica che la lista si aggiorni in base alla data dell’evento (i sottoeventi con **locked** non vengono sovrascritti).

### Test manuali ATTO GIURIDICO

7. **Citazione – Costituzione**: Template "Atto giuridico" → Citazione, Costituzione. Data notifica citazione → verifica "Costituzione attore" (notifica + 10 gg), Calcolo con "art. 165 c.p.c.".
8. **Citazione – Da notificare**: Data udienza comparizione → "Ultimo giorno per notificare citazione" = udienza − 120 (o 150 se estero).
9. **Ricorso opposizione**: Da notificare → +40 gg; Costituzione → +10 gg.
10. **Appello civile**: Breve = notifica sentenza + 30; Lungo = pubblicazione + 6 mesi.
11. **Ricorso Cassazione – Costituzione**: Ultima notifica ricorso + 20 gg (art. 369 c.p.c.).

Unit test: `npm run test:calcoli`.

## Script utili

- `npm run dev` – avvio in sviluppo
- `npm run build` – build di produzione
- `npm run start` – avvio dopo build
- `npm run db:migrate` – applica migrazioni Prisma
- `npm run db:seed` – esegue il seed

## Struttura progetto

- `src/app/` – layout e pagina principale
- `src/components/calendar/` – vista FullCalendar e toolbar
- `src/components/event-modal/` – modale create/edit a tab
- `src/components/ui/` – componenti shadcn (button, dialog, tabs, …)
- `src/lib/actions/` – Server Actions (CRUD eventi e sottoeventi, preview)
- `src/lib/rules/` – rule engine e plugin (reminder, generic-deadline, checklist, **atto-giuridico**)
- `src/types/atto-giuridico.ts` – tipi e enum per ATTO GIURIDICO (actionType, actionMode, inputs)
- `src/lib/settings.ts` – impostazioni (promemoria, defaultTimeForDeadlines, termini 120/150, ecc.)
- `prisma/` – schema e migrazioni SQLite

## Estendibilità

- **Modale**: tab "Promemoria" e "Avanzate" sono placeholder per future periferiche/controlli.
- **Regole**: nuove regole si registrano in `lib/rules/registry.ts` e si aggiungono al template in `types` (RULE_TEMPLATES).
- **Settings**: `lib/settings.ts` e tabella `Setting` consentono di aggiungere gestione weekend/festivi e sospensione feriale.
