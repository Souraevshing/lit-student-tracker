"use client";

import { ChevronLeftIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import ChatBot from "@/app/components/chatbot";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export default function ChatPage() {
  const { data: session, status: authStatus } = useSession();
  const router = useRouter();
  const [applicationStatus, setApplicationStatus] = useState<string | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (authStatus === "unauthenticated") {
      router.push("/login");
    }
  }, [authStatus, router]);

  useEffect(() => {
    async function fetchApplicationStatus() {
      if (session?.user?.email) {
        try {
          setLoading(true);
          const response = await fetch(
            `/api/application/status?email=${session.user.email}`
          );

          if (!response.ok) {
            toast.error("Failed to fetch application status");
            throw new Error("Failed to fetch application status");
          }

          const data = await response.json();

          setApplicationStatus(data.status);
          setError("");
        } catch (error) {
          toast.error("Error fetching application status");
          console.error("Error fetching application status:", error);
          setError(
            "Failed to load your application status. Please try again later."
          );
        } finally {
          setLoading(false);
        }
      }
    }

    if (authStatus === "authenticated") {
      fetchApplicationStatus();
    }
  }, [session, authStatus]);

  if (authStatus === "loading" || loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (authStatus === "unauthenticated") {
    return null;
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <Link href="/dashboard">
          <Button variant="ghost" size="sm" className="mb-4 cursor-pointer">
            <ChevronLeftIcon className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Chat with AI Assistant</h1>
        <p className="text-muted-foreground">
          Ask questions about your application, the program, or get help with
          the process
        </p>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-md mb-6 border border-red-200">
          {error}
        </div>
      )}

      <ChatBot status={applicationStatus} />
    </div>
  );
}
