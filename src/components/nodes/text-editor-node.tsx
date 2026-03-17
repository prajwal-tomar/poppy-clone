import { Handle, Position, type NodeProps } from "@xyflow/react";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Code,
  ChevronDown,
} from "lucide-react";

export function TextEditorNode({}: NodeProps) {
  return (
    <div className="w-[320px] bg-white border border-border rounded-lg shadow-sm overflow-hidden">
      <div className="flex items-center gap-0.5 px-2 py-1.5 border-b border-border bg-secondary/40">
        <button className="flex items-center gap-1 px-2 py-1 rounded text-xs font-medium text-muted-foreground hover:bg-white transition-colors">
          H1
          <ChevronDown className="size-3" />
        </button>
        <div className="w-px h-4 bg-border mx-1" />
        <button className="p-1 rounded text-muted-foreground hover:bg-white transition-colors">
          <Bold className="size-3.5" />
        </button>
        <button className="p-1 rounded text-muted-foreground hover:bg-white transition-colors">
          <Italic className="size-3.5" />
        </button>
        <div className="w-px h-4 bg-border mx-1" />
        <button className="p-1 rounded text-muted-foreground hover:bg-white transition-colors">
          <List className="size-3.5" />
        </button>
        <button className="p-1 rounded text-muted-foreground hover:bg-white transition-colors">
          <ListOrdered className="size-3.5" />
        </button>
        <button className="p-1 rounded text-muted-foreground hover:bg-white transition-colors">
          <Code className="size-3.5" />
        </button>
      </div>
      <div className="p-4 min-h-[180px]">
        <p className="font-sans text-[16px] text-[#999999] leading-[1.6]">
          Start writing...
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
