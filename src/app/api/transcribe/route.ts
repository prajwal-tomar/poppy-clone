import { NextResponse } from "next/server";
import OpenAI, { toFile } from "openai";

const openai = new OpenAI();

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof Blob)) {
      return NextResponse.json(
        { error: "No audio file provided" },
        { status: 400 }
      );
    }

    const openaiFile = await toFile(file, "audio.webm");

    const transcription = await openai.audio.transcriptions.create({
      file: openaiFile,
      model: "gpt-4o-mini-transcribe",
      response_format: "text",
    });

    return NextResponse.json({ transcript: transcription });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Transcription failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
