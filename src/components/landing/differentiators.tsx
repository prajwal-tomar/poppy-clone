import Image from "next/image";
import { Mic, Image as ImageIcon, LayoutDashboard } from "lucide-react";
import { ScrollReveal, RevealChild } from "@/components/landing/scroll-reveal";

const cards = [
  {
    icon: LayoutDashboard,
    title: "Spatial canvas thinking",
    description:
      "Arrange sources visually, draw connections, and see relationships between ideas — the way your brain actually works.",
    imageSrc:
      "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=600&h=400&fit=crop&q=80",
    imageAlt: "Creative workflow board with sticky notes",
  },
  {
    icon: Mic,
    title: "Voice notes with transcription",
    description:
      "Record ideas on the go. Whisper-powered transcription turns your voice into searchable, AI-readable text in seconds.",
    imageSrc:
      "https://images.unsplash.com/photo-1589903308904-1010c2294adc?w=600&h=400&fit=crop&q=80",
    imageAlt: "Person recording a voice note while working",
  },
  {
    icon: ImageIcon,
    title: "Image understanding",
    description:
      "Drop screenshots, diagrams, or photos onto the canvas. AI vision analyzes them alongside your other sources.",
    imageSrc:
      "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=600&h=400&fit=crop&q=80",
    imageAlt: "Visual design assets on a workspace",
  },
];

export function Differentiators() {
  return (
    <section className="py-24 md:py-32 bg-white">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="font-sans text-sm font-medium text-accent mb-3">
            Why Thinkboard
          </p>
          <h2 className="font-heading text-[36px] md:text-[40px] font-bold leading-[1.2] text-primary">
            See what sets us apart
          </h2>
          <p className="mt-4 font-sans text-base text-muted-foreground leading-[1.6]">
            Built specifically for creators who need to go from research to
            published content, fast.
          </p>
        </div>

        <ScrollReveal staggerChildren={120}>
          <div className="grid md:grid-cols-3 gap-8">
            {cards.map(({ icon: Icon, title, description, imageSrc, imageAlt }) => (
              <RevealChild key={title}>
                <div className="group rounded-2xl border border-border overflow-hidden hover:shadow-md transition-shadow h-full">
                  <div className="h-48 overflow-hidden">
                    <Image
                      src={imageSrc}
                      alt={imageAlt}
                      width={600}
                      height={400}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6">
                    <div className="size-10 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                      <Icon className="size-4 text-accent" />
                    </div>
                    <h3 className="font-heading text-lg font-semibold text-primary mb-2">
                      {title}
                    </h3>
                    <p className="font-sans text-sm text-muted-foreground leading-[1.6]">
                      {description}
                    </p>
                  </div>
                </div>
              </RevealChild>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
