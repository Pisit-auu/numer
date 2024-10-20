-- CreateTable
CREATE TABLE "multiple" (
    "id" SERIAL NOT NULL,
    "point" INTEGER NOT NULL,
    "xvalue" INTEGER NOT NULL,
    "X" JSONB NOT NULL,
    "Y" JSONB NOT NULL,
    "xi" JSONB NOT NULL,

    CONSTRAINT "multiple_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "multiple_X_key" ON "multiple"("X");
