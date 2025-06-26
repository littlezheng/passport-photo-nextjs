/**
 * Stripe API requests expect amounts to be provided in a currency’s smallest unit.
 * To charge 50 USD, provide an amount value of 5000 (that is, 5000 cents).
 * To charge 50 JPY, provide an amount value of 50.
 * https://stripe.com/docs/currencies#zero-decimal
 *
 * This function can convert amount in cent into stripe payment amount.
 * So we only need specify a price in cent in config.
 * currency  amountInCent  stripeAmount
 * USD       150           150
 * JPY       15000         150
 * KWD       150           1500
 * @param {number} amountInCent
 * @param {number} currency
 * @returns {number} stripeAmount
 */
export function amountInCentToStripeAmount(
  amountInCent: number,
  currency: string,
): number {
  const zeroDecimalCurrencies = new Set([
    "bif",
    "clp",
    "djf",
    "gnf",
    "jpy",
    "kmf",
    "krw",
    "mga",
    "pyg",
    "rwf",
    "ugx",
    "vnd",
    "vuv",
    "xaf",
    "xof",
    "xpf",
  ]);
  const threeDecimalCurrencies = new Set(["bhd", "jod", "kwd", "omr", "tnd"]);

  const scaler = (() => {
    if (zeroDecimalCurrencies.has(currency.toLocaleLowerCase())) {
      return 0.01;
    }
    if (threeDecimalCurrencies.has(currency.toLocaleLowerCase())) {
      return 10;
    }
    return 1;
  })();

  const stripeAmount = scaler * amountInCent;
  return stripeAmount;
}
