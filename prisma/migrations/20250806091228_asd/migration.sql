/*
  Warnings:

  - You are about to drop the column `flat` on the `address` table. All the data in the column will be lost.
  - You are about to drop the column `house` on the `address` table. All the data in the column will be lost.
  - You are about to drop the column `street` on the `address` table. All the data in the column will be lost.
  - Added the required column `fullAddress` to the `address` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."address" DROP COLUMN "flat",
DROP COLUMN "house",
DROP COLUMN "street",
ADD COLUMN     "fullAddress" TEXT NOT NULL,
ALTER COLUMN "lat" DROP NOT NULL,
ALTER COLUMN "lat" SET DATA TYPE TEXT,
ALTER COLUMN "lng" DROP NOT NULL,
ALTER COLUMN "lng" SET DATA TYPE TEXT;
