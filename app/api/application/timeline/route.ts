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
    const { userEmail, step } = body;

    if (!userEmail || !step) {
      return NextResponse.json(
        { message: "User email and step description are required" },
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

    const timelineStep = await prisma.timelineStep.create({
      data: {
        step,
        date: new Date().toISOString(),
        applicationId: user.application.id,
      },
    });

    return NextResponse.json(
      {
        message: "Timeline step added successfully",
        timelineStep,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Add timeline step error:", error);
    return NextResponse.json(
      { message: "An error occurred while adding the timeline step" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
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
        { message: "Application not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(user.application.timeline);
  } catch (error) {
    console.error("Get timeline steps error:", error);
    return NextResponse.json(
      { message: "An error occurred while fetching timeline steps" },
      { status: 500 }
    );
  }
}
