import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { base64 } = await req.json();

        if (!process.env.GEMINI_API_KEY) {
            return NextResponse.json(
                { error: "Missing Gemini API key" },
                { status: 500 }
            );
        }

        const genAI = new GoogleGenerativeAI(
            process.env.GEMINI_API_KEY
        );
        // const modelNames = [
        //     "gemini-2.5-flash",
        //     "gemini-2.0-flash-lite",
        // ];

        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash"
        });

        async function analyzeWithRetry(model: any, payload: any) {
            let retries = 3;
            let delay = 2000;

            for (let i = 0; i < retries; i++) {
                try {
                    return await model.generateContent(payload);
                } catch (error: any) {
                    const message = error?.message || "";

                    if (!message.includes("503")) {
                        throw error;
                    }

                    if (i === retries - 1) {
                        throw error;
                    }

                    await new Promise((resolve) =>
                        setTimeout(resolve, delay)
                    );

                    delay *= 2;
                }
            }
        }

        //         const result = await model.generateContent([
        //             {
        //                 inlineData: {
        //                     data: base64,
        //                     mimeType: "image/jpeg",
        //                 },
        //             },
        //             {
        //                 text: `
        // Identify this meal image.
        // Return ONLY raw JSON.
        // No markdown.
        // No backticks.

        // {
        //    "name": "food name",
        //   "calories": 0,
        //   "protein": 0,
        //   "carbs": 0,
        //   "fat": 0,
        //   "fiber": 0
        // }
        //         `,
        //             },
        //         ]);
        const result = await analyzeWithRetry(model, [
            {
                inlineData: {
                    data: base64,
                    mimeType: "image/jpeg",
                },
            },
            {
                text: `
 Identify this meal image.
Return ONLY raw JSON.
No markdown.
No backticks.
{
  "name": "",
  "calories": 0,
  "protein": 0,
  "carbs": 0,
  "fat": 0,
  "fiber": 0
}
    `,
            },
        ]);

        const text = result.response.text();

        console.log("Gemini response:", text);

        return NextResponse.json({
            result: text,
        });
    } catch (error: any) {
        console.error("Gemini backend error:", error);

        return NextResponse.json(
            {
                error: error.message || "AI analysis failed",
            },
            { status: 500 }
        );
    }
}
