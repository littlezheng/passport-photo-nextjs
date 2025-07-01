import { NextResponse } from "next/server";

function getIdphotoApiEndpoint(): string {
  const endpoint = process.env.IDPHOTO_API_ENDPOINT;
  // Check if the endpoint is defined and starts with http:// or https://
  if (endpoint?.startsWith("http://") || endpoint?.startsWith("https://")) {
    return endpoint;
  }
  // Default to the US endpoint if no valid endpoint is provided
  return "https://api-us.idphotoapp.com";
}

const IDPHOTO_API_ENDPOINT = getIdphotoApiEndpoint();
console.log(`Current idphoto api endpoint: ${IDPHOTO_API_ENDPOINT}`);

export const forwardRequest = async (
  method: string,
  path: string,
  body?: any,
) => {
  const url = `${IDPHOTO_API_ENDPOINT}${path}`;
  const options: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
    },
  };

  if (body) {
    options.body = JSON.stringify({
      ...body,
      apiKey: process.env.IDPHOTO_API_KEY,
      apiSecret: process.env.IDPHOTO_API_SECRET,
    });
  }

  const response = await fetch(url, options);
  return response;
};

type ErrorHandler = (params: { status: number; responseText: string }) => {
  status?: number;
  body: any;
};

type SuccessHandler<T> = (data: T) => { status?: number; body: any };

export async function handleForwardRequest<T = any>(
  requestPromise: Promise<Response>,
  options?: {
    onError?: ErrorHandler;
    onSuccess?: SuccessHandler<T>;
  },
): Promise<NextResponse> {
  try {
    const response = await requestPromise;
    const text = await response.text();

    if (!response.ok) {
      const status = response.status;
      console.error(`Forward request failed: ${status} - ${text}`);

      if (options?.onError) {
        const custom = options.onError({ status, responseText: text });
        return NextResponse.json(custom.body, {
          status: custom.status || status,
        });
      }

      return NextResponse.json(
        {
          error:
            response.status < 500
              ? `Client error: ${text}`
              : `Server error: ${text}`,
        },
        { status },
      );
    }

    const data: T = JSON.parse(text);

    if (options?.onSuccess) {
      const { status = 200, body } = options.onSuccess(data);
      return NextResponse.json(body, { status });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    console.error("Unexpected error during forwardRequest:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
