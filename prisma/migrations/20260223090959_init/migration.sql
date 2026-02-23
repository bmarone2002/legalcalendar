-- CreateTable
CREATE TABLE "Event" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "startAt" DATETIME NOT NULL,
    "endAt" DATETIME NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'altro',
    "tags" TEXT NOT NULL DEFAULT '[]',
    "caseId" TEXT,
    "notes" TEXT,
    "generateSubEvents" BOOLEAN NOT NULL DEFAULT false,
    "ruleTemplateId" TEXT,
    "ruleParams" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "SubEvent" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "parentEventId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "dueAt" DATETIME NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "priority" INTEGER NOT NULL DEFAULT 0,
    "ruleId" TEXT,
    "ruleParams" TEXT,
    "explanation" TEXT,
    "createdBy" TEXT NOT NULL DEFAULT 'automatico',
    "locked" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "SubEvent_parentEventId_fkey" FOREIGN KEY ("parentEventId") REFERENCES "Event" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Setting" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "value" TEXT NOT NULL
);

-- CreateIndex
CREATE INDEX "Event_startAt_idx" ON "Event"("startAt");

-- CreateIndex
CREATE INDEX "Event_endAt_idx" ON "Event"("endAt");

-- CreateIndex
CREATE INDEX "SubEvent_parentEventId_idx" ON "SubEvent"("parentEventId");

-- CreateIndex
CREATE INDEX "SubEvent_dueAt_idx" ON "SubEvent"("dueAt");
