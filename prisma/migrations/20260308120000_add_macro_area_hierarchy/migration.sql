-- AlterTable Event: add macro area hierarchy fields
ALTER TABLE "Event" ADD COLUMN "macroArea" TEXT;
ALTER TABLE "Event" ADD COLUMN "procedimento" TEXT;
ALTER TABLE "Event" ADD COLUMN "parteProcessuale" TEXT;

-- AlterTable SubEvent: add isPlaceholder, make dueAt nullable
ALTER TABLE "SubEvent" ADD COLUMN "isPlaceholder" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "SubEvent" ALTER COLUMN "dueAt" DROP NOT NULL;
