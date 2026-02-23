# Guida al deploy – Legal Calendar online

Questa guida spiega come mettere l’app su internet (uso da più dispositivi) e come continuare a modificarla da Cursor.

---

## Cosa ti serve

1. **Account GitHub** – [github.com](https://github.com) (gratis)
2. **Account Railway** – [railway.app](https://railway.app) (login con GitHub, piano gratuito)
3. **Git** – già usato nel progetto (branch `master`)

---

## Passo 1 – Crea il repository su GitHub

1. Vai su [github.com/new](https://github.com/new).
2. **Repository name:** `legal-calendar` (o un altro nome che preferisci).
3. Lascia **Public**.
4. **Non** spuntare “Add a README” (il progetto esiste già).
5. Clicca **Create repository**.

Tieni aperta la pagina del repo: ti servirà l’URL (es. `https://github.com/TUO-USERNAME/legal-calendar`).

---

## Passo 2 – Collega il progetto e fai il primo push

Apri il **terminale in Cursor** (cartella `legal-calendar`) ed esegui, **sostituendo `TUO-USERNAME`** con il tuo username GitHub:

```bash
git remote add origin https://github.com/TUO-USERNAME/legal-calendar.git
git add .
git commit -m "Preparazione deploy: .gitignore, script start:prod, guida DEPLOY"
git branch -M main
git push -u origin main
```

Se il repo è già collegato (`git remote -v` mostra già `origin`), usa solo:

```bash
git add .
git commit -m "Preparazione deploy"
git push -u origin main
```

Da questo momento: **ogni modifica che fai in Cursor** la metti online con `git add .` → `git commit -m "descrizione"` → `git push`.

---

## Passo 3 – Deploy su Railway

### 3.1 Crea il progetto

1. Vai su [railway.app](https://railway.app) e accedi con **GitHub**.
2. **New Project** → **Deploy from GitHub repo**.
3. Scegli il repo **legal-calendar** (autorizza Railway su GitHub se richiesto).
4. Railway crea un “service” collegato al repo.

### 3.2 Configura il servizio

1. Clicca sul servizio (il riquadro del progetto).
2. Vai su **Settings** (o **Variables**).

**Variables – aggiungi:**

| Nome            | Valore                    |
|-----------------|---------------------------|
| `DATABASE_URL`  | `file:/data/dev.db`       |

(La useremo con il volume al passo 3.3.)

### 3.3 Volume per il database (SQLite persistente)

1. Nella stessa pagina del servizio, cerca **Volumes** (o **Persistent Storage**).
2. **Add Volume** (o **Mount Volume**).
3. **Mount Path:** `/data`.
4. Salva.

In questo modo il file `dev.db` sarà in `/data/dev.db` e non verrà perso ai riavvii.

### 3.4 Comandi di build e avvio

Sempre in **Settings** del servizio:

- **Build Command:**  
  `npm install && npx prisma generate && npm run build`

- **Start Command:**  
  `npm run start:prod`

- **Root Directory:** lascia vuoto (il repo è già nella root del progetto).

Salva le modifiche. Railway eseguirà il build e poi avvierà l’app con `start:prod` (che applica le migrazioni e avvia Next.js).

### 3.5 Dominio pubblico

1. Vai su **Settings** → **Networking** (o **Generate Domain**).
2. Clicca **Generate Domain** (o **Public Networking**).
3. Railway assegna un URL tipo:  
   `https://legal-calendar-production-xxxx.up.railway.app`

Quell’URL è il tuo **Calendario online**: puoi aprirlo da PC, telefono, tablet; tutti vedono gli stessi dati.

---

## Passo 4 – Workflow: modifiche in Cursor e aggiornamento online

- **Sviluppo e correzioni:** lavori in Cursor come sempre (`npm run dev` in locale).
- **Pubblicare le modifiche:**
  ```bash
  git add .
  git commit -m "Descrizione delle modifiche"
  git push
  ```
- Railway, dopo ogni `git push`, rifà da solo **build** e **deploy**. In 1–2 minuti il sito pubblico è aggiornato.

Nessun bisogno di rifare a mano i passi 3.1–3.5: basta push da Cursor.

---

## Riepilogo

| Cosa                    | Dove / Come |
|-------------------------|------------|
| Codice e modifiche      | Cursor (cartella `legal-calendar`) |
| Versione online         | GitHub (repo `legal-calendar`) |
| App online              | Railway (URL generato al passo 3.5) |
| Database                | SQLite su volume Railway (`/data/dev.db`) |
| Aggiornare il sito      | `git add .` → `git commit -m "..."` → `git push` |

---

## Problemi comuni

- **Errore “DATABASE_URL” o “prisma migrate”:**  
  Controlla che la variable `DATABASE_URL=file:/data/dev.db` sia impostata e che il volume sia montato su `/data`.

- **Build fallisce:**  
  In **Deployments** clicca sull’ultimo deploy e leggi i log. Di solito è un errore di `npm run build` o di `prisma generate`; correggi in Cursor, commit e push.

- **Vuoi cambiare nome/URL:**  
  In Railway → Settings → Networking puoi usare un dominio personalizzato (se ne hai uno) o tenere quello generato da Railway.

Se mi dici a che passo sei (GitHub, Railway, primo push, ecc.) posso aiutarti con il messaggio di errore preciso che vedi.
