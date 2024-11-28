/*
  Warnings:

  - Added the required column `isbn` to the `Book` table without a default value. This is not possible if the table is not empty.
  - Made the column `email` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Book" ADD COLUMN     "description" TEXT,
ADD COLUMN     "isbn" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "publisher" TEXT,
ALTER COLUMN "publishedAt" DROP NOT NULL,
ALTER COLUMN "publishedAt" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "isAdmin" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "email" SET NOT NULL;
