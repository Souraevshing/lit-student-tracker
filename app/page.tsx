import { LogInIcon, UserPlusIcon } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-background to-primary/20 text-center p-4">
      <div className="max-w-3xl">
        <h1 className="text-4xl font-bold mb-6 text-foreground">
          Welcome to LIT School
        </h1>
        <p className="mb-8 text-lg text-muted-foreground max-w-2xl mx-auto">
          Unlock your creative potential with our specialized courses in Creator
          Marketing, Creatorpreneurship, and Next Gen Business.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link href="/login">
            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto cursor-pointer"
            >
              <LogInIcon className="w-4 h-4 mr-2" />
              Log In
            </Button>
          </Link>
          <Link href="/register">
            <Button
              variant="default"
              className="w-full sm:w-auto cursor-pointer"
              size="lg"
            >
              <UserPlusIcon className="w-4 h-4 mr-2" />
              Apply Now
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
