-- CreateTable
CREATE TABLE "Rinvio" (
    "id" TEXT NOT NULL,
    "parentEventId" TEXT NOT NULL,
    "numero" INTEGER NOT NULL,
    "dataUdienza" TIMESTAMP(3) NOT NULL,
    "tipoUdienza" TEXT NOT NULL,
    "tipoUdienzaCustom" TEXT,
    "note" TEXT,
    "adempimenti" TEXT NOT NULL DEFAULT '[]',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Rinvio_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Rinvio_parentEventId_idx" ON "Rinvio"("parentEventId");

-- CreateIndex
CREATE INDEX "Rinvio_dataUdienza_idx" ON "Rinvio"("dataUdienza");

-- AddForeignKey
ALTER TABLE "Rinvio" ADD CONSTRAINT "Rinvio_parentEventId_fkey" FOREIGN KEY ("parentEventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;
