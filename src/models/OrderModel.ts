import type { OrderStatus } from "./OrderStatus";

export interface OrderModel {
  orderId: string;
  croppedNoBgNoWatermarkImageUrl?: string;
  croppedNoBgWatermarkImageUrl?: string;
  issues: string[];
  orderAmountInCents?: number;
  orderCurrency?: string;
  paymentMethod?: string;
  paymentResult?: string;
  paymentTransactionId?: string;
  priceId?: string;
  productDescription?: string;
  productId?: string;
  productName?: string;
  specCode: string;
  status: OrderStatus;
}
