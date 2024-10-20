/*
  Warnings:

  - Changed the type of `A` on the `linear` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `B` on the `linear` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `x0` on the `linear` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "linear" DROP COLUMN "A",
ADD COLUMN     "A" JSONB NOT NULL,
DROP COLUMN "B",
ADD COLUMN     "B" JSONB NOT NULL,
DROP COLUMN "x0",
ADD COLUMN     "x0" JSONB NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "linear_A_key" ON "linear"("A");
