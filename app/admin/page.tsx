"use client";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface TimelineStep {
  id: string;
  step: string;
  date: string;
}

interface Application {
  id: string;
  status: string;
  timeline: TimelineStep[];
  user: {
    id: string;
    email: string;
    name: string;
    course: string;
  };
}

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router, session]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/applications");

      if (!res.ok) {
        toast.error("Failed to fetch applications");
        throw new Error("Failed to fetch applications");
      }

      const data = await res.json();
      setApplications(data);
    } catch (error) {
      console.error("Error fetching applications:", error);
      toast.error("Failed to load applications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === "authenticated") {
      fetchApplications();
    }
  }, [status]);

  const updateStatus = async (id: string, status: string) => {
    setActionLoading(id);
    try {
      const res = await fetch("/api/application/update-status", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ applicationId: id, status }),
      });

      if (!res.ok) {
        toast.error("Failed to update status");
        throw new Error("Failed to update status");
      }

      toast.success(`Status updated to ${status}`);
      fetchApplications();
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status");
    } finally {
      setActionLoading(null);
    }
  };

  const addTimelineStep = async (id: string, step: string) => {
    setActionLoading(id);
    try {
      const res = await fetch("/api/application/timeline", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ applicationId: id, step }),
      });

      if (!res.ok) {
        toast.error("Failed to add timeline step");
        throw new Error("Failed to add timeline step");
      }

      toast.success("Timeline step added");
      fetchApplications();
    } catch (error) {
      console.error("Error adding timeline step:", error);
      toast.error("Failed to add timeline step");
    } finally {
      setActionLoading(null);
    }
  };

  const triggerDecision = async (
    id: string,
    decision: "accepted" | "rejected"
  ) => {
    setActionLoading(id);
    try {
      await updateStatus(id, decision);
      await addTimelineStep(
        id,
        `Application ${decision === "accepted" ? "Accepted" : "Rejected"}`
      );
      toast.success(
        `Application ${decision === "accepted" ? "accepted" : "rejected"}`
      );
    } catch (error) {
      console.error("Error processing decision:", error);
      toast.error("Failed to process decision");
    } finally {
      setActionLoading(null);
    }
  };

  const filteredApplications = applications.filter((app) => {
    if (filter === "all") return true;
    return app.status === filter;
  });

  if (status === "loading" || loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchApplications}
            className="flex items-center gap-2 cursor-pointer"
          >
            Refresh
          </Button>
          <Badge variant="outline" className="ml-2">
            {applications.length} Applications
          </Badge>
        </div>
      </div>

      <Tabs
        defaultValue="all"
        value={filter}
        onValueChange={setFilter}
        className="mb-6"
      >
        <TabsList className="grid grid-cols-2 md:grid-cols-6 w-full">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="interview">Interview</TabsTrigger>
          <TabsTrigger value="task_submitted">Task</TabsTrigger>
          <TabsTrigger value="accepted">Accepted</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="grid grid-cols-1 gap-6">
        {filteredApplications.length > 0 ? (
          filteredApplications.map((app) => (
            <Card key={app.id} className="overflow-hidden">
              <CardHeader className="bg-gray-50">
                <div className="flex flex-col md:flex-row justify-between md:items-center gap-2">
                  <CardTitle className="text-xl">
                    {app.user.name} ({app.user.email})
                  </CardTitle>
                  <Badge
                    variant={
                      app.status === "accepted"
                        ? "default"
                        : app.status === "rejected"
                        ? "destructive"
                        : "secondary"
                    }
                  >
                    {app.status}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Course: {app.user.course}
                </p>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateStatus(app.id, "interview")}
                      disabled={actionLoading === app.id}
                      className="flex-grow md:flex-grow-0 cursor-pointer"
                    >
                      Book Interview
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateStatus(app.id, "task")}
                      disabled={actionLoading === app.id}
                      className="flex-grow md:flex-grow-0 cursor-pointer"
                    >
                      Request Task
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateStatus(app.id, "payment")}
                      disabled={actionLoading === app.id}
                      className="flex-grow md:flex-grow-0 cursor-pointer"
                    >
                      Request Payment
                    </Button>
                    <Button
                      size="sm"
                      variant="default"
                      onClick={() => triggerDecision(app.id, "accepted")}
                      disabled={actionLoading === app.id}
                      className="flex-grow md:flex-grow-0 bg-green-600 text-white hover:bg-green-700 cursor-pointer"
                    >
                      Accept
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => triggerDecision(app.id, "rejected")}
                      disabled={actionLoading === app.id}
                      className="flex-grow md:flex-grow-0 cursor-pointer"
                    >
                      Reject
                    </Button>
                  </div>

                  {actionLoading === app.id && (
                    <div className="flex justify-center py-2">
                      <LoadingSpinner size="sm" />
                    </div>
                  )}

                  <div>
                    <h3 className="font-semibold mb-2">Timeline:</h3>
                    {app.timeline.length > 0 ? (
                      <ol className="relative border-l border-gray-300 ml-3 space-y-2">
                        {app.timeline.map((step) => (
                          <li key={step.id} className="mb-2 ml-6">
                            <span className="absolute flex items-center justify-center w-4 h-4 bg-blue-100 rounded-full -left-2 ring-4 ring-white">
                              <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                            </span>
                            <p className="font-medium text-sm">{step.step}</p>
                            <p className="text-xs text-gray-500">
                              {new Date(step.date).toLocaleDateString()}
                            </p>
                          </li>
                        ))}
                      </ol>
                    ) : (
                      <p className="text-sm text-gray-500">
                        No timeline events yet.
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-500">
              No applications found matching the selected filter.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
