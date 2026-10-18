/** ₦40M, ₦550M, ₦1.2B */
export function formatNgnShort(amount: number) {
  if (amount >= 1_000_000_000) return `₦${(amount / 1_000_000_000).toLocaleString("en-NG", { maximumFractionDigits: 1 })}B`;
  return `₦${(amount / 1_000_000).toLocaleString("en-NG", { maximumFractionDigits: 1 })}M`;
}

/** "1, 2 & 3 bed" */
export function formatBeds(beds: number[]) {
  if (beds.length === 1) return `${beds[0]} bed`;
  return `${beds.slice(0, -1).join(", ")} & ${beds.at(-1)} bed`;
}
