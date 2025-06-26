import { NextRequest, NextResponse } from "next/server";
import { getStripeInstance } from "@/lib/stripe";

const stripe = getStripeInstance();

export async function POST(req: NextRequest): Promise<NextResponse> {
  const { amountInCent, currency, photoUuid } = await req.json();
  if (!amountInCent || !currency || !photoUuid) {
    return NextResponse.json(
      { error: "amountInCent, currency and photoUuid are required" },
      { status: 400 },
    );
  }

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCent,
      currency: currency.toLowerCase(),
      metadata: {
        photoUuid,
      },
    });

    return NextResponse.json(
      { clientSecret: paymentIntent.client_secret },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
