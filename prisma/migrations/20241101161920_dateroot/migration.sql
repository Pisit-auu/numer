/*
  Warnings:

  - You are about to drop the column `createdAt` on the `root` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "root" DROP COLUMN "createdAt",
ADD COLUMN     "Date" TEXT;
