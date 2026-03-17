import Image from "next/image";
import { Check } from "lucide-react";
import { ScrollReveal } from "@/components/landing/scroll-reveal";

interface FeatureShowcaseItemProps {
  label: string;
  title: string;
  description: string;
  bullets: string[];
  imageSrc: string;
  imageAlt: string;
  reverse?: boolean;
}

function FeatureShowcaseItem({
  label,
  title,
  description,
  bullets,
  imageSrc,
  imageAlt,
  reverse = false,
}: FeatureShowcaseItemProps) {
  return (
    <ScrollReveal>
      <div
        className={`grid lg:grid-cols-2 gap-12 lg:gap-20 items-center ${
          reverse ? "lg:direction-rtl" : ""
        }`}
      >
        <div className={`${reverse ? "lg:order-2" : ""} lg:direction-ltr`}>
          <p className="font-sans text-sm font-medium text-accent mb-3">
            {label}
          </p>
          <h3 className="font-heading text-[28px] md:text-[32px] font-bold leading-[1.2] text-primary">
            {title}
          </h3>
          <p className="mt-4 font-sans text-base text-muted-foreground leading-[1.6]">
            {description}
          </p>
          <ul className="mt-6 space-y-3">
            {bullets.map((bullet) => (
              <li key={bullet} className="flex items-start gap-3">
                <div className="mt-0.5 size-5 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                  <Check className="size-3 text-accent" />
                </div>
                <span className="font-sans text-sm text-muted-foreground leading-[1.5]">
                  {bullet}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div
          className={`${reverse ? "lg:order-1" : ""} lg:direction-ltr relative`}
        >
          <div className="rounded-xl border border-border bg-white shadow-lg overflow-hidden">
            <Image
              src={imageSrc}
              alt={imageAlt}
              width={800}
              height={560}
              className="w-full h-auto"
            />
          </div>
        </div>
      </div>
    </ScrollReveal>
  );
}

const features: FeatureShowcaseItemProps[] = [
  {
    label: "YouTube & PDF Ingestion",
    title: "All your research sources, one canvas",
    description:
      "Paste a YouTube link and we extract the transcript instantly. Upload a PDF and the text is ready for AI. No more juggling browser tabs.",
    bullets: [
      "Automatic YouTube transcript extraction",
      "PDF text parsing with page-by-page navigation",
      "Visual node cards with thumbnails and metadata",
    ],
    imageSrc:
      "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&h=560&fit=crop&q=80",
    imageAlt: "Research materials and notes on a desk",
  },
  {
    label: "Contextual AI Chat",
    title: "Ask AI about everything at once",
    description:
      "Connect your sources to an AI chat node. Ask questions that span multiple videos, documents, and notes — get answers backed by all of them.",
    bullets: [
      "Multi-source AI context from connected nodes",
      "Streaming responses powered by GPT-4o",
      "Suggestion chips to get started quickly",
    ],
    imageSrc:
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=560&fit=crop&q=80",
    imageAlt: "AI-powered chat interface for research",
    reverse: true,
  },
  {
    label: "Rich Text Editor",
    title: "Write your final draft on the canvas",
    description:
      "A Notion-like text editor lives right alongside your sources. Use AI insights to write articles, scripts, summaries — without leaving the workspace.",
    bullets: [
      "Full formatting: headings, lists, code blocks, and more",
      "Slash commands for fast editing",
      "Auto-saves every change in real time",
    ],
    imageSrc:
      "https://images.unsplash.com/photo-1517842645767-c639042777db?w=800&h=560&fit=crop&q=80",
    imageAlt: "Person writing and creating content",
  },
];

export function FeatureShowcase() {
  return (
    <section id="features" className="py-24 md:py-32 bg-white">
      <div className="mx-auto max-w-7xl px-6 space-y-24 md:space-y-32">
        {features.map((feature) => (
          <FeatureShowcaseItem key={feature.label} {...feature} />
        ))}
      </div>
    </section>
  );
}
