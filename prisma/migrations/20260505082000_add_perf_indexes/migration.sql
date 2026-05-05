-- Indici additivi (zero rischio dati): velocizzano filtri ricorrenti.

-- Event: filtri/dashboard per stato per utente.
CREATE INDEX IF NOT EXISTS "Event_userId_status_idx"
  ON "Event" ("userId", "status");

-- SubEvent: query per pratica + tipo regola (es. rinvii, promemoria).
CREATE INDEX IF NOT EXISTS "SubEvent_parentEventId_ruleId_idx"
  ON "SubEvent" ("parentEventId", "ruleId");

-- SubEvent: query per pratica + scadenza ordinata.
CREATE INDEX IF NOT EXISTS "SubEvent_parentEventId_dueAt_idx"
  ON "SubEvent" ("parentEventId", "dueAt");
