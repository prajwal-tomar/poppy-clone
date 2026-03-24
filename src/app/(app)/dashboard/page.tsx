import { getBoards, getBoardCount, getUserProfile } from "@/lib/actions/board-actions";
import { DashboardClient } from "./dashboard-client";

export default async function DashboardPage() {
  const [boards, boardCountData, profile] = await Promise.all([
    getBoards(),
    getBoardCount(),
    getUserProfile(),
  ]);

  return (
    <DashboardClient
      boards={boards}
      boardCount={boardCountData.count}
      boardLimit={boardCountData.limit}
      displayName={profile?.display_name ?? null}
    />
  );
}
