import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { BoardCanvas } from "./board-canvas";

export default async function BoardPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: board } = await supabase
    .from("boards")
    .select("id, name, user_id")
    .eq("id", id)
    .single();

  if (!board || board.user_id !== user.id) {
    redirect("/dashboard");
  }

  return <BoardCanvas boardId={board.id} initialBoardName={board.name} />;
}
