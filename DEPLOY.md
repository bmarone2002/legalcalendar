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

### 3.2 Aggiungi il database PostgreSQL

1. Nel **progetto** Railway (non dentro il servizio app), clicca **+ New** (o **Add Service**).
2. Scegli **Database** → **PostgreSQL**.
3. Railway crea un servizio PostgreSQL e ti assegna variabili (es. `DATABASE_URL`, `PGHOST`, ecc.).
4. Clicca sul servizio **PostgreSQL** → **Variables** (o **Connect**): copia la **`DATABASE_URL`** (formato `postgresql://postgres:xxx@xxx.railway.app:5432/railway`).

### 3.3 Collega il database all’app (obbligatorio)

1. Clicca sul **servizio dell’app** (Legal Calendar), **non** sul servizio PostgreSQL.
2. Vai su **Variables** (o **Settings** → **Variables**).
3. **+ New Variable** e aggiungi:
   - **Name:** `DATABASE_URL`
   - **Value (scegli uno):**
     - **Riferimento (consigliato):** `${{Postgres.DATABASE_URL}}`  
       (sostituisci `Postgres` con il nome esatto del tuo servizio PostgreSQL se diverso)
     - **Oppure** copia il valore di `DATABASE_URL` dal servizio PostgreSQL e incollalo qui.
4. Salva. Railway farà un nuovo deploy.

Se manca questa variabile vedi errore "Environment variable not found: DATABASE_URL". Vedi anche **RAILWAY-DATABASE.md** per i dettagli.

I dati restano nel database PostgreSQL gestito da Railway (nessun volume da configurare).

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
| Database                | PostgreSQL gestito Railway (servizio Database) |
| Aggiornare il sito      | `git add .` → `git commit -m "..."` → `git push` |

---

## Problemi comuni

- **Errore “DATABASE_URL” o “prisma migrate”:**  
  Controlla che il servizio **PostgreSQL** sia stato aggiunto e che nel servizio **app** la variable `DATABASE_URL` contenga la URL di connessione al database (copiata dalle Variables del servizio PostgreSQL).

- **Build fallisce:**  
  In **Deployments** clicca sull’ultimo deploy e leggi i log. Di solito è un errore di `npm run build` o di `prisma generate`; correggi in Cursor, commit e push.

- **Vuoi cambiare nome/URL:**  
  In Railway → Settings → Networking puoi usare un dominio personalizzato (se ne hai uno) o tenere quello generato da Railway.

Se mi dici a che passo sei (GitHub, Railway, primo push, ecc.) posso aiutarti con il messaggio di errore preciso che vedi.
