import { NextResponse } from "next/server";
import { z } from "zod";
import { fetchTranscript } from "youtube-transcript";

const youtubeUrlSchema = z
  .string()
  .url()
  .refine(
    (url) =>
      /^https?:\/\/(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/shorts\/)/.test(
        url
      ),
    { message: "Invalid YouTube URL" }
  );

function extractVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/,
    /(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match?.[1]) return match[1];
  }
  return null;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = youtubeUrlSchema.safeParse(body.url);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid YouTube URL" },
        { status: 400 }
      );
    }

    const url = parsed.data;
    const videoId = extractVideoId(url);
    if (!videoId) {
      return NextResponse.json(
        { error: "Could not extract video ID" },
        { status: 400 }
      );
    }

    let title = "YouTube Video";
    let channel = "Unknown";
    let thumbnail = "";

    try {
      const oembedRes = await fetch(
        `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`
      );
      if (oembedRes.ok) {
        const oembed = await oembedRes.json();
        title = oembed.title || title;
        channel = oembed.author_name || channel;
        thumbnail =
          oembed.thumbnail_url ||
          `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
      }
    } catch {
      thumbnail = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
    }

    if (!thumbnail) {
      thumbnail = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
    }

    let transcript = "";
    try {
      const segments = await fetchTranscript(videoId);
      transcript = segments.map((s) => s.text).join(" ");
    } catch {
      return NextResponse.json(
        {
          error:
            "Could not fetch transcript. This video may not have captions available.",
        },
        { status: 422 }
      );
    }

    return NextResponse.json({
      title,
      channel,
      thumbnail,
      transcript,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to process YouTube URL" },
      { status: 500 }
    );
  }
}
