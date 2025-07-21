import type { BusinessLocation } from "../models/BusinessLocation";
import type { SpecCode } from "../models/PhotoSpec";
import type { ProductPackage } from "../models/ProductPackage";

export const constants = {
  perAdditionalPhotoPriceInCent: Number(
    `${process.env.NEXT_PUBLIC_PER_ADDITIONAL_PHOTO_PRICE_IN_CENT}`,
  ),
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
      name: "Downtown",
      address: "2142A White Plains RdBronx, NY 10462",
      phone: "(718) 518-1887",
      email: "mandy@passportphotofast.com",
      hours: {
        "Mon-Fri": "9:00 AM - 7:00 PM",
        Sat: "10:00 AM - 6:00 PM",
        Sun: "12:00 PM - 5:00 PM",
      },
    },
  ] satisfies BusinessLocation[],
  productPackages: [
    {
      id: "basic",
      name: "Basic",
      priceCents: 599,
      currency: "usd",
      description: ["Digital photo"],
      printedPhotoNumber: 2,
    },
    {
      id: "standard",
      name: "Standard",
      priceCents: 999,
      currency: "usd",
      description: ["Digital photo"],
      // isPopular: true,
      isPickUp: true,
      printedPhotoNumber: 2,
    },
    {
      id: "premium",
      name: "Premium",
      priceCents: 1399,
      currency: "usd",
      description: ["Digital photo"],
      // isPickUp: true,
      printedPhotoNumber: 2,
    },
  ] satisfies ProductPackage[],
};
