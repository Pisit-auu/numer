-- CreateTable
CREATE TABLE "integration" (
    "id" SERIAL NOT NULL,
    "fx" TEXT NOT NULL,
    "a" DOUBLE PRECISION NOT NULL,
    "b" DOUBLE PRECISION NOT NULL,
    "n" INTEGER NOT NULL,

    CONSTRAINT "integration_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "integration_fx_key" ON "integration"("fx");
