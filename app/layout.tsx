import {
  BadgeCheckIcon,
  BanIcon,
  InfoIcon,
  LoaderIcon,
  TriangleAlert,
  XIcon,
} from "lucide-react";
import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import type React from "react";
import { Toaster } from "sonner";

import { Providers as SessionProvider } from "@/app/providers/session-provider";
import { ThemeProvider } from "@/app/providers/theme-provider";
import "./globals.css";

const geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Student Application Tracker",
  description:
    "Track your application status and get assistance from our AI chatbot",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={geistMono.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
          themes={["light", "dark"]}
        >
          <SessionProvider>{children}</SessionProvider>
          <Toaster
            richColors
            duration={4000}
            gap={8}
            visibleToasts={3}
            position="top-center"
            hotkey={["escape", "esc"]}
            style={{
              animationDuration: "0.35s",
            }}
            toastOptions={{
              style: {
                borderRadius: "8px",
                padding: "12px 16px",
                boxShadow: "var(--shadow-md)",
                border: "1px solid var(--border)",
              },
              classNames: {
                success:
                  "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border-green-200 dark:border-green-800",
                error:
                  "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 border-red-200 dark:border-red-800",
                warning:
                  "bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800",
                info: "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800",
              },
            }}
            expand
            className="toast-container"
            mobileOffset={8}
            dir="ltr"
            swipeDirections={["top", "right"]}
            icons={{
              close: (
                <XIcon className="w-4 h-4 opacity-70 hover:opacity-100 transition-opacity" />
              ),
              error: (
                <BanIcon className="w-5 h-5 text-red-600 dark:text-red-400" />
              ),
              info: (
                <InfoIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              ),
              loading: (
                <LoaderIcon className="w-5 h-5 text-foreground animate-spin" />
              ),
              success: (
                <BadgeCheckIcon className="w-5 h-5 text-green-600 dark:text-green-400" />
              ),
              warning: (
                <TriangleAlert className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              ),
            }}
            theme="system"
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
