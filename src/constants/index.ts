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
      id: "basic",
      name: `${process.env.NEXT_PUBLIC_BASIC_PKG_NAME}`,
      priceCents: Number(`${process.env.NEXT_PUBLIC_BASIC_PKG_PRICE_IN_CENT}`),
      currency: `${process.env.NEXT_PUBLIC_BASIC_PKG_CURRENCY}`,
      description: `${process.env.NEXT_PUBLIC_BASIC_PKG_DESCRIPTION}`
        .split("\n")
        .filter((it) => !!it),
      printedPhotoNumber: Number(
        `${process.env.NEXT_PUBLIC_BASIC_PKG_PRINTED_PHOTO_NUMBER}`,
      ),
      isPopular: process.env.NEXT_PUBLIC_BASIC_PKG_IS_POPULAR === "true",
      isPickUp: process.env.NEXT_PUBLIC_BASIC_PKG_IS_PICKUP === "true",
    },
    {
      id: "standard",
      name: `${process.env.NEXT_PUBLIC_STANDARD_PKG_NAME}`,
      priceCents: Number(
        `${process.env.NEXT_PUBLIC_STANDARD_PKG_PRICE_IN_CENT}`,
      ),
      currency: `${process.env.NEXT_PUBLIC_STANDARD_PKG_CURRENCY}`,
      description: `${process.env.NEXT_PUBLIC_STANDARD_PKG_DESCRIPTION}`
        .split("\n")
        .filter((it) => !!it),
      printedPhotoNumber: Number(
        `${process.env.NEXT_PUBLIC_STANDARD_PKG_PRINTED_PHOTO_NUMBER}`,
      ),
      isPopular: process.env.NEXT_PUBLIC_STANDARD_PKG_IS_POPULAR === "true",
      isPickUp: process.env.NEXT_PUBLIC_STANDARD_PKG_IS_PICKUP === "true",
    },
    {
      id: "premium",
      name: `${process.env.NEXT_PUBLIC_PREMIUM_PKG_NAME}`,
      priceCents: Number(
        `${process.env.NEXT_PUBLIC_PREMIUM_PKG_PRICE_IN_CENT}`,
      ),
      currency: `${process.env.NEXT_PUBLIC_PREMIUM_PKG_CURRENCY}`,
      description: `${process.env.NEXT_PUBLIC_PREMIUM_PKG_DESCRIPTION}`
        .split("\n")
        .filter((it) => !!it),
      printedPhotoNumber: Number(
        `${process.env.NEXT_PUBLIC_PREMIUM_PKG_PRINTED_PHOTO_NUMBER}`,
      ),
      isPopular: process.env.NEXT_PUBLIC_PREMIUM_PKG_IS_POPULAR === "true",
      isPickUp: process.env.NEXT_PUBLIC_PREMIUM_PKG_IS_PICKUP === "true",
    },
  ] satisfies ProductPackage[],
  perAdditionalPhotoPriceInCent: Number(
    `${process.env.NEXT_PUBLIC_PER_ADDITIONAL_PHOTO_PRICE_IN_CENT}`,
  ),
};
