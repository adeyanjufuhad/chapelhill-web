import { whatsappNumber } from "@/content/company";

/** wa.me link with an optional prefilled message. */
export function whatsappLink(message?: string) {
  const base = `https://wa.me/${whatsappNumber}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}
