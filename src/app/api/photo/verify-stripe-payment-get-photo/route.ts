import { NextRequest, NextResponse } from "next/server";
import { handleForwardRequest, forwardRequest } from "@/lib/api";
import { getStripeInstance } from "@/lib/stripe";

type RequestBody = {
  photoUuid: string;
  paymentIntentId: string;
};

const stripe = getStripeInstance();

export async function POST(req: NextRequest): Promise<NextResponse> {
  const { photoUuid, paymentIntentId }: RequestBody = await req.json();
  console.log(
    `Current photoUuid: ${photoUuid}, paymentIntentId: ${paymentIntentId}`,
  );

  if (!photoUuid || !paymentIntentId) {
    return NextResponse.json(
      { error: "photoUuid and paymentIntentId are required" },
      { status: 400 },
    );
  }

  let amountInCents: number | undefined;
  let currency: string | undefined;
  let paymentStatus: string | undefined;
  let printedPhotoNumber: number | undefined;

  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    amountInCents = paymentIntent.amount;
    currency = paymentIntent.currency;
    paymentStatus = paymentIntent.status;
    printedPhotoNumber =
      Number(paymentIntent?.metadata?.printedPhotoNumber) || 0;

    if (paymentStatus !== "succeeded") {
      return NextResponse.json(
        { error: "Payment not succeeded" },
        { status: 402 },
      );
    }

    if (paymentIntent.metadata.photoUuid !== photoUuid) {
      return NextResponse.json(
        { error: "photoUuid does not match payment intent" },
        { status: 400 },
      );
    }
  } catch (error) {
    console.error("Error verifying payment and getting photo:", error);
    return NextResponse.json(
      { error: "Invalid payment intent ID" },
      { status: 400 },
    );
  }

  // Update photo user metadata with order information
  try {
    await forwardRequest("POST", "/v2/updateIdPhotoUserMetadata", {
      photoUuid,
      userMetadata: {
        paymentIntentId,
        amountInCents,
        currency,
        printedPhotoNumber,
        paymentStatus,
      },
    });
  } catch (error) {
    console.error("Error updating user metadata:", error);
    // Continue even if metadata update fails - this is not critical
  }

  try {
    return await handleForwardRequest(
      forwardRequest("POST", "/v2/getIdPhotoNoWatermark", {
        photoUuid: photoUuid,
      }),
      {
        onSuccess: (data) => ({
          status: 200,
          body: {
            photoUuid: data.photoUuid,
            specCode: data.specCode,
            idPhotoTempResultPhotoUrl: data.idPhotoUrl,
            idPhotoOriginalBgPhotoUrl: data.idPhotoOriginalBgUrl,
            amountInCents: amountInCents,
            currency: currency,
            paymentStatus: paymentStatus,
          },
        }),
        onError: ({ status, responseText }) => ({
          status: 400,
          body: {
            error: `Bad request: ${responseText}`,
          },
        }),
      },
    );
  } catch (error) {
    console.error("Error verifying payment and getting photo:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
