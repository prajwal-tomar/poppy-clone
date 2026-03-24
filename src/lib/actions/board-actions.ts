"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import type { Board, Profile } from "@/types/board";
import type { DbNode, DbEdge } from "@/types/node";

async function getAuthenticatedUser() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error || !user) {
    throw new Error("Not authenticated");
  }
  return { supabase, user };
}

export async function getBoards(): Promise<Board[]> {
  const { supabase } = await getAuthenticatedUser();

  const { data, error } = await supabase
    .from("boards")
    .select("*")
    .order("updated_at", { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch boards: ${error.message}`);
  }

  return data ?? [];
}

export async function getBoard(
  boardId: string
): Promise<{
  board: Board;
  nodes: DbNode[];
  edges: DbEdge[];
} | null> {
  const { supabase } = await getAuthenticatedUser();

  const { data, error } = await supabase
    .from("boards")
    .select("*, nodes(*), edges(*)")
    .eq("id", boardId)
    .single();

  if (error || !data) {
    return null;
  }

  const { nodes, edges, ...board } = data;

  return {
    board: board as Board,
    nodes: (nodes as DbNode[]) ?? [],
    edges: (edges as DbEdge[]) ?? [],
  };
}

const createBoardSchema = z.object({
  name: z.string().min(1).max(100).optional(),
});

export async function createBoard(
  name?: string
): Promise<{ id: string } | { error: string }> {
  const { supabase, user } = await getAuthenticatedUser();

  const parsed = createBoardSchema.safeParse({ name });
  if (!parsed.success) {
    return { error: "Invalid board name" };
  }

  const { data: canCreate } = await supabase.rpc("can_create_board", {
    p_user_id: user.id,
  });

  if (!canCreate) {
    return { error: "Board limit reached. Upgrade to Pro for unlimited boards." };
  }

  const { data, error } = await supabase
    .from("boards")
    .insert({
      user_id: user.id,
      name: parsed.data?.name || "Untitled Board",
    })
    .select("id")
    .single();

  if (error || !data) {
    return { error: `Failed to create board: ${error?.message}` };
  }

  revalidatePath("/dashboard");
  return { id: data.id };
}

const renameBoardSchema = z.object({
  boardId: z.string().uuid(),
  name: z.string().min(1).max(100),
});

export async function renameBoard(
  boardId: string,
  name: string
): Promise<{ success: boolean; error?: string }> {
  const { supabase } = await getAuthenticatedUser();

  const parsed = renameBoardSchema.safeParse({ boardId, name });
  if (!parsed.success) {
    return { success: false, error: "Invalid input" };
  }

  const { error } = await supabase
    .from("boards")
    .update({ name: parsed.data.name })
    .eq("id", parsed.data.boardId);

  if (error) {
    return { success: false, error: `Failed to rename board: ${error.message}` };
  }

  revalidatePath("/dashboard");
  return { success: true };
}

export async function duplicateBoard(
  boardId: string
): Promise<{ id: string } | { error: string }> {
  const { supabase, user } = await getAuthenticatedUser();

  const { data: canCreate } = await supabase.rpc("can_create_board", {
    p_user_id: user.id,
  });

  if (!canCreate) {
    return { error: "Board limit reached. Upgrade to Pro for unlimited boards." };
  }

  const boardData = await getBoard(boardId);
  if (!boardData) {
    return { error: "Board not found" };
  }

  const { board, nodes, edges } = boardData;

  const { data: newBoard, error: boardError } = await supabase
    .from("boards")
    .insert({
      user_id: user.id,
      name: `${board.name} (Copy)`,
    })
    .select("id")
    .single();

  if (boardError || !newBoard) {
    return { error: `Failed to duplicate board: ${boardError?.message}` };
  }

  if (nodes.length > 0) {
    const nodeIdMap = new Map<string, string>();

    const newNodes = nodes.map((node) => {
      const newId = crypto.randomUUID();
      nodeIdMap.set(node.id, newId);
      return {
        id: newId,
        board_id: newBoard.id,
        type: node.type,
        position_x: node.position_x,
        position_y: node.position_y,
        width: node.width,
        height: node.height,
        data: node.data,
        z_index: node.z_index,
      };
    });

    const { error: nodesError } = await supabase
      .from("nodes")
      .insert(newNodes);

    if (nodesError) {
      await supabase.from("boards").delete().eq("id", newBoard.id);
      return { error: `Failed to duplicate nodes: ${nodesError.message}` };
    }

    if (edges.length > 0) {
      const newEdges = edges.map((edge) => ({
        board_id: newBoard.id,
        source_node_id: nodeIdMap.get(edge.source_node_id) ?? edge.source_node_id,
        target_node_id: nodeIdMap.get(edge.target_node_id) ?? edge.target_node_id,
        source_handle: edge.source_handle,
        target_handle: edge.target_handle,
      }));

      const { error: edgesError } = await supabase
        .from("edges")
        .insert(newEdges);

      if (edgesError) {
        await supabase.from("boards").delete().eq("id", newBoard.id);
        return { error: `Failed to duplicate edges: ${edgesError.message}` };
      }
    }
  }

  revalidatePath("/dashboard");
  return { id: newBoard.id };
}

export async function deleteBoard(
  boardId: string
): Promise<{ success: boolean; error?: string }> {
  const { supabase } = await getAuthenticatedUser();

  const { error } = await supabase
    .from("boards")
    .delete()
    .eq("id", boardId);

  if (error) {
    return { success: false, error: `Failed to delete board: ${error.message}` };
  }

  revalidatePath("/dashboard");
  return { success: true };
}

export async function getBoardCount(): Promise<{
  count: number;
  limit: number | null;
}> {
  const { supabase, user } = await getAuthenticatedUser();

  const { count, error } = await supabase
    .from("boards")
    .select("*", { count: "exact", head: true });

  if (error) {
    throw new Error(`Failed to get board count: ${error.message}`);
  }

  const { data: sub } = await supabase
    .from("subscriptions")
    .select("plan")
    .eq("user_id", user.id)
    .eq("status", "active")
    .single();

  return {
    count: count ?? 0,
    limit: sub?.plan === "pro" ? null : 3,
  };
}

export async function getUserProfile(): Promise<Profile | null> {
  const { supabase, user } = await getAuthenticatedUser();

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error) {
    return null;
  }

  return data;
}

export async function createBoardAndRedirect(name?: string) {
  const result = await createBoard(name);
  if ("error" in result) {
    return result;
  }
  redirect(`/board/${result.id}`);
}
