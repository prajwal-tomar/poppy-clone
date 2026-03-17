"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  /** Stagger children animations by this amount in ms */
  staggerChildren?: number;
}

export function ScrollReveal({
  children,
  className,
  delay = 0,
  staggerChildren,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (staggerChildren) {
            const items = el.querySelectorAll("[data-reveal-child]");
            items.forEach((child, i) => {
              setTimeout(() => {
                (child as HTMLElement).classList.add("reveal-visible");
              }, i * staggerChildren);
            });
          }
          setTimeout(() => el.classList.add("reveal-visible"), delay);
          observer.unobserve(el);
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [delay, staggerChildren]);

  return (
    <div ref={ref} className={cn("reveal-hidden", className)}>
      {children}
    </div>
  );
}

export function RevealChild({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div data-reveal-child className={cn("reveal-child-hidden", className)}>
      {children}
    </div>
  );
}
