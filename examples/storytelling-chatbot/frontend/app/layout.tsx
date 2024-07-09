import React from "react";

import "./globals.css";
import type { Metadata } from "next";
import { Space_Grotesk, Space_Mono } from "next/font/google";

import { cn } from "@/app/utils";
import { Analytics } from "@vercel/analytics/react"
// Font
const sans = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-sans",
});

const mono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "her build by Fiit AI",
  description: "Built with fiit.ai",
  metadataBase: new URL(process.env.SITE_URL || "http://localhost:3000"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased flex flex-col",
          sans.variable,
          mono.variable
        )}
      >
        <main className="flex flex-1">{children}</main>
        <Analytics />
      </body>
    </html>
  );
}
