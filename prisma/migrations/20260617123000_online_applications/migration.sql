CREATE TABLE "ChildCareApplication" (
    "id" TEXT NOT NULL,
    "childName" TEXT NOT NULL,
    "childAge" INTEGER,
    "guardianName" TEXT NOT NULL,
    "guardianPhone" TEXT NOT NULL,
    "guardianEmail" TEXT,
    "county" TEXT,
    "diagnosis" TEXT NOT NULL,
    "hospital" TEXT,
    "estimatedNeed" INTEGER,
    "story" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'NEW',
    "adminNotes" TEXT,
    "beneficiaryId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ChildCareApplication_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "PartnerInstitutionApplication" (
    "id" TEXT NOT NULL,
    "organization" TEXT NOT NULL,
    "institutionType" TEXT NOT NULL,
    "contactName" TEXT NOT NULL,
    "contactEmail" TEXT NOT NULL,
    "contactPhone" TEXT,
    "county" TEXT,
    "website" TEXT,
    "proposal" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'NEW',
    "adminNotes" TEXT,
    "partnerId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PartnerInstitutionApplication_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "ChildCareApplication_status_createdAt_idx" ON "ChildCareApplication"("status", "createdAt");
CREATE INDEX "PartnerInstitutionApplication_status_createdAt_idx" ON "PartnerInstitutionApplication"("status", "createdAt");
