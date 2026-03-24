import { create } from "zustand";
import {
  applyNodeChanges,
  applyEdgeChanges,
  type Node,
  type Edge,
  type OnNodesChange,
  type OnEdgesChange,
  type OnConnect,
  type XYPosition,
  type NodeChange,
} from "@xyflow/react";
import { createClient } from "@/lib/supabase/client";
import { getBoard } from "@/lib/actions/board-actions";
import type { NodeType } from "@/types/node";
import { dbTypeToRFType, rfTypeToDbType } from "@/types/node";
import type { Json } from "@/types/database";

interface BoardState {
  boardId: string | null;
  boardName: string;
  nodes: Node[];
  edges: Edge[];
  isLoading: boolean;
  isSaving: boolean;
  saveError: string | null;

  loadBoard: (boardId: string) => Promise<void>;
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  addNode: (
    type: string,
    position: XYPosition,
    data?: Record<string, unknown>
  ) => Promise<string | null>;
  updateNodeData: (
    nodeId: string,
    data: Record<string, unknown>
  ) => void;
  removeNode: (nodeId: string) => Promise<void>;
  removeEdge: (edgeId: string) => Promise<void>;
  renameBoardLocal: (name: string) => void;
  reset: () => void;
}

let positionSaveTimer: ReturnType<typeof setTimeout> | null = null;
let dataSaveTimers: Map<string, ReturnType<typeof setTimeout>> = new Map();
const dirtyNodes = new Set<string>();

function flushPositionUpdates(
  nodes: Node[],
  boardId: string | null,
  set: (partial: Partial<BoardState>) => void
) {
  if (dirtyNodes.size === 0 || !boardId) return;

  const nodesToUpdate = nodes.filter((n) => dirtyNodes.has(n.id));
  dirtyNodes.clear();

  if (nodesToUpdate.length === 0) return;

  set({ isSaving: true });

  const supabase = createClient();

  const updates = nodesToUpdate.map((node) =>
    supabase
      .from("nodes")
      .update({
        position_x: node.position.x,
        position_y: node.position.y,
        width: node.measured?.width ?? node.width ?? null,
        height: node.measured?.height ?? node.height ?? null,
      })
      .eq("id", node.id)
  );

  Promise.all(updates)
    .then((results) => {
      const failed = results.find((r) => r.error);
      if (failed?.error) {
        set({ isSaving: false, saveError: `Save failed: ${failed.error.message}` });
      } else {
        set({ isSaving: false, saveError: null });
      }
    })
    .catch(() => {
      set({ isSaving: false, saveError: "Save failed: network error" });
    });
}

export const useBoardStore = create<BoardState>((set, get) => ({
  boardId: null,
  boardName: "",
  nodes: [],
  edges: [],
  isLoading: false,
  isSaving: false,
  saveError: null,

  loadBoard: async (boardId: string) => {
    set({ isLoading: true, boardId, nodes: [], edges: [] });

    try {
      const result = await getBoard(boardId);

      if (!result) {
        set({ isLoading: false });
        return;
      }

      const { board, nodes: dbNodes, edges: dbEdges } = result;

      const rfNodes: Node[] = dbNodes.map((dbNode) => ({
        id: dbNode.id,
        type: dbTypeToRFType(dbNode.type),
        position: { x: dbNode.position_x, y: dbNode.position_y },
        data: (dbNode.data as Record<string, unknown>) ?? {},
        ...(dbNode.width != null && { width: dbNode.width }),
        ...(dbNode.height != null && { height: dbNode.height }),
        zIndex: dbNode.z_index,
      }));

      const rfEdges: Edge[] = dbEdges.map((dbEdge) => ({
        id: dbEdge.id,
        source: dbEdge.source_node_id,
        target: dbEdge.target_node_id,
        sourceHandle: dbEdge.source_handle,
        targetHandle: dbEdge.target_handle,
        style: { stroke: "#EAEAEA", strokeWidth: 2 },
      }));

      set({
        boardName: board.name,
        nodes: rfNodes,
        edges: rfEdges,
        isLoading: false,
      });
    } catch {
      set({ isLoading: false });
    }
  },

  onNodesChange: (changes: NodeChange[]) => {
    const state = get();

    const newNodes = applyNodeChanges(changes, state.nodes);
    set({ nodes: newNodes });

    const hasPositionChange = changes.some(
      (c) => c.type === "position" && c.dragging === false
    );
    const hasDimensionChange = changes.some(
      (c) => c.type === "dimensions"
    );

    if (hasPositionChange || hasDimensionChange) {
      for (const change of changes) {
        if (
          (change.type === "position" && change.dragging === false) ||
          change.type === "dimensions"
        ) {
          dirtyNodes.add(change.id);
        }
      }

      if (positionSaveTimer) clearTimeout(positionSaveTimer);
      positionSaveTimer = setTimeout(() => {
        const currentState = get();
        flushPositionUpdates(currentState.nodes, currentState.boardId, set);
      }, 1000);
    }

    const removeChanges = changes.filter((c) => c.type === "remove");
    if (removeChanges.length > 0 && state.boardId) {
      const supabase = createClient();
      for (const change of removeChanges) {
        if (change.type === "remove") {
          supabase.from("nodes").delete().eq("id", change.id).then(() => {});
        }
      }
    }
  },

  onEdgesChange: (changes) => {
    const state = get();
    const newEdges = applyEdgeChanges(changes, state.edges);
    set({ edges: newEdges });

    const removeChanges = changes.filter((c) => c.type === "remove");
    if (removeChanges.length > 0 && state.boardId) {
      const supabase = createClient();
      for (const change of removeChanges) {
        if (change.type === "remove") {
          supabase.from("edges").delete().eq("id", change.id).then(() => {});
        }
      }
    }
  },

  onConnect: (connection) => {
    const state = get();
    if (!state.boardId) return;

    const supabase = createClient();

    supabase
      .from("edges")
      .insert({
        board_id: state.boardId,
        source_node_id: connection.source!,
        target_node_id: connection.target!,
        source_handle: connection.sourceHandle,
        target_handle: connection.targetHandle,
      })
      .select("id")
      .single()
      .then(({ data, error }) => {
        if (error || !data) return;

        const newEdge: Edge = {
          id: data.id,
          source: connection.source!,
          target: connection.target!,
          sourceHandle: connection.sourceHandle,
          targetHandle: connection.targetHandle,
          style: { stroke: "#EAEAEA", strokeWidth: 2 },
        };

        set({ edges: [...get().edges, newEdge] });
      });
  },

  addNode: async (type, position, data = {}) => {
    const state = get();
    if (!state.boardId) return null;

    const supabase = createClient();
    const dbType = rfTypeToDbType(type);

    const { data: inserted, error } = await supabase
      .from("nodes")
      .insert({
        board_id: state.boardId,
        type: dbType,
        position_x: position.x,
        position_y: position.y,
        data: data as Json,
      })
      .select()
      .single();

    if (error || !inserted) return null;

    const rfNode: Node = {
      id: inserted.id,
      type,
      position: { x: inserted.position_x, y: inserted.position_y },
      data: (inserted.data as Record<string, unknown>) ?? {},
    };

    set({ nodes: [...get().nodes, rfNode] });
    return inserted.id;
  },

  updateNodeData: (nodeId, data) => {
    set({
      nodes: get().nodes.map((n) =>
        n.id === nodeId ? { ...n, data: { ...n.data, ...data } } : n
      ),
    });

    const existingTimer = dataSaveTimers.get(nodeId);
    if (existingTimer) clearTimeout(existingTimer);

    const timer = setTimeout(() => {
      const state = get();
      const node = state.nodes.find((n) => n.id === nodeId);
      if (!node) return;

      const supabase = createClient();
      set({ isSaving: true });

      supabase
        .from("nodes")
        .update({ data: node.data as Json })
        .eq("id", nodeId)
        .then(({ error }) => {
          if (error) {
            set({ isSaving: false, saveError: `Save failed: ${error.message}` });
          } else {
            set({ isSaving: false, saveError: null });
          }
        });

      dataSaveTimers.delete(nodeId);
    }, 1000);

    dataSaveTimers.set(nodeId, timer);
  },

  removeNode: async (nodeId) => {
    const state = get();
    if (!state.boardId) return;

    const supabase = createClient();
    await supabase.from("nodes").delete().eq("id", nodeId);

    set({
      nodes: get().nodes.filter((n) => n.id !== nodeId),
      edges: get().edges.filter(
        (e) => e.source !== nodeId && e.target !== nodeId
      ),
    });
  },

  removeEdge: async (edgeId) => {
    const state = get();
    if (!state.boardId) return;

    const supabase = createClient();
    await supabase.from("edges").delete().eq("id", edgeId);

    set({ edges: get().edges.filter((e) => e.id !== edgeId) });
  },

  renameBoardLocal: (name) => {
    set({ boardName: name });
  },

  reset: () => {
    if (positionSaveTimer) clearTimeout(positionSaveTimer);
    dataSaveTimers.forEach((timer) => clearTimeout(timer));
    dataSaveTimers.clear();
    dirtyNodes.clear();

    set({
      boardId: null,
      boardName: "",
      nodes: [],
      edges: [],
      isLoading: false,
      isSaving: false,
      saveError: null,
    });
  },
}));
