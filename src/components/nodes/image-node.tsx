import { Handle, Position, type NodeProps } from "@xyflow/react";
import { ImageIcon } from "lucide-react";

export function ImageNode({}: NodeProps) {
  return (
    <div className="w-[240px] bg-white border border-border rounded-lg overflow-hidden shadow-sm relative">
      <div className="absolute top-2 right-2 z-10">
        <span className="inline-flex items-center rounded-full bg-accent px-2 py-0.5 text-[10px] font-bold text-white uppercase tracking-wide">
          Pro
        </span>
      </div>
      <div className="h-[160px] bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
        <ImageIcon className="size-10 text-muted-foreground/30" />
      </div>
      <div className="px-3 py-2 border-t border-border">
        <p className="font-sans text-xs text-muted-foreground truncate">
          competitor-ad.png
        </p>
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
