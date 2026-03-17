"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus, MoreHorizontal, Pencil, Copy, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UpgradeModal } from "@/components/app/upgrade-modal";
import { OnboardingModal } from "@/components/app/onboarding-modal";
import { usePlan } from "@/components/app/plan-provider";

const boards = [
  {
    id: "board-1",
    name: "Q2 Content Strategy",
    editedAt: "Edited 2 hours ago",
    gradient: "from-violet-100 to-blue-100",
  },
  {
    id: "board-2",
    name: "Product Launch Research",
    editedAt: "Edited yesterday",
    gradient: "from-amber-100 to-orange-100",
  },
  {
    id: "board-3",
    name: "Weekly Newsletter",
    editedAt: "Edited 3 days ago",
    gradient: "from-emerald-100 to-teal-100",
  },
];

export default function DashboardPage() {
  const { isPro } = usePlan();
  const router = useRouter();
  const [upgradeOpen, setUpgradeOpen] = useState(false);

  const FREE_BOARD_LIMIT = 3;

  const handleNewBoard = () => {
    if (isPro || boards.length < FREE_BOARD_LIMIT) {
      router.push(`/board/new-board-${Date.now()}`);
    } else {
      setUpgradeOpen(true);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      <OnboardingModal />
      <UpgradeModal
        open={upgradeOpen}
        onOpenChange={setUpgradeOpen}
        headline="You've reached the free board limit."
      />

      <div className="flex items-center justify-between mb-1">
        <h1 className="font-heading text-[40px] font-bold leading-[1.2]">
          Your Boards
        </h1>
        <Button
          onClick={handleNewBoard}
          className="rounded-full bg-primary text-primary-foreground hover:bg-[#333333] px-5 py-2.5 text-sm font-medium gap-2"
        >
          <Plus className="size-4" />
          New Board
        </Button>
      </div>

      {!isPro && (
        <p className="font-sans text-sm text-muted-foreground mb-8">
          2 of 3 boards used
        </p>
      )}
      {isPro && (
        <p className="font-sans text-sm text-muted-foreground mb-8">
          {boards.length} boards
        </p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {boards.map((board) => (
          <div key={board.id} className="group relative">
            <Link
              href={`/board/${board.id}`}
              className="block bg-white border border-border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
            >
              <div
                className={`h-36 bg-gradient-to-br ${board.gradient} flex items-center justify-center`}
              >
                <div className="flex gap-2 opacity-40">
                  <div className="w-16 h-10 bg-white/60 rounded" />
                  <div className="w-12 h-14 bg-white/60 rounded" />
                  <div className="w-14 h-12 bg-white/60 rounded" />
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-heading text-[16px] font-semibold leading-[1.3] truncate">
                  {board.name}
                </h3>
                <p className="font-sans text-xs text-muted-foreground mt-1">
                  {board.editedAt}
                </p>
              </div>
            </Link>

            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="size-8 flex items-center justify-center rounded-md bg-white/90 border border-border hover:bg-white transition-colors">
                    <MoreHorizontal className="size-4 text-muted-foreground" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40">
                  <DropdownMenuItem className="cursor-pointer">
                    <Pencil className="size-4 mr-2" />
                    Rename
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer">
                    <Copy className="size-4 mr-2" />
                    Duplicate
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer text-destructive focus:text-destructive">
                    <Trash2 className="size-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
