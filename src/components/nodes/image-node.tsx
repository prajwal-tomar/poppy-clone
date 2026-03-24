"use client";

import { useState } from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import { ImageIcon, Loader2, X, Trash2, Maximize2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { useBoardStore } from "@/stores/board-store";
import type { ImageNodeData } from "@/types/node";

export function ImageNode({ id, data }: NodeProps) {
  const nodeData = data as unknown as ImageNodeData;
  const removeNode = useBoardStore((s) => s.removeNode);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const hasImage = !!nodeData.fileUrl;

  return (
    <>
      <ContextMenu>
        <ContextMenuTrigger asChild>
          <div
            className="w-[280px] bg-white border border-border rounded-lg overflow-hidden shadow-sm relative"
            onDoubleClick={() => {
              if (hasImage) setLightboxOpen(true);
            }}
          >
        {hasImage ? (
          <div className="max-h-[300px] overflow-hidden">
            <img
              src={nodeData.fileUrl}
              alt={nodeData.fileName || "Image"}
              className="w-full object-contain"
              draggable={false}
            />
          </div>
        ) : (
          <div className="h-[160px] bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
            <Loader2 className="size-8 text-muted-foreground/40 animate-spin" />
          </div>
        )}
        <div className="px-3 py-2 border-t border-border">
          <p className="font-sans text-xs text-muted-foreground truncate">
            {nodeData.fileName || "Uploading..."}
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
        </ContextMenuTrigger>
        <ContextMenuContent className="w-48">
          {hasImage && (
            <ContextMenuItem onClick={() => setLightboxOpen(true)}>
              <Maximize2 className="size-4 mr-2" />
              View Full Size
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

      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent className="max-w-[90vw] max-h-[90vh] p-0 border-none bg-transparent shadow-none">
          <DialogTitle className="sr-only">
            {nodeData.fileName || "Image"}
          </DialogTitle>
          <div className="relative flex items-center justify-center">
            <button
              onClick={() => setLightboxOpen(false)}
              className="absolute top-2 right-2 z-10 size-8 rounded-full bg-black/60 flex items-center justify-center hover:bg-black/80 transition-colors"
            >
              <X className="size-4 text-white" />
            </button>
            <img
              src={nodeData.fileUrl}
              alt={nodeData.fileName || "Image"}
              className="max-w-full max-h-[85vh] object-contain rounded-lg"
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
