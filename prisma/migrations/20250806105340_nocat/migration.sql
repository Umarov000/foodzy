/*
  Warnings:

  - You are about to drop the `category` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."restaurant" DROP CONSTRAINT "restaurant_categoryId_fkey";

-- DropTable
DROP TABLE "public"."category";
