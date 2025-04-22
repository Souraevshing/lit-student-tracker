import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userEmail = email || session.user.email;

    const user = await prisma.user.findUnique({
      where: { email: userEmail },
      include: {
        application: {
          include: {
            timeline: {
              orderBy: {
                date: "desc",
              },
            },
          },
        },
      },
    });

    if (!user || !user.application) {
      return NextResponse.json(
        { error: "Application not found" },
        { status: 404 }
      );
    }

    let nextStep = null;
    switch (user.application.status) {
      case "pending":
        nextStep = "Your application is being reviewed.";
        break;
      case "interview":
        nextStep =
          "Please schedule an interview with one of our administrators.";
        break;
      case "interview_scheduled":
        nextStep =
          "Your interview has been scheduled. Please check your email for details.";
        break;
      case "task":
        nextStep =
          "Please submit the required task to proceed with your application.";
        break;
      case "task_submitted":
        nextStep = "Your task has been submitted and is being reviewed.";
        break;
      case "payment":
        nextStep =
          "Your application has been accepted. Please complete the payment to secure your admission.";
        break;
      case "accepted":
        nextStep =
          "Congratulations! Your application has been accepted and enrollment is complete.";
        break;
      case "rejected":
        nextStep =
          "We regret to inform you that your application has been rejected.";
        break;
    }

    return NextResponse.json({
      status: user.application.status,
      timeline: user.application.timeline,
      nextStep,
    });
  } catch (error) {
    console.error("Error fetching application status:", error);
    return NextResponse.json(
      { error: "Failed to fetch application status" },
      { status: 500 }
    );
  }
}
