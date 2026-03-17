import Link from "next/link";
import { Sparkles } from "lucide-react";

export function Logo({ href = "/" }: { href?: string }) {
  return (
    <Link href={href} className="flex items-center gap-2">
      <div className="flex items-center justify-center size-8 rounded-lg bg-accent">
        <Sparkles className="size-4 text-white" />
      </div>
      <span className="font-heading text-xl font-bold text-primary">
        Thinkboard
      </span>
    </Link>
  );
}
