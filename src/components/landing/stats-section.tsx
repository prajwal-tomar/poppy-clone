import { Zap, Brain, Infinity } from "lucide-react";
import { ScrollReveal, RevealChild } from "@/components/landing/scroll-reveal";

const stats = [
  {
    icon: Infinity,
    value: "Unlimited",
    label: "Sources per board",
    description:
      "Drop as many YouTube videos, PDFs, and notes as you need. No artificial limits on your research.",
  },
  {
    icon: Zap,
    value: "< 2s",
    label: "Transcript extraction",
    description:
      "YouTube transcripts and PDF text are extracted in seconds, ready for AI-powered analysis.",
  },
  {
    icon: Brain,
    value: "GPT-4o",
    label: "Powering your AI",
    description:
      "Pro users get access to the latest GPT-4o model for smarter, more nuanced answers across all sources.",
  },
];

export function StatsSection() {
  return (
    <section className="py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="font-sans text-sm font-medium text-accent mb-3">
            Built for Performance
          </p>
          <h2 className="font-heading text-[36px] md:text-[40px] font-bold leading-[1.2] text-primary">
            Your research, supercharged
          </h2>
        </div>

        <ScrollReveal staggerChildren={120}>
          <div className="grid md:grid-cols-3 gap-8">
            {stats.map(({ icon: Icon, value, label, description }) => (
              <RevealChild key={label}>
                <div className="rounded-2xl border border-border bg-white p-8 text-center hover:shadow-md transition-shadow h-full">
                  <div className="size-12 rounded-xl bg-accent/10 flex items-center justify-center mx-auto mb-6">
                    <Icon className="size-5 text-accent" />
                  </div>
                  <p className="font-heading text-[40px] font-bold text-primary leading-none">
                    {value}
                  </p>
                  <p className="mt-2 font-sans text-sm font-medium text-primary">
                    {label}
                  </p>
                  <p className="mt-3 font-sans text-sm text-muted-foreground leading-[1.6]">
                    {description}
                  </p>
                </div>
              </RevealChild>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
