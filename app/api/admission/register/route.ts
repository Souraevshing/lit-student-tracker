import { hash } from "bcryptjs";
import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, name, age, gender, qualification, courseChoice } =
      body;

    if (
      !email ||
      !password ||
      !name ||
      !age ||
      !gender ||
      !qualification ||
      !courseChoice
    ) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "User with this email already exists" },
        { status: 400 }
      );
    }

    const hashedPassword = await hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        age: Number(age),
        gender,
        qualification,
        course: courseChoice,
        application: {
          create: {
            status: "pending",
            timeline: {
              create: {
                step: `Application Submitted for ${courseChoice}`,
                date: new Date().toISOString(),
              },
            },
          },
        },
      },
    });

    return NextResponse.json(
      { message: "User registered successfully", user: user },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { message: "An error occurred during registration" },
      { status: 500 }
    );
  }
}
