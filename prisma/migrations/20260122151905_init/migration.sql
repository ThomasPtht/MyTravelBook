/*
  Warnings:

  - You are about to drop the `Post` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "CityStatus" AS ENUM ('visited', 'wishlist');

-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_authorId_fkey";

-- DropTable
DROP TABLE "Post";

-- CreateTable
CREATE TABLE "City" (
    "id" SERIAL NOT NULL,
    "cityName" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "status" "CityStatus" NOT NULL,
    "visitDate" TIMESTAMP(3) NOT NULL,
    "coverImage" TEXT NOT NULL,
    "neighborhood" TEXT[],
    "description" TEXT NOT NULL,
    "budget" INTEGER NOT NULL,
    "food" INTEGER NOT NULL,
    "safety" INTEGER NOT NULL,
    "culture" INTEGER NOT NULL,
    "atmosphere" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "City_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CityImage" (
    "id" SERIAL NOT NULL,
    "cityId" INTEGER NOT NULL,
    "imagePath" TEXT NOT NULL,
    "caption" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CityImage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "City_cityName_key" ON "City"("cityName");

-- AddForeignKey
ALTER TABLE "CityImage" ADD CONSTRAINT "CityImage_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "City"("id") ON DELETE CASCADE ON UPDATE CASCADE;
