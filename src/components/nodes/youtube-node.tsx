"use client";

import { useEffect, useRef, useState } from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import {
  Play,
  CheckCircle,
  Loader2,
  AlertCircle,
  RefreshCw,
  ExternalLink,
  FileText,
  Trash2,
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
import type { YouTubeNodeData } from "@/types/node";

export function YouTubeNode({ id, data }: NodeProps) {
  const nodeData = data as unknown as YouTubeNodeData;
  const updateNodeData = useBoardStore((s) => s.updateNodeData);
  const removeNode = useBoardStore((s) => s.removeNode);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const fetchedRef = useRef(false);

  useEffect(() => {
    if (nodeData.status !== "pending" || fetchedRef.current) return;
    fetchedRef.current = true;

    updateNodeData(id, { status: "processing" });

    fetch("/api/youtube", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: nodeData.url }),
    })
      .then(async (res) => {
        const json = await res.json();
        if (!res.ok) {
          setErrorMsg(json.error || "Failed to fetch transcript");
          updateNodeData(id, { status: "failed" });
          return;
        }
        updateNodeData(id, {
          title: json.title,
          channel: json.channel,
          thumbnail: json.thumbnail,
          transcript: json.transcript,
          status: "completed",
        });
      })
      .catch(() => {
        setErrorMsg("Network error");
        updateNodeData(id, { status: "failed" });
      });
  }, [nodeData.status, nodeData.url, id, updateNodeData]);

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
              if (status === "completed" && nodeData.transcript) {
                setSheetOpen(true);
              }
            }}
          >
        {status === "completed" && nodeData.thumbnail ? (
          <div className="h-[120px] overflow-hidden relative">
            <img
              src={nodeData.thumbnail}
              alt={nodeData.title || "YouTube video"}
              className="w-full h-full object-cover"
              draggable={false}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="size-10 rounded-full bg-red-600/90 flex items-center justify-center">
                <Play className="size-4 text-white ml-0.5" fill="white" />
              </div>
            </div>
          </div>
        ) : (
          <div className="h-[120px] bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center">
            {status === "failed" ? (
              <AlertCircle className="size-10 text-red-400" />
            ) : (
              <Loader2 className="size-8 text-red-400 animate-spin" />
            )}
          </div>
        )}

        <div className="p-3">
          {status === "completed" ? (
            <>
              <h4 className="font-heading text-sm font-semibold leading-tight line-clamp-2">
                {nodeData.title}
              </h4>
              <p className="font-sans text-xs text-muted-foreground mt-1">
                {nodeData.channel}
              </p>
              <div className="flex items-center gap-1.5 mt-2">
                <CheckCircle className="size-3 text-emerald-500" />
                <span className="font-sans text-[11px] text-emerald-600 font-medium">
                  Transcript ready
                </span>
              </div>
            </>
          ) : status === "failed" ? (
            <>
              <p className="font-sans text-xs text-red-600 leading-relaxed">
                {errorMsg || "Failed to fetch transcript"}
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
              <h4 className="font-heading text-sm font-semibold leading-tight text-muted-foreground">
                Fetching transcript...
              </h4>
              <p className="font-sans text-xs text-muted-foreground mt-1">
                This may take a moment
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
          {status === "completed" && nodeData.transcript && (
            <ContextMenuItem onClick={() => setSheetOpen(true)}>
              <FileText className="size-4 mr-2" />
              View Transcript
            </ContextMenuItem>
          )}
          {nodeData.url && (
            <ContextMenuItem
              onClick={() => window.open(nodeData.url, "_blank")}
            >
              <ExternalLink className="size-4 mr-2" />
              Open on YouTube
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
              {nodeData.title || "Transcript"}
            </SheetTitle>
          </SheetHeader>
          <div className="mt-4">
            {nodeData.channel && (
              <p className="font-sans text-sm text-muted-foreground mb-4">
                {nodeData.channel}
              </p>
            )}
            <p className="font-sans text-sm leading-relaxed text-primary whitespace-pre-wrap">
              {nodeData.transcript}
            </p>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
