import { Star, Users, Sparkles } from "lucide-react";

const metrics = [
  {
    icon: Users,
    value: "1,000+",
    label: "Creators on the platform",
  },
  {
    icon: Sparkles,
    value: "50K+",
    label: "AI conversations powered",
  },
  {
    icon: Star,
    value: "4.8",
    label: "Average user rating",
  },
];

export function SocialProof() {
  return (
    <section className="py-16 border-y border-border bg-white">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <p className="font-heading text-xl md:text-2xl font-semibold text-primary text-center md:text-left">
            Trusted by creators
            <br className="hidden md:block" /> worldwide
          </p>
          <div className="flex flex-wrap items-center justify-center gap-10 md:gap-16">
            {metrics.map(({ icon: Icon, value, label }) => (
              <div key={label} className="text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Icon className="size-4 text-accent" />
                  <span className="font-heading text-2xl font-bold text-primary">
                    {value}
                  </span>
                </div>
                <p className="font-sans text-xs text-muted-foreground">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
