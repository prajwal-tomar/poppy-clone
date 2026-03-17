import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function FinalCTA() {
  return (
    <section className="py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="rounded-2xl bg-primary p-12 md:p-20 text-center">
          <h2 className="font-heading text-[32px] md:text-[44px] font-bold leading-[1.2] text-primary-foreground max-w-2xl mx-auto">
            Start creating with AI today
          </h2>
          <p className="mt-4 font-sans text-base text-primary-foreground/60 max-w-lg mx-auto leading-[1.6]">
            Join thousands of creators who research, brainstorm, and write — all
            on one visual canvas powered by AI.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              asChild
              className="rounded-full bg-accent text-white hover:bg-accent/90 px-8 py-3 h-12 text-sm font-medium"
            >
              <Link href="/signup">
                Get Started Free
                <ArrowRight className="size-4 ml-1" />
              </Link>
            </Button>
            <Link
              href="#pricing"
              className="font-sans text-sm font-medium text-primary-foreground/60 hover:text-primary-foreground transition-colors underline underline-offset-4"
            >
              See Pricing
            </Link>
          </div>
          <p className="mt-4 font-sans text-xs text-primary-foreground/40">
            No credit card required · Free forever plan
          </p>
        </div>
      </div>
    </section>
  );
}
