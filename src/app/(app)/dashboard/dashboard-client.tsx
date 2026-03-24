"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Plus,
  MoreHorizontal,
  Pencil,
  Copy,
  Trash2,
  LayoutDashboard,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { UpgradeModal } from "@/components/app/upgrade-modal";
import { OnboardingModal } from "@/components/app/onboarding-modal";
import {
  createBoard,
  renameBoard,
  duplicateBoard,
  deleteBoard,
} from "@/lib/actions/board-actions";
import type { Board } from "@/types/board";

const GRADIENTS = [
  "from-violet-100 to-blue-100",
  "from-amber-100 to-orange-100",
  "from-emerald-100 to-teal-100",
  "from-rose-100 to-pink-100",
  "from-cyan-100 to-sky-100",
  "from-lime-100 to-green-100",
  "from-fuchsia-100 to-purple-100",
  "from-yellow-100 to-amber-100",
];

function getGradient(index: number) {
  return GRADIENTS[index % GRADIENTS.length];
}

interface DashboardClientProps {
  boards: Board[];
  boardCount: number;
  boardLimit: number | null;
  displayName: string | null;
}

export function DashboardClient({
  boards,
  boardCount,
  boardLimit,
  displayName,
}: DashboardClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [boardToDelete, setBoardToDelete] = useState<Board | null>(null);
  const [renameDialogOpen, setRenameDialogOpen] = useState(false);
  const [boardToRename, setBoardToRename] = useState<Board | null>(null);
  const [renameValue, setRenameValue] = useState("");

  const isPro = boardLimit === null;

  const handleNewBoard = () => {
    if (!isPro && boardCount >= (boardLimit ?? 3)) {
      setUpgradeOpen(true);
      return;
    }

    startTransition(async () => {
      const result = await createBoard();
      if ("error" in result) {
        toast.error(result.error);
        return;
      }
      router.push(`/board/${result.id}`);
    });
  };

  const handleRename = (board: Board) => {
    setBoardToRename(board);
    setRenameValue(board.name);
    setRenameDialogOpen(true);
  };

  const confirmRename = () => {
    if (!boardToRename || !renameValue.trim()) return;

    startTransition(async () => {
      const result = await renameBoard(boardToRename.id, renameValue.trim());
      if (!result.success) {
        toast.error(result.error ?? "Failed to rename board");
        return;
      }
      setRenameDialogOpen(false);
      setBoardToRename(null);
      router.refresh();
    });
  };

  const handleDuplicate = (board: Board) => {
    startTransition(async () => {
      const result = await duplicateBoard(board.id);
      if ("error" in result) {
        toast.error(result.error);
        return;
      }
      toast.success("Board duplicated");
      router.refresh();
    });
  };

  const handleDelete = (board: Board) => {
    setBoardToDelete(board);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (!boardToDelete) return;

    startTransition(async () => {
      const result = await deleteBoard(boardToDelete.id);
      if (!result.success) {
        toast.error(result.error ?? "Failed to delete board");
        return;
      }
      setDeleteDialogOpen(false);
      setBoardToDelete(null);
      router.refresh();
    });
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
          disabled={isPending}
          className="rounded-full bg-primary text-primary-foreground hover:bg-[#333333] px-5 py-2.5 text-sm font-medium gap-2"
        >
          <Plus className="size-4" />
          New Board
        </Button>
      </div>

      {!isPro && (
        <p className="font-sans text-sm text-muted-foreground mb-8">
          {boardCount} of {boardLimit} boards used
        </p>
      )}
      {isPro && (
        <p className="font-sans text-sm text-muted-foreground mb-8">
          {boardCount} {boardCount === 1 ? "board" : "boards"}
        </p>
      )}

      {boards.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="size-16 rounded-full bg-secondary flex items-center justify-center mb-6">
            <LayoutDashboard className="size-7 text-muted-foreground" />
          </div>
          <h2 className="font-heading text-[24px] font-semibold leading-[1.3] mb-2">
            No boards yet
          </h2>
          <p className="font-sans text-sm text-muted-foreground mb-6 max-w-md">
            Create your first board to get started. Drop in YouTube videos, PDFs,
            and more — then use AI to research and write.
          </p>
          <Button
            onClick={handleNewBoard}
            disabled={isPending}
            className="rounded-full bg-primary text-primary-foreground hover:bg-[#333333] px-5 py-2.5 text-sm font-medium gap-2"
          >
            <Plus className="size-4" />
            Create Your First Board
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {boards.map((board, index) => (
            <div key={board.id} className="group relative">
              <Link
                href={`/board/${board.id}`}
                className="block bg-white border border-border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
              >
                <div
                  className={`h-36 bg-gradient-to-br ${getGradient(index)} flex items-center justify-center`}
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
                    Edited{" "}
                    {formatDistanceToNow(new Date(board.updated_at), {
                      addSuffix: true,
                    })}
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
                    <DropdownMenuItem
                      className="cursor-pointer"
                      onClick={(e) => {
                        e.preventDefault();
                        handleRename(board);
                      }}
                    >
                      <Pencil className="size-4 mr-2" />
                      Rename
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="cursor-pointer"
                      onClick={(e) => {
                        e.preventDefault();
                        handleDuplicate(board);
                      }}
                    >
                      <Copy className="size-4 mr-2" />
                      Duplicate
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="cursor-pointer text-destructive focus:text-destructive"
                      onClick={(e) => {
                        e.preventDefault();
                        handleDelete(board);
                      }}
                    >
                      <Trash2 className="size-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}
        </div>
      )}

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Delete &ldquo;{boardToDelete?.name}&rdquo;?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this board and all its nodes,
              connections, and chat messages. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={renameDialogOpen} onOpenChange={setRenameDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Rename Board</DialogTitle>
          </DialogHeader>
          <Input
            value={renameValue}
            onChange={(e) => setRenameValue(e.target.value)}
            placeholder="Board name"
            className="mt-2"
            onKeyDown={(e) => {
              if (e.key === "Enter") confirmRename();
            }}
            autoFocus
          />
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setRenameDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={confirmRename}
              disabled={isPending || !renameValue.trim()}
              className="bg-primary text-primary-foreground hover:bg-[#333333]"
            >
              Rename
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
