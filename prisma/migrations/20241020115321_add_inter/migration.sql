-- CreateTable
CREATE TABLE "inter" (
    "id" SERIAL NOT NULL,
    "point" INTEGER NOT NULL,
    "X" JSONB NOT NULL,
    "Y" JSONB NOT NULL,
    "x0" JSONB NOT NULL,

    CONSTRAINT "inter_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "inter_X_key" ON "inter"("X");
