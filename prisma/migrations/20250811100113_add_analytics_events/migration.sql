-- CreateEnum
CREATE TYPE "public"."AnalyticsEventType" AS ENUM ('LISTING_CLICK', 'AGENT_CONTACT_CLICK', 'CONTACT_SUBMIT');

-- AlterEnum
ALTER TYPE "public"."LocationType" ADD VALUE 'MUNICIPALITY';

-- CreateTable
CREATE TABLE "public"."analytics_events" (
    "id" TEXT NOT NULL,
    "listingId" TEXT,
    "userId" TEXT,
    "type" "public"."AnalyticsEventType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "analytics_events_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "analytics_events_listingId_idx" ON "public"."analytics_events"("listingId");

-- CreateIndex
CREATE INDEX "analytics_events_type_idx" ON "public"."analytics_events"("type");

-- CreateIndex
CREATE INDEX "analytics_events_createdAt_idx" ON "public"."analytics_events"("createdAt");

-- AddForeignKey
ALTER TABLE "public"."analytics_events" ADD CONSTRAINT "analytics_events_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "public"."listings"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."analytics_events" ADD CONSTRAINT "analytics_events_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
