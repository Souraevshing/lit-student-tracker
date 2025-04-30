/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { CalendarIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatApplicationStatus } from "@/lib/utils/format-status";

type TimelineStep = {
  step: string;
  date: string;
};

type ApplicationStatus = {
  status: string;
  email: string;
  timeline: TimelineStep[];
};

type User = {
  email: string;
  password: string;
  name: string;
  age: string;
  gender: string;
  qualification: string;
  courseChoice:
    | "creator-marketer"
    | "creatorpreneur"
    | "next-gen-business"
    | "";
};

const defaultUser: User = {
  email: "",
  password: "",
  name: "",
  age: "",
  gender: "",
  qualification: "",
  courseChoice: "",
};

export default function AdmissionPage() {
  const [user, setUser] = useState<User>(defaultUser);
  const [statusData, setStatusData] = useState<ApplicationStatus | null>(null);
  const [taskFile, setTaskFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [statusLoading, setStatusLoading] = useState(true);
  const [taskLoading, setTaskLoading] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);

  const [courseDetails, setCourseDetails] = useState({
    "creator-marketer": { price: 1499, name: "Creator Marketer" },
    creatorpreneur: { price: 1799, name: "Creatorpreneur" },
    "next-gen-business": { price: 1599, name: "Next Gen Business" },
  });

  const handleRegister = async () => {
    if (
      !user.email ||
      !user.password ||
      !user.name ||
      !user.age ||
      !user.gender ||
      !user.qualification ||
      !user.courseChoice
    ) {
      toast.error("All fields are required");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to register");
      }

      toast.success("Registered successfully!");

      const data = await res.json();
      if (data.user) {
        window.location.href = "/payment";
      }
    } catch (err) {
      console.error(err);
      toast.error(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const fetchStatus = async () => {
    setStatusLoading(true);
    try {
      const res = await fetch("/api/application/status");
      if (!res.ok) throw new Error("Failed to fetch status");

      const data: ApplicationStatus = await res.json();
      setStatusData(data);
    } catch (err) {
      console.error("Error fetching status:", err);
      toast.error("Error fetching application status");
    } finally {
      setStatusLoading(false);
    }
  };

  const submitTask = async () => {
    if (!taskFile) {
      toast.error("Please upload a task file");
      return;
    }

    setTaskLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", taskFile);

      const taskDescription = "Task submission via file upload";

      const res = await fetch("/api/application/submit-task", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          taskDescription,
          taskLink: "",
          comments: "Submitted from admission portal",
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to submit task");
      }

      toast.success("Task submitted successfully!");
      fetchStatus();
    } catch (err) {
      console.error("Task submission error:", err);
      toast.error(err instanceof Error ? err.message : "Failed to submit task");
    } finally {
      setTaskLoading(false);
    }
  };

  const proceedToPayment = async () => {
    if (!statusData) return;

    setPaymentLoading(true);
    try {
      const coursePrice =
        user.courseChoice && courseDetails[user.courseChoice]
          ? courseDetails[user.courseChoice].price
          : 1499;

      const response = await fetch("/api/payment/create-checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: coursePrice,
          courseId: user.courseChoice || "default-course",
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        toast.error(errorData.message || "Failed to create checkout session");
        throw new Error(
          errorData.message || "Failed to create checkout session"
        );
      }

      const data = await response.json();

      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        toast.error("No checkout URL returned from the server");
        throw new Error("No checkout URL returned from the server");
      }
    } catch (error) {
      console.error("Payment error:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "An error occurred while processing your payment"
      );
    } finally {
      setPaymentLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const formattedStatus = statusData?.status
    ? formatApplicationStatus(statusData.status)
    : "Pending";

  console.log(formattedStatus);

  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString();
    } catch (e) {
      return dateString;
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl text-gray-900 dark:text-gray-100">
      <h1 className="text-3xl font-bold mb-6">Admission Portal</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="w-full bg-white dark:bg-gray-800">
          <CardHeader>
            <CardTitle>Register</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Email"
                value={user.email}
                onChange={(e) => setUser({ ...user, email: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Password"
                value={user.password}
                onChange={(e) => setUser({ ...user, password: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                placeholder="Full Name"
                value={user.name}
                onChange={(e) => setUser({ ...user, name: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                type="number"
                placeholder="Age"
                value={user.age}
                onChange={(e) => setUser({ ...user, age: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              <Select
                value={user.gender}
                onValueChange={(value) => setUser({ ...user, gender: value })}
              >
                <SelectTrigger id="gender">
                  <SelectValue placeholder="Select Gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="qualification">Qualification</Label>
              <Select
                value={user.qualification}
                onValueChange={(value) =>
                  setUser({ ...user, qualification: value })
                }
              >
                <SelectTrigger id="qualification">
                  <SelectValue placeholder="Select Qualification" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high-school">High School</SelectItem>
                  <SelectItem value="bachelors">
                    Bachelor&apos;s Degree
                  </SelectItem>
                  <SelectItem value="masters">Master&apos;s Degree</SelectItem>
                  <SelectItem value="phd">PhD</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="courseChoice">Course Choice</Label>
              <Select
                value={user.courseChoice}
                onValueChange={(value) =>
                  setUser({
                    ...user,
                    courseChoice: value as User["courseChoice"],
                  })
                }
              >
                <SelectTrigger id="courseChoice">
                  <SelectValue placeholder="Select Course" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="creator-marketer">
                    Creator Marketer
                  </SelectItem>
                  <SelectItem value="creatorpreneur">Creatorpreneur</SelectItem>
                  <SelectItem value="next-gen-business">
                    Next Gen Business
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              style={{ width: "100% !important" }}
              onClick={handleRegister}
              className="w-full bg-blue-600 hover:bg-blue-700"
              disabled={loading}
            >
              {loading ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" /> Registering...
                </>
              ) : (
                "Register"
              )}
            </Button>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="bg-white dark:bg-gray-800">
            <CardHeader>
              <CardTitle>Application Status</CardTitle>
            </CardHeader>
            <CardContent>
              {statusLoading ? (
                <div className="flex justify-center items-center py-8">
                  <LoadingSpinner size="md" />
                </div>
              ) : statusData ? (
                <div className="space-y-4">
                  <div className="flex items-center">
                    <span className="font-medium mr-2">Status:</span>
                    <Badge variant="outline">
                      {formatApplicationStatus(statusData.status)}
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-medium">Timeline</h3>
                    <div className="border rounded-md p-4 bg-gray-50 dark:bg-gray-700 dark:border-gray-600">
                      {statusData.timeline && statusData.timeline.length > 0 ? (
                        <ol className="relative border-l border-gray-300 dark:border-gray-500 ml-3 space-y-4">
                          {statusData.timeline.map((step, idx) => (
                            <li key={idx} className="mb-4 ml-6">
                              <span className="absolute flex items-center justify-center w-6 h-6 bg-blue-100 dark:bg-blue-900 rounded-full -left-3 ring-8 ring-white dark:ring-gray-800">
                                <CalendarIcon className="w-3 h-3 text-blue-600 dark:text-blue-300" />
                              </span>
                              <h3 className="font-medium">{step.step}</h3>
                              <p className="text-sm text-gray-500 dark:text-gray-300">
                                {formatDate(step.date)}
                              </p>
                            </li>
                          ))}
                        </ol>
                      ) : (
                        <p className="text-gray-500 text-sm dark:text-gray-400">
                          No timeline events yet.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4 dark:text-gray-400">
                  No application data available.
                </p>
              )}
            </CardContent>
          </Card>

          {statusData?.status?.toLowerCase() === "registered" ||
            statusData?.status?.toLowerCase() === "task" ||
            (statusData?.status?.toLowerCase() === "task-required" && (
              <Card className="bg-white dark:bg-gray-800">
                <CardHeader>
                  <CardTitle>Submit Task</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="taskFile">Upload Task File</Label>
                    <Input
                      id="taskFile"
                      type="file"
                      onChange={(e) => {
                        if (e.target.files?.[0]) {
                          setTaskFile(e.target.files[0]);
                        }
                      }}
                    />
                    <p className="text-sm text-gray-500 dark:text-gray-300">
                      Upload your completed task as a PDF or ZIP file.
                    </p>
                  </div>

                  <Button
                    onClick={submitTask}
                    className="w-full bg-green-600 hover:bg-green-700"
                    disabled={taskLoading || !taskFile}
                  >
                    {taskLoading ? (
                      <>
                        <LoadingSpinner size="sm" className="mr-2" />{" "}
                        Submitting...
                      </>
                    ) : (
                      "Submit Task"
                    )}
                  </Button>
                </CardContent>
              </Card>
            ))}

          {(statusData?.status?.toLowerCase() === "accepted" ||
            statusData?.status?.toLowerCase() === "payment" ||
            statusData?.status?.toLowerCase() === "payment-required") && (
            <Card className="bg-white dark:bg-gray-800">
              <CardHeader>
                <CardTitle>Proceed to Payment</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700 dark:text-gray-300">
                  Your application has been accepted! Complete your payment to
                  secure your spot.
                </p>

                <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-md">
                  <h3 className="font-medium text-blue-800 dark:text-blue-300 mb-2">
                    Course Details
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Course:</span>
                      <span className="font-medium">
                        {user.courseChoice && courseDetails[user.courseChoice]
                          ? courseDetails[user.courseChoice].name
                          : "Selected Course"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Price:</span>
                      <span className="font-medium">
                        ₹
                        {user.courseChoice && courseDetails[user.courseChoice]
                          ? courseDetails[user.courseChoice].price
                          : 1499}
                      </span>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={proceedToPayment}
                  className="w-full bg-purple-600 hover:bg-purple-700"
                  disabled={paymentLoading}
                >
                  {paymentLoading ? (
                    <>
                      <LoadingSpinner size="sm" className="mr-2" />{" "}
                      Processing...
                    </>
                  ) : (
                    "Pay Now"
                  )}
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
