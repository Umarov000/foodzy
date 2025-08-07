/*
  Warnings:

  - You are about to drop the `Admins` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "public"."RoleValue" ADD VALUE 'SUPERADMIN';
ALTER TYPE "public"."RoleValue" ADD VALUE 'MANAGER';

-- DropTable
DROP TABLE "public"."Admins";
