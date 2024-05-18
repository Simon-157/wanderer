-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "Difficulty" AS ENUM ('Easy', 'Medium', 'Hard');

-- CreateEnum
CREATE TYPE "SubmissionStatus" AS ENUM ('Pending', 'Accepted', 'Rejected');

-- CreateTable
CREATE TABLE "appUser" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "firstName" TEXT,
    "lastName" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'USER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "phoneNumber" TEXT,
    "bio" TEXT,
    "profileImage" TEXT,
    "linkedIn" TEXT,
    "mfaEnabled" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "appUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuthProvider" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "googleId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AuthProvider_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PracticeSession" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "challengeId" INTEGER NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endedAt" TIMESTAMP(3),

    CONSTRAINT "PracticeSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Challenge" (
    "challenge_id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "difficulty" "Difficulty" NOT NULL,
    "topicTags" JSONB NOT NULL,
    "similarQuestions" JSONB NOT NULL,
    "sampleTestCase" JSONB NOT NULL,
    "hints" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Challenge_pkey" PRIMARY KEY ("challenge_id")
);

-- CreateTable
CREATE TABLE "Submission" (
    "submission_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "challenge_id" INTEGER NOT NULL,
    "code" TEXT NOT NULL,
    "status" "SubmissionStatus" NOT NULL,
    "runtime" DOUBLE PRECISION,
    "memory" DOUBLE PRECISION,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "practiceSessionId" INTEGER,

    CONSTRAINT "Submission_pkey" PRIMARY KEY ("submission_id")
);

-- CreateTable
CREATE TABLE "Language" (
    "language_id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Language_pkey" PRIMARY KEY ("language_id")
);

-- CreateTable
CREATE TABLE "SubmissionLanguage" (
    "submission_id" INTEGER NOT NULL,
    "language_id" INTEGER NOT NULL,

    CONSTRAINT "SubmissionLanguage_pkey" PRIMARY KEY ("submission_id","language_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "appUser_email_key" ON "appUser"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Language_name_key" ON "Language"("name");

-- AddForeignKey
ALTER TABLE "AuthProvider" ADD CONSTRAINT "AuthProvider_userId_fkey" FOREIGN KEY ("userId") REFERENCES "appUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PracticeSession" ADD CONSTRAINT "PracticeSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "appUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PracticeSession" ADD CONSTRAINT "PracticeSession_challengeId_fkey" FOREIGN KEY ("challengeId") REFERENCES "Challenge"("challenge_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Submission" ADD CONSTRAINT "Submission_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "appUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Submission" ADD CONSTRAINT "Submission_challenge_id_fkey" FOREIGN KEY ("challenge_id") REFERENCES "Challenge"("challenge_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Submission" ADD CONSTRAINT "Submission_practiceSessionId_fkey" FOREIGN KEY ("practiceSessionId") REFERENCES "PracticeSession"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubmissionLanguage" ADD CONSTRAINT "SubmissionLanguage_submission_id_fkey" FOREIGN KEY ("submission_id") REFERENCES "Submission"("submission_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubmissionLanguage" ADD CONSTRAINT "SubmissionLanguage_language_id_fkey" FOREIGN KEY ("language_id") REFERENCES "Language"("language_id") ON DELETE CASCADE ON UPDATE CASCADE;
