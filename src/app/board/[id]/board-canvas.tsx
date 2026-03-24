"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ReactFlow,
  ReactFlowProvider,
  useReactFlow,
  Background,
  Controls,
  MiniMap,
  type NodeTypes,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useDropzone, type FileRejection } from "react-dropzone";
import { toast } from "sonner";
import {
  ArrowLeft,
  Settings,
  CreditCard,
  LogOut,
  Check,
  Loader2,
  Upload,
} from "lucide-react";
import type { User } from "@supabase/supabase-js";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UpgradeModal } from "@/components/app/upgrade-modal";
import { usePlan } from "@/components/app/plan-provider";
import { CanvasToolbar } from "@/components/app/canvas-toolbar";
import { YouTubeNode } from "@/components/nodes/youtube-node";
import { PDFNode } from "@/components/nodes/pdf-node";
import { ImageNode } from "@/components/nodes/image-node";
import { VoiceNoteNode } from "@/components/nodes/voice-note-node";
import { TextEditorNode } from "@/components/nodes/text-editor-node";
import { AIChatNode } from "@/components/nodes/ai-chat-node";
import { useBoardStore } from "@/stores/board-store";
import { renameBoard } from "@/lib/actions/board-actions";
import { uploadPDF, uploadImage, uploadAudio } from "@/lib/actions/file-actions";
import { createClient } from "@/lib/supabase/client";

const nodeTypes: NodeTypes = {
  youtube: YouTubeNode,
  pdf: PDFNode,
  image: ImageNode,
  voiceNote: VoiceNoteNode,
  textEditor: TextEditorNode,
  aiChat: AIChatNode,
};

function getInitials(user: User | null): string {
  if (!user) return "?";
  const meta = user.user_metadata;
  if (meta?.full_name) {
    return meta.full_name
      .split(" ")
      .map((n: string) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }
  if (user.email) {
    return user.email.slice(0, 2).toUpperCase();
  }
  return "?";
}

interface BoardCanvasProps {
  boardId: string;
  initialBoardName: string;
}

function BoardCanvasInner({ boardId, initialBoardName }: BoardCanvasProps) {
  const router = useRouter();
  const { isPro } = usePlan();
  const { screenToFlowPosition } = useReactFlow();
  const [user, setUser] = useState<User | null>(null);
  const [isEditingName, setIsEditingName] = useState(false);
  const [editName, setEditName] = useState(initialBoardName);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const [aiUsage, setAiUsage] = useState<{
    used: number;
    limit: number;
  } | null>(null);
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const [upgradeHeadline, setUpgradeHeadline] = useState("");
  const [isDroppingFiles, setIsDroppingFiles] = useState(false);

  const {
    nodes,
    edges,
    isLoading,
    isSaving,
    saveError,
    boardName,
    loadBoard,
    onNodesChange,
    onEdgesChange,
    onConnect,
    addNode,
    renameBoardLocal,
    reset,
  } = useBoardStore();

  useEffect(() => {
    loadBoard(boardId);
    return () => {
      reset();
    };
  }, [boardId, loadBoard, reset]);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      if (data.user) {
        supabase
          .rpc("get_ai_usage_today", { p_user_id: data.user.id })
          .then(({ data: usage }) => {
            if (usage) {
              const parsed = usage as { used: number; limit: number };
              setAiUsage(parsed);
            }
          });
      }
    });
  }, []);

  useEffect(() => {
    renameBoardLocal(initialBoardName);
    setEditName(initialBoardName);
  }, [initialBoardName, renameBoardLocal]);

  const handleFileDrop = useCallback(
    async (acceptedFiles: File[]) => {
      setIsDroppingFiles(false);

      for (const file of acceptedFiles) {
        const center = screenToFlowPosition({
          x: window.innerWidth / 2,
          y: window.innerHeight / 2,
        });

        const formData = new FormData();
        formData.append("file", file);

        if (file.type === "application/pdf") {
          const result = await uploadPDF(formData);
          if ("error" in result) {
            toast.error(result.error);
            continue;
          }
          await addNode("pdf", { x: center.x - 140, y: center.y - 100 }, {
            fileUrl: result.url,
            fileName: file.name,
            status: "pending",
          });
        } else if (file.type.startsWith("image/")) {
          if (!isPro) {
            setUpgradeHeadline("Image upload is a Pro feature.");
            setUpgradeOpen(true);
            return;
          }
          const result = await uploadImage(formData);
          if ("error" in result) {
            toast.error(result.error);
            continue;
          }
          await addNode("image", { x: center.x - 140, y: center.y - 100 }, {
            fileUrl: result.url,
            fileName: file.name,
          });
        } else if (file.type.startsWith("audio/")) {
          if (!isPro) {
            setUpgradeHeadline("Voice notes are a Pro feature.");
            setUpgradeOpen(true);
            return;
          }
          const result = await uploadAudio(formData);
          if ("error" in result) {
            toast.error(result.error);
            continue;
          }
          await addNode("voiceNote", { x: center.x - 130, y: center.y - 70 }, {
            fileUrl: result.url,
            fileName: file.name,
            status: "transcribing",
          });
        }
      }
    },
    [screenToFlowPosition, addNode, isPro]
  );

  const handleDropRejected = useCallback((rejections: FileRejection[]) => {
    setIsDroppingFiles(false);
    if (rejections.length > 0) {
      toast.error("This file type isn't supported yet.");
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    noClick: true,
    noKeyboard: true,
    onDrop: handleFileDrop,
    onDropRejected: handleDropRejected,
    onDragEnter: () => setIsDroppingFiles(true),
    onDragLeave: () => setIsDroppingFiles(false),
    accept: {
      "application/pdf": [".pdf"],
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
      "image/gif": [".gif"],
      "image/webp": [".webp"],
      "audio/mpeg": [".mp3"],
      "audio/mp4": [".m4a"],
      "audio/wav": [".wav"],
      "audio/webm": [".webm"],
      "audio/ogg": [".ogg"],
    },
  });

  const handleNameClick = useCallback(() => {
    setIsEditingName(true);
    setEditName(boardName);
    setTimeout(() => nameInputRef.current?.select(), 0);
  }, [boardName]);

  const handleNameSave = useCallback(async () => {
    setIsEditingName(false);
    const trimmed = editName.trim();
    if (!trimmed || trimmed === boardName) {
      setEditName(boardName);
      return;
    }
    renameBoardLocal(trimmed);
    await renameBoard(boardId, trimmed);
  }, [editName, boardName, boardId, renameBoardLocal]);

  const handleSignOut = useCallback(async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }, [router]);

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
          <p className="font-sans text-sm text-muted-foreground">
            Loading board...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-background">
      <div className="h-12 border-b border-border bg-white flex items-center justify-between px-4 shrink-0 z-10">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="size-8 flex items-center justify-center rounded-md hover:bg-secondary transition-colors"
          >
            <ArrowLeft className="size-4 text-muted-foreground" />
          </Link>
          <div className="w-px h-5 bg-border" />

          {isEditingName ? (
            <input
              ref={nameInputRef}
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              onBlur={handleNameSave}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleNameSave();
                if (e.key === "Escape") {
                  setEditName(boardName);
                  setIsEditingName(false);
                }
              }}
              className="font-heading text-sm font-semibold bg-transparent border border-border rounded px-2 py-0.5 outline-none focus:border-primary w-48"
              autoFocus
            />
          ) : (
            <button
              onClick={handleNameClick}
              className="font-heading text-sm font-semibold hover:bg-secondary rounded px-2 py-0.5 transition-colors"
            >
              {boardName || "Untitled Board"}
            </button>
          )}

          <div className="flex items-center gap-1.5 ml-2">
            {isSaving && (
              <span className="flex items-center gap-1 font-sans text-[11px] text-muted-foreground">
                <Loader2 className="size-3 animate-spin" />
                Saving...
              </span>
            )}
            {!isSaving && !saveError && boardName && (
              <span className="flex items-center gap-1 font-sans text-[11px] text-muted-foreground">
                <Check className="size-3" />
                Saved
              </span>
            )}
            {saveError && (
              <span className="font-sans text-[11px] text-destructive">
                {saveError}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {aiUsage && (
            <span className="font-sans text-xs text-muted-foreground bg-secondary rounded-full px-3 py-1">
              {aiUsage.used} / {aiUsage.limit} AI messages today
            </span>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="outline-none">
                <Avatar className="size-7 cursor-pointer hover:opacity-80 transition-opacity">
                  <AvatarFallback className="bg-primary text-primary-foreground text-[10px] font-medium">
                    {getInitials(user)}
                  </AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem asChild>
                <Link href="/settings" className="cursor-pointer">
                  <Settings className="size-4 mr-2" />
                  Account Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/billing" className="cursor-pointer">
                  <CreditCard className="size-4 mr-2" />
                  Billing
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleSignOut}
                className="cursor-pointer"
              >
                <LogOut className="size-4 mr-2" />
                Log Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="flex-1 relative" {...getRootProps()}>
        <input {...getInputProps()} />

        {isDragActive && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-3 rounded-xl border-2 border-dashed border-primary/40 px-12 py-10">
              <Upload className="size-8 text-muted-foreground" />
              <p className="font-sans text-sm font-medium text-muted-foreground">
                Drop to add to your board
              </p>
            </div>
          </div>
        )}

        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.3 }}
          className="bg-background"
        >
          <Background gap={20} size={1} color="#E5E5E5" />
          <Controls
            position="bottom-right"
            className="!bg-white !border-border !rounded-lg !shadow-md"
          />
          <MiniMap
            position="bottom-right"
            className="!bg-white !border-border !rounded-lg !shadow-sm"
            style={{ marginBottom: 80 }}
            nodeColor="#F2F0EB"
            maskColor="rgba(253, 251, 247, 0.7)"
          />
        </ReactFlow>

        <CanvasToolbar />

        <UpgradeModal
          open={upgradeOpen}
          onOpenChange={setUpgradeOpen}
          headline={upgradeHeadline}
        />
      </div>
    </div>
  );
}

export function BoardCanvas(props: BoardCanvasProps) {
  return (
    <ReactFlowProvider>
      <BoardCanvasInner {...props} />
    </ReactFlowProvider>
  );
}
