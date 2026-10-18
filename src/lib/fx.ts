import { fxRatesPlaceholder } from "@/content/placeholders";

export type Currency = "NGN" | "USD" | "GBP";

export const currencies: { code: Currency; symbol: string; label: string }[] = [
  { code: "NGN", symbol: "₦", label: "Naira" },
  { code: "USD", symbol: "$", label: "US dollar" },
  { code: "GBP", symbol: "£", label: "Pound sterling" },
];

// Display-only rates (NGN per unit). PLACEHOLDER: set by the admin in Phase 6, no live FX feed.
export const fxRates = { NGN: 1, USD: fxRatesPlaceholder.USD, GBP: fxRatesPlaceholder.GBP } satisfies Record<Currency, number>;
export const fxUpdatedAt = fxRatesPlaceholder.updatedAt;

export function convertFromNgn(amountNgn: number, to: Currency) {
  return amountNgn / fxRates[to];
}

export function formatMoney(amountNgn: number, currency: Currency, { compact = false } = {}) {
  const value = convertFromNgn(amountNgn, currency);
  return new Intl.NumberFormat(currency === "NGN" ? "en-NG" : currency === "GBP" ? "en-GB" : "en-US", {
    style: "currency",
    currency,
    notation: compact ? "compact" : "standard",
    maximumFractionDigits: compact ? 1 : 0,
  }).format(value);
}
