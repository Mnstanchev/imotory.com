-- CreateTable
CREATE TABLE "public"."guest_favorites" (
    "id" TEXT NOT NULL,
    "listingId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sofiaTime" TEXT,

    CONSTRAINT "guest_favorites_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "guest_favorites_listingId_idx" ON "public"."guest_favorites"("listingId");

-- AddForeignKey
ALTER TABLE "public"."guest_favorites" ADD CONSTRAINT "guest_favorites_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "public"."listings"("id") ON DELETE CASCADE ON UPDATE CASCADE;
