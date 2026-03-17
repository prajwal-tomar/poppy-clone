import { Handle, Position, type NodeProps } from "@xyflow/react";
import { Play, CheckCircle } from "lucide-react";

export function YouTubeNode({}: NodeProps) {
  return (
    <div className="w-[280px] bg-white border border-border rounded-lg overflow-hidden shadow-sm">
      <div className="h-[120px] bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center relative">
        <div className="size-12 rounded-full bg-red-500/90 flex items-center justify-center">
          <Play className="size-5 text-white ml-0.5" fill="white" />
        </div>
      </div>
      <div className="p-3">
        <h4 className="font-heading text-sm font-semibold leading-tight line-clamp-2">
          How to Build a SaaS in 2026
        </h4>
        <p className="font-sans text-xs text-muted-foreground mt-1">
          Tech Creator
        </p>
        <div className="flex items-center gap-1.5 mt-2">
          <CheckCircle className="size-3 text-emerald-500" />
          <span className="font-sans text-[11px] text-emerald-600 font-medium">
            Transcript ready
          </span>
        </div>
      </div>
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
