import {
  createPracticeSession,
  getPracticedSessions,
  getPracticedSession,
  deleteAllPracticeSessions,
} from "../controllers/sessionController";

import {
  getChallenges,
  getChallenge,
  createChallenge,
  updateChallenge,
  createManyChallenges,
  deleteAllChallenges,
  getChallengeTitleAndDifficulty,
} from "../controllers/problemsController";

import { Router } from "express";
import { prisma } from "../config/prisma";
import { createSubmissionOrRunTests } from "../controllers/submissionController";

export const router = Router();

router.get("/allusers", async (req: any, res: any) => {
  const users = await prisma.appUser.findMany();
  res.status(200).json(users);
});

// CHALLENGE ENDPOINTS

router.get("/challenges", getChallenges);
router.get("/challenge/:id", getChallenge);
router.get("/challenge/title/:id", getChallengeTitleAndDifficulty);
router.post("/challenges", createChallenge);
router.post("/challenges/batch", createManyChallenges);
router.put("/challenges/:id", updateChallenge);
router.delete("/challenges", deleteAllChallenges);

// SESSION ENDPOINTS
router.post("/session", createPracticeSession);
router.get("/sessions/:userId", getPracticedSessions);
router.get("/session/:userId/:practiceSessionId", getPracticedSession);
router.delete("/sessions", deleteAllPracticeSessions);
router.post("/submission", createSubmissionOrRunTests);
