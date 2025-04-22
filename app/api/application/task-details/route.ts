/* eslint-disable @typescript-eslint/no-unused-vars */
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { course: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const courseSpecificTask = {
      title: `${user.course} Project Proposal`,
      description: `Create a project proposal related to ${user.course}. The proposal should include your project idea, target audience, implementation plan, and expected outcomes.`,
      deadline: "Within 7 days of application",
    };

    return NextResponse.json(courseSpecificTask);
  } catch (error) {
    console.error("Error fetching task details:", error);
    return NextResponse.json(
      { error: "Failed to fetch task details" },
      { status: 500 }
    );
  }
}
