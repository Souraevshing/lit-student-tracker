"use client";

import confetti from "canvas-confetti";
import { CheckCircleIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export default function PaymentSuccessPage() {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated") {
      const duration = 3 * 1000;
      const end = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 2,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ["#3b82f6", "#10b981", "#6366f1"],
        });

        confetti({
          particleCount: 2,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ["#3b82f6", "#10b981", "#6366f1"],
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };

      frame();
    }
  }, [status]);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <LoadingSpinner />
      </div>
    );
  }

  if (status === "unauthenticated") {
    toast.error("You need to be logged in to view this page.");
    return null;
  }

  return (
    <div className="container mx-auto max-w-md py-16 px-4 bg-background text-foreground">
      <Card className="text-center">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-green-100 dark:bg-green-900 p-3">
              <CheckCircleIcon className="h-12 w-12 text-green-600" />
            </div>
          </div>
          <CardTitle className="text-2xl">Payment Successful!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-muted-foreground">
            Thank you for your payment. Your admission to LIT School has been
            confirmed. You will receive an email with all the details about your
            course, including start date and access instructions.
          </p>

          <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-md text-left border border-blue-100 dark:border-blue-800">
            <h3 className="font-medium text-blue-800 dark:text-blue-300 mb-2">
              Next Steps:
            </h3>
            <ul className="space-y-2 text-sm text-blue-700 dark:text-blue-200">
              <li className="flex items-start">
                <CheckCircleIcon className="w-4 h-4 mr-2 mt-0.5 text-blue-600 dark:text-blue-400" />
                Check your email for course access details
              </li>
              <li className="flex items-start">
                <CheckCircleIcon className="w-4 h-4 mr-2 mt-0.5 text-blue-600 dark:text-blue-400" />
                Complete your student profile
              </li>
              <li className="flex items-start">
                <CheckCircleIcon className="w-4 h-4 mr-2 mt-0.5 text-blue-600 dark:text-blue-400" />
                Join the orientation session
              </li>
            </ul>
          </div>

          <div className="flex flex-col space-y-3">
            <Link href="/dashboard">
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                Go to Dashboard
              </Button>
            </Link>
            <Link href="/course-materials">
              <Button variant="outline" className="w-full">
                View Course Materials
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
