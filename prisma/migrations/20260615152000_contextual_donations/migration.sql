-- AlterTable
ALTER TABLE "Beneficiary" ADD COLUMN     "slug" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Donation" ADD COLUMN     "destinationLabel" TEXT,
ADD COLUMN     "destinationType" TEXT NOT NULL DEFAULT 'campaign',
ADD COLUMN     "eventId" TEXT,
ADD COLUMN     "frequency" TEXT NOT NULL DEFAULT 'one-time',
ADD COLUMN     "packageName" TEXT;

-- AlterTable
ALTER TABLE "EventRegistration" ADD COLUMN     "donationId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Beneficiary_slug_key" ON "Beneficiary"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "EventRegistration_donationId_key" ON "EventRegistration"("donationId");

-- AddForeignKey
ALTER TABLE "Donation" ADD CONSTRAINT "Donation_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventRegistration" ADD CONSTRAINT "EventRegistration_donationId_fkey" FOREIGN KEY ("donationId") REFERENCES "Donation"("id") ON DELETE SET NULL ON UPDATE CASCADE;
