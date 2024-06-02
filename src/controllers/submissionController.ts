import { prisma } from "../config/prisma";
import { Response, Request } from "express";
import axios from "axios";
import "dotenv/config";

interface TestCase {
    input: string;
    output: string;
    explanation: string;
}

interface Result {
    input: string;
    expectedOutput: string;
    output: string;
    status: {
        id: number;
        description: string;
    };
    time: number;
    memory: number;
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
            // const fullCode = `${code}\n\n${driverCode}`;
            const testCases = challenge.sampleTestCase as unknown as TestCase[];
            const results = await runTestCases(code, languageId, testCases);
            // const results = await submitBatch(code, languageId, testCases);

            res.status(200).json({ "output_data": results, status: "Success" });
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
            // const fullCode = `${code}\n\n${driverCode}`;
            const testCases = challenge.allTestCases as unknown as TestCase[];
            const results = await submitBatch(code, languageId, testCases);

            // create submission
            const submission = await prisma.submission.create({
                data: {
                    user_id: userId,
                    challenge_id: problemId,
                    code: code,
                    status: results.status,
                    runtime: results.runtime,
                    memory: results.memory,
                    practiceSessionId: sessionId,
                },
            });

            res.status(200).json({ results, status: "success" });
        }


    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Failed to submit code", error });
    }
       
};



const runTestCases = async (code: string, languageId: number, testCases: TestCase[]): Promise<any> => {
    if (!code || !languageId || !testCases) {
        return null;
    }

    const results: Result[] = [];

    for (const testCase of testCases) {
        const input = testCase.input;
        const expectedOutput = testCase.output;

        const response = await submitCode(code, input, expectedOutput, languageId);
        if (!response) {
            return null;
        }

        console.log(response);

        const result: Result = {
            input,
            expectedOutput,
            output: response.stdout?.trim(),
            status: response.status,
            time: parseFloat(response.time), 
            memory: parseInt(response.memory),
        };
        results.push(result);
    }

    // Calculate average runtime and memory usage
    const totalRuntime = results.reduce((acc, result) => acc + result.time, 0);
    const totalMemory = results.reduce((acc, result) => acc + result.memory, 0);
    const averageRuntime = totalRuntime / results.length;
    const averageMemory = totalMemory / results.length;

    return {
        results,
        averageRuntime,
        averageMemory,
    };
};



// Function to decode Base64
const decodeBase64 = (encodedString:any) => {
    try {
        const buffer = Buffer.from(encodedString, 'base64');
        return buffer.toString('utf-8');
    } catch (error:any) {
        return `Error decoding Base64: ${error.message}`;
    }
};

// Function to submit the code and get the result
const submitCode = async (code:any, input:any,  expectedOutput:any, languageId:number) => {
    if (!code || !languageId) {
        return null;
    }

    try {
        const response = await axios.post(
            `${process.env.RAPID_API_URL}/submissions`,
            {
                source_code: Buffer.from(code).toString('base64'),  
                language_id: languageId,
                stdin: Buffer.from(input).toString('base64'),      
                expected_output: Buffer.from(expectedOutput).toString('base64'), 
            },
            {
                headers: {
                    "x-rapidapi-host": process.env.RAPID_API_HOST,
                    "x-rapidapi-key": process.env.RAPID_API_KEY,
                    "Content-Type": "application/json",
                },
                params: {
                    base64_encoded: "true",
                    fields: "*",
                },
            }
        );

        if (response.status === 201) {
            const submissionId = response.data.token;
            const submissionResponse = await axios.get(
                `${process.env.RAPID_API_URL}/submissions/${submissionId}`,
                {
                    headers: {
                        "x-rapidapi-host": process.env.RAPID_API_HOST,
                        "x-rapidapi-key": process.env.RAPID_API_KEY,
                        "Content-Type": "application/json",
                    },
                    params: {
                        base64_encoded: "true",
                        fields: "*",
                    },
                }
            );

            const submissionData = submissionResponse.data;

            // Decode Base64 encoded fields
            if (submissionData.stdout) {
                submissionData.stdout = decodeBase64(submissionData.stdout);
            }
            if (submissionData.stderr) {
                submissionData.stderr = decodeBase64(submissionData.stderr);
            }
            if (submissionData.compile_output) {
                submissionData.compile_output = decodeBase64(submissionData.compile_output);
            }

            return submissionData;
        }

        console.log(response.data);
        return null;
    } catch (error) {
        console.log(error);
        return null;
    }
};



const submitBatch = async (code: string, languageId: number, testCases: TestCase[]): Promise<any> => {
    if (!code || !languageId || !testCases) {
        console.log("Missing required parameters");
        return null;
    }

    // submit batch submission to judge0
    try {
        const submissions = testCases.map((testCase) => ({
                source_code: Buffer.from(code).toString('base64'),  
                language_id: languageId,
                stdin: Buffer.from(testCase.input).toString('base64'),      
                expected_output: Buffer.from(testCase.output).toString('base64'), 
        }));

        const response = await axios.post(
            `${process.env.RAPID_API_URL}/submissions/batch`,
            { submissions }
        );

        console.log(response.data);
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

                    // Decode Base64 encoded fields
                    if (submission.data.stdout) {
                        submission.data.stdout = decodeBase64(submission.data.stdout);
                    }
                    if (submission.data.stderr) {
                        submission.data.stderr = decodeBase64(submission.data.stderr);
                    }
                    if (submission.data.compile_output) {
                        submission.data.compile_output = decodeBase64(submission.data.compile_output);
                    }

                    console.log(submission.data);
                    

                    return submission.data;
                })
            );
            return submissions;
        }   
    } catch(error) {
        console.log(error)
        return null;
    }
}
