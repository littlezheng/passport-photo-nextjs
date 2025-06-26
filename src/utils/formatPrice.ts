export function formatPrice(
  amountCents: number,
  currency: string,
  locale: string = "en-US",
): string {
  const amount = amountCents / 100;
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(amount);
}
