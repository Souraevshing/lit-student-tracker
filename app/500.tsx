"use client";

import { AlertTriangle } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function ServerError() {
  return (
    <div className="h-screen flex items-center justify-center bg-background text-center p-4">
      <div className="max-w-lg">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
            <AlertTriangle className="h-8 w-8 text-destructive" />
          </div>
        </div>

        <h1 className="text-4xl font-bold text-foreground mb-4">
          500 - Server Error
        </h1>

        <p className="text-muted-foreground mb-6">
          Oops! Something went wrong on our end. Please try again later or
          contact support if the issue persists.
        </p>

        <Link href="/">
          <Button variant="destructive" size="lg">
            Go Home
          </Button>
        </Link>
      </div>
    </div>
  );
}
