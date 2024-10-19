/*
  Warnings:

  - Made the column `ratingDate` on table `Rating` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Rating" ALTER COLUMN "ratingDate" SET NOT NULL,
ALTER COLUMN "ratingDate" DROP DEFAULT;
