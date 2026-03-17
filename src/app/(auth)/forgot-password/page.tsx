import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ForgotPasswordPage() {
  return (
    <div className="bg-white border border-border rounded-lg p-8">
      <h1 className="font-heading text-[24px] font-semibold leading-[1.3] text-center mb-2">
        Reset your password.
      </h1>
      <p className="text-center font-sans text-sm text-muted-foreground mb-6">
        Enter your email and we&apos;ll send you a reset link.
      </p>

      <form className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email" className="font-sans text-sm font-medium">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            className="rounded-md px-[20px] py-[12px] h-auto text-[16px] placeholder:text-[#999999]"
          />
        </div>

        <Button className="w-full rounded-full h-11 bg-primary text-primary-foreground hover:bg-[#333333] text-sm font-medium">
          Send Reset Link
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
