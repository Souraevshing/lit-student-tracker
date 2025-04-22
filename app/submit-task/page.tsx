"use client";

import { ChevronLeftIcon, FileTextIcon, UploadIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type React from "react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Textarea } from "@/components/ui/textarea";

export default function SubmitTaskPage() {
  const { data: session, status: authStatus } = useSession();
  const router = useRouter();
  const [taskDescription, setTaskDescription] = useState("");
  const [taskLink, setTaskLink] = useState("");
  const [comments, setComments] = useState("");
  const [loading, setLoading] = useState(false);
  const [userCourse, setUserCourse] = useState<string | null>(null);

  useEffect(() => {
    if (authStatus === "unauthenticated") {
      router.push("/login");
    }
  }, [authStatus, router]);

  useEffect(() => {
    async function fetchUserCourse() {
      if (session?.user?.email) {
        try {
          const response = await fetch("/api/user/profile");
          if (response.ok) {
            const userData = await response.json();
            setUserCourse(userData.course);
          }
        } catch (error) {
          toast.error("Failed to fetch user profile");
          console.error("Error fetching user profile:", error);
        }
      }
    }

    if (session?.user?.email) {
      fetchUserCourse();
    }
  }, [session]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!taskDescription && !taskLink) {
      toast.error(
        "Please provide either a task description or a link to your work"
      );
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/application/submit-task", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          taskDescription,
          taskLink,
          comments,
        }),
      });

      if (response.ok) {
        toast.success("Task submitted successfully");
        router.push("/dashboard");
      } else {
        const error = await response.json();
        toast.error(error.message || "Failed to submit task");
      }
    } catch (error) {
      toast.error("An error occurred while submitting the task");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (authStatus === "loading") {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (authStatus !== "authenticated") {
    toast.error("User not authenticated");
    return null;
  }

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
          Submit Task
        </h1>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Task Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-lg">
                {userCourse
                  ? `${userCourse} Project Proposal`
                  : "Course Project Proposal"}
              </h3>
              <p className="text-gray-700 mt-2">
                Create a project proposal related to{" "}
                {userCourse || "your course"}. The proposal should include your
                project idea, target audience, implementation plan, and expected
                outcomes.
              </p>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-md p-4">
              <p className="text-amber-800">
                <strong>Deadline:</strong> Within 7 days of application
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Submit Your Work</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="taskDescription">Task Description</Label>
              <Textarea
                id="taskDescription"
                placeholder="Describe your project proposal here..."
                value={taskDescription}
                onChange={(e) => setTaskDescription(e.target.value)}
                className="min-h-[150px]"
              />
              <p className="text-sm text-muted-foreground">
                You can provide your project proposal directly in this text area
                or upload a link below.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="taskLink">Link to Your Work (Optional)</Label>
              <Input
                id="taskLink"
                type="url"
                placeholder="https://docs.google.com/document/d/..."
                value={taskLink}
                onChange={(e) => setTaskLink(e.target.value)}
              />
              <p className="text-sm text-muted-foreground">
                You can provide a link to Google Docs, Notion, or any other
                platform where you&apos;ve created your proposal.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="comments">Additional Comments (Optional)</Label>
              <Textarea
                id="comments"
                placeholder="Any additional information you'd like to share..."
                value={comments}
                onChange={(e) => setComments(e.target.value)}
              />
            </div>

            <Button
              type="submit"
              disabled={(!taskDescription && !taskLink) || loading}
              className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
            >
              {loading ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  Submitting...
                </>
              ) : (
                <>
                  <UploadIcon className="w-4 h-4 mr-2" />
                  Submit Task
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
