-- Reindirizza eventuali pratiche col vecchio motore regole al template data-driven.
UPDATE "Event" SET "ruleTemplateId" = 'data-driven' WHERE "ruleTemplateId" = 'atto-giuridico';

ALTER TABLE "Event" DROP COLUMN IF EXISTS "actionType";
ALTER TABLE "Event" DROP COLUMN IF EXISTS "actionMode";
