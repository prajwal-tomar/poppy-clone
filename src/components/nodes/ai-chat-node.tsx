"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import {
  Handle,
  Position,
  useHandleConnections,
  useNodesData,
  type NodeProps,
} from "@xyflow/react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import {
  Sparkles,
  ArrowUp,
  Youtube,
  FileText,
  ImageIcon,
  Mic,
  Type,
  Square,
  Copy,
  Check,
  AlertTriangle,
  Trash2,
  Eraser,
  type LucideIcon,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import { toast } from "sonner";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { createClient } from "@/lib/supabase/client";
import { useBoardStore } from "@/stores/board-store";

const nodeTypeIcons: Record<string, LucideIcon> = {
  youtube: Youtube,
  pdf: FileText,
  image: ImageIcon,
  voiceNote: Mic,
  textEditor: Type,
};

export function AIChatNode({ id }: NodeProps) {
  const boardId = useBoardStore((s) => s.boardId);
  const removeNode = useBoardStore((s) => s.removeNode);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [initialLoaded, setInitialLoaded] = useState(false);
  const [limitReached, setLimitReached] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const topConns = useHandleConnections({ type: "target", id: "top" });
  const leftConns = useHandleConnections({ type: "target", id: "left" });
  const allConns = [...topConns, ...leftConns];

  const sourceIds = allConns.map((c) => c.source);
  const sourceNodesData = useNodesData(sourceIds);

  const sourceCount = sourceNodesData.length;
  const uniqueTypes = Array.from(
    new Set(
      sourceNodesData
        .map((n) => n.type)
        .filter((t): t is string => !!t && t in nodeTypeIcons)
    )
  );

  const {
    messages,
    sendMessage,
    status,
    stop,
    setMessages,
    error,
  } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
      body: { nodeId: id, boardId },
    }),
    onFinish: () => {
      window.dispatchEvent(new CustomEvent("ai-usage-updated"));
    },
    onError: (err) => {
      if (err.message?.includes("429")) {
        setLimitReached(true);
      }
    },
  });

  const isLoading = status === "streaming" || status === "submitted";

  useEffect(() => {
    if (initialLoaded) return;
    setInitialLoaded(true);

    const supabase = createClient();
    supabase
      .from("chat_messages")
      .select("id, role, content, created_at")
      .eq("node_id", id)
      .order("created_at", { ascending: true })
      .then(({ data }) => {
        if (data && data.length > 0) {
          const restored = data.map((msg) => ({
            id: msg.id,
            role: msg.role as "user" | "assistant",
            parts: [{ type: "text" as const, text: msg.content }],
          }));
          setMessages(restored);
        }
      });
  }, [id, initialLoaded, setMessages]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const getMessageText = useCallback(
    (msg: (typeof messages)[number]): string => {
      return (
        msg.parts
          ?.filter(
            (p): p is { type: "text"; text: string } => p.type === "text"
          )
          .map((p) => p.text)
          .join("") ?? ""
      );
    },
    []
  );

  const handleCopy = useCallback(
    (messageId: string, content: string) => {
      navigator.clipboard.writeText(content).then(() => {
        setCopiedId(messageId);
        setTimeout(() => setCopiedId(null), 2000);
      });
    },
    []
  );

  const onSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (limitReached) {
        toast.error("Daily AI message limit reached. Upgrade to Pro for more.");
        return;
      }
      const text = inputValue.trim();
      if (!text) return;
      setInputValue("");
      sendMessage({ text });
    },
    [sendMessage, inputValue, limitReached]
  );

  const clearChat = useCallback(async () => {
    const supabase = createClient();
    await supabase.from("chat_messages").delete().eq("node_id", id);
    setMessages([]);
    setLimitReached(false);
  }, [id, setMessages]);

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <div
          className="w-[360px] bg-white border border-border rounded-lg shadow-sm overflow-hidden flex flex-col"
          style={{ height: 400 }}
        >
          <div className="px-3 py-2.5 border-b border-border flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <Sparkles className="size-4 text-accent" />
              <span className="font-heading text-sm font-semibold">
                AI Chat
              </span>
            </div>
            {sourceCount > 0 ? (
              <div className="flex items-center gap-1.5 bg-secondary rounded-full px-2.5 py-1">
                {uniqueTypes.map((type) => {
                  const Icon = nodeTypeIcons[type];
                  return (
                    <Icon
                      key={type}
                      className="size-3 text-muted-foreground"
                    />
                  );
                })}
                <span className="font-sans text-[11px] text-muted-foreground font-medium">
                  {sourceCount} {sourceCount === 1 ? "source" : "sources"}
                </span>
              </div>
            ) : (
              <span className="font-sans text-[11px] text-muted-foreground">
                No sources
              </span>
            )}
          </div>

          {sourceCount === 0 && messages.length === 0 ? (
            <div className="flex-1 flex items-center justify-center p-4">
              <p className="font-sans text-xs text-muted-foreground text-center leading-relaxed">
                Connect sources to this chat by drawing lines from other nodes.
              </p>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex-1 flex items-center justify-center p-4">
              <p className="font-sans text-xs text-muted-foreground text-center leading-relaxed">
                Ask me anything about your connected sources.
              </p>
            </div>
          ) : (
            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-3 space-y-3 nodrag nowheel"
            >
              {messages.map((msg) => {
                const text = getMessageText(msg);
                if (!text) return null;
                return (
                  <div
                    key={msg.id}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-lg px-3 py-2 ${
                        msg.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary"
                      }`}
                    >
                      {msg.role === "assistant" ? (
                        <div className="group relative">
                          <div className="ai-chat-md font-sans text-xs leading-relaxed text-primary">
                            <ReactMarkdown
                              components={{
                                h1: ({ children }) => <h1 className="text-sm font-bold mt-2 mb-1 first:mt-0">{children}</h1>,
                                h2: ({ children }) => <h2 className="text-xs font-bold mt-2 mb-1 first:mt-0">{children}</h2>,
                                h3: ({ children }) => <h3 className="text-xs font-semibold mt-1.5 mb-0.5 first:mt-0">{children}</h3>,
                                p: ({ children }) => <p className="mb-1 last:mb-0">{children}</p>,
                                ul: ({ children }) => <ul className="list-disc pl-4 mb-1 space-y-0.5">{children}</ul>,
                                ol: ({ children }) => <ol className="list-decimal pl-4 mb-1 space-y-0.5">{children}</ol>,
                                li: ({ children }) => <li>{children}</li>,
                                code: ({ children, className }) => {
                                  const isBlock = className?.includes("language-");
                                  if (isBlock) {
                                    return <code className="text-[11px]">{children}</code>;
                                  }
                                  return <code className="bg-white/60 rounded px-1 py-0.5 text-[11px]">{children}</code>;
                                },
                                pre: ({ children }) => <pre className="bg-white/60 rounded p-2 my-1 overflow-x-auto text-[11px]">{children}</pre>,
                                strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                                em: ({ children }) => <em className="italic">{children}</em>,
                                blockquote: ({ children }) => <blockquote className="border-l-2 border-muted-foreground/30 pl-2 my-1 text-muted-foreground">{children}</blockquote>,
                                hr: () => <hr className="my-2 border-border" />,
                                a: ({ children, href }) => <a href={href} target="_blank" rel="noopener noreferrer" className="text-accent underline">{children}</a>,
                              }}
                            >
                              {text}
                            </ReactMarkdown>
                          </div>
                          <button
                            onClick={() => handleCopy(msg.id, text)}
                            className="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity size-6 rounded bg-white border border-border flex items-center justify-center shadow-sm"
                          >
                            {copiedId === msg.id ? (
                              <Check className="size-3 text-emerald-500" />
                            ) : (
                              <Copy className="size-3 text-muted-foreground" />
                            )}
                          </button>
                        </div>
                      ) : (
                        <p className="font-sans text-xs leading-relaxed">
                          {text}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}

              {isLoading &&
                messages.length > 0 &&
                messages[messages.length - 1]?.role === "user" && (
                  <div className="flex justify-start">
                    <div className="bg-secondary rounded-lg px-3 py-2">
                      <div className="flex items-center gap-1">
                        <div className="size-1.5 rounded-full bg-muted-foreground/40 animate-bounce" />
                        <div
                          className="size-1.5 rounded-full bg-muted-foreground/40 animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        />
                        <div
                          className="size-1.5 rounded-full bg-muted-foreground/40 animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        />
                      </div>
                    </div>
                  </div>
                )}
            </div>
          )}

          {error && !limitReached && (
            <div className="px-3 py-2 bg-red-50 border-t border-red-200">
              <p className="font-sans text-[11px] text-red-600">
                Error: {error.message}
              </p>
            </div>
          )}

          {limitReached && (
            <div className="px-3 py-2 bg-amber-50 border-t border-amber-200 flex items-center gap-2">
              <AlertTriangle className="size-3.5 text-amber-600 shrink-0" />
              <p className="font-sans text-[11px] text-amber-700">
                Daily limit reached. Upgrade to Pro for more messages.
              </p>
            </div>
          )}

          <div className="p-2 border-t border-border shrink-0">
            <form
              onSubmit={onSubmit}
              className="flex items-center gap-2 nodrag"
            >
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={
                  sourceCount > 0
                    ? "Ask about your connected sources..."
                    : "Ask me anything..."
                }
                className="flex-1 bg-secondary rounded-full px-3 py-1.5 text-xs font-sans placeholder:text-muted-foreground outline-none nowheel"
                disabled={limitReached}
              />
              {isLoading ? (
                <button
                  type="button"
                  onClick={() => stop()}
                  className="size-7 rounded-full bg-red-500 flex items-center justify-center shrink-0 hover:bg-red-600 transition-colors"
                >
                  <Square className="size-3 text-white" fill="white" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={!inputValue.trim() || limitReached}
                  className="size-7 rounded-full bg-accent flex items-center justify-center shrink-0 hover:bg-accent/90 transition-colors disabled:opacity-50"
                >
                  <ArrowUp className="size-3.5 text-white" />
                </button>
              )}
            </form>
          </div>

          <Handle
            type="target"
            position={Position.Top}
            id="top"
            className="!size-2 !bg-border !border-white !border-2"
          />
          <Handle
            type="source"
            position={Position.Bottom}
            className="!size-2 !bg-border !border-white !border-2"
          />
          <Handle
            type="target"
            position={Position.Left}
            id="left"
            className="!size-2 !bg-border !border-white !border-2"
          />
          <Handle
            type="source"
            position={Position.Right}
            className="!size-2 !bg-border !border-white !border-2"
          />
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent className="w-48">
        {messages.length > 0 && (
          <ContextMenuItem onClick={clearChat}>
            <Eraser className="size-4 mr-2" />
            Clear Chat
          </ContextMenuItem>
        )}
        <ContextMenuSeparator />
        <ContextMenuItem
          onClick={() => removeNode(id)}
          className="text-red-600 focus:text-red-600"
        >
          <Trash2 className="size-4 mr-2" />
          Delete Node
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
