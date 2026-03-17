import { Upload, Cable, MessageSquareText } from "lucide-react";
import { ScrollReveal, RevealChild } from "@/components/landing/scroll-reveal";

const steps = [
  {
    icon: Upload,
    title: "Drop in your sources",
    description:
      "Drag YouTube videos, PDFs, images, and voice notes straight onto the canvas. No reformatting, no copy-pasting.",
    step: "01",
  },
  {
    icon: Cable,
    title: "Connect them to AI",
    description:
      "Draw lines between your source nodes and the AI chat. Connected sources become instant context for any question.",
    step: "02",
  },
  {
    icon: MessageSquareText,
    title: "Ask, write, and create",
    description:
      "Chat with AI across all your linked sources. Summarize, compare, brainstorm — then draft your content right on the canvas.",
    step: "03",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="font-sans text-sm font-medium text-accent mb-3">
            How It Works
          </p>
          <h2 className="font-heading text-[36px] md:text-[40px] font-bold leading-[1.2] text-primary">
            From scattered research to polished content
          </h2>
          <p className="mt-4 font-sans text-base text-muted-foreground leading-[1.6]">
            Three simple steps to transform how you research, brainstorm, and
            write.
          </p>
        </div>

        <ScrollReveal staggerChildren={120}>
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map(({ icon: Icon, title, description, step }) => (
              <RevealChild key={step}>
                <div className="relative rounded-2xl border border-border bg-white p-8 hover:shadow-md transition-shadow h-full">
                  <span className="font-heading text-[64px] font-extrabold text-secondary leading-none absolute top-6 right-6">
                    {step}
                  </span>
                  <div className="size-12 rounded-xl bg-primary flex items-center justify-center mb-6">
                    <Icon className="size-5 text-primary-foreground" />
                  </div>
                  <h3 className="font-heading text-xl font-semibold text-primary mb-3">
                    {title}
                  </h3>
                  <p className="font-sans text-sm text-muted-foreground leading-[1.6]">
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
