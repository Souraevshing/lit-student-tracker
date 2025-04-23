import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2025-03-31.basil",
});

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { amount, courseId } = body;

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

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL;

    const stripeSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: "LIT School Course Enrollment",
              description: `Enrollment fee for ${user.course}`,
            },
            unit_amount: Math.round(amount * 100),
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${baseUrl}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/payment?canceled=true`,
      metadata: {
        userId: user.id,
        applicationId: user.application.id,
        courseId: courseId || "",
      },
    });

    return NextResponse.json({ checkoutUrl: stripeSession.url });
  } catch (error) {
    console.error("Create checkout error:", error);
    return NextResponse.json(
      { message: "An error occurred while creating the checkout session" },
      { status: 500 }
    );
  }
}
