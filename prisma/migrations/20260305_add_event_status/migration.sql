-- AlterTable: add status column to Event with default "pending"
ALTER TABLE "Event" ADD COLUMN "status" TEXT NOT NULL DEFAULT 'pending';
