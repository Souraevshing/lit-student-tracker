import {
  BadgeCheckIcon,
  BanIcon,
  InfoIcon,
  LoaderIcon,
  TriangleAlert,
  XIcon,
} from "lucide-react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";

import "./globals.css";
import { Providers } from "./providers/session-provider";
import { ThemeProvider } from "./providers/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LIT -  Student Management",
  description: "Manage students timeline, schedule interviews and many more.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
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
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                border: "1px solid rgba(0, 0, 0, 0.06)",
              },
              classNames: {
                success: "bg-green-50 text-green-800 border-green-200",
                error: "bg-red-50 text-red-800 border-red-200",
                warning: "bg-amber-50 text-amber-800 border-amber-200",
                info: "bg-blue-50 text-blue-800 border-blue-200",
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
              error: <BanIcon className="w-5 h-5 text-red-600" />,
              info: <InfoIcon className="w-5 h-5 text-blue-600" />,
              loading: (
                <LoaderIcon className="w-5 h-5 text-gray-600 animate-spin" />
              ),
              success: <BadgeCheckIcon className="w-5 h-5 text-green-600" />,
              warning: <TriangleAlert className="w-5 h-5 text-amber-600" />,
            }}
            theme="system"
          />
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}
