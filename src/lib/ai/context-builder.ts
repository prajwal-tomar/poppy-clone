import { createClient } from "@/lib/supabase/server";
import type { Json } from "@/types/database";

interface TiptapNode {
  type?: string;
  text?: string;
  content?: TiptapNode[];
}

function extractPlainText(tiptapJson: TiptapNode | string): string {
  if (typeof tiptapJson === "string") return tiptapJson;
  if (!tiptapJson) return "";

  let text = "";
  if (tiptapJson.text) {
    text += tiptapJson.text;
  }
  if (tiptapJson.content) {
    for (const child of tiptapJson.content) {
      const childText = extractPlainText(child);
      if (childText) {
        if (
          tiptapJson.type === "paragraph" ||
          tiptapJson.type === "heading" ||
          tiptapJson.type === "listItem" ||
          tiptapJson.type === "bulletList" ||
          tiptapJson.type === "orderedList"
        ) {
          text += childText + "\n";
        } else {
          text += childText;
        }
      }
    }
  }
  return text;
}

export interface ContextResult {
  contextString: string;
  sourceCount: number;
  sourceTypes: string[];
  imageUrls: string[];
}

export async function buildContext(
  chatNodeId: string,
  boardId: string
): Promise<ContextResult> {
  const supabase = await createClient();

  const { data: edges } = await supabase
    .from("edges")
    .select("source_node_id")
    .eq("board_id", boardId)
    .eq("target_node_id", chatNodeId);

  if (!edges || edges.length === 0) {
    return {
      contextString: "",
      sourceCount: 0,
      sourceTypes: [],
      imageUrls: [],
    };
  }

  const sourceIds = edges.map((e) => e.source_node_id);

  const { data: sourceNodes } = await supabase
    .from("nodes")
    .select("id, type, data")
    .in("id", sourceIds);

  if (!sourceNodes || sourceNodes.length === 0) {
    return {
      contextString: "",
      sourceCount: 0,
      sourceTypes: [],
      imageUrls: [],
    };
  }

  const sections: string[] = [];
  const sourceTypes: string[] = [];
  const imageUrls: string[] = [];
  let sourceIndex = 1;

  for (const node of sourceNodes) {
    const data = node.data as Record<string, Json> | null;
    if (!data) continue;

    const type = node.type;
    sourceTypes.push(type);

    switch (type) {
      case "youtube": {
        const status = data.status as string;
        if (status !== "completed") {
          sections.push(
            `[Source ${sourceIndex}: YouTube — processing, not yet available]`
          );
        } else {
          const title = (data.title as string) || "YouTube Video";
          const transcript = data.transcript as string;
          if (transcript) {
            sections.push(
              `[Source ${sourceIndex}: YouTube — "${title}"]\n${transcript}`
            );
          }
        }
        break;
      }

      case "pdf": {
        const status = data.status as string;
        if (status !== "completed") {
          sections.push(
            `[Source ${sourceIndex}: PDF — processing, not yet available]`
          );
        } else {
          const fileName = (data.fileName as string) || "PDF Document";
          const content = data.content as string;
          if (content) {
            sections.push(
              `[Source ${sourceIndex}: PDF — "${fileName}"]\n${content}`
            );
          }
        }
        break;
      }

      case "image": {
        const fileUrl = data.fileUrl as string;
        if (fileUrl) {
          imageUrls.push(fileUrl);
          const fileName = (data.fileName as string) || "Image";
          sections.push(
            `[Source ${sourceIndex}: Image — "${fileName}" (image attached for vision)]`
          );
        }
        break;
      }

      case "voice_note": {
        const status = data.status as string;
        if (status !== "completed") {
          sections.push(
            `[Source ${sourceIndex}: Voice Note — processing, not yet available]`
          );
        } else {
          const transcript = data.transcript as string;
          if (transcript) {
            sections.push(
              `[Source ${sourceIndex}: Voice Note]\n${transcript}`
            );
          }
        }
        break;
      }

      case "text": {
        const content = data.content;
        if (content) {
          const plainText =
            typeof content === "string"
              ? content
              : extractPlainText(content as unknown as TiptapNode);
          if (plainText.trim()) {
            sections.push(
              `[Source ${sourceIndex}: Text Note]\n${plainText.trim()}`
            );
          }
        }
        break;
      }
    }

    sourceIndex++;
  }

  const contextString =
    sections.length > 0
      ? "The user has connected the following sources to this chat:\n\n" +
        sections.join("\n\n")
      : "";

  return {
    contextString,
    sourceCount: sourceNodes.length,
    sourceTypes: [...new Set(sourceTypes)],
    imageUrls,
  };
}
