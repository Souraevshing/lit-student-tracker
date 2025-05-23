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
import AdmissionPage from "../admission/page";

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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
    <div className="min-h-screen bg-background">
      <header className="bg-card shadow sticky top-0 z-10 border-b border-border">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center cursor-pointer">
            <GraduationCapIcon className="w-6 h-6 text-primary mr-2" />
            <h1 className="text-xl font-bold text-foreground">LIT School</h1>
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
              className="text-destructive hover:text-destructive hover:bg-destructive/10 cursor-pointer"
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
          <div className="flex justify-center w-full">
            <TabsList className="mb-6">
              <TabsTrigger
                value="dashboard"
                className="flex items-center gap-2"
              >
                <HomeIcon className="w-4 h-4" />
                <span className="hidden sm:inline">Dashboard</span>
              </TabsTrigger>
              <TabsTrigger
                value="admission"
                className="flex items-center gap-2"
              >
                <ClipboardIcon className="w-4 h-4" />
                <span className="hidden sm:inline">Admission</span>
              </TabsTrigger>
              <TabsTrigger value="profile" className="flex items-center gap-2">
                <UserIcon className="w-4 h-4" />
                <span className="hidden sm:inline">Profile</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="dashboard">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-6">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-xl flex items-center">
                      <FileTextIcon className="w-5 h-5 mr-2 text-primary" />
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
                          <div className="border rounded-md p-4 bg-muted/50 border-border">
                            {application.timeline &&
                            application.timeline.length > 0 ? (
                              <ol className="relative border-l border-border ml-3 space-y-4">
                                {application.timeline.map((item, idx) => (
                                  <li key={idx} className="mb-4 ml-6">
                                    <span className="absolute flex items-center justify-center w-6 h-6 bg-blue-600 rounded-full -left-3 ring-8 ring-background">
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
                              <p className="text-muted-foreground text-sm">
                                No timeline events yet.
                              </p>
                            )}
                          </div>
                        </div>

                        {application.nextStep && (
                          <div className="bg-primary/10 border border-primary/20 rounded-md p-4">
                            <h3 className="font-medium text-primary mb-1">
                              Next Step:
                            </h3>
                            <p className="text-primary/90">
                              {application.nextStep}
                            </p>

                            {application.status === "interview" && (
                              <Link href="/schedule-interview">
                                <Button className="mt-3 bg-primary hover:bg-primary/90 text-primary-foreground cursor-pointer">
                                  Schedule Interview
                                </Button>
                              </Link>
                            )}

                            {application.status === "task" && (
                              <Link href="/submit-task">
                                <Button className="mt-3 bg-primary hover:bg-primary/90 text-primary-foreground cursor-pointer">
                                  Submit Task
                                </Button>
                              </Link>
                            )}

                            {application.status === "payment" && (
                              <Link href="/payment">
                                <Button className="mt-3 bg-primary hover:bg-primary/90 text-primary-foreground cursor-pointer">
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
                      <UserIcon className="w-5 h-5 mr-2 text-primary" />
                      Your Profile
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Name</p>
                        <p className="font-medium">
                          {session.user?.name || "Not provided"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Email</p>
                        <p className="font-medium">{session.user?.email}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Course</p>
                        <p className="font-medium">
                          {userProfile?.course || "Not specified"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">
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
            <AdmissionPage />
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
                      <h3 className="font-medium text-muted-foreground">
                        Personal Information
                      </h3>
                      <div className="grid grid-cols-1 gap-4 mt-2">
                        <div>
                          <p className="text-sm text-muted-foreground">Name</p>
                          <p className="font-medium">
                            {session.user?.name || "Not provided"}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Email</p>
                          <p className="font-medium">{session.user?.email}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Age</p>
                          <p className="font-medium">
                            {userProfile?.age || "Not provided"}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Gender
                          </p>
                          <p className="font-medium">
                            {userProfile?.gender?.toUpperCase() ||
                              "Not provided"}
                          </p>
                        </div>
                      </div>
                    </div>
                    <Link href="/edit-profile">
                      <Button className="bg-primary hover:bg-primary/90 text-primary-foreground cursor-pointer">
                        Edit Profile
                      </Button>
                    </Link>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium text-muted-foreground">
                        Academic Information
                      </h3>
                      <div className="grid grid-cols-1 gap-4 mt-2">
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Qualification
                          </p>
                          <p className="font-medium">
                            {userProfile?.qualification || "Not provided"}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Course
                          </p>
                          <p className="font-medium">
                            {userProfile?.course || "Not specified"}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Application Date
                          </p>
                          <p className="font-medium">
                            {application?.timeline?.[0]?.date
                              ? formatDate(application.timeline[0].date)
                              : "Not available"}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Status
                          </p>
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
