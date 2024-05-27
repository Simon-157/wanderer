import { prisma } from "@/config/prisma";
import { Response, Request } from "express";
import axios from "axios";
import "dotenv/config";


interface TestCase {
    input: string;
    expectedOutput: string;
}


export const createSubmissionOrRunTests = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const { userId, problemId, sessionId, languageId, code } = req.body;

        if (!userId || !problemId || !sessionId || !languageId || !code) {
            res.status(400).json({ message: "Missing required fields" });
            return;
        }
        
        //GET challenge drivercode and testcases if req.test type = test or submit
        
        if(req.query.type === "test") {
            const challenge = await prisma.challenge.findUnique({
                where: {
                    challenge_id: problemId,
                },
                select: {
                    sampleTestCase: true,
                    driverCode: true,
                },
            });
    
            if(!challenge) {
                res.status(404).json({ message: "Challenge not found" });
                return;
            }
    
            const driverCode = challenge.driverCode;
            const fullCode = `${code}\n\n${driverCode}`;
            const testCases = challenge.sampleTestCase as unknown as TestCase[];
            const results = await runTestCases(fullCode, languageId, testCases);
            res.status(200).json({ results, status: "success" });
        }


        else if(req.query.type === "submit") {

            const challenge = await prisma.challenge.findUnique({
                where: {
                    challenge_id: problemId,
                },
                select: {
                    allTestCases: true,
                    driverCode: true,
                },
            })


            if(!challenge) {
                res.status(404).json({ message: "Challenge not found" });
                return;
            }
            const driverCode = challenge.driverCode;
            const fullCode = `${code}\n\n${driverCode}`;
            const testCases = challenge.allTestCases as unknown as TestCase[];
            const results = await submitBatch(fullCode, languageId, testCases);

            // create submission
            const submission = await prisma.submission.create({
                data: {
                    user_id: userId,
                    challenge_id: problemId,
                    code: fullCode,
                    status: results.status,
                    runtime: results.runtime,
                    memory: results.memory,
                    practiceSessionId: sessionId,
                },
            });

            res.status(200).json({ results, status: "success" });
        }


    } catch (error) {
        res.status(500).json({ message: "Failed to submit code", error });
    }
       
};



const runTestCases = async (code: string, languageId: number, testCases: TestCase[]): Promise<any> => {
    if (!code || !languageId || !testCases) {
        return null;
    }
    const results = [];

    for (const testCase of testCases) {
        const input = testCase.input;
        const expectedOutput = testCase.expectedOutput;

        const response = await submitCode(code, input, languageId);
        if (!response) {
            return null;
        }

        const result = {
            input,
            expectedOutput,
            output: response?.stdout ?? "",
            status: response?.status,
        };
        results.push(result);
    }
    return results;
}


const submitCode = async (
    code: string,
    input: string,
    languageId: number
): Promise<any> => {
    if (!code || input || !languageId) {
        return null;
    }

    // submit to judge0
    try {
        const response = await axios.post(
            `${process.env.RAPID_API_URL}/submissions`,
            {
                source_code: code,
                language_id: languageId,
                stdin: input,
            },
            {
                headers: {
                    "x-rapidapi-host": `${process.env.RAPID_API_HOST}`,
                    "x-rapidapi-key": process.env.RAPID_API_KEY,
                },
            }
        );
        
        // check if submission was successful and get submission
        if (response.status === 201) {
            const submissionId = response.data.token;
            const submission = await axios.get(
                `${process.env.RAPID_API_URL}/submissions/${submissionId}`,
                {
                    headers: {
                        "x-rapidapi-host": `${process.env.RAPID_API_HOST}`,
                        "x-rapidapi-key": process.env.RAPID_API_KEY,
                    },
                }
            )
            return submission;
        }

        return null;
    } catch {
        return null;
    }
};


const submitBatch = async (code: string, languageId: number, testCases: TestCase[]): Promise<any> => {
    if (!code || !languageId || !testCases) {
        return null;
    }

    // submit batch submission to judge0
    try {
        const submissions = testCases.map((testCase) => ({
            source_code: code,
            language_id: languageId,
            stdin: testCase.input,
            expected_output: testCase.expectedOutput,
        }));

        const response = await axios.post(
            `${process.env.RAPID_API_URL}/submissions/batch`,
            { submissions }
        );

        // check if submission was successful and get submission for each submission
        if (response.status === 201) {
            const submissionIds = response.data.map((submission: any) => submission.token);
            const submissions = await Promise.all(
                submissionIds.map(async (submissionId: string) => {
                    const submission = await axios.get(
                        `${process.env.RAPID_API_URL}/submissions/${submissionId}`,
                        {
                            headers: {
                                "x-rapidapi-host": `${process.env.RAPID_API_HOST}`,
                                "x-rapidapi-key": process.env.RAPID_API_KEY,
                            },
                        }
                    );
                    return submission;
                })
            );
            return submissions;
        }   
    } catch {
        return null;
    }
}
