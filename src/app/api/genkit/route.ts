// app/api/genkit/route.ts
import { NextResponse } from "next/server";
import generateCodeFromFigma from "@/src/ai/genkit"; // ✅ Import from src/ai/genkit.ts

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    const result = await generateCodeFromFigma(prompt);

    return NextResponse.json({ text: result });
  } catch (error: any) {
    console.error("Error in genkit API:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
