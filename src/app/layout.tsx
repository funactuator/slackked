import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

import { ConvexAuthNextjsServerProvider } from "@convex-dev/auth/nextjs/server";
import { ConvexClientProvider } from "@/components/convex-client-provider";

import { Modals } from "@/components/Modals";

import { JotaiProvider } from "@/components/jotai-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Slackked",
  description: "Fully functional Slack clone",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ConvexAuthNextjsServerProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <ConvexClientProvider>
            <JotaiProvider>
              <Toaster />
              {children}
              <Modals />
            </JotaiProvider>
          </ConvexClientProvider>
        </body>
      </html>
    </ConvexAuthNextjsServerProvider>
  );
}
