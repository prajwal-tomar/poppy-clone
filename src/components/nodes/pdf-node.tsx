import { Handle, Position, type NodeProps } from "@xyflow/react";
import { FileText, CheckCircle } from "lucide-react";

export function PDFNode({}: NodeProps) {
  return (
    <div className="w-[280px] bg-white border border-border rounded-lg overflow-hidden shadow-sm">
      <div className="h-[120px] bg-secondary flex items-center justify-center">
        <FileText className="size-12 text-muted-foreground/40" />
      </div>
      <div className="p-3">
        <h4 className="font-heading text-sm font-semibold leading-tight truncate">
          Product Requirements.pdf
        </h4>
        <p className="font-sans text-xs text-muted-foreground mt-1">
          12 pages
        </p>
        <div className="flex items-center gap-1.5 mt-2">
          <CheckCircle className="size-3 text-emerald-500" />
          <span className="font-sans text-[11px] text-emerald-600 font-medium">
            Content ready
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
