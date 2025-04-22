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
    const { paymentMethod, amount, cardDetails, transferDetails } = body;

    if (!paymentMethod || !amount) {
      return NextResponse.json(
        { message: "Payment method and amount are required" },
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

    if (paymentMethod === "credit-card") {
      if (
        !cardDetails ||
        !cardDetails.cardNumber ||
        !cardDetails.cardName ||
        !cardDetails.expiryDate ||
        !cardDetails.cvv
      ) {
        return NextResponse.json(
          { message: "Invalid card details" },
          { status: 400 }
        );
      }

      if (cardDetails.cardNumber.length < 16) {
        return NextResponse.json(
          { message: "Invalid card number" },
          { status: 400 }
        );
      }

      if (cardDetails.cvv.length < 3) {
        return NextResponse.json({ message: "Invalid CVV" }, { status: 400 });
      }
    } else if (paymentMethod === "bank-transfer") {
      if (
        !transferDetails ||
        !transferDetails.reference ||
        !transferDetails.date ||
        !transferDetails.amount
      ) {
        return NextResponse.json(
          { message: "Invalid transfer details" },
          { status: 400 }
        );
      }
    }

    await prisma.application.update({
      where: { id: user.application.id },
      data: {
        status: "accepted",
        timeline: {
          create: {
            step: `Payment of $${amount} processed via ${paymentMethod}`,
            date: new Date().toISOString(),
          },
        },
      },
    });

    return NextResponse.json(
      {
        message: "Payment processed successfully",
        transactionId: `TXN-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        status: "completed",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Process payment error:", error);
    return NextResponse.json(
      { message: "An error occurred while processing the payment" },
      { status: 500 }
    );
  }
}
