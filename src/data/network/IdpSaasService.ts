import { HttpService } from "./HttpService";

export interface GetSignedUrlPayload {
  specCode: string;
}

export interface GetSignedUrlResult {
  signedUrl: string;
}

export interface CreateWatermarkPhotoPayload {
  imageBase64: string;
}

export interface CreateWatermarkPhotoResult {
  photoUuid: string;
  issues: string[];
  idPhotoUrl: string;
  idPhotoPngUrl?: string;
  idPhotoOriginalBgUrl?: string;
}

export interface GetPhotosResult {
  photoUuid: string;
  specCode: string;
  idPhotoNoBgPhotoUrl?: string; // Not cropped, no bg, no watermark
  idPhotoTempWatermarkPhotoUrl: string; // Cropped, no bg, has watermark
  idPhotoTempResultPhotoUrl?: string; // Cropped, no bg, no watermark
  idPhotoOriginalBgPhotoUrl?: string; // Cropped, has bg, no watermark
  idPhotoWithBgDataUrl?: string; // Cropped, has bg, has watermark
  idPhotoCode?: string;
}

export interface GetOrderResult {
  orderAmountInCent?: number;
  orderCurrency?: string;
  orderId: string | null;
  orderStatus: string;
  paymentMethod?: string;
  paymentResult?: string;
  paymentTransactionId?: string;
  priceId?: string;
  productDescription?: string;
  productId?: string;
  productName?: string;
}

export interface CreatePaymentIntentPayload {
  amountInCent: number;
  currency: string;
  photoUuid: string;
}

export interface CreatePaymentIntentResult {
  clientSecret: string;
}

export interface VerifyStripePaymentGetPhotoPayload {
  photoUuid: string;
  paymentIntentId: string;
}

export interface VerifyStripePaymentGetPhotoResult {
  photoUuid: string;
  specCode: string;
  idPhotoOriginalBgPhotoUrl: string;
  idPhotoTempResultPhotoUrl: string;
}

export class IdpSaasService {
  http: HttpService;

  constructor(baseURL: string) {
    this.http = new HttpService(baseURL);
  }

  async getSignedUrl(
    payload: GetSignedUrlPayload,
  ): Promise<GetSignedUrlResult> {
    return this.http.post("/api/photo/get-signed-url", payload);
  }

  async createWatermarkPhoto(
    signedUrl: string,
    payload: CreateWatermarkPhotoPayload,
  ): Promise<CreateWatermarkPhotoResult> {
    const http = new HttpService(signedUrl.replace("http:", "https:"));
    return http.post("", payload);
  }

  async getPhotos(orderId: string): Promise<GetPhotosResult> {
    return this.http.get(`/api/photo/${orderId}`);
  }

  async getOrder(orderId: string): Promise<GetOrderResult> {
    return this.http.get(`/api/order/${orderId}`);
  }

  async createPaymentIntent(
    payload: CreatePaymentIntentPayload,
  ): Promise<CreatePaymentIntentResult> {
    return this.http.post("/api/stripe/create-payment-intent", payload);
  }

  async verifyStripePaymentGetPhoto(
    payload: VerifyStripePaymentGetPhotoPayload,
  ): Promise<VerifyStripePaymentGetPhotoResult> {
    return this.http.post(
      "/api/photo/verify-stripe-payment-get-photo",
      payload,
    );
  }
}

export const idpSaasService = new IdpSaasService(
  `${process.env.NEXT_PUBLIC_IDP_SAAS_BASE_URL}`,
);
