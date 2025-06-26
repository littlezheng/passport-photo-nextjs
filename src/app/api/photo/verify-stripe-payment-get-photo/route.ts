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

  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status !== "succeeded") {
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
