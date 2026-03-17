import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import { PlanProvider } from "@/components/app/plan-provider";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Thinkboard — Visual AI Workspace for Creators",
  description:
    "Drop YouTube videos, PDFs, images, and voice notes onto an AI-powered canvas. Research, brainstorm, and write — all in one place.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${jakarta.variable} ${inter.variable} antialiased`}
      >
        <PlanProvider>{children}</PlanProvider>
      </body>
    </html>
  );
}
