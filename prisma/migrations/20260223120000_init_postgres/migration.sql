-- CreateTable
CREATE TABLE "Event" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "startAt" TIMESTAMP(3) NOT NULL,
    "endAt" TIMESTAMP(3) NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'altro',
    "tags" TEXT NOT NULL DEFAULT '[]',
    "caseId" TEXT,
    "notes" TEXT,
    "generateSubEvents" BOOLEAN NOT NULL DEFAULT false,
    "ruleTemplateId" TEXT,
    "ruleParams" TEXT,
    "macroType" TEXT,
    "actionType" TEXT,
    "actionMode" TEXT,
    "inputs" TEXT,
    "color" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubEvent" (
    "id" TEXT NOT NULL,
    "parentEventId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "dueAt" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "priority" INTEGER NOT NULL DEFAULT 0,
    "ruleId" TEXT,
    "ruleParams" TEXT,
    "explanation" TEXT,
    "createdBy" TEXT NOT NULL DEFAULT 'automatico',
    "locked" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SubEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Setting" (
    "id" TEXT NOT NULL,
    "value" TEXT NOT NULL,

    CONSTRAINT "Setting_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Event_startAt_idx" ON "Event"("startAt");

-- CreateIndex
CREATE INDEX "Event_endAt_idx" ON "Event"("endAt");

-- CreateIndex
CREATE INDEX "SubEvent_parentEventId_idx" ON "SubEvent"("parentEventId");

-- CreateIndex
CREATE INDEX "SubEvent_dueAt_idx" ON "SubEvent"("dueAt");

-- AddForeignKey
ALTER TABLE "SubEvent" ADD CONSTRAINT "SubEvent_parentEventId_fkey" FOREIGN KEY ("parentEventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;
