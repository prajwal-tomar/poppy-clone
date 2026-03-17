import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { ScrollReveal, RevealChild } from "@/components/landing/scroll-reveal";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "/mo",
    description: "Perfect for getting started with AI-powered research.",
    cta: "Get Started Free",
    ctaHref: "/signup",
    highlighted: false,
    features: [
      "3 boards",
      "30 AI messages per day",
      "YouTube transcript extraction",
      "PDF text parsing",
      "Rich text editor",
      "GPT-4o mini model",
    ],
  },
  {
    name: "Pro",
    price: "$15",
    period: "/mo",
    description: "For serious creators who need the full toolkit.",
    cta: "Start Pro",
    ctaHref: "/signup",
    highlighted: true,
    features: [
      "Unlimited boards",
      "200 AI messages per day",
      "Everything in Free",
      "Image understanding",
      "Voice note transcription",
      "GPT-4o model",
      "Priority support",
    ],
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="font-sans text-sm font-medium text-accent mb-3">
            Pricing
          </p>
          <h2 className="font-heading text-[36px] md:text-[40px] font-bold leading-[1.2] text-primary">
            Simple, transparent pricing
          </h2>
          <p className="mt-4 font-sans text-base text-muted-foreground leading-[1.6]">
            Start free. Upgrade when you need more power. No annual lock-in —
            cancel anytime with one click.
          </p>
        </div>

        <ScrollReveal staggerChildren={150}>
          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {plans.map((plan) => (
              <RevealChild key={plan.name}>
                <div
                  className={`rounded-2xl border p-8 h-full ${
                    plan.highlighted
                      ? "border-accent bg-white shadow-lg relative"
                      : "border-border bg-white"
                  }`}
                >
                  {plan.highlighted && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="inline-flex items-center rounded-full bg-accent px-3 py-1 text-xs font-medium text-white">
                        Most Popular
                      </span>
                    </div>
                  )}

                  <div className="mb-6">
                    <h3 className="font-heading text-xl font-semibold text-primary">
                      {plan.name}
                    </h3>
                    <div className="mt-3 flex items-baseline gap-1">
                      <span className="font-heading text-[48px] font-bold text-primary leading-none">
                        {plan.price}
                      </span>
                      <span className="font-sans text-sm text-muted-foreground">
                        {plan.period}
                      </span>
                    </div>
                    <p className="mt-2 font-sans text-sm text-muted-foreground">
                      {plan.description}
                    </p>
                  </div>

                  <Button
                    asChild
                    className={`w-full rounded-full h-11 text-sm font-medium ${
                      plan.highlighted
                        ? "bg-accent text-white hover:bg-accent/90"
                        : "bg-primary text-primary-foreground hover:bg-[#333333]"
                    }`}
                  >
                    <Link href={plan.ctaHref}>{plan.cta}</Link>
                  </Button>

                  <ul className="mt-8 space-y-3">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-3">
                        <Check className="size-4 text-accent shrink-0" />
                        <span className="font-sans text-sm text-muted-foreground">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </RevealChild>
            ))}
          </div>
        </ScrollReveal>

        <p className="mt-8 text-center font-sans text-xs text-muted-foreground">
          No annual lock-in. Cancel anytime with one click. Prices in USD.
        </p>
      </div>
    </section>
  );
}
