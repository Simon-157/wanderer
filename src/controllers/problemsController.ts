import { prisma } from "@/config/prisma";


export const createChallenge = async (req: any, res: any) : Promise<void> => {
    const { title, description, difficulty, topicTags, similarQuestions, sampleTestCase, hints } = req.body;

    if (!title || !description || !difficulty || !topicTags || !similarQuestions || !sampleTestCase || !hints) {
        res.status(400).json({ message: "Missing required fields" });
        return;
    }

    try {
        const challenge = await prisma.challenge.create({
            data: {
                title,
                description,
                difficulty,
                topicTags,
                similarQuestions,
                sampleTestCase,
                hints
            }
        })
        res.status(201).json({ message: "Challenge created successfully", challenge });
    } catch (error) {
        res.status(500).json({ message: "Failed to create challenge", error });
    }
}


export const getChallenges = async (req: any, res: any) : Promise<void> => {
    try {
        const challenges = await prisma.challenge.findMany();
        res.status(200).json(challenges);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch challenges", error });
    }
}



export const getChallenge = async (req: any, res: any) : Promise<void> => {
    const { id } = req.params;
    try {
        const challenge = await prisma.challenge.findUnique({
            where: {challenge_id: parseInt(id) }
        });

        if (!challenge) {
            res.status(404).json({ message: "Challenge not found" });
            return;
        }

        res.status(200).json(challenge);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch challenge", error });
    }
}


export const updateChallenge = async (req: any, res: any) : Promise<void> => {
    const { id } = req.params;
    const { title, description, difficulty, topicTags, similarQuestions, sampleTestCase, hints } = req.body;

    if (!title || !description || !difficulty || !topicTags || !similarQuestions || !sampleTestCase || !hints) {
        res.status(400).json({ message: "Missing required fields" });
        return;
    }

    try {
        const challenge = await prisma.challenge.update({
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
        })
        res.status(200).json({ message: "Challenge updated successfully", challenge });
    } catch (error) {
        res.status(500).json({ message: "Failed to update challenge", error });
    }
}

