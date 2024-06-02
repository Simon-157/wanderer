"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAllPracticeSessions = exports.getPracticedSession = exports.getPracticedSessions = exports.createPracticeSession = void 0;
const prisma_1 = require("../config/prisma");
const crypto_1 = require("crypto");
const createPracticeSession = async (req, res) => {
    const { userId, challengeId } = req.body;
    const sessionId = (0, crypto_1.randomUUID)();
    if (!userId || !challengeId) {
        res.status(400).json({ message: "Missing required fields" });
        return;
    }
    // TODO: check if user has already practiced this challenge
    try {
        const practiceSession = await prisma_1.prisma.practiceSession.create({
            data: {
                sessionId,
                userId,
                challengeId
            }
        });
        res.status(201).json({ message: "Practice session created successfully", practiceSession });
    }
    catch (error) {
        res.status(500).json({ message: "Failed to create practice session", error });
    }
};
exports.createPracticeSession = createPracticeSession;
// get practiced sessions for a user
const getPracticedSessions = async (req, res) => {
    const { userId } = req.params;
    try {
        const practiceSessions = await prisma_1.prisma.practiceSession.findMany({
            where: { userId: parseInt(userId) }
        });
        res.status(200).json(practiceSessions);
    }
    catch (error) {
        res.status(500).json({ message: "Failed to fetch practice sessions", error });
    }
};
exports.getPracticedSessions = getPracticedSessions;
// get a practice session by session id and userid for a user
const getPracticedSession = async (req, res) => {
    const { userId, practiceSessionId } = req.params;
    try {
        const practiceSession = await prisma_1.prisma.practiceSession.findFirst({
            where: { userId: parseInt(userId), id: parseInt(practiceSessionId) }
        });
        if (!practiceSession) {
            res.status(404).json({ message: "Practice session not found" });
            return;
        }
        res.status(200).json(practiceSession);
    }
    catch (error) {
        res.status(500).json({ message: "Failed to fetch practice session", error });
    }
};
exports.getPracticedSession = getPracticedSession;
// delete all practice session 
const deleteAllPracticeSessions = async (req, res) => {
    try {
        const practiceSessions = await prisma_1.prisma.practiceSession.deleteMany();
        res.status(200).json({ message: "Practice sessions deleted successfully", practiceSessions });
    }
    catch (error) {
        res.status(500).json({ message: "Failed to delete practice sessions", error });
    }
};
exports.deleteAllPracticeSessions = deleteAllPracticeSessions;
