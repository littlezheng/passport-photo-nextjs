import { ProductPackage } from "@/models/ProductPackage";
import { constants } from "@/constants";
import { amountInCentToStripeAmount } from "./amountInCentToStripeAmount";

interface ComputeResult {
  totalAmount: number;
  stripeAmount: number;
  photoNumber: number;
}

export function computeTotalAndPhotoNumber(
  pkg: ProductPackage,
  additionalPhotoNumber: number,
): ComputeResult {
  const totalAmount =
    pkg.printedPhotoNumber === 0
      ? pkg.priceCents
      : pkg.priceCents +
        additionalPhotoNumber * constants.perAdditionalPhotoPriceInCent;

  const stripeAmount = amountInCentToStripeAmount(totalAmount, pkg.currency);

  const photoNumber =
    pkg.printedPhotoNumber === 0
      ? 0
      : pkg.printedPhotoNumber + additionalPhotoNumber;

  return {
    totalAmount,
    stripeAmount,
    photoNumber,
  };
}
