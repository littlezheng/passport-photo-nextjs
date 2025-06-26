export interface ProductPackage {
  id: string; // App-wide ID (e.g., Stripe price ID or custom ID)
  name: string; // e.g., "Basic Package"
  priceCents: number; // Price in cents for Stripe (e.g., 1299 for $12.99)
  currency: string; // Currency code (e.g., 'usd')
  description: string[]; // List of features or services (e.g., ['2 printed photos', 'Government compliant', '10-minute service'])
  isPopular?: boolean;
}
