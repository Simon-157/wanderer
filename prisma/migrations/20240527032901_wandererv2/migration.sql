/*
  Warnings:

  - Added the required column `allTestCases` to the `Challenge` table without a default value. This is not possible if the table is not empty.
  - Added the required column `driverCode` to the `Challenge` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Challenge" ADD COLUMN     "allTestCases" JSONB NOT NULL,
ADD COLUMN     "content" TEXT,
ADD COLUMN     "driverCode" TEXT NOT NULL;
