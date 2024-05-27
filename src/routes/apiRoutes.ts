import { createPracticeSession, getPracticedSessions, getPracticedSession } from "../controllers/sessionController";
import { getChallenges, getChallenge, createChallenge, updateChallenge, createManyChallenges } from "../controllers/problemsController";
import { Router } from "express";
import { prisma } from "@/config/prisma";
import { createSubmission } from "@/controllers/submissionController";



// SESSION ROUTES

export const router = Router();

router.get("/allusers", async (req: any, res: any) => {
    const users = await prisma.appUser.findMany();
    res.status(200).json(users);
});

router.get("/challenges", getChallenges);
router.get("/challenges/:id", getChallenge);
router.post("/challenges", createChallenge);
router.post("/challenges/batch", createManyChallenges);
router.put("/challenges/:id", updateChallenge);

router.post("/session", createPracticeSession)
router.get("/sessions", getPracticedSessions);
router.get("/session/:userId/:practiceSessionId", getPracticedSession);

router.post("/submission", createSubmission)