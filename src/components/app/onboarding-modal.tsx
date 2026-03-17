"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Play,
  FileText,
  ImageIcon,
  ArrowRight,
  Sparkles,
  MessageSquare,
  Type,
  FileTextIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";

const STORAGE_KEY = "thinkboard-onboarded";

const steps = [
  {
    headline: "Drop in your sources",
    description:
      "Add YouTube videos, PDFs, and more to your canvas. Just click the toolbar and start building your research board.",
    renderIllustration: () => (
      <div className="flex items-center justify-center gap-4 py-6">
        <div className="size-14 rounded-xl bg-red-50 flex items-center justify-center border border-red-100">
          <Play className="size-6 text-red-500" />
        </div>
        <div className="size-14 rounded-xl bg-blue-50 flex items-center justify-center border border-blue-100">
          <FileText className="size-6 text-blue-500" />
        </div>
        <div className="size-14 rounded-xl bg-emerald-50 flex items-center justify-center border border-emerald-100">
          <ImageIcon className="size-6 text-emerald-500" />
        </div>
      </div>
    ),
  },
  {
    headline: "Connect them to AI",
    description:
      "Draw lines between your source nodes and an AI Chat node. The AI will read everything you connect.",
    renderIllustration: () => (
      <div className="flex items-center justify-center gap-3 py-6">
        <div className="size-12 rounded-lg bg-secondary flex items-center justify-center border border-border">
          <Play className="size-5 text-muted-foreground" />
        </div>
        <div className="flex items-center gap-1">
          <div className="w-8 h-px bg-accent" />
          <ArrowRight className="size-4 text-accent" />
        </div>
        <div className="size-12 rounded-lg bg-accent/10 flex items-center justify-center border-2 border-accent">
          <Sparkles className="size-5 text-accent" />
        </div>
      </div>
    ),
  },
  {
    headline: "Ask anything",
    description:
      "The AI reads all connected sources and answers your questions. Summarize, extract key points, or brainstorm ideas.",
    renderIllustration: () => (
      <div className="flex flex-col items-center gap-2 py-4">
        <div className="flex items-center gap-2 bg-secondary rounded-full px-4 py-2">
          <Sparkles className="size-4 text-accent" />
          <span className="font-sans text-xs text-muted-foreground">
            AI is thinking...
          </span>
        </div>
        <div className="flex items-start gap-2 max-w-[200px]">
          <MessageSquare className="size-4 text-accent shrink-0 mt-0.5" />
          <p className="font-sans text-xs text-muted-foreground leading-relaxed">
            Here are the 3 key points from your video and PDF...
          </p>
        </div>
      </div>
    ),
  },
  {
    headline: "Write your final draft",
    description:
      "Use the rich text editor to write alongside your research. Everything stays on one canvas.",
    renderIllustration: () => (
      <div className="flex items-center justify-center gap-3 py-6">
        <div className="size-12 rounded-lg bg-secondary flex items-center justify-center border border-border">
          <Sparkles className="size-5 text-accent" />
        </div>
        <ArrowRight className="size-4 text-muted-foreground" />
        <div className="w-32 h-20 rounded-lg bg-secondary border border-border flex flex-col gap-1 p-2">
          <div className="flex items-center gap-1 mb-1">
            <Type className="size-3 text-muted-foreground" />
            <FileTextIcon className="size-3 text-muted-foreground" />
          </div>
          <div className="h-1.5 bg-muted-foreground/20 rounded-full w-full" />
          <div className="h-1.5 bg-muted-foreground/20 rounded-full w-3/4" />
          <div className="h-1.5 bg-muted-foreground/20 rounded-full w-5/6" />
        </div>
      </div>
    ),
  },
];

export function OnboardingModal() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (localStorage.getItem(STORAGE_KEY) !== "true") {
      setOpen(true);
    }
  }, []);

  const dismiss = useCallback(() => {
    localStorage.setItem(STORAGE_KEY, "true");
    setOpen(false);
  }, []);

  const handleNext = useCallback(() => {
    if (step < steps.length - 1) {
      setStep((s) => s + 1);
    } else {
      dismiss();
    }
  }, [step, dismiss]);

  const current = steps[step];

  return (
    <Dialog open={open} onOpenChange={(v) => !v && dismiss()}>
      <DialogContent className="sm:max-w-[420px] p-0 overflow-hidden">
        <div className="px-6 pt-8 pb-6 flex flex-col items-center text-center">
          {current.renderIllustration()}

          <h2 className="font-heading text-[20px] font-semibold leading-[1.3] mt-2 mb-2">
            {current.headline}
          </h2>
          <p className="font-sans text-sm text-muted-foreground max-w-xs leading-relaxed">
            {current.description}
          </p>

          <div className="flex items-center gap-1.5 mt-6 mb-4">
            {steps.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all ${
                  i === step
                    ? "w-6 bg-accent"
                    : "w-1.5 bg-muted-foreground/20"
                }`}
              />
            ))}
          </div>

          <div className="flex items-center gap-3 w-full">
            <button
              onClick={dismiss}
              className="font-sans text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Skip
            </button>
            <Button
              onClick={handleNext}
              className="flex-1 rounded-full h-10 bg-primary text-primary-foreground hover:bg-[#333333] text-sm font-medium"
            >
              {step === steps.length - 1 ? "Get Started" : "Next"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
