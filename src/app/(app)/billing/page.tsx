"use client";

import { useState } from "react";
import { Check, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { usePlan } from "@/components/app/plan-provider";
import { UpgradeModal } from "@/components/app/upgrade-modal";

const freePlanFeatures = [
  "3 boards",
  "30 AI messages per day",
  "YouTube transcript extraction",
  "PDF text parsing",
  "Rich text editor",
  "GPT-4o mini model",
];

const proPlanFeatures = [
  "Unlimited boards",
  "200 AI messages per day",
  "Everything in Free",
  "Image understanding",
  "Voice note transcription",
  "GPT-4o model",
  "Priority support",
];

const invoices = [
  { date: "Mar 1, 2026", amount: "$0.00", status: "Free tier", id: "inv-001" },
];

export default function BillingPage() {
  const { isPro } = usePlan();
  const [upgradeOpen, setUpgradeOpen] = useState(false);

  return (
    <div className="mx-auto max-w-[800px] px-6 py-8">
      <UpgradeModal
        open={upgradeOpen}
        onOpenChange={setUpgradeOpen}
        headline="Upgrade to unlock the full toolkit."
      />

      <h1 className="font-heading text-[40px] font-bold leading-[1.2] mb-8">
        Billing
      </h1>

      {/* Current Plan */}
      <section className="bg-white border border-border rounded-lg p-6 mb-6">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="font-heading text-[20px] font-semibold leading-[1.3]">
              {isPro ? "Pro Plan" : "Free Plan"}
            </h2>
            <p className="font-sans text-sm text-muted-foreground mt-1">
              {isPro
                ? "$15/mo — You're on the Pro plan."
                : "$0/mo — You're on the free tier."}
            </p>
          </div>
          {isPro ? (
            <Button
              disabled
              className="rounded-full px-5 py-2.5 text-sm font-medium"
            >
              Current Plan
            </Button>
          ) : (
            <Button
              onClick={() => setUpgradeOpen(true)}
              className="rounded-full bg-accent text-white hover:bg-accent/90 px-5 py-2.5 text-sm font-medium"
            >
              Upgrade to Pro
            </Button>
          )}
        </div>
        <Separator className="my-4" />
        <ul className="space-y-2">
          {(isPro ? proPlanFeatures : freePlanFeatures).map((feature) => (
            <li key={feature} className="flex items-center gap-2">
              <Check className="size-4 text-accent shrink-0" />
              <span className="font-sans text-sm text-muted-foreground">
                {feature}
              </span>
            </li>
          ))}
        </ul>
      </section>

      {/* Plan Comparison */}
      <section className="mb-6">
        <h2 className="font-heading text-[20px] font-semibold leading-[1.3] mb-4">
          Compare Plans
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          {/* Free */}
          <div className="bg-white border border-border rounded-lg p-6">
            <h3 className="font-heading text-lg font-semibold">Free</h3>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="font-heading text-[36px] font-bold leading-none">
                $0
              </span>
              <span className="font-sans text-sm text-muted-foreground">
                /mo
              </span>
            </div>
            <p className="mt-2 font-sans text-sm text-muted-foreground">
              Perfect for getting started.
            </p>
            <Button
              disabled
              className={`w-full mt-4 rounded-full h-10 text-sm font-medium ${
                isPro ? "bg-secondary text-muted-foreground" : ""
              }`}
            >
              {!isPro ? "Current Plan" : "Free"}
            </Button>
            <ul className="mt-6 space-y-2">
              {freePlanFeatures.map((f) => (
                <li key={f} className="flex items-center gap-2">
                  <Check className="size-3.5 text-accent shrink-0" />
                  <span className="font-sans text-sm text-muted-foreground">
                    {f}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Pro */}
          <div className="bg-white border-2 border-accent rounded-lg p-6 relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <span className="inline-flex items-center rounded-full bg-accent px-3 py-1 text-xs font-medium text-white">
                {isPro ? "Your Plan" : "Recommended"}
              </span>
            </div>
            <h3 className="font-heading text-lg font-semibold">Pro</h3>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="font-heading text-[36px] font-bold leading-none">
                $15
              </span>
              <span className="font-sans text-sm text-muted-foreground">
                /mo
              </span>
            </div>
            <p className="mt-2 font-sans text-sm text-muted-foreground">
              For serious creators who need the full toolkit.
            </p>
            {isPro ? (
              <Button
                disabled
                className="w-full mt-4 rounded-full h-10 text-sm font-medium"
              >
                Current Plan
              </Button>
            ) : (
              <Button
                onClick={() => setUpgradeOpen(true)}
                className="w-full mt-4 rounded-full h-10 bg-accent text-white hover:bg-accent/90 text-sm font-medium"
              >
                Upgrade to Pro
              </Button>
            )}
            <ul className="mt-6 space-y-2">
              {proPlanFeatures.map((f) => (
                <li key={f} className="flex items-center gap-2">
                  <Check className="size-3.5 text-accent shrink-0" />
                  <span className="font-sans text-sm text-muted-foreground">
                    {f}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <p className="mt-4 text-center font-sans text-xs text-muted-foreground">
          No annual lock-in. Cancel anytime with one click.
        </p>
      </section>

      {/* Usage */}
      <section className="bg-white border border-border rounded-lg p-6 mb-6">
        <h2 className="font-heading text-[20px] font-semibold leading-[1.3] mb-4">
          Usage
        </h2>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-1.5">
              <span className="font-sans text-sm text-muted-foreground">
                AI messages used today
              </span>
              <span className="font-sans text-sm font-medium">
                12 / {isPro ? "200" : "30"}
              </span>
            </div>
            <div className="h-2 bg-secondary rounded-full overflow-hidden">
              <div
                className="h-full bg-accent rounded-full transition-all"
                style={{ width: isPro ? "6%" : "40%" }}
              />
            </div>
          </div>
          <div>
            <div className="flex justify-between mb-1.5">
              <span className="font-sans text-sm text-muted-foreground">
                Boards
              </span>
              <span className="font-sans text-sm font-medium">
                {isPro ? "3 — Unlimited" : "2 / 3"}
              </span>
            </div>
            {!isPro && (
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full bg-accent rounded-full transition-all"
                  style={{ width: "66%" }}
                />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Billing History */}
      <section className="bg-white border border-border rounded-lg p-6">
        <h2 className="font-heading text-[20px] font-semibold leading-[1.3] mb-4">
          Billing History
        </h2>
        {invoices.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left font-sans text-xs font-medium text-muted-foreground pb-2">
                    Date
                  </th>
                  <th className="text-left font-sans text-xs font-medium text-muted-foreground pb-2">
                    Amount
                  </th>
                  <th className="text-left font-sans text-xs font-medium text-muted-foreground pb-2">
                    Status
                  </th>
                  <th className="text-right font-sans text-xs font-medium text-muted-foreground pb-2">
                    Invoice
                  </th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((inv) => (
                  <tr
                    key={inv.id}
                    className="border-b border-border last:border-0"
                  >
                    <td className="py-3 font-sans text-sm">{inv.date}</td>
                    <td className="py-3 font-sans text-sm">{inv.amount}</td>
                    <td className="py-3 font-sans text-sm text-muted-foreground">
                      {inv.status}
                    </td>
                    <td className="py-3 text-right">
                      <button className="inline-flex items-center gap-1 font-sans text-sm text-muted-foreground hover:text-primary transition-colors">
                        <Download className="size-3.5" />
                        Download
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="font-sans text-sm text-muted-foreground">
            No billing history yet.
          </p>
        )}
      </section>
    </div>
  );
}
