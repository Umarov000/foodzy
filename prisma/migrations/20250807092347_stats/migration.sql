/*
  Warnings:

  - You are about to drop the column `avgTime` on the `CourierStats` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `CourierStats` table. All the data in the column will be lost.
  - You are about to drop the column `date` on the `CourierStats` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `CourierStats` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[courierId]` on the table `CourierStats` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "public"."CourierStats_courierId_date_key";

-- AlterTable
ALTER TABLE "public"."CourierStats" DROP COLUMN "avgTime",
DROP COLUMN "createdAt",
DROP COLUMN "date",
DROP COLUMN "updatedAt",
ALTER COLUMN "orders" DROP DEFAULT,
ALTER COLUMN "earnings" DROP DEFAULT;

-- CreateIndex
CREATE UNIQUE INDEX "CourierStats_courierId_key" ON "public"."CourierStats"("courierId");
