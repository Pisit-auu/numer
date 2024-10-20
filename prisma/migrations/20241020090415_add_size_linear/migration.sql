/*
  Warnings:

  - Added the required column `size` to the `linear` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "linear" ADD COLUMN     "size" INTEGER NOT NULL;
