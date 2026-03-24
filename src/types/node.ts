import type { Tables, TablesInsert, TablesUpdate, Enums } from "./database";

export type NodeType = Enums<"node_type">;
export type DbNode = Tables<"nodes">;
export type DbNodeInsert = TablesInsert<"nodes">;
export type DbNodeUpdate = TablesUpdate<"nodes">;
export type DbEdge = Tables<"edges">;
export type DbEdgeInsert = TablesInsert<"edges">;
export type ChatMessage = Tables<"chat_messages">;
export type ProcessingStatus = Enums<"processing_status">;

export interface YouTubeNodeData {
  url: string;
  title?: string;
  channel?: string;
  thumbnail?: string;
  transcript?: string;
  status: ProcessingStatus;
}

export interface PDFNodeData {
  fileUrl: string;
  fileName: string;
  pageCount?: number;
  content?: string;
  status: ProcessingStatus;
}

export interface ImageNodeData {
  fileUrl: string;
  fileName: string;
}

export interface VoiceNoteNodeData {
  fileUrl?: string;
  fileName?: string;
  duration?: number;
  transcript?: string;
  status: "recording" | "transcribing" | "completed" | "failed";
}

export interface TextNodeData {
  content: string;
}

export interface AIChatNodeData {
  [key: string]: unknown;
}

export type NodeData =
  | YouTubeNodeData
  | PDFNodeData
  | ImageNodeData
  | VoiceNoteNodeData
  | TextNodeData
  | AIChatNodeData;

/**
 * Maps DB node_type enum values to React Flow component type names.
 * RF uses camelCase for component registry, DB uses snake_case.
 */
const DB_TO_RF_TYPE: Record<NodeType, string> = {
  youtube: "youtube",
  pdf: "pdf",
  image: "image",
  voice_note: "voiceNote",
  text: "textEditor",
  ai_chat: "aiChat",
};

const RF_TO_DB_TYPE: Record<string, NodeType> = {
  youtube: "youtube",
  pdf: "pdf",
  image: "image",
  voiceNote: "voice_note",
  textEditor: "text",
  aiChat: "ai_chat",
};

export function dbTypeToRFType(dbType: NodeType): string {
  return DB_TO_RF_TYPE[dbType];
}

export function rfTypeToDbType(rfType: string): NodeType {
  const mapped = RF_TO_DB_TYPE[rfType];
  if (!mapped) {
    throw new Error(`Unknown React Flow node type: ${rfType}`);
  }
  return mapped;
}
