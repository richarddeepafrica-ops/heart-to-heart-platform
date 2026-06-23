CREATE TABLE "EventTicketPackage" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "audience" TEXT,
    "benefits" TEXT[],
    "price" INTEGER NOT NULL,
    "capacity" INTEGER NOT NULL DEFAULT 0,
    "color" TEXT NOT NULL DEFAULT '#00539C',
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "showInShop" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EventTicketPackage_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ComplimentaryTicket" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "packageName" TEXT NOT NULL,
    "recipientName" TEXT NOT NULL,
    "recipientEmail" TEXT,
    "recipientPhone" TEXT,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "code" TEXT NOT NULL,
    "note" TEXT,
    "issuedBy" TEXT,
    "sentAt" TIMESTAMP(3),
    "redeemedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ComplimentaryTicket_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "EmailLog" (
    "id" TEXT NOT NULL,
    "toEmail" TEXT,
    "toName" TEXT,
    "subject" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'QUEUED',
    "context" TEXT,
    "entityId" TEXT,
    "sentAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EmailLog_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "EventTicketPackage_eventId_slug_key" ON "EventTicketPackage"("eventId", "slug");
CREATE UNIQUE INDEX "ComplimentaryTicket_code_key" ON "ComplimentaryTicket"("code");

ALTER TABLE "EventTicketPackage" ADD CONSTRAINT "EventTicketPackage_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "ComplimentaryTicket" ADD CONSTRAINT "ComplimentaryTicket_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
