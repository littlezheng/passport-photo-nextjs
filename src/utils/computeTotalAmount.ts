import { ProductPackage } from "@/models/ProductPackage";
import { constants } from "@/constants";

export function computeTotalAmount(
  pkg: ProductPackage,
  additionalPhotoNumber: number,
): number {
  const totalAmount =
    pkg.priceCents +
    additionalPhotoNumber * constants.perAdditionalPhotoPriceInCent;

  return totalAmount;
}
