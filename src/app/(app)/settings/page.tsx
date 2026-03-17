import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export default function SettingsPage() {
  return (
    <div className="mx-auto max-w-[640px] px-6 py-8">
      <h1 className="font-heading text-[40px] font-bold leading-[1.2] mb-8">
        Account Settings
      </h1>

      {/* Profile Section */}
      <section className="bg-white border border-border rounded-lg p-6 mb-6">
        <h2 className="font-heading text-[20px] font-semibold leading-[1.3] mb-6">
          Profile
        </h2>

        <div className="flex items-center gap-4 mb-6">
          <Avatar className="size-16">
            <AvatarFallback className="bg-primary text-primary-foreground text-lg font-medium">
              PT
            </AvatarFallback>
          </Avatar>
          <Button
            variant="ghost"
            className="rounded-full text-sm text-muted-foreground hover:text-primary"
          >
            Upload photo
          </Button>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label
              htmlFor="display-name"
              className="font-sans text-sm font-medium"
            >
              Display name
            </Label>
            <Input
              id="display-name"
              defaultValue="Prajwal Tomar"
              className="rounded-md px-[20px] py-[12px] h-auto text-[16px]"
            />
          </div>

          <div className="space-y-2">
            <Label className="font-sans text-sm font-medium">Email</Label>
            <p className="font-sans text-[16px] text-muted-foreground px-[20px] py-[12px] bg-secondary/50 border border-border rounded-md">
              prajwal@example.com
            </p>
            <p className="font-sans text-xs text-muted-foreground">
              Contact support to change your email address.
            </p>
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <Button
            disabled
            className="rounded-full bg-primary text-primary-foreground px-5 py-2.5 text-sm font-medium"
          >
            Save Changes
          </Button>
        </div>
      </section>

      {/* Password Section */}
      <section className="bg-white border border-border rounded-lg p-6 mb-6">
        <h2 className="font-heading text-[20px] font-semibold leading-[1.3] mb-6">
          Password
        </h2>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label
              htmlFor="current-password"
              className="font-sans text-sm font-medium"
            >
              Current password
            </Label>
            <Input
              id="current-password"
              type="password"
              placeholder="Enter current password"
              className="rounded-md px-[20px] py-[12px] h-auto text-[16px] placeholder:text-[#999999]"
            />
          </div>

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
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="confirm-new-password"
              className="font-sans text-sm font-medium"
            >
              Confirm new password
            </Label>
            <Input
              id="confirm-new-password"
              type="password"
              placeholder="Re-enter new password"
              className="rounded-md px-[20px] py-[12px] h-auto text-[16px] placeholder:text-[#999999]"
            />
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <Button className="rounded-full bg-primary text-primary-foreground hover:bg-[#333333] px-5 py-2.5 text-sm font-medium">
            Update Password
          </Button>
        </div>
      </section>

      {/* Danger Zone */}
      <section className="border border-destructive rounded-lg p-6">
        <h2 className="font-heading text-[20px] font-semibold leading-[1.3] text-destructive mb-2">
          Danger Zone
        </h2>
        <p className="font-sans text-sm text-muted-foreground mb-4">
          Permanently delete your account and all your boards. This action
          cannot be undone.
        </p>
        <Separator className="mb-4" />
        <Button
          variant="destructive"
          className="rounded-full px-5 py-2.5 text-sm font-medium"
        >
          Delete Account
        </Button>
      </section>
    </div>
  );
}
