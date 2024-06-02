"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateChallenge = exports.getChallenge = exports.getChallenges = exports.createManyChallenges = exports.deleteAllChallenges = exports.createChallenge = void 0;
const prisma_1 = require("../config/prisma");
const createChallenge = async (req, res) => {
    const { title, description, difficulty, topicTags, similarQuestions, sampleTestCase, hints, driverCode, allTestCases, content } = req.body;
    if (!title || !description || !difficulty || !topicTags || !similarQuestions || !sampleTestCase || !hints || !driverCode || !allTestCases || !content) {
        res.status(400).json({ message: "Missing required fields" });
        return;
    }
    try {
        const challenge = await prisma_1.prisma.challenge.create({
            data: {
                title,
                description,
                difficulty,
                content,
                topicTags,
                similarQuestions,
                sampleTestCase,
                allTestCases,
                driverCode,
                hints
            }
        });
        res.status(201).json({ message: "Challenge created successfully", challenge });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to create challenge", error });
    }
};
exports.createChallenge = createChallenge;
const deleteAllChallenges = async (req, res) => {
    try {
        const challenges = await prisma_1.prisma.challenge.deleteMany();
        res.status(200).json({ message: "Challenges deleted successfully", challenges });
    }
    catch (error) {
        res.status(500).json({ message: "Failed to delete challenges", error });
    }
};
exports.deleteAllChallenges = deleteAllChallenges;
const createManyChallenges = async (req, res) => {
    const { challenges } = req.body;
    if (!challenges || !Array.isArray(challenges)) {
        res.status(400).json({ message: "Invalid or missing challenges array" });
        return;
    }
    try {
        const createdChallenges = await prisma_1.prisma.challenge.createMany({
            data: challenges,
        });
        res.status(201).json({ message: "Challenges created successfully", challenges: createdChallenges });
    }
    catch (error) {
        res.status(500).json({ message: "Failed to create challenges", error });
    }
};
exports.createManyChallenges = createManyChallenges;
const getChallenges = async (req, res) => {
    try {
        const challenges = await prisma_1.prisma.challenge.findMany();
        res.status(200).json(challenges);
    }
    catch (error) {
        res.status(500).json({ message: "Failed to fetch challenges", error });
    }
};
exports.getChallenges = getChallenges;
const getChallenge = async (req, res) => {
    const { id } = req.params;
    try {
        const challenge = await prisma_1.prisma.challenge.findUnique({
            where: { challenge_id: parseInt(id) }
        });
        if (!challenge) {
            res.status(404).json({ message: "Challenge not found" });
            return;
        }
        res.status(200).json(challenge);
    }
    catch (error) {
        res.status(500).json({ message: "Failed to fetch challenge", error });
    }
};
exports.getChallenge = getChallenge;
const updateChallenge = async (req, res) => {
    const { id } = req.params;
    const { title, description, difficulty, topicTags, similarQuestions, sampleTestCase, hints } = req.body;
    if (!title || !description || !difficulty || !topicTags || !similarQuestions || !sampleTestCase || !hints) {
        res.status(400).json({ message: "Missing required fields" });
        return;
    }
    try {
        const challenge = await prisma_1.prisma.challenge.update({
            where: { challenge_id: parseInt(id) },
            data: {
                title,
                description,
                difficulty,
                topicTags,
                similarQuestions,
                sampleTestCase,
                hints
            }
        });
        res.status(200).json({ message: "Challenge updated successfully", challenge });
    }
    catch (error) {
        res.status(500).json({ message: "Failed to update challenge", error });
    }
};
exports.updateChallenge = updateChallenge;
