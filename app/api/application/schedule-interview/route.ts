import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { date, timeSlot } = body;

    if (!date || !timeSlot) {
      return NextResponse.json(
        { message: "Date and time slot are required" },
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
        status: "interview_scheduled",
        timeline: {
          create: {
            step: `Interview Scheduled for ${date} at ${timeSlot}`,
            date: new Date().toISOString(),
          },
        },
      },
    });

    return NextResponse.json(
      { message: "Interview scheduled successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Schedule interview error:", error);
    return NextResponse.json(
      { message: "An error occurred while scheduling the interview" },
      { status: 500 }
    );
  }
}
