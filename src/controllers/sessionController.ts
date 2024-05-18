import { prisma } from "@/config/prisma";

export const createPracticeSession = async (req: any, res: any) : Promise<void> => {

    const { userId, challengeId } = req.body;

    if (!userId || !challengeId) {
        res.status(400).json({ message: "Missing required fields" });
        return;
    }

    try {
        const practiceSession = await prisma.practiceSession.create({
            data: {
                userId,
                challengeId
            }
        })
        res.status(201).json({ message: "Practice session created successfully", practiceSession });
    } catch (error) {
        res.status(500).json({ message: "Failed to create practice session", error });
    }

}


// get practiced sessions for a user
export const getPracticedSessions = async (req: any, res: any) : Promise<void> => {
    const { userId } = req.params;
    try {
        const practiceSessions = await prisma.practiceSession.findMany({
            where: { userId: parseInt(userId) }
        });
        res.status(200).json(practiceSessions);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch practice sessions", error });
    }
}


// get a practice session by session id and userid for a user
export const getPracticedSession = async (req: any, res: any) : Promise<void> => {
    const { userId, practiceSessionId } = req.params;
    try {
        const practiceSession = await prisma.practiceSession.findFirst({
            where: { userId: parseInt(userId), id: parseInt(practiceSessionId) }
        });
        if (!practiceSession) {
            res.status(404).json({ message: "Practice session not found" });
            return;
        }
        res.status(200).json(practiceSession);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch practice session", error });
    }
}
