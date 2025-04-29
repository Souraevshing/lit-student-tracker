import { LogInIcon, UserPlusIcon } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 to-black text-center p-4">
      <div className="max-w-3xl">
        <h1 className="text-4xl font-bold mb-6 text-black">
          Welcome to LIT School
        </h1>
        <p className="mb-8 text-lg text-gray-400 max-w-2xl mx-auto">
          Unlock your creative potential with our specialized courses in Creator
          Marketing, Creatorpreneurship, and Next Gen Business.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link href="/login">
            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto cursor-pointer hover:bg-zinc-700 hover:text-white"
            >
              <LogInIcon className="w-4 h-4 mr-2" />
              Log In
            </Button>
          </Link>
          <Link href="/register">
            <Button
              className="w-full sm:w-auto cursor-pointer bg-blue-600 hover:bg-blue-700 text-white"
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
