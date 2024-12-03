/*
  Warnings:

  - You are about to drop the column `bookId` on the `Wishlist` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `Wishlist` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Wishlist" DROP CONSTRAINT "Wishlist_bookId_fkey";

-- AlterTable
ALTER TABLE "Wishlist" DROP COLUMN "bookId";

-- CreateIndex
CREATE UNIQUE INDEX "Wishlist_name_key" ON "Wishlist"("name");
