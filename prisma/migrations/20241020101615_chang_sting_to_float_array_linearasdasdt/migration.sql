/*
  Warnings:

  - You are about to alter the column `A` on the `linear` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.
  - You are about to alter the column `B` on the `linear` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.
  - You are about to alter the column `x0` on the `linear` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.

*/
-- AlterTable
ALTER TABLE "linear" ALTER COLUMN "A" SET DATA TYPE INTEGER[],
ALTER COLUMN "B" SET DATA TYPE INTEGER[],
ALTER COLUMN "x0" SET DATA TYPE INTEGER[];
