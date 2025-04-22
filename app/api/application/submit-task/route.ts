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
    const { taskDescription, taskLink, comments } = body;

    if (!taskDescription && !taskLink) {
      return NextResponse.json(
        { message: "Task description or link is required" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
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
        status: "task_submitted",
        timeline: {
          create: {
            step: `Task Submitted: ${
              taskDescription ? "Written submission" : "Link submission"
            }${comments ? ` with comments: ${comments}` : ""}`,
            date: new Date().toISOString(),
          },
        },
      },
    });

    return NextResponse.json(
      { message: "Task submitted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Submit task error:", error);
    return NextResponse.json(
      { message: "An error occurred while submitting the task" },
      { status: 500 }
    );
  }
}
