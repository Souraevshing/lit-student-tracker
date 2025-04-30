/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import {
  CalendarIcon,
  ClipboardIcon,
  CreditCardIcon,
  FileTextIcon,
  GraduationCapIcon,
  HomeIcon,
  LogOutIcon,
  MessageSquareIcon,
  UserIcon,
} from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import ChatBot from "@/app/components/chatbot";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatApplicationStatus } from "@/lib/utils/format-status";
import { signOut } from "next-auth/react";

type TimelineStep = {
  step: string;
  date: string;
};

type UserProfile = {
  id: string;
  name: string;
  email: string;
  age: number | null;
  gender: string | null;
  qualification: string | null;
  course: string;
};

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [application, setApplication] = useState<{
    status: string;
    timeline: TimelineStep[];
    nextStep: string | null;
  } | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [_activeTab, setActiveTab] = useState("dashboard");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [router, status]);

  useEffect(() => {
    async function fetchStatus() {
      if (session?.user?.email) {
        try {
          const res = await fetch(
            `/api/application/status?email=${session.user.email}`
          );
          if (res.ok) {
            const data = await res.json();
            setApplication(data);
          }
        } catch (error) {
          toast.error("Failed to fetch application status");
          console.error("Failed to fetch application status:", error);
        }
      }
    }

    async function fetchUserProfile() {
      if (session?.user?.email) {
        try {
          const res = await fetch("/api/user/profile");
          if (res.ok) {
            const data = await res.json();
            setUserProfile(data);
          }
        } catch (error) {
          toast.error("Failed to fetch user profile");
          console.error("Failed to fetch user profile:", error);
        }
      }
    }

    if (session) {
      fetchStatus();
      fetchUserProfile();
    }
  }, [session]);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!session) return null;

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString();
    } catch (e) {
      console.error(e);
      return dateString;
    }
  };

  const formattedStatus = application?.status
    ? formatApplicationStatus(application.status)
    : "Pending";

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center cursor-pointer">
            <GraduationCapIcon className="w-6 h-6 text-blue-600 mr-2" />
            <h1 className="text-xl font-bold">LIT School</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm hidden md:inline-block font-medium">
              {session.user?.name || session.user?.email?.split("@")[0]}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                toast.error("Logged out");
                signOut({ redirectTo: "/" });
              }}
              className="text-red-500 hover:text-red-700 hover:bg-red-50 cursor-pointer"
            >
              <LogOutIcon className="w-4 h-4 mr-2" />
              Log Out
            </Button>
            <Button
              variant="secondary"
              size="lg"
              onClick={() => router.push("/account-details")}
            >
              Download Id Card
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 w-full">
        <Tabs
          defaultValue="dashboard"
          className="w-full"
          onValueChange={setActiveTab}
        >
          <TabsList className="grid grid-cols-3 md:grid-cols-5 mb-6 w-full">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <HomeIcon className="w-4 h-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="admission" className="flex items-center gap-2">
              <ClipboardIcon className="w-4 h-4" />
              <span className="hidden sm:inline">Admission</span>
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <UserIcon className="w-4 h-4" />
              <span className="hidden sm:inline">Profile</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-6">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-xl flex items-center">
                      <FileTextIcon className="w-5 h-5 mr-2 text-blue-600" />
                      Application Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {application ? (
                      <div className="space-y-4">
                        <div className="flex items-center">
                          <span className="font-medium mr-2">
                            Current Status:
                          </span>
                          <Badge
                            variant={
                              application.status === "pending"
                                ? "secondary"
                                : application.status === "accepted"
                                ? "default"
                                : application.status === "rejected"
                                ? "destructive"
                                : "secondary"
                            }
                          >
                            {formattedStatus}
                          </Badge>
                        </div>

                        <div className="space-y-2">
                          <h3 className="font-medium">Application Timeline</h3>
                          <div className="border rounded-md p-4 bg-gray-50">
                            {application.timeline &&
                            application.timeline.length > 0 ? (
                              <ol className="relative border-l border-gray-300 ml-3 space-y-4">
                                {application.timeline.map((item, idx) => (
                                  <li key={idx} className="mb-4 ml-6">
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
                              <p className="text-gray-500 text-sm">
                                No timeline events yet.
                              </p>
                            )}
                          </div>
                        </div>

                        {application.nextStep && (
                          <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                            <h3 className="font-medium text-blue-800 mb-1">
                              Next Step:
                            </h3>
                            <p className="text-blue-700">
                              {application.nextStep}
                            </p>

                            {application.status === "interview" && (
                              <Link href="/schedule-interview">
                                <Button className="mt-3 bg-blue-600 hover:bg-blue-700 text-white cursor-pointer">
                                  Schedule Interview
                                </Button>
                              </Link>
                            )}

                            {application.status === "task" && (
                              <Link href="/submit-task">
                                <Button className="mt-3 bg-blue-600 hover:bg-blue-700 text-white cursor-pointer">
                                  Submit Task
                                </Button>
                              </Link>
                            )}

                            {application.status === "payment" && (
                              <Link href="/payment">
                                <Button className="mt-3 bg-blue-600 hover:bg-blue-700 text-white cursor-pointer">
                                  <CreditCardIcon className="w-4 h-4 mr-2" />
                                  Make Payment
                                </Button>
                              </Link>
                            )}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-6">
                        <LoadingSpinner size="lg" />
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-xl flex items-center">
                      <UserIcon className="w-5 h-5 mr-2 text-blue-600" />
                      Your Profile
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Name</p>
                        <p className="font-medium">
                          {session.user?.name || "Not provided"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="font-medium">{session.user?.email}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Course</p>
                        <p className="font-medium">
                          {userProfile?.course || "Not specified"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">
                          Application Date
                        </p>
                        <p className="font-medium">
                          {application?.timeline?.[0]?.date
                            ? formatDate(application.timeline[0].date)
                            : "Not available"}
                        </p>
                      </div>
                    </div>

                    <Separator className="my-4" />

                    <Link href="/edit-profile">
                      <Button
                        variant="outline"
                        size="sm"
                        className="cursor-pointer"
                      >
                        Edit Profile
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Need Help?</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ChatBot status={application?.status || null} />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Quick Links</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <Link href="/application-status">
                        <Button
                          variant="ghost"
                          className="w-full justify-start cursor-pointer"
                        >
                          <FileTextIcon className="w-4 h-4 mr-2 flex-shrink-0" />
                          <span className="truncate">
                            Detailed Application Status
                          </span>
                        </Button>
                      </Link>

                      <Link href="/schedule-interview">
                        <Button
                          variant="ghost"
                          className="w-full justify-start cursor-pointer"
                        >
                          <CalendarIcon className="w-4 h-4 mr-2 flex-shrink-0" />
                          <span className="truncate">Schedule Interview</span>
                        </Button>
                      </Link>

                      <Link href="/submit-task">
                        <Button
                          variant="ghost"
                          className="w-full justify-start cursor-pointer"
                        >
                          <FileTextIcon className="w-4 h-4 mr-2 flex-shrink-0" />
                          <span className="truncate">Submit Task</span>
                        </Button>
                      </Link>

                      <Link href="/payment">
                        <Button
                          variant="ghost"
                          className="w-full justify-start cursor-pointer"
                        >
                          <CreditCardIcon className="w-4 h-4 mr-2 flex-shrink-0" />
                          <span className="truncate">Make Payment</span>
                        </Button>
                      </Link>

                      <Link href="/edit-profile">
                        <Button
                          variant="ghost"
                          className="w-full justify-start cursor-pointer"
                        >
                          <UserIcon className="w-4 h-4 mr-2 flex-shrink-0" />
                          <span className="truncate">Edit Profile</span>
                        </Button>
                      </Link>

                      <div className="mt-4">
                        <Link href="/chat">
                          <Button
                            variant="outline"
                            className="w-full justify-start cursor-pointer"
                          >
                            <MessageSquareIcon className="w-4 h-4 mr-2 flex-shrink-0" />
                            <span className="truncate">
                              Chat with AI Assistant
                            </span>
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="admission">
            <AdmissionUI />
          </TabsContent>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Your Profile</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium text-gray-500">
                        Personal Information
                      </h3>
                      <div className="grid grid-cols-1 gap-4 mt-2">
                        <div>
                          <p className="text-sm text-gray-500">Name</p>
                          <p className="font-medium">
                            {session.user?.name || "Not provided"}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Email</p>
                          <p className="font-medium">{session.user?.email}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Age</p>
                          <p className="font-medium">
                            {userProfile?.age || "Not provided"}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Gender</p>
                          <p className="font-medium">
                            {userProfile?.gender?.toUpperCase() ||
                              "Not provided"}
                          </p>
                        </div>
                      </div>
                    </div>
                    <Link href="/edit-profile">
                      <Button className="cursor-pointer">Edit Profile</Button>
                    </Link>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium text-gray-500">
                        Academic Information
                      </h3>
                      <div className="grid grid-cols-1 gap-4 mt-2">
                        <div>
                          <p className="text-sm text-gray-500">Qualification</p>
                          <p className="font-medium">
                            {userProfile?.qualification || "Not provided"}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Course</p>
                          <p className="font-medium">
                            {userProfile?.course || "Not specified"}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">
                            Application Date
                          </p>
                          <p className="font-medium">
                            {application?.timeline?.[0]?.date
                              ? formatDate(application.timeline[0].date)
                              : "Not available"}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Status</p>
                          <p className="font-medium">{formattedStatus}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function AdmissionUI() {
  const [user, setUser] = useState({
    email: "",
    password: "",
    name: "",
    age: "",
    gender: "",
    qualification: "",
    courseChoice: "",
  });
  const [statusData, setStatusData] = useState<{
    status: string;
    email: string;
    timeline: { step: string; date: string }[];
  } | null>(null);
  const [taskFile, setTaskFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

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
      fetchStatus();
    } catch (err) {
      console.error(err);
      toast.error(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const fetchStatus = async () => {
    try {
      const res = await fetch("/api/application/status");
      if (!res.ok) throw new Error("Failed to fetch status");

      const data = await res.json();
      setStatusData(data);
    } catch (err) {
      console.error("Error fetching status:", err);
      toast.error("Error fetching application status");
    }
  };

  const submitTask = async () => {
    if (!taskFile) {
      toast.error("Please upload a task file");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", taskFile);

      const res = await fetch("/api/application/submit-task", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to submit task");
      }

      toast.success("Task submitted!");
      fetchStatus();
    } catch (err) {
      console.error("Task submission error:", err);
      toast.error(err instanceof Error ? err.message : "Failed to submit task");
    } finally {
      setLoading(false);
    }
  };

  const proceedToPayment = () => {
    if (statusData?.status === "accepted") {
      window.location.href = "/payment";
    } else {
      toast.error("Your application is not accepted yet.");
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Admission Portal</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold mb-4">Register</h2>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium">Email</label>
                    <input
                      type="email"
                      className="w-full border rounded px-3 py-2 mt-1"
                      placeholder="Email"
                      value={user.email}
                      onChange={(e) =>
                        setUser({ ...user, email: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Password</label>
                    <input
                      type="password"
                      className="w-full border rounded px-3 py-2 mt-1"
                      placeholder="Password"
                      value={user.password}
                      onChange={(e) =>
                        setUser({ ...user, password: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Name</label>
                    <input
                      type="text"
                      className="w-full border rounded px-3 py-2 mt-1"
                      placeholder="Name"
                      value={user.name}
                      onChange={(e) =>
                        setUser({ ...user, name: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Age</label>
                    <input
                      type="number"
                      className="w-full border rounded px-3 py-2 mt-1"
                      placeholder="Age"
                      value={user.age}
                      onChange={(e) =>
                        setUser({ ...user, age: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Gender</label>
                    <select
                      className="w-full border rounded px-3 py-2 mt-1"
                      value={user.gender}
                      onChange={(e) =>
                        setUser({ ...user, gender: e.target.value })
                      }
                    >
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Qualification</label>
                    <select
                      className="w-full border rounded px-3 py-2 mt-1"
                      value={user.qualification}
                      onChange={(e) =>
                        setUser({ ...user, qualification: e.target.value })
                      }
                    >
                      <option value="">Select Qualification</option>
                      <option value="high-school">High School</option>
                      <option value="bachelors">Bachelor&apos;s Degree</option>
                      <option value="masters">Master&apos;s Degree</option>
                      <option value="phd">PhD</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Course Choice</label>
                    <select
                      className="w-full border rounded px-3 py-2 mt-1"
                      value={user.courseChoice}
                      onChange={(e) =>
                        setUser({ ...user, courseChoice: e.target.value })
                      }
                    >
                      <option value="">Select Course</option>
                      <option value="Creator Marketer">Creator Marketer</option>
                      <option value="Creatorpreneur">Creatorpreneur</option>
                      <option value="Next Gen Business">
                        Next Gen Business
                      </option>
                      <option value="Electronics Communication">
                        Electronics Communication
                      </option>
                    </select>
                  </div>
                </div>
                <Button
                  onClick={handleRegister}
                  className="mt-4 bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
                  disabled={loading}
                >
                  {loading ? "Registering..." : "Register"}
                </Button>
              </div>

              {statusData?.status === "Registered" && (
                <div>
                  <h2 className="text-lg font-semibold mb-4">Submit Task</h2>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium">
                        Upload Task File
                      </label>
                      <input
                        type="file"
                        className="w-full border rounded px-3 py-2 mt-1"
                        onChange={(e) => {
                          if (e.target.files?.[0]) {
                            setTaskFile(e.target.files[0]);
                          }
                        }}
                      />
                    </div>
                    <Button
                      onClick={submitTask}
                      className="bg-green-600 hover:bg-green-700 text-white cursor-pointer"
                      disabled={loading || !taskFile}
                    >
                      {loading ? "Submitting..." : "Submit Task"}
                    </Button>
                  </div>
                </div>
              )}

              {statusData?.status === "Accepted" && (
                <div>
                  <h2 className="text-lg font-semibold mb-4">
                    Proceed to Payment
                  </h2>
                  <Button
                    onClick={proceedToPayment}
                    className="bg-purple-600 hover:bg-purple-700 text-white cursor-pointer"
                    disabled={loading}
                  >
                    {loading ? "Processing..." : "Pay Now"}
                  </Button>
                </div>
              )}
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-4">Application Status</h2>
              {statusData ? (
                <div className="bg-gray-50 border rounded-md p-4">
                  <div className="mb-4">
                    <span className="font-medium">Status: </span>
                    <Badge>{statusData.status}</Badge>
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">Timeline</h3>
                    {statusData.timeline && statusData.timeline.length > 0 ? (
                      <ol className="relative border-l border-gray-300 ml-3 space-y-4">
                        {statusData.timeline.map((item, idx) => (
                          <li key={idx} className="mb-4 ml-6">
                            <span className="absolute flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full -left-3 ring-8 ring-white">
                              <CalendarIcon className="w-3 h-3 text-blue-600" />
                            </span>
                            <h3 className="font-medium">{item.step}</h3>
                            <p className="text-sm text-gray-500">{item.date}</p>
                          </li>
                        ))}
                      </ol>
                    ) : (
                      <p className="text-gray-500">No timeline events yet.</p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-gray-500">
                    No application data available.
                  </p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
