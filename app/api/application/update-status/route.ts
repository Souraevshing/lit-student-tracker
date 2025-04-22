import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { userEmail, status, note } = body;

    if (!userEmail || !status) {
      return NextResponse.json(
        { message: "User email and status are required" },
        { status: 400 }
      );
    }

    const validStatuses = [
      "pending",
      "interview",
      "interview_scheduled",
      "task",
      "task_submitted",
      "payment",
      "accepted",
      "rejected",
    ];

    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { message: "Invalid status value" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: userEmail },
      include: { application: true },
    });

    if (!user || !user.application) {
      return NextResponse.json(
        { message: "Application not found" },
        { status: 404 }
      );
    }

    await prisma.application.update({
      where: { id: user.application.id },
      data: {
        status,
        timeline: {
          create: {
            step: `Status updated to ${status}${note ? `: ${note}` : ""}`,
            date: new Date().toISOString(),
          },
        },
      },
    });

    return NextResponse.json(
      { message: "Application status updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Update application status error:", error);
    return NextResponse.json(
      { message: "An error occurred while updating the application status" },
      { status: 500 }
    );
  }
}
