-- CreateTable
CREATE TABLE "public"."CourierStats" (
    "id" SERIAL NOT NULL,
    "courierId" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "orders" INTEGER NOT NULL DEFAULT 0,
    "earnings" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "avgTime" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CourierStats_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CourierStats_courierId_date_key" ON "public"."CourierStats"("courierId", "date");

-- AddForeignKey
ALTER TABLE "public"."CourierStats" ADD CONSTRAINT "CourierStats_courierId_fkey" FOREIGN KEY ("courierId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
