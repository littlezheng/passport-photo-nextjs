import { NextRequest, NextResponse } from "next/server";
import { handleForwardRequest, forwardRequest } from "@/lib/api";

export async function POST(req: NextRequest): Promise<NextResponse> {
  const body = await req.json();

  if (!body.specCode) {
    return NextResponse.json(
      { error: "specCode is required" },
      { status: 400 },
    );
  }

  try {
    return await handleForwardRequest(
      forwardRequest("POST", "/v2/getSignedUrl", {
        specCode: body.specCode,
        photoTypeList: body.photoTypeList || [],
      }),
      {
        onSuccess: (data) => ({
          status: 200,
          body: data,
        }),
      },
    );
  } catch (error) {
    console.error("Error getting signed URL:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
