import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="mx-auto max-w-7xl flex items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex items-center justify-center size-8 rounded-lg bg-accent">
            <Sparkles className="size-4 text-white" />
          </div>
          <span className="font-heading text-xl font-bold text-primary">
            Thinkboard
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link
            href="#features"
            className="font-sans text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            Features
          </Link>
          <Link
            href="#how-it-works"
            className="font-sans text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            How It Works
          </Link>
          <Link
            href="#pricing"
            className="font-sans text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            Pricing
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="hidden sm:inline-flex font-sans text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            Log in
          </Link>
          <Button
            asChild
            className="rounded-full bg-primary text-primary-foreground hover:bg-[#333333] px-5 py-2.5 text-sm font-medium"
          >
            <Link href="/signup">Get Started Free</Link>
          </Button>
        </div>
      </div>
    </nav>
  );
}
