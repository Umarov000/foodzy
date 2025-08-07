/*
  Warnings:

  - Added the required column `isAvailable` to the `meal` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."meal" ADD COLUMN     "isAvailable" BOOLEAN NOT NULL;
