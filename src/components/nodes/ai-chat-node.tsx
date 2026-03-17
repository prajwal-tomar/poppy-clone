import {
  Handle,
  Position,
  useHandleConnections,
  useNodesData,
  type NodeProps,
} from "@xyflow/react";
import {
  Sparkles,
  ArrowUp,
  Youtube,
  FileText,
  ImageIcon,
  Mic,
  Type,
  type LucideIcon,
} from "lucide-react";

const messages = [
  {
    role: "user" as const,
    content: "Summarize the key points from the connected video",
  },
  {
    role: "assistant" as const,
    content: `**Key Points:**

- **Creator-first approach** — Focus on solo creators who think spatially and work with mixed media
- **Pricing advantage** — 60-75% cheaper than competitors with no annual lock-in
- **Core workflow** — Drop sources → connect to AI → ask anything → write final draft
- **Free tier** drives adoption — 3 boards and 30 messages/day is enough to hit the "aha" moment`,
  },
  {
    role: "user" as const,
    content: "Turn this into a tweet thread",
  },
  {
    role: "assistant" as const,
    content: `**Thread: Why visual AI workspaces are the future** 🧵

1/ Most AI tools are chat boxes. But creators don't think in linear conversations — they think spatially.

2/ Imagine dropping a YouTube video, a PDF, and a voice note onto a canvas, connecting them to AI, and getting insights across all of them.

3/ That's the future of AI-powered research. Not another chatbot — a workspace.`,
  },
];

const nodeTypeIcons: Record<string, LucideIcon> = {
  youtube: Youtube,
  pdf: FileText,
  image: ImageIcon,
  voiceNote: Mic,
  textEditor: Type,
};

export function AIChatNode({}: NodeProps) {
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

  return (
    <div
      className="w-[360px] bg-white border border-border rounded-lg shadow-sm overflow-hidden flex flex-col"
      style={{ height: 400 }}
    >
      <div className="px-3 py-2.5 border-b border-border flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <Sparkles className="size-4 text-accent" />
          <span className="font-heading text-sm font-semibold">AI Chat</span>
        </div>
        {sourceCount > 0 ? (
          <div className="flex items-center gap-1.5 bg-secondary rounded-full px-2.5 py-1">
            {uniqueTypes.map((type) => {
              const Icon = nodeTypeIcons[type];
              return (
                <Icon key={type} className="size-3 text-muted-foreground" />
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

      {sourceCount === 0 ? (
        <div className="flex-1 flex items-center justify-center p-4">
          <p className="font-sans text-xs text-muted-foreground text-center leading-relaxed">
            Connect sources to this chat by drawing lines from other nodes.
          </p>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto p-3 space-y-3">
          {messages.map((msg, i) => (
            <div
              key={i}
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
                  <div className="font-sans text-xs leading-relaxed text-primary whitespace-pre-line">
                    {msg.content}
                  </div>
                ) : (
                  <p className="font-sans text-xs leading-relaxed">
                    {msg.content}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="p-2 border-t border-border shrink-0">
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Ask about your connected sources..."
            className="flex-1 bg-secondary rounded-full px-3 py-1.5 text-xs font-sans placeholder:text-muted-foreground outline-none"
            readOnly
          />
          <button className="size-7 rounded-full bg-accent flex items-center justify-center shrink-0 hover:bg-accent/90 transition-colors">
            <ArrowUp className="size-3.5 text-white" />
          </button>
        </div>
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
  );
}
