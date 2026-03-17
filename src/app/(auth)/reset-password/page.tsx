import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ResetPasswordPage() {
  return (
    <div className="bg-white border border-border rounded-lg p-8">
      <h1 className="font-heading text-[24px] font-semibold leading-[1.3] text-center mb-6">
        Set a new password.
      </h1>

      <form className="space-y-4">
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
            className="rounded-md px-[20px] py-[12px] h-auto text-[16px] placeholder:text-[#999999]"
          />
          <div className="flex gap-1 pt-1">
            <div className="h-1 flex-1 rounded-full bg-accent" />
            <div className="h-1 flex-1 rounded-full bg-accent/60" />
            <div className="h-1 flex-1 rounded-full bg-border" />
            <div className="h-1 flex-1 rounded-full bg-border" />
          </div>
          <p className="font-sans text-xs text-muted-foreground">
            Medium strength
          </p>
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
            className="rounded-md px-[20px] py-[12px] h-auto text-[16px] placeholder:text-[#999999]"
          />
        </div>

        <Button className="w-full rounded-full h-11 bg-primary text-primary-foreground hover:bg-[#333333] text-sm font-medium">
          Reset Password
        </Button>
      </form>
    </div>
  );
}
