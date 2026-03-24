import {
  streamText,
  convertToModelMessages,
  type UIMessage,
  type ModelMessage,
} from "ai";
import { openai } from "@ai-sdk/openai";
import { createClient } from "@/lib/supabase/server";
import { buildContext } from "@/lib/ai/context-builder";

export async function POST(req: Request) {
  try {
    const {
      messages,
      nodeId,
      boardId,
    }: { messages: UIMessage[]; nodeId: string; boardId: string } =
      await req.json();

    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const { data: usageData } = await supabase.rpc("get_ai_usage_today", {
      p_user_id: user.id,
    });

    if (usageData) {
      const usage = usageData as unknown as { used: number; limit: number };
      if (usage.used >= usage.limit) {
        return new Response(
          JSON.stringify({
            error: "Daily AI message limit reached. Upgrade to Pro for more.",
          }),
          {
            status: 429,
            headers: { "Content-Type": "application/json" },
          }
        );
      }
    }

    const context = await buildContext(nodeId, boardId);

    const systemPrompt = `You are a helpful AI assistant inside a visual workspace called Thinkboard. Users connect source materials (YouTube videos, PDFs, images, voice notes, text notes) to you and ask questions about them.

${context.contextString ? context.contextString : "No sources are currently connected to this chat. You can still help with general questions."}

Respond in a helpful, concise manner. Use markdown formatting for better readability. When referencing specific sources, mention them by their type and title.`;

    const model = openai("gpt-4o-mini");

    const lastRawMessage = messages[messages.length - 1];
    const lastUserContent =
      lastRawMessage?.role === "user"
        ? extractTextContent(lastRawMessage)
        : null;

    const modelMessages: ModelMessage[] = await convertToModelMessages(messages);

    if (context.imageUrls.length > 0) {
      const lastUserIdx = modelMessages.findLastIndex(
        (m) => m.role === "user"
      );
      if (lastUserIdx !== -1) {
        const lastUser = modelMessages[lastUserIdx];
        const existingContent =
          typeof lastUser.content === "string"
            ? [{ type: "text" as const, text: lastUser.content }]
            : Array.isArray(lastUser.content)
              ? lastUser.content
              : [];

        const imageParts = context.imageUrls.map((url) => ({
          type: "image" as const,
          image: new URL(url),
        }));

        modelMessages[lastUserIdx] = {
          ...lastUser,
          content: [...existingContent, ...imageParts],
        };
      }
    }

    const result = streamText({
      model,
      system: systemPrompt,
      messages: modelMessages,
      onFinish: async ({ text }) => {
        await supabase.rpc("increment_ai_usage", { p_user_id: user.id });

        if (lastUserContent) {
          await supabase.from("chat_messages").insert({
            node_id: nodeId,
            role: "user" as const,
            content: lastUserContent,
          });
        }

        await supabase.from("chat_messages").insert({
          node_id: nodeId,
          role: "assistant" as const,
          content: text,
        });
      },
    });

    return result.toUIMessageStreamResponse();
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Internal server error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

function extractTextContent(msg: UIMessage): string {
  const textParts = msg.parts
    .filter((p): p is { type: "text"; text: string } => p.type === "text")
    .map((p) => p.text);
  return textParts.join("") || "";
}
