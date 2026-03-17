"use client";

import { useCallback, useMemo } from "react";
import Link from "next/link";
import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  Controls,
  MiniMap,
  addEdge,
  type Node,
  type Edge,
  type NodeTypes,
  type Connection,
  useNodesState,
  useEdgesState,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import {
  ArrowLeft,
  Settings,
  CreditCard,
  LogOut,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { usePlan } from "@/components/app/plan-provider";
import { CanvasToolbar } from "@/components/app/canvas-toolbar";
import { YouTubeNode } from "@/components/nodes/youtube-node";
import { PDFNode } from "@/components/nodes/pdf-node";
import { ImageNode } from "@/components/nodes/image-node";
import { VoiceNoteNode } from "@/components/nodes/voice-note-node";
import { TextEditorNode } from "@/components/nodes/text-editor-node";
import { AIChatNode } from "@/components/nodes/ai-chat-node";

const initialNodes: Node[] = [
  {
    id: "youtube-1",
    type: "youtube",
    position: { x: 100, y: 100 },
    data: {},
  },
  {
    id: "pdf-1",
    type: "pdf",
    position: { x: 100, y: 380 },
    data: {},
  },
  {
    id: "ai-chat-1",
    type: "aiChat",
    position: { x: 500, y: 120 },
    data: {},
  },
  {
    id: "text-1",
    type: "textEditor",
    position: { x: 950, y: 150 },
    data: {},
  },
];

const initialEdges: Edge[] = [
  {
    id: "e-youtube-ai",
    source: "youtube-1",
    target: "ai-chat-1",
    style: { stroke: "#EAEAEA", strokeWidth: 2 },
  },
  {
    id: "e-pdf-ai",
    source: "pdf-1",
    target: "ai-chat-1",
    style: { stroke: "#EAEAEA", strokeWidth: 2 },
  },
];

const nodeTypes: NodeTypes = {
  youtube: YouTubeNode,
  pdf: PDFNode,
  image: ImageNode,
  voiceNote: VoiceNoteNode,
  textEditor: TextEditorNode,
  aiChat: AIChatNode,
};

function BoardCanvas() {
  const { isPro } = usePlan();
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (connection: Connection) => {
      setEdges((eds) =>
        addEdge(
          { ...connection, style: { stroke: "#EAEAEA", strokeWidth: 2 } },
          eds
        )
      );
    },
    [setEdges]
  );

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
          <h1 className="font-heading text-sm font-semibold">
            Q2 Content Strategy
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <span className="font-sans text-xs text-muted-foreground bg-secondary rounded-full px-3 py-1">
            12 / {isPro ? "200" : "30"} AI messages today
          </span>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="outline-none">
                <Avatar className="size-7 cursor-pointer hover:opacity-80 transition-opacity">
                  <AvatarFallback className="bg-primary text-primary-foreground text-[10px] font-medium">
                    PT
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
              <DropdownMenuItem asChild>
                <Link href="/" className="cursor-pointer">
                  <LogOut className="size-4 mr-2" />
                  Log Out
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="flex-1 relative">
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
      </div>
    </div>
  );
}

export default function BoardPage() {
  return (
    <ReactFlowProvider>
      <BoardCanvas />
    </ReactFlowProvider>
  );
}
