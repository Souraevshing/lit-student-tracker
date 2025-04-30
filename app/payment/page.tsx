"use client";

import { CheckCircleIcon, ChevronLeftIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export default function PaymentPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [courseDetails, setCourseDetails] = useState<{
    name: string;
    price: number;
    duration: string;
    id: string;
  } | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (session?.user?.email) {
      fetchCourseDetails();
    }
  }, [session]);

  const fetchCourseDetails = async () => {
    try {
      setCourseDetails({
        id: "course_123",
        name: "Creator Marketer",
        price: 1499,
        duration: "12 weeks",
      });
    } catch (error) {
      console.error("Error fetching course details:", error);
      toast.error("Failed to load course details");
    }
  };

  const handlePayment = async () => {
    if (!courseDetails) return;

    setLoading(true);

    try {
      const response = await fetch("/api/payment/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: courseDetails.price,
          courseId: courseDetails.id,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        toast.error("Payment failed");
        throw new Error(
          errorData.message || "Failed to create checkout session"
        );
      }

      const data = await response.json();

      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        throw new Error("No checkout URL returned from the server");
      }
    } catch (error) {
      console.error("Payment error:", error);
      toast.error(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="h-screen flex items-center justify-center bg-background text-foreground">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (status === "unauthenticated") {
    toast.error("User not authenticated");
    return null;
  }

  return (
    <div className="container mx-auto py-10 px-4 bg-background text-foreground">
      <Suspense fallback={null}>
        <PaymentStatusHandler />
      </Suspense>

      <div className="mb-6">
        <Link href="/dashboard">
          <Button variant="ghost" size="sm" className="mb-4">
            <ChevronLeftIcon className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Complete Your Payment</h1>
        <p className="text-muted-foreground">
          Secure your spot in the program by completing your payment
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Payment Information</CardTitle>
              <CardDescription>
                You will be redirected to our secure payment processor to
                complete your payment.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="bg-muted p-4 rounded-md">
                  <h3 className="font-medium text-foreground mb-2">
                    Important Information
                  </h3>
                  <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                    <li>Your payment is secure and encrypted</li>
                    <li>You will receive a receipt via email</li>
                    <li>
                      Access to course materials will be granted immediately
                      after payment
                    </li>
                  </ul>
                </div>

                <Button
                  onClick={handlePayment}
                  disabled={loading || !courseDetails}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {loading ? (
                    <>
                      <LoadingSpinner size="sm" className="mr-2" />
                      Processing...
                    </>
                  ) : (
                    "Proceed to Payment"
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              {courseDetails ? (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium text-lg">
                      {courseDetails.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {courseDetails.duration} course
                    </p>
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex justify-between mb-2">
                      <span>Course Fee</span>
                      <span>₹{courseDetails.price.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between mb-2 text-green-600">
                      <span>Discount</span>
                      <span>₹0.00</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg border-t pt-2 mt-2">
                      <span>Total</span>
                      <span>₹{courseDetails.price.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="bg-muted p-3 rounded-md text-sm">
                    <p className="flex items-start">
                      <CheckCircleIcon className="w-4 h-4 mr-2 mt-0.5 text-blue-600" />
                      Secure payment processing
                    </p>
                    <p className="flex items-start mt-2">
                      <CheckCircleIcon className="w-4 h-4 mr-2 mt-0.5 text-blue-600" />
                      Full access to course materials
                    </p>
                    <p className="flex items-start mt-2">
                      <CheckCircleIcon className="w-4 h-4 mr-2 mt-0.5 text-blue-600" />
                      Certificate upon completion
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center py-6">
                  <LoadingSpinner size="md" />
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function PaymentStatusHandler() {
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get("canceled")) {
      toast.error("Payment was canceled");
    }

    if (searchParams.get("success")) {
      toast.success("Payment was successful!");
    }
  }, [searchParams]);

  return null;
}
