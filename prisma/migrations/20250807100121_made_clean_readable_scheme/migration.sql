/*
  Warnings:

  - You are about to drop the `notification` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `support` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."notification" DROP CONSTRAINT "notification_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."support" DROP CONSTRAINT "support_userId_fkey";

-- DropTable
DROP TABLE "public"."notification";

-- DropTable
DROP TABLE "public"."support";
