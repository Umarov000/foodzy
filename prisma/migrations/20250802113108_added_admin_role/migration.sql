/*
  Warnings:

  - You are about to drop the column `activationLink` on the `Admins` table. All the data in the column will be lost.

*/
-- AlterEnum
ALTER TYPE "public"."RoleValue" ADD VALUE 'ADMIN';

-- DropIndex
DROP INDEX "public"."Admins_activationLink_key";

-- AlterTable
ALTER TABLE "public"."Admins" DROP COLUMN "activationLink";
