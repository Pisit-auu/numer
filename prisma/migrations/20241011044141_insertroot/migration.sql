-- CreateTable
CREATE TABLE "root" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "xl" INTEGER NOT NULL,
    "xr" INTEGER NOT NULL,

    CONSTRAINT "root_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "root_name_key" ON "root"("name");
