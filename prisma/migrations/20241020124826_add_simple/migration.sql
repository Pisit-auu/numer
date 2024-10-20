-- CreateTable
CREATE TABLE "simple" (
    "id" SERIAL NOT NULL,
    "point" INTEGER NOT NULL,
    "xvalue" INTEGER NOT NULL,
    "m" INTEGER NOT NULL,
    "X" JSONB NOT NULL,
    "Y" JSONB NOT NULL,

    CONSTRAINT "simple_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "simple_X_key" ON "simple"("X");
