"use client";

import { CalendarIcon, ChevronLeftIcon, FileTextIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { formatApplicationStatus } from "@/lib/utils/format-status";

type TimelineStep = {
  id: string;
  step: string;
  date: string;
};

export default function ApplicationStatusPage() {
  const { data: session, status: authStatus } = useSession();
  const router = useRouter();
  const [status, setStatus] = useState<string | null>(null);
  const [timeline, setTimeline] = useState<TimelineStep[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchStatus = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `/api/application/status?email=${session?.user?.email}`
      );

      if (!res.ok) {
        const errorData = await res.json();
        setError(errorData.error || "Failed to fetch status.");
        return;
      }

      const data = await res.json();
      setStatus(data.status);
      setTimeline(data.timeline);
      setError("");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred while fetching status."
      );
    } finally {
      setLoading(false);
    }
  }, [session?.user?.email]);

  useEffect(() => {
    if (authStatus === "unauthenticated") {
      router.push("/login");
    }
  }, [authStatus, router]);

  useEffect(() => {
    if (authStatus === "authenticated") {
      fetchStatus();
    }
  }, [authStatus, fetchStatus]);

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString();
    } catch (e) {
      console.error(e);
      return dateString;
    }
  };

  if (authStatus === "loading" || loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (authStatus !== "authenticated") {
    toast.error("User not authenticated");
    return null;
  }

  const formattedStatus = formatApplicationStatus(status || "");

  return (
    <div className="container mx-auto max-w-4xl py-8 px-4 bg-background text-foreground">
      <div className="mb-6">
        <Link href="/dashboard">
          <Button variant="ghost" size="sm" className="mb-4 cursor-pointer">
            <ChevronLeftIcon className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>
        <h1 className="text-2xl font-bold flex items-center">
          <FileTextIcon className="w-6 h-6 mr-2 text-primary" />
          Application Status
        </h1>
      </div>

      {error && (
        <div className="bg-destructive/10 text-destructive mb-6 border border-destructive/20 p-4 rounded-md">
          {error}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Current Status: {formattedStatus}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-medium mb-4">Application Timeline</h2>
              {timeline.length > 0 ? (
                <ol className="relative border-l border-border ml-3 space-y-6">
                  {timeline.map((item) => (
                    <li key={item.id} className="mb-6 ml-6">
                      <span className="absolute flex items-center justify-center w-6 h-6 bg-primary/10 rounded-full -left-3 ring-8 ring-background">
                        <CalendarIcon className="w-3 h-3 text-primary" />
                      </span>
                      <h3 className="font-medium">{item.step}</h3>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(item.date)}
                      </p>
                    </li>
                  ))}
                </ol>
              ) : (
                <p className="text-muted-foreground">No timeline events yet.</p>
              )}
            </div>

            {status === "interview" && (
              <div className="bg-primary/5 border border-primary/20 rounded-md p-4">
                <h3 className="font-medium text-primary mb-2">
                  Next Step: Schedule an Interview
                </h3>
                <p className="text-foreground mb-4">
                  Please schedule an interview with one of our administrators to
                  proceed with your application.
                </p>
                <Link href="/schedule-interview">
                  <Button className="bg-primary hover:bg-primary/90 text-primary-foreground cursor-pointer">
                    Schedule Interview
                  </Button>
                </Link>
              </div>
            )}

            {status === "task" && (
              <div className="bg-primary/5 border border-primary/20 rounded-md p-4">
                <h3 className="font-medium text-primary mb-2">
                  Next Step: Submit Required Task
                </h3>
                <p className="text-foreground mb-4">
                  Please complete and submit the required task to proceed with
                  your application.
                </p>
                <Link href="/submit-task">
                  <Button className="bg-primary hover:bg-primary/90 text-primary-foreground cursor-pointer">
                    Submit Task
                  </Button>
                </Link>
              </div>
            )}

            {status === "payment" && (
              <div className="bg-primary/5 border border-primary/20 rounded-md p-4">
                <h3 className="font-medium text-primary mb-2">
                  Next Step: Complete Payment
                </h3>
                <p className="text-foreground mb-4">
                  Congratulations! Your application has been accepted. Please
                  complete the payment to secure your admission.
                </p>
                <Link href="/payment">
                  <Button className="bg-primary hover:bg-primary/90 text-primary-foreground cursor-pointer">
                    Make Payment
                  </Button>
                </Link>
              </div>
            )}

            {status === "accepted" && (
              <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/30 rounded-md p-4">
                <h3 className="font-medium text-emerald-800 dark:text-emerald-400 mb-2">
                  Application Accepted
                </h3>
                <p className="text-emerald-700 dark:text-emerald-300">
                  Congratulations! Your application has been accepted and your
                  payment has been processed. Welcome to LIT School!
                </p>
              </div>
            )}

            {status === "rejected" && (
              <div className="bg-destructive/10 border border-destructive/20 rounded-md p-4">
                <h3 className="font-medium text-destructive mb-2">
                  Application Rejected
                </h3>
                <p className="text-destructive/90">
                  We regret to inform you that your application has been
                  rejected. Please contact our support team for more
                  information.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
