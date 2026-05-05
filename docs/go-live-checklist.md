# Go-Live Checklist (30 minuti)

Questa checklist e pensata per il rilascio su Railway con Clerk + Stripe.

## 0) Pre-check (5 min)

- Verifica variabili ambiente in produzione:
  - `DATABASE_URL`
  - `NEXT_PUBLIC_APP_URL`
  - `CLERK_SECRET_KEY`
  - `STRIPE_SECRET_KEY`
  - `STRIPE_WEBHOOK_SECRET`
  - `STRIPE_PRICE_PRO_MONTHLY`
  - `STRIPE_PRICE_PRO_YEARLY`
  - `STRIPE_TRIAL_DAYS` (es. `14` oppure `0`)
  - `SUPPORT_TO_EMAIL`
  - `SUPPORT_FROM_EMAIL`
  - `RESEND_API_KEY`
- Conferma che il deploy usa `npm run start:prod`.
- Conferma che il dominio canonico risponde correttamente (`www.agendalegale.com`).

## 1) Sanity app + DB (5 min)

- Apri `GET /api/health` e verifica:
  - `ok: true`
  - `db: "ok"`
- Verifica che l'app risponda da homepage e pagina login.

## 2) Smoke auth Clerk (5 min)

- Login con utente reale.
- Verifica redirect corretto dopo autenticazione.
- Verifica accesso alla dashboard senza loop/403.

## 3) Smoke billing Stripe (8 min)

- Avvia checkout con carta test.
- Completa pagamento/trial.
- Verifica stato in app (`subscriptionStatus`, piano visibile lato UI).
- Verifica che webhook Stripe risponda `2xx`.
- Verifica apertura portale billing (`/api/billing/portal`).

## 4) Smoke backup/restore (4 min)

- Esegui backup da UI/API.
- Ripristina su account test con dataset piccolo.
- Verifica numero eventi importati e corrette date/sottoeventi.

## 5) Go/No-Go (3 min)

- GO se:
  - nessun errore bloccante su auth, checkout, webhook, restore
  - healthcheck stabile
  - error log senza spike
- NO-GO se:
  - webhook Stripe falliscono
  - app non aggiorna stato abbonamento
  - restore fallisce su dataset minimo

## Prime 24-72 ore post-lancio

- Monitora ogni 2-4 ore:
  - error rate API
  - latenza p95 endpoint critici (`billing`, `backup`, `support`)
  - fallimenti webhook Stripe
  - availability `GET /api/health`
- Tieni pronto rollback selettivo del billing se webhook degradano.
