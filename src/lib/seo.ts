import { company } from "@/content/company";
import type { Development } from "@/content/developments";

export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://chapelhill.com.ng").replace(/\/$/, "");
export const absolute = (path: string) => (path.startsWith("http") ? path : `${siteUrl}${path.startsWith("/") ? "" : "/"}${path}`);

/** Serialise JSON-LD safely for a <script> tag (no "</script>" breakouts). */
export const jsonLd = (data: unknown) => ({ __html: JSON.stringify(data).replace(/</g, "\\u003c") });

export function organizationSchema() {
  const { address, phones, email } = company.contact;
  return {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    "@id": `${siteUrl}/#organization`,
    name: company.name,
    alternateName: company.shortName,
    url: siteUrl,
    logo: absolute("/brand/chapelhill-logo.png"),
    image: absolute("/build/final.webp"),
    description: company.description,
    email,
    telephone: phones.map((p) => p.e164),
    address: {
      "@type": "PostalAddress",
      streetAddress: `${address.line1}, ${address.line2}`,
      addressLocality: address.city,
      addressRegion: address.state,
      addressCountry: "NG",
    },
    areaServed: ["Lagos", "Abuja"].map((name) => ({ "@type": "City", name })),
    sameAs: company.socials.map((s) => s.href).filter((h) => h.startsWith("http")),
  };
}

export function developmentSchema(d: Development) {
  const url = absolute(`/developments/${d.slug}`);
  return {
    "@context": "https://schema.org",
    "@type": "Residence",
    "@id": `${url}#residence`,
    name: `${d.name}, ${d.area}`,
    description: d.summary,
    url,
    image: d.images.map((im) => absolute(im.src)),
    address: { "@type": "PostalAddress", addressLocality: d.area, addressRegion: d.state, addressCountry: "NG" },
    geo: d.location.approximate ? undefined : { "@type": "GeoCoordinates", latitude: d.location.lat, longitude: d.location.lng },
    numberOfRooms: Math.max(...d.bedrooms),
    amenityFeature: d.amenities.map((name) => ({ "@type": "LocationFeatureSpecification", name, value: true })),
    offers: {
      "@type": "Offer",
      url,
      priceCurrency: "NGN",
      price: d.priceFromNgn,
      priceSpecification: { "@type": "PriceSpecification", minPrice: d.priceFromNgn, priceCurrency: "NGN" },
      availability:
        d.status === "sold_out"
          ? "https://schema.org/SoldOut"
          : d.status === "coming_soon"
            ? "https://schema.org/PreOrder"
            : "https://schema.org/InStock",
      seller: { "@id": `${siteUrl}/#organization` },
    },
  };
}
