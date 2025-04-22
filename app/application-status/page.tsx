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
      <div className="h-screen flex items-center justify-center">
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
    <div className="container mx-auto max-w-4xl py-8 px-4">
      <div className="mb-6">
        <Link href="/dashboard">
          <Button variant="ghost" size="sm" className="mb-4 cursor-pointer">
            <ChevronLeftIcon className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>
        <h1 className="text-2xl font-bold flex items-center">
          <FileTextIcon className="w-6 h-6 mr-2 text-blue-600" />
          Application Status
        </h1>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 mb-6 border border-red-300 p-4 rounded-md">
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
                <ol className="relative border-l border-gray-300 ml-3 space-y-6">
                  {timeline.map((item) => (
                    <li key={item.id} className="mb-6 ml-6">
                      <span className="absolute flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full -left-3 ring-8 ring-white">
                        <CalendarIcon className="w-3 h-3 text-blue-600" />
                      </span>
                      <h3 className="font-medium">{item.step}</h3>
                      <p className="text-sm text-gray-500">
                        {formatDate(item.date)}
                      </p>
                    </li>
                  ))}
                </ol>
              ) : (
                <p className="text-gray-500">No timeline events yet.</p>
              )}
            </div>

            {status === "interview" && (
              <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                <h3 className="font-medium text-blue-800 mb-2">
                  Next Step: Schedule an Interview
                </h3>
                <p className="text-blue-700 mb-4">
                  Please schedule an interview with one of our administrators to
                  proceed with your application.
                </p>
                <Link href="/schedule-interview">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer">
                    Schedule Interview
                  </Button>
                </Link>
              </div>
            )}

            {status === "task" && (
              <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                <h3 className="font-medium text-blue-800 mb-2">
                  Next Step: Submit Required Task
                </h3>
                <p className="text-blue-700 mb-4">
                  Please complete and submit the required task to proceed with
                  your application.
                </p>
                <Link href="/submit-task">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer">
                    Submit Task
                  </Button>
                </Link>
              </div>
            )}

            {status === "payment" && (
              <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                <h3 className="font-medium text-blue-800 mb-2">
                  Next Step: Complete Payment
                </h3>
                <p className="text-blue-700 mb-4">
                  Congratulations! Your application has been accepted. Please
                  complete the payment to secure your admission.
                </p>
                <Link href="/payment">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer">
                    Make Payment
                  </Button>
                </Link>
              </div>
            )}

            {status === "accepted" && (
              <div className="bg-green-50 border border-green-200 rounded-md p-4">
                <h3 className="font-medium text-green-800 mb-2">
                  Application Accepted
                </h3>
                <p className="text-green-700">
                  Congratulations! Your application has been accepted and your
                  payment has been processed. Welcome to LIT School!
                </p>
              </div>
            )}

            {status === "rejected" && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <h3 className="font-medium text-red-800 mb-2">
                  Application Rejected
                </h3>
                <p className="text-red-700">
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
