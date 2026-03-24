-- AlterTable
ALTER TABLE "public"."locations" ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "sortOrder" INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE INDEX "locations_isActive_idx" ON "public"."locations"("isActive");
