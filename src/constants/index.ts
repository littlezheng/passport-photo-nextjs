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
      name: "Basic",
      priceCents: 599,
      currency: "usd",
      description: ["Digital photo"],
      printedPhotoNumber: 0,
    },
    {
      id: "standard",
      name: "Standard",
      priceCents: 999,
      currency: "usd",
      description: [],
      isPopular: true,
      isPickUp: true,
      printedPhotoNumber: 2,
    },
    {
      id: "premium",
      name: "Premium",
      priceCents: 1399,
      currency: "usd",
      description: ["Digital photo"],
      isPickUp: true,
      printedPhotoNumber: 2,
    },
  ] satisfies ProductPackage[],
  perAdditionalPhotoPriceInCent: Number(
    `${process.env.NEXT_PUBLIC_PER_ADDITIONAL_PHOTO_PRICE_IN_CENT}`,
  ),
};
