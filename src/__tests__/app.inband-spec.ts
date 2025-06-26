import { describe, it, expect, jest } from "@jest/globals";
jest.setTimeout(120 * 1000); // Set a timeout for the tests

import { testImageBase64 } from "./test-image";

const HOST = "http://127.0.0.1:3000";

const getHttp = async (url: string) => {
  const response = await fetch(url, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  return response;
};

const postHttp = async (url: string, body: object) => {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return response;
};

describe("[Photo Studio InBand Tests]", () => {
  // Get the signed URL and create the photo
  let photoUuid = "";
  let getIdPhotoWatermarkResData = {};
  {
    let signedUrl = "";
    const apiPath = "/api/photo/get-signed-url";
    describe(apiPath, () => {
      it("[Get Signed URL]", async () => {
        const url = `${HOST}${apiPath}`;
        const response = await postHttp(url, {
          specCode: "us-passport",
        });
        expect(response.status).toBe(200);
        const data = await response.json();
        expect(data).toHaveProperty("signedUrl");
        signedUrl = data.signedUrl;
        console.log(`The signed URL: ${signedUrl}`);
      });
    });

    describe("IDP /v2/getIdPhotoWatermark", () => {
      it("[Get Id Photo Watermark]", async () => {
        const url = signedUrl;
        const response = await postHttp(url, {
          imageBase64: testImageBase64,
        });
        const data = await response.json();
        photoUuid = data["photoUuid"];
        expect(!!photoUuid).toBeTruthy();
        console.log(`The photo Uuid: ${photoUuid}`);
        getIdPhotoWatermarkResData = data;
      });
    });
  }

  // Create a Stripe payment intent
  let paymentIntentId = "";
  {
    const apiPath = "/api/stripe/create-payment-intent";
    describe(apiPath, () => {
      it("[Create Stripe Payment Intent]", async () => {
        const url = `${HOST}${apiPath}`;
        const response = await postHttp(url, {
          amountInCent: 1000, // 10 USD
          currency: "USD",
          photoUuid: photoUuid,
        });
        expect(response.status).toBe(200);
        const data = await response.json();
        expect(data).toHaveProperty("clientSecret");
        paymentIntentId = data.clientSecret.split("_secret_")[0]; // Extract the payment intent ID
        console.log(`The payment intent ID: ${paymentIntentId}`);
      });
    });
  }

  // Query the passport photo (payment failed)
  {
    describe("/api/photo/verify-stripe-payment-get-photo", () => {
      it("[Verify Stripe Payment Get Photo]", async () => {
        const apiPath = `/api/photo/verify-stripe-payment-get-photo`;
        const url = `${HOST}${apiPath}`;
        const response = await postHttp(url, {
          photoUuid: photoUuid,
          paymentIntentId: paymentIntentId,
        });
        expect(response.status).toBe(402);
      });
    });
  }

  // Query the passport photo (payment succeeded)
  {
    describe("/api/photo/verify-stripe-payment-get-photo", () => {
      it("[Verify Stripe Payment Get Photo]", async () => {
        const apiPath = `/api/photo/verify-stripe-payment-get-photo`;
        const url = `${HOST}${apiPath}`;
        const response = await postHttp(url, {
          photoUuid: "2506231150DRDGH3MUF", // Replace with a valid photo UUID
          paymentIntentId: "pi_3RdLsF4KkbZaMjq21KYLip6t", // Replace with a valid payment intent ID
        });
        expect(response.status).toBe(200);
        const data = await response.json();
        expect(data).toHaveProperty("photoUuid");
        expect(data).toHaveProperty("specCode");
      });
    });
  }
});
