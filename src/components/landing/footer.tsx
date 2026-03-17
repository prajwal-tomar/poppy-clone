import Link from "next/link";
import { Sparkles } from "lucide-react";

const footerLinks = {
  Product: [
    { label: "Features", href: "#features" },
    { label: "Pricing", href: "#pricing" },
    { label: "How It Works", href: "#how-it-works" },
  ],
  Company: [
    { label: "Terms of Service", href: "/terms" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Contact", href: "mailto:support@thinkboard.app" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-border bg-white py-12">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col md:flex-row justify-between gap-10">
          <div className="max-w-xs">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="flex items-center justify-center size-8 rounded-lg bg-accent">
                <Sparkles className="size-4 text-white" />
              </div>
              <span className="font-heading text-xl font-bold text-primary">
                Thinkboard
              </span>
            </Link>
            <p className="font-sans text-sm text-muted-foreground leading-[1.6]">
              The visual AI workspace for creators. Research, brainstorm, and
              write — all in one place.
            </p>
          </div>

          <div className="flex gap-16">
            {Object.entries(footerLinks).map(([category, links]) => (
              <div key={category}>
                <p className="font-sans text-sm font-medium text-primary mb-4">
                  {category}
                </p>
                <ul className="space-y-3">
                  {links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="font-sans text-sm text-muted-foreground hover:text-primary transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-sans text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Thinkboard. All rights reserved.
          </p>
          <p className="font-sans text-xs text-muted-foreground">
            Built with care for creators everywhere.
          </p>
        </div>
      </div>
    </footer>
  );
}
