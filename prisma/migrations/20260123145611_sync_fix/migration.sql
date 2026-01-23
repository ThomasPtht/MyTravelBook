/*
  Warnings:

  - Added the required column `overallRating` to the `City` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "City" ADD COLUMN     "overallRating" INTEGER NOT NULL,
ALTER COLUMN "visitDate" SET DATA TYPE TEXT;
