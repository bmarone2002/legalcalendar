-- CreateEnum
CREATE TYPE "SharePermission" AS ENUM ('VIEW_ONLY', 'FULL');

-- CreateTable
CREATE TABLE "CalendarShare" (
    "id" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "sharedWithId" TEXT NOT NULL,
    "permission" "SharePermission" NOT NULL DEFAULT 'VIEW_ONLY',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CalendarShare_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CalendarShare_sharedWithId_idx" ON "CalendarShare"("sharedWithId");

-- CreateIndex
CREATE UNIQUE INDEX "CalendarShare_ownerId_sharedWithId_key" ON "CalendarShare"("ownerId", "sharedWithId");

-- AddForeignKey
ALTER TABLE "CalendarShare" ADD CONSTRAINT "CalendarShare_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CalendarShare" ADD CONSTRAINT "CalendarShare_sharedWithId_fkey" FOREIGN KEY ("sharedWithId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
