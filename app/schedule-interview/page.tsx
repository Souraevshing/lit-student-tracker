"use client";

import { CalendarIcon, ChevronLeftIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type React from "react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function ScheduleInterviewPage() {
  const { data: session, status: authStatus } = useSession();
  const router = useRouter();
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [timeSlot, setTimeSlot] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);

  useEffect(() => {
    if (authStatus === "unauthenticated") {
      router.push("/login");
    }
  }, [authStatus, router]);

  useEffect(() => {
    if (date) {
      const slots = [
        "09:00 AM",
        "10:00 AM",
        "11:00 AM",
        "01:00 PM",
        "02:00 PM",
        "03:00 PM",
        "04:00 PM",
        "05:00 PM",
      ];
      setAvailableSlots(slots);
    } else {
      setAvailableSlots([]);
    }
  }, [date]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!date || !timeSlot) {
      toast.error("Please select both date and time");
      return;
    }

    setLoading(true);

    try {
      const formattedDate = date.toISOString().split("T")[0];

      const response = await fetch("/api/application/schedule-interview", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: session?.user?.email,
          date: formattedDate,
          timeSlot,
        }),
      });

      if (response.ok) {
        toast.success("Interview scheduled successfully");
        router.push("/dashboard");
      } else {
        const error = await response.json();
        toast.error(error.message || "Failed to schedule interview");
      }
    } catch (error) {
      toast.error("An error occurred while scheduling the interview");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (authStatus === "loading") {
    return <LoadingSpinner />;
  }

  if (authStatus !== "authenticated") {
    toast.error("User not authenticated");
    return null;
  }

  return (
    <div className="container mx-auto max-w-4xl py-8 px-4 text-foreground">
      <div className="mb-6">
        <Link href="/dashboard">
          <Button variant="ghost" size="sm" className="mb-4 cursor-pointer">
            <ChevronLeftIcon className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>
        <h1 className="text-2xl font-bold flex items-center">
          <CalendarIcon className="w-6 h-6 mr-2 text-primary" />
          Schedule Interview
        </h1>
      </div>

      <Card className="bg-background text-foreground">
        <CardHeader>
          <CardTitle>Select Interview Date and Time</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="date">Select Date</Label>
                <div className="border rounded-md p-3 bg-muted">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    disabled={(date) => {
                      const now = new Date();
                      now.setHours(0, 0, 0, 0);
                      const thirtyDaysFromNow = new Date();
                      thirtyDaysFromNow.setDate(now.getDate() + 30);

                      return (
                        date < now ||
                        date > thirtyDaysFromNow ||
                        date.getDay() === 0 ||
                        date.getDay() === 6
                      );
                    }}
                    className="rounded-md border bg-background"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="time">Select Time Slot</Label>
                <Select
                  disabled={!date || availableSlots.length === 0}
                  onValueChange={setTimeSlot}
                  value={timeSlot}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select time slot" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableSlots.map((slot) => (
                      <SelectItem key={slot} value={slot}>
                        {slot}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {!date && (
                  <p className="text-sm text-muted-foreground">
                    Please select a date first
                  </p>
                )}

                {date && availableSlots.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    No available slots for the selected date
                  </p>
                )}

                {date && timeSlot && (
                  <div className="mt-6 p-4 bg-primary/5 border border-primary/10 rounded-md">
                    <h3 className="font-medium text-primary mb-2">
                      Interview Details
                    </h3>
                    <p className="text-sm text-foreground">
                      <strong>Date:</strong> {date.toLocaleDateString()}
                    </p>
                    <p className="text-sm text-foreground">
                      <strong>Time:</strong> {timeSlot}
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                      The interview will be conducted via Zoom. You will receive
                      the meeting link via email before the scheduled time.
                    </p>
                  </div>
                )}
              </div>
            </div>

            <Button
              type="submit"
              disabled={!date || !timeSlot || loading}
              className="bg-primary hover:bg-primary/90 text-primary-foreground w-full cursor-pointer"
            >
              {loading ? <LoadingSpinner /> : "Confirm Interview"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
