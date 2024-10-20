-- CreateTable
CREATE TABLE "diff" (
    "id" SERIAL NOT NULL,
    "fx" TEXT NOT NULL,
    "x" DOUBLE PRECISION NOT NULL,
    "h" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "diff_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "diff_fx_key" ON "diff"("fx");
