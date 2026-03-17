import {
  Youtube,
  FileText,
  Image as ImageIcon,
  Mic,
  Type,
  Sparkles,
} from "lucide-react";

const integrations = [
  { icon: Youtube, label: "YouTube" },
  { icon: FileText, label: "PDFs" },
  { icon: ImageIcon, label: "Images" },
  { icon: Mic, label: "Voice Notes" },
  { icon: Type, label: "Rich Text" },
  { icon: Sparkles, label: "AI Chat" },
];

export function LogoStrip() {
  return (
    <section className="py-16 border-y border-border bg-white">
      <div className="mx-auto max-w-7xl px-6">
        <p className="font-sans text-sm text-center text-muted-foreground mb-8">
          Works with all your favorite content types
        </p>
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-14">
          {integrations.map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex items-center gap-2 text-muted-foreground/60 hover:text-primary transition-colors"
            >
              <Icon className="size-5" strokeWidth={1.5} />
              <span className="font-sans text-sm font-medium">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
