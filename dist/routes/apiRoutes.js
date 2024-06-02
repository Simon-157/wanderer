"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const sessionController_1 = require("../controllers/sessionController");
const problemsController_1 = require("../controllers/problemsController");
const express_1 = require("express");
const prisma_1 = require("../config/prisma");
const submissionController_1 = require("../controllers/submissionController");
// SESSION ROUTES
exports.router = (0, express_1.Router)();
exports.router.get("/allusers", async (req, res) => {
    const users = await prisma_1.prisma.appUser.findMany();
    res.status(200).json(users);
});
exports.router.get("/challenges", problemsController_1.getChallenges);
exports.router.get("/challenge/:id", problemsController_1.getChallenge);
exports.router.post("/challenges", problemsController_1.createChallenge);
exports.router.post("/challenges/batch", problemsController_1.createManyChallenges);
exports.router.put("/challenges/:id", problemsController_1.updateChallenge);
exports.router.delete("/challenges", problemsController_1.deleteAllChallenges);
exports.router.post("/session", sessionController_1.createPracticeSession);
exports.router.get("/sessions", sessionController_1.getPracticedSessions);
exports.router.get("/session/:userId/:practiceSessionId", sessionController_1.getPracticedSession);
exports.router.delete("/sessions", sessionController_1.deleteAllPracticeSessions);
exports.router.post("/submission", submissionController_1.createSubmissionOrRunTests);
