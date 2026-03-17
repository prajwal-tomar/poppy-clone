"use client";

import { useState, useEffect, useCallback } from "react";
import { Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { usePlan } from "@/components/app/plan-provider";

const freePlanFeatures = [
  "3 boards",
  "30 AI messages/day",
  "YouTube + PDF + text",
  "GPT-4o mini",
];

const proPlanFeatures = [
  "Unlimited boards",
  "200 AI messages/day",
  "All input types",
  "GPT-4o model",
  "Priority support",
];

type ModalStatus = "idle" | "processing" | "success";

interface UpgradeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  headline?: string;
  onUpgradeComplete?: () => void;
}

export function UpgradeModal({
  open,
  onOpenChange,
  headline = "You've reached the free board limit.",
  onUpgradeComplete,
}: UpgradeModalProps) {
  const { upgrade } = usePlan();
  const [status, setStatus] = useState<ModalStatus>("idle");

  useEffect(() => {
    if (!open) {
      const timer = setTimeout(() => setStatus("idle"), 300);
      return () => clearTimeout(timer);
    }
  }, [open]);

  const handleUpgrade = useCallback(() => {
    setStatus("processing");
    setTimeout(() => setStatus("success"), 2000);
  }, []);

  const handleContinue = useCallback(() => {
    upgrade();
    onOpenChange(false);
    onUpgradeComplete?.();
  }, [upgrade, onOpenChange, onUpgradeComplete]);

  return (
    <Dialog open={open} onOpenChange={status === "processing" ? undefined : onOpenChange}>
      <DialogContent className="sm:max-w-[560px] p-0 overflow-hidden">
        {status === "success" ? (
          <div className="flex flex-col items-center justify-center px-6 py-12 text-center">
            <div className="size-16 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
              <Check className="size-8 text-emerald-600" />
            </div>
            <h2 className="font-heading text-[24px] font-semibold leading-[1.3] mb-2">
              You&apos;re now on Pro!
            </h2>
            <p className="font-sans text-sm text-muted-foreground max-w-sm mb-6">
              You now have unlimited boards, 200 AI messages/day, and access to
              all features.
            </p>
            <Button
              onClick={handleContinue}
              className="rounded-full bg-primary text-primary-foreground hover:bg-[#333333] px-8 py-2.5 text-sm font-medium"
            >
              Continue
            </Button>
          </div>
        ) : (
          <>
            <DialogHeader className="px-6 pt-6 pb-0">
              <DialogTitle className="font-heading text-[24px] font-semibold leading-[1.3] text-center">
                {headline}
              </DialogTitle>
              <DialogDescription className="text-center font-sans text-sm text-muted-foreground mt-2">
                Upgrade to Pro for unlimited boards, 200 AI messages/day, and
                access to every feature.
              </DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-2 gap-4 px-6 py-6">
              <div className="border border-border rounded-lg p-4 opacity-60">
                <h3 className="font-heading text-sm font-semibold">Free</h3>
                <div className="mt-1 flex items-baseline gap-0.5">
                  <span className="font-heading text-2xl font-bold">$0</span>
                  <span className="font-sans text-xs text-muted-foreground">
                    /mo
                  </span>
                </div>
                <ul className="mt-3 space-y-1.5">
                  {freePlanFeatures.map((f) => (
                    <li key={f} className="flex items-center gap-1.5">
                      <Check className="size-3 text-muted-foreground shrink-0" />
                      <span className="font-sans text-xs text-muted-foreground">
                        {f}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="border-2 border-accent rounded-lg p-4 relative">
                <div className="absolute -top-2.5 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center rounded-full bg-accent px-2 py-0.5 text-[10px] font-medium text-white">
                    Recommended
                  </span>
                </div>
                <h3 className="font-heading text-sm font-semibold">Pro</h3>
                <div className="mt-1 flex items-baseline gap-0.5">
                  <span className="font-heading text-2xl font-bold">$15</span>
                  <span className="font-sans text-xs text-muted-foreground">
                    /mo
                  </span>
                </div>
                <ul className="mt-3 space-y-1.5">
                  {proPlanFeatures.map((f) => (
                    <li key={f} className="flex items-center gap-1.5">
                      <Check className="size-3 text-accent shrink-0" />
                      <span className="font-sans text-xs">{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="px-6 pb-6 space-y-2">
              <Button
                onClick={handleUpgrade}
                disabled={status === "processing"}
                className="w-full rounded-full h-11 bg-accent text-white hover:bg-accent/90 text-sm font-medium gap-2"
              >
                {status === "processing" ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Upgrade to Pro — $15/mo"
                )}
              </Button>
              {status === "idle" && (
                <DialogClose asChild>
                  <button className="w-full text-center font-sans text-sm text-muted-foreground hover:text-primary transition-colors py-1">
                    Maybe later
                  </button>
                </DialogClose>
              )}
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
