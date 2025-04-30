"use client";

import { HomeIcon } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="h-screen flex items-center justify-center bg-background text-center p-4">
      <div className="max-w-md">
        <div className="mb-6 flex justify-center">
          <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center">
            <span className="text-6xl font-light">404</span>
          </div>
        </div>
        <h1 className="text-3xl font-bold mb-3 text-foreground">
          Page Not Found
        </h1>
        <p className="text-muted-foreground mb-6">
          Sorry, the page you are looking for doesn&apos;t exist or has been
          moved.
        </p>
        <Link href="/">
          <Button className="gap-2">
            <HomeIcon className="h-4 w-4" />
            Back to Home
          </Button>
        </Link>
      </div>
    </div>
  );
}
