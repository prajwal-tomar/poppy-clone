import { Handle, Position, type NodeProps } from "@xyflow/react";
import { Play } from "lucide-react";

export function VoiceNoteNode({}: NodeProps) {
  return (
    <div className="w-[260px] bg-white border border-border rounded-lg shadow-sm p-3 relative">
      <div className="absolute top-2 right-2 z-10">
        <span className="inline-flex items-center rounded-full bg-accent px-2 py-0.5 text-[10px] font-bold text-white uppercase tracking-wide">
          Pro
        </span>
      </div>

      <div className="flex items-center gap-3 mb-3">
        <button className="size-8 rounded-full bg-primary flex items-center justify-center shrink-0">
          <Play className="size-3.5 text-white ml-0.5" fill="white" />
        </button>
        <div className="flex-1">
          <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
            <div className="h-full w-[35%] bg-accent rounded-full" />
          </div>
        </div>
        <span className="font-sans text-xs text-muted-foreground shrink-0">
          0:45
        </span>
      </div>

      <p className="font-sans text-xs text-muted-foreground leading-relaxed line-clamp-3">
        I was thinking we should focus on the creator market first because
        they&apos;re the ones who need this spatial workflow the most...
      </p>

      <p className="font-sans text-[11px] text-muted-foreground/60 mt-2">
        Voice Note — 0:45
      </p>

      <Handle
        type="target"
        position={Position.Top}
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
