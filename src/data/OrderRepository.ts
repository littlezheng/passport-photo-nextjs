import type { OrderModel } from "../models/OrderModel";
import { idpSaasService, type IdpSaasService } from "./network/IdpSaasService";

export class OrderRepository {
  private idpSaasService: IdpSaasService;

  constructor(idpSaasService: IdpSaasService) {
    this.idpSaasService = idpSaasService;
  }

  async createOrder(
    specCode: string,
    imageDataURL: string,
  ): Promise<OrderModel> {
    const getSignedUrlRes = await this.idpSaasService.getSignedUrl({
      specCode,
    });

    const createWatermarkPhotoRes =
      await this.idpSaasService.createWatermarkPhoto(
        getSignedUrlRes.signedUrl,
        { imageBase64: imageDataURL },
      );

    const orderId = createWatermarkPhotoRes.photoUuid;

    const newOrder: OrderModel = {
      orderId,
      specCode,
      status: "unpaid",
      croppedNoBgWatermarkImageUrl: createWatermarkPhotoRes.idPhotoUrl,
      issues: createWatermarkPhotoRes.issues,
    };

    return newOrder;
  }

  async getOrder(
    orderId: string,
    paymentIntentId: string,
  ): Promise<OrderModel> {
    const getOrderRes = await this.idpSaasService.verifyStripePaymentGetPhoto({
      photoUuid: orderId,
      paymentIntentId,
    });

    const order: OrderModel = {
      orderId: getOrderRes.photoUuid,
      specCode: getOrderRes.specCode,
      status: "ORDER_EFFECTIVELY",
      croppedNoBgNoWatermarkImageUrl: getOrderRes.idPhotoTempResultPhotoUrl,
      issues: [],
    };

    return order;
  }
}

// Shared instance
export const orderRepository = new OrderRepository(idpSaasService);
