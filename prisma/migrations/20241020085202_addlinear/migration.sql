-- CreateTable
CREATE TABLE "linear" (
    "id" SERIAL NOT NULL,
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    "x0" TEXT NOT NULL,

    CONSTRAINT "linear_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "linear_A_key" ON "linear"("A");
