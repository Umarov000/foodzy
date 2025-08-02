/*
  Warnings:

  - You are about to drop the column `resfreshToken` on the `Admins` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Admins" DROP COLUMN "resfreshToken",
ADD COLUMN     "refreshToken" TEXT;
