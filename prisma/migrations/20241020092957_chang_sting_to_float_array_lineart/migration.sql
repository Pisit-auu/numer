/*
  Warnings:

  - The `A` column on the `linear` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `B` column on the `linear` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `x0` column on the `linear` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "linear" DROP COLUMN "A",
ADD COLUMN     "A" DOUBLE PRECISION[],
DROP COLUMN "B",
ADD COLUMN     "B" DOUBLE PRECISION[],
DROP COLUMN "x0",
ADD COLUMN     "x0" DOUBLE PRECISION[];

-- CreateIndex
CREATE UNIQUE INDEX "linear_A_key" ON "linear"("A");
