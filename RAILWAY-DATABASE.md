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
