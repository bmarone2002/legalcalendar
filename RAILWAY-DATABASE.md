# Collegare PostgreSQL all’app su Railway

Se vedi **"Environment variable not found: DATABASE_URL"** su Railway, l’app non ha ancora la variabile del database.

## Passi (da fare nel dashboard Railway)

1. Apri il **progetto** su [railway.app](https://railway.app).
2. Clicca sul **servizio dell’app** (Legal Calendar / legalcalendar), **non** sul servizio PostgreSQL.
3. Vai in **Variables** (o **Settings** → **Variables**).
4. Aggiungi la variabile in uno di questi modi:

### Opzione A – Riferimento (consigliato)

- **Nome:** `DATABASE_URL`
- **Valore:** `${{NOME_SERVIZIO_POSTGRES.DATABASE_URL}}`

Sostituisci `NOME_SERVIZIO_POSTGRES` con il nome del tuo servizio PostgreSQL (es. se si chiama "Postgres": `${{Postgres.DATABASE_URL}}`).

Così Railway copia automaticamente la URL dal database all’app e non devi incollare nulla.

### Opzione B – Copia manuale

- Clicca sul **servizio PostgreSQL** → **Variables** (o **Connect**).
- Copia il valore di **`DATABASE_URL`**.
- Torna al **servizio App** → **Variables** → **New Variable**.
- **Nome:** `DATABASE_URL`  
- **Valore:** incolla la URL copiata.

5. **Salva**. Railway farà un nuovo deploy; dopo il deploy l’app userà il database.

---

**Nota:** La variabile va impostata nel **servizio dell’applicazione**, non solo in quello del database. I due servizi hanno variabili separate.

---

## Errore: "The table `public.Event` does not exist"

Significa che il database è connesso ma **le migrazioni non sono state applicate**: le tabelle non esistono ancora.

### 1. Controlla il comando di avvio

Nel **servizio App** su Railway → **Settings** → cerca **Start Command** (o **Deploy**).

- Deve essere: **`npm run start:prod`**
- Se è `npm start` o vuoto, le migrazioni non partono. Imposta `npm run start:prod`, salva e fai **Redeploy**.

Dopo il deploy, all'avvio l'app esegue `prisma migrate deploy` e crea le tabelle.

### 2. Eseguire le migrazioni una volta da locale (alternativa)

Se vuoi creare le tabelle subito senza aspettare un nuovo deploy:

1. Copia la **`DATABASE_URL`** dal servizio PostgreSQL su Railway (Variables).
2. Dalla cartella **legal-calendar** nel terminale (PowerShell):

```powershell
$env:DATABASE_URL="incolla_qui_la_url_completa"
npx prisma migrate deploy
```

3. Quando vedi "Applied 1 migration", le tabelle sono state create. Ricarica l'app sul browser e riprova ad aggiungere l'evento.
