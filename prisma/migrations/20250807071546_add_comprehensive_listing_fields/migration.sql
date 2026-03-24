-- CreateEnum
CREATE TYPE "public"."HeatingType" AS ENUM ('NONE', 'CENTRAL', 'ELECTRIC', 'GAS', 'WOOD', 'SOLAR', 'HEATPUMP');

-- CreateEnum
CREATE TYPE "public"."OwnershipType" AS ENUM ('FREEHOLD', 'LEASEHOLD', 'COOPERATIVE');

-- CreateEnum
CREATE TYPE "public"."BuildingType" AS ENUM ('PANEL', 'BRICK', 'NEW_BUILD', 'MONOLITHIC', 'WOOD', 'PREFAB');

-- CreateEnum
CREATE TYPE "public"."ListingStatus" AS ENUM ('ACTIVE', 'RESERVED', 'SOLD', 'INACTIVE', 'UNDER_CONSTRUCTION');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "public"."ListingType" ADD VALUE 'LEASE';
ALTER TYPE "public"."ListingType" ADD VALUE 'AUCTION';

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "public"."PropertyType" ADD VALUE 'INDUSTRIAL';
ALTER TYPE "public"."PropertyType" ADD VALUE 'PENTHOUSE';
ALTER TYPE "public"."PropertyType" ADD VALUE 'DUPLEX';
ALTER TYPE "public"."PropertyType" ADD VALUE 'LOFT';

-- AlterTable
ALTER TABLE "public"."listings" ADD COLUMN     "address" TEXT,
ADD COLUMN     "airConditioning" BOOLEAN,
ADD COLUMN     "availableFrom" TIMESTAMP(3),
ADD COLUMN     "balcony" BOOLEAN,
ADD COLUMN     "buildingCondition" TEXT,
ADD COLUMN     "buildingType" "public"."BuildingType",
ADD COLUMN     "clicks" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "elevator" BOOLEAN,
ADD COLUMN     "furnished" BOOLEAN,
ADD COLUMN     "garage" BOOLEAN,
ADD COLUMN     "gardenSize" INTEGER,
ADD COLUMN     "heatingType" "public"."HeatingType",
ADD COLUMN     "kitchens" INTEGER,
ADD COLUMN     "lastViewedAt" TIMESTAMP(3),
ADD COLUMN     "latitude" DOUBLE PRECISION,
ADD COLUMN     "livingRooms" INTEGER,
ADD COLUMN     "longitude" DOUBLE PRECISION,
ADD COLUMN     "maintenanceFee" DECIMAL(10,2),
ADD COLUMN     "mortgagePossible" BOOLEAN,
ADD COLUMN     "ownershipType" "public"."OwnershipType",
ADD COLUMN     "parkingSpots" INTEGER,
ADD COLUMN     "pool" BOOLEAN,
ADD COLUMN     "postalCode" TEXT,
ADD COLUMN     "pricePerSqM" DECIMAL(12,2),
ADD COLUMN     "status" "public"."ListingStatus" NOT NULL DEFAULT 'ACTIVE',
ADD COLUMN     "tags" TEXT[],
ADD COLUMN     "terraceSize" INTEGER,
ADD COLUMN     "videoUrl" TEXT,
ADD COLUMN     "virtualTourUrl" TEXT;

-- CreateIndex
CREATE INDEX "listings_status_idx" ON "public"."listings"("status");
