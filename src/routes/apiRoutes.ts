import { createPracticeSession, getPracticedSessions, getPracticedSession } from "../controllers/sessionController";
import { getChallenges, getChallenge, createChallenge, updateChallenge, createManyChallenges } from "../controllers/problemsController";
import { Router } from "express";



// SESSION ROUTES

export const router = Router();

router.get("/challenges", getChallenges);
router.get("/challenges/:id", getChallenge);
router.post("/challenges", createChallenge);
router.post("/challenges/batch", createManyChallenges);
router.put("/challenges/:id", updateChallenge);


router.post("/session", createPracticeSession)
router.get("/sessions", getPracticedSessions);
router.get("/session/:userId/:practiceSessionId", getPracticedSession);
