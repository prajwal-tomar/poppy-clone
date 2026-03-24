"use client";

import { useActionState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Loader2, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { forgotPassword } from "./actions";

export default function ForgotPasswordPage() {
  const [state, formAction, isPending] = useActionState(forgotPassword, null);
  const searchParams = useSearchParams();
  const linkExpired = searchParams.get("error") === "link_expired";

  if (state?.success) {
    return (
      <div className="bg-white border border-border rounded-lg p-8 text-center">
        <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-secondary">
          <Mail className="size-5 text-primary" />
        </div>
        <h1 className="font-heading text-[24px] font-semibold leading-[1.3] mb-2">
          Check your inbox.
        </h1>
        <p className="font-sans text-sm text-muted-foreground mb-6">
          We&apos;ve sent a reset link to your email. Click the link to set a
          new password.
        </p>
        <p className="font-sans text-sm text-muted-foreground">
          Didn&apos;t get it?{" "}
          <button
            onClick={() => window.location.reload()}
            className="text-primary font-medium hover:underline"
          >
            Resend
          </button>
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-border rounded-lg p-8">
      <h1 className="font-heading text-[24px] font-semibold leading-[1.3] text-center mb-2">
        Reset your password.
      </h1>
      <p className="text-center font-sans text-sm text-muted-foreground mb-6">
        Enter your email and we&apos;ll send you a reset link.
      </p>

      {linkExpired && (
        <div className="mb-4 rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          Your reset link has expired. Please request a new one.
        </div>
      )}

      {state?.error && (
        <div className="mb-4 rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {state.error}
        </div>
      )}

      <form action={formAction} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email" className="font-sans text-sm font-medium">
            Email
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="you@example.com"
            required
            className="rounded-md px-[20px] py-[12px] h-auto text-[16px] placeholder:text-[#999999]"
          />
        </div>

        <Button
          type="submit"
          disabled={isPending}
          className="w-full rounded-full h-11 bg-primary text-primary-foreground hover:bg-[#333333] text-sm font-medium"
        >
          {isPending ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            "Send Reset Link"
          )}
        </Button>
      </form>

      <p className="mt-6 text-center font-sans text-sm text-muted-foreground">
        <Link
          href="/login"
          className="text-primary font-medium hover:underline"
        >
          Back to Log In
        </Link>
      </p>
    </div>
  );
}
