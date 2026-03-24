import { NextResponse } from "next/server";
import { extractText, getDocumentProxy } from "unpdf";

export async function POST(req: Request) {
  try {
    const { fileUrl } = await req.json();

    if (!fileUrl || typeof fileUrl !== "string") {
      return NextResponse.json(
        { error: "Missing fileUrl" },
        { status: 400 }
      );
    }

    const response = await fetch(fileUrl);
    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to download PDF" },
        { status: 422 }
      );
    }

    const buffer = new Uint8Array(await response.arrayBuffer());
    const pdf = await getDocumentProxy(buffer);
    const { totalPages, text } = await extractText(pdf, { mergePages: true });

    return NextResponse.json({
      content: text,
      pageCount: totalPages,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to extract text from PDF" },
      { status: 500 }
    );
  }
}
