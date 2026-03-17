import { AppNavbar } from "@/components/app/app-navbar";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <AppNavbar />
      <main className="pt-16">{children}</main>
    </div>
  );
}
