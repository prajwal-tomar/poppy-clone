"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [sessionReady, setSessionReady] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        setSessionReady(true);
      } else {
        setError("No reset session found. Please request a new reset link.");
      }
      setChecking(false);
    });
  }, []);

  function getStrength(pw: string): { level: number; label: string } {
    if (pw.length === 0) return { level: 0, label: "" };
    if (pw.length < 8) return { level: 1, label: "Too short" };
    const hasUpper = /[A-Z]/.test(pw);
    const hasLower = /[a-z]/.test(pw);
    const hasNumber = /[0-9]/.test(pw);
    const hasSpecial = /[^A-Za-z0-9]/.test(pw);
    const score = [hasUpper, hasLower, hasNumber, hasSpecial].filter(
      Boolean
    ).length;
    if (score <= 1) return { level: 1, label: "Weak" };
    if (score === 2) return { level: 2, label: "Medium" };
    if (score === 3) return { level: 3, label: "Strong" };
    return { level: 4, label: "Very strong" };
  }

  const strength = getStrength(password);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    const supabase = createClient();
    const { error: updateError } = await supabase.auth.updateUser({
      password,
    });

    setLoading(false);

    if (updateError) {
      setError(updateError.message);
      return;
    }

    toast.success("Password updated. Log in with your new password.");
    router.push("/login");
  }

  const strengthColors = [
    "bg-border",
    "bg-red-500",
    "bg-accent",
    "bg-green-400",
    "bg-green-500",
  ];

  if (checking) {
    return (
      <div className="bg-white border border-border rounded-lg p-8 text-center">
        <Loader2 className="size-6 animate-spin mx-auto mb-4 text-primary" />
        <p className="font-sans text-sm text-muted-foreground">
          Verifying your session…
        </p>
      </div>
    );
  }

  if (error && !sessionReady) {
    return (
      <div className="bg-white border border-border rounded-lg p-8 text-center">
        <div className="mb-4 rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
        <Button
          onClick={() => router.push("/forgot-password")}
          className="rounded-full h-11 bg-primary text-primary-foreground hover:bg-[#333333] text-sm font-medium"
        >
          Request New Link
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-white border border-border rounded-lg p-8">
      <h1 className="font-heading text-[24px] font-semibold leading-[1.3] text-center mb-6">
        Set a new password.
      </h1>

      {error && (
        <div className="mb-4 rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label
            htmlFor="new-password"
            className="font-sans text-sm font-medium"
          >
            New password
          </Label>
          <Input
            id="new-password"
            type="password"
            placeholder="At least 8 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
            className="rounded-md px-[20px] py-[12px] h-auto text-[16px] placeholder:text-[#999999]"
          />
          {password.length > 0 && (
            <>
              <div className="flex gap-1 pt-1">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className={`h-1 flex-1 rounded-full ${
                      i <= strength.level
                        ? strengthColors[strength.level]
                        : "bg-border"
                    }`}
                  />
                ))}
              </div>
              <p className="font-sans text-xs text-muted-foreground">
                {strength.label}
              </p>
            </>
          )}
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="confirm-password"
            className="font-sans text-sm font-medium"
          >
            Confirm password
          </Label>
          <Input
            id="confirm-password"
            type="password"
            placeholder="Re-enter your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="rounded-md px-[20px] py-[12px] h-auto text-[16px] placeholder:text-[#999999]"
          />
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full rounded-full h-11 bg-primary text-primary-foreground hover:bg-[#333333] text-sm font-medium"
        >
          {loading ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            "Reset Password"
          )}
        </Button>
      </form>
    </div>
  );
}
