"use client";

import { useEffect, useRef, useState } from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import {
  FileText,
  CheckCircle,
  Loader2,
  AlertCircle,
  RefreshCw,
  Trash2,
  Eye,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { useBoardStore } from "@/stores/board-store";
import type { PDFNodeData } from "@/types/node";

export function PDFNode({ id, data }: NodeProps) {
  const nodeData = data as unknown as PDFNodeData;
  const updateNodeData = useBoardStore((s) => s.updateNodeData);
  const removeNode = useBoardStore((s) => s.removeNode);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const fetchedRef = useRef(false);

  useEffect(() => {
    if (nodeData.status !== "pending" || fetchedRef.current) return;
    fetchedRef.current = true;

    updateNodeData(id, { status: "processing" });

    fetch("/api/pdf", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fileUrl: nodeData.fileUrl }),
    })
      .then(async (res) => {
        const json = await res.json();
        if (!res.ok) {
          setErrorMsg(json.error || "Failed to extract text");
          updateNodeData(id, { status: "failed" });
          return;
        }
        updateNodeData(id, {
          content: json.content,
          pageCount: json.pageCount,
          status: "completed",
        });
      })
      .catch(() => {
        setErrorMsg("Network error");
        updateNodeData(id, { status: "failed" });
      });
  }, [nodeData.status, nodeData.fileUrl, id, updateNodeData]);

  const handleRetry = () => {
    fetchedRef.current = false;
    setErrorMsg("");
    updateNodeData(id, { status: "pending" });
  };

  const status = nodeData.status;

  return (
    <>
      <ContextMenu>
        <ContextMenuTrigger asChild>
          <div
            className="w-[280px] bg-white border border-border rounded-lg overflow-hidden shadow-sm"
            onDoubleClick={() => {
              if (status === "completed" && nodeData.content) {
                setSheetOpen(true);
              }
            }}
          >
        <div className="h-[120px] bg-secondary flex items-center justify-center">
          {status === "failed" ? (
            <AlertCircle className="size-12 text-red-400" />
          ) : status === "completed" ? (
            <FileText className="size-12 text-muted-foreground/40" />
          ) : (
            <Loader2 className="size-10 text-muted-foreground/40 animate-spin" />
          )}
        </div>
        <div className="p-3">
          {status === "completed" ? (
            <>
              <h4 className="font-heading text-sm font-semibold leading-tight truncate">
                {nodeData.fileName}
              </h4>
              <p className="font-sans text-xs text-muted-foreground mt-1">
                {nodeData.pageCount} {nodeData.pageCount === 1 ? "page" : "pages"}
              </p>
              <div className="flex items-center gap-1.5 mt-2">
                <CheckCircle className="size-3 text-emerald-500" />
                <span className="font-sans text-[11px] text-emerald-600 font-medium">
                  Content ready
                </span>
              </div>
            </>
          ) : status === "failed" ? (
            <>
              <p className="font-sans text-xs text-red-600 leading-relaxed">
                {errorMsg || "Failed to extract text"}
              </p>
              <button
                onClick={handleRetry}
                className="flex items-center gap-1.5 mt-2 font-sans text-[11px] text-muted-foreground hover:text-primary transition-colors"
              >
                <RefreshCw className="size-3" />
                Retry
              </button>
            </>
          ) : (
            <>
              <h4 className="font-heading text-sm font-semibold leading-tight truncate">
                {nodeData.fileName || "Processing PDF..."}
              </h4>
              <p className="font-sans text-xs text-muted-foreground mt-1">
                Extracting text...
              </p>
            </>
          )}
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
          {status === "completed" && nodeData.content && (
            <ContextMenuItem onClick={() => setSheetOpen(true)}>
              <Eye className="size-4 mr-2" />
              View Content
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

      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent className="overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="font-heading text-lg">
              {nodeData.fileName || "PDF Content"}
            </SheetTitle>
          </SheetHeader>
          <div className="mt-4">
            {nodeData.pageCount && (
              <p className="font-sans text-sm text-muted-foreground mb-4">
                {nodeData.pageCount} {nodeData.pageCount === 1 ? "page" : "pages"}
              </p>
            )}
            <p className="font-sans text-sm leading-relaxed text-primary whitespace-pre-wrap">
              {nodeData.content}
            </p>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
