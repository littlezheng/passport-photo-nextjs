import type { BusinessLocation } from "../models/BusinessLocation";
import type { SpecCode } from "../models/PhotoSpec";
import type { ProductPackage } from "../models/ProductPackage";

export const constants = {
  stripePublicKey: `${process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY}`,
  studioName: `${process.env.NEXT_PUBLIC_STUDIO_NAME}`,
  studioDescription: `${process.env.NEXT_PUBLIC_STUDIO_DESCRIPTION}`,
  defaultSpecCodes: [
    "us-passport",
    "us-visa",
    "china-passport",
    "china-visa",
  ] satisfies SpecCode[],
  businessLocations: [
    {
      address: `${process.env.NEXT_PUBLIC_BUSINESS_ADDRESS}`,
      phone: `${process.env.NEXT_PUBLIC_BUSINESS_PHONE}`,
      email: `${process.env.NEXT_PUBLIC_BUSINESS_EMAIL}`,
      hours: `${process.env.NEXT_PUBLIC_BUSINESS_HOURS}`,
    },
  ] satisfies BusinessLocation[],
  productPackages: [
    {
      id: "standard",
      name: `${process.env.NEXT_PUBLIC_STANDARD_PKG_NAME}`,
      priceCents: Number(
        `${process.env.NEXT_PUBLIC_STANDARD_PKG_PRICE_IN_CENT}`,
      ),
      currency: `${process.env.NEXT_PUBLIC_STANDARD_PKG_CURRENCY}`,
      description: `${process.env.NEXT_PUBLIC_STANDARD_PKG_DESCRIPTION}`.split(
        "\n",
      ),
      isPopular: true,
      isPickUp: true,
      printedPhotoNumber: Number(
        `${process.env.NEXT_PUBLIC_STANDARD_PKG_PRINTED_PHOTO_NUMBER}`,
      ),
    },
  ] satisfies ProductPackage[],
  perAdditionalPhotoPriceInCent: Number(
    `${process.env.NEXT_PUBLIC_PER_ADDITIONAL_PHOTO_PRICE_IN_CENT}`,
  ),
};
