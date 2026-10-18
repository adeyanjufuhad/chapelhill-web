export type Currency = "NGN" | "USD" | "GBP";

/** NGN per unit of each display currency. Set by the admin (no live FX feed). */
export type Rates = { USD: number; GBP: number };

export const currencies: { code: Currency; symbol: string; label: string }[] = [
  { code: "NGN", symbol: "₦", label: "Naira" },
  { code: "USD", symbol: "$", label: "US dollar" },
  { code: "GBP", symbol: "£", label: "Pound sterling" },
];

export function convertFromNgn(amountNgn: number, to: Currency, rates: Rates) {
  return to === "NGN" ? amountNgn : amountNgn / rates[to];
}

export function formatMoney(amountNgn: number, currency: Currency, rates: Rates, { compact = false } = {}) {
  const value = convertFromNgn(amountNgn, currency, rates);
  return new Intl.NumberFormat(currency === "NGN" ? "en-NG" : currency === "GBP" ? "en-GB" : "en-US", {
    style: "currency",
    currency,
    notation: compact ? "compact" : "standard",
    maximumFractionDigits: compact ? 1 : 0,
  }).format(value);
}
