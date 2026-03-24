/*
  Warnings:

  - The `address` column on the `listings` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `buildingCondition` column on the `listings` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `features` on the `listings` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `tags` on the `listings` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "public"."bookings" DROP CONSTRAINT "bookings_userId_fkey";

-- AlterTable
ALTER TABLE "public"."bookings" ALTER COLUMN "userId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."listings" DROP COLUMN "features",
ADD COLUMN     "features" JSONB NOT NULL,
DROP COLUMN "address",
ADD COLUMN     "address" JSONB,
DROP COLUMN "buildingCondition",
ADD COLUMN     "buildingCondition" JSONB,
DROP COLUMN "tags",
ADD COLUMN     "tags" JSONB NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."bookings" ADD CONSTRAINT "bookings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
