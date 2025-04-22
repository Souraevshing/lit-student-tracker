import { prisma } from "@/lib/prisma";

import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY || "", {
  apiVersion: "2025-03-31.basil",
});

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature") || "";

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.NEXT_PUBLIC_STRIPE_WEBHOOK_SECRET || ""
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json(
      { message: "Webhook signature verification failed" },
      { status: 400 }
    );
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    const applicationId = session.metadata?.applicationId;

    if (applicationId) {
      try {
        await prisma.application.update({
          where: { id: applicationId },
          data: {
            status: "accepted",
            timeline: {
              create: {
                step: "Payment completed and verified",
                date: new Date().toISOString(),
              },
            },
          },
        });

        await prisma.payment.create({
          data: {
            applicationId,
            amount: session.amount_total ? session.amount_total / 100 : 0,
            method: "stripe",
            status: "completed",
            reference: (session.payment_intent as string) || "manual",
            details: { checkoutSessionId: session.id },
          },
        });
      } catch (error) {
        console.error("Error processing payment:", error);
      }
    }
  }

  return NextResponse.json({ received: true });
}
