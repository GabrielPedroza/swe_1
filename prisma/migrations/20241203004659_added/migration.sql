/*
  Warnings:

  - Added the required column `name` to the `Wishlist` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Wishlist" ADD COLUMN     "name" TEXT NOT NULL;
