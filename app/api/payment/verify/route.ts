import { prisma } from "@/lib/prisma";

import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { email, paymentSuccess } = await req.json();
  if (!email || !paymentSuccess)
    return NextResponse.json({ error: "Invalid" }, { status: 400 });

  const user = await prisma.user.findUnique({
    where: { email },
    include: { application: true },
  });
  if (!user || !user.application)
    return NextResponse.json({ error: "User not found" }, { status: 404 });

  const now = new Date().toISOString();
  await prisma.application.update({
    where: { id: user.application.id },
    data: {
      status: "payment-done",
      timeline: {
        create: {
          step: "Payment Verified",
          date: now,
        },
      },
    },
  });

  return NextResponse.json({ message: "Payment verified and status updated." });
}
