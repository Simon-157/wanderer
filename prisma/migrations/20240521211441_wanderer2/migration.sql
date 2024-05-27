/*
  Warnings:

  - A unique constraint covering the columns `[sessionId]` on the table `PracticeSession` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `sessionId` to the `PracticeSession` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PracticeSession" ADD COLUMN     "sessionId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "PracticeSession_sessionId_key" ON "PracticeSession"("sessionId");
