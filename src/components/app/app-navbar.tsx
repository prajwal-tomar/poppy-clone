"use client";

import Link from "next/link";
import { Search, Settings, CreditCard, LogOut } from "lucide-react";
import { Logo } from "@/components/app/logo";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function AppNavbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-border">
      <div className="mx-auto max-w-7xl flex items-center justify-between px-6 py-3">
        <div className="flex items-center gap-6">
          <Logo href="/dashboard" />
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder="Search boards..."
              className="w-64 pl-9 h-9 rounded-full bg-secondary border-none text-sm placeholder:text-muted-foreground"
            />
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="outline-none">
              <Avatar className="size-8 cursor-pointer hover:opacity-80 transition-opacity">
                <AvatarFallback className="bg-primary text-primary-foreground text-xs font-medium">
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
    </nav>
  );
}
