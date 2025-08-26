import { NextResponse } from "next/server";
import generateCodeFromFigma from "@/genkit";

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    const code = await generateCodeFromFigma(prompt);
    return NextResponse.json({ code });
  } catch (error) {
    console.error("Error generating code:", error);
    return NextResponse.json({ error: "Failed to generate code" }, { status: 500 });
  }
}
