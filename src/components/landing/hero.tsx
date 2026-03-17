import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

export function Hero() {
  return (
    <section className="relative pt-32 pb-20 md:pt-44 md:pb-32 overflow-hidden">
      {/* Grid background */}
      <div className="absolute inset-0 -z-10">
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(#1A1A1A 1px, transparent 1px), linear-gradient(90deg, #1A1A1A 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,var(--background)_80%)]" />
      </div>

      {/* Decorative blobs */}
      <div className="absolute top-20 -left-32 size-72 rounded-full bg-accent/5 blur-3xl -z-10" />
      <div className="absolute top-40 -right-32 size-72 rounded-full bg-secondary blur-3xl -z-10" />

      <div className="mx-auto max-w-7xl px-6">
        {/* Centered copy */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-4 py-1.5 mb-8">
            <Sparkles className="size-3.5 text-accent" />
            <span className="font-sans text-xs font-medium text-muted-foreground">
              The future of visual AI research.
            </span>
          </div>

          <h1 className="font-heading text-[44px] md:text-[64px] font-extrabold leading-[1.1] text-primary tracking-tight">
            Visual AI Workspace,
            <br />
            <span className="text-accent italic">For every creator.</span>
          </h1>

          <p className="mt-6 font-sans text-base md:text-lg leading-[1.6] text-muted-foreground max-w-xl">
            Drop YouTube videos, PDFs, images, and voice notes onto an
            AI-powered canvas. Research, brainstorm, and write — all in one
            place.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center gap-4">
            <Button
              asChild
              className="rounded-full bg-accent text-white hover:bg-accent/90 px-7 py-3 h-12 text-sm font-medium"
            >
              <Link href="/signup">Get Started</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="rounded-full border-border bg-white text-primary hover:bg-secondary/60 px-7 py-3 h-12 text-sm font-medium"
            >
              <Link href="#pricing">View Pricing</Link>
            </Button>
          </div>
        </div>

        {/* Product screenshot */}
        <div className="relative mt-16 md:mt-20 max-w-5xl mx-auto">
          {/* Decorative colored dots */}
          <div className="absolute -top-3 -left-3 size-6 rounded-full bg-accent/80 hidden md:block" />
          <div className="absolute top-8 -right-4 size-4 rounded-full bg-yellow-400 hidden md:block" />
          <div className="absolute -bottom-2 left-16 size-5 rounded-full bg-blue-400/60 hidden md:block" />

          <div className="rounded-xl border border-border bg-white shadow-lg overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=1400&h=900&fit=crop&q=80"
              alt="Thinkboard visual AI workspace with research sources on a canvas"
              width={1400}
              height={900}
              className="w-full h-auto"
              priority
            />
          </div>

          {/* Subtle gradient fade at the bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-linear-to-t from-background to-transparent pointer-events-none" />
        </div>
      </div>
    </section>
  );
}
