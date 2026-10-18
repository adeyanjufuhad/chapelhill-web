// Development data from chapelhill.com.ng property pages (October 2026).
// Fields set to null are not published by the client yet. They render as
// "On request" and are tracked in CONTENT-NEEDED.md. This file seeds the
// Supabase `developments` table in Phase 6.

export type DevelopmentStatus = "for_sale" | "coming_soon" | "sold_out";

export type DevelopmentImage = {
  src: string;
  alt: string;
  width: number;
  height: number;
  /** Render or artist's impression rather than a photograph. */
  render?: boolean;
};

export type Development = {
  slug: string;
  name: string;
  area: string;
  city: string;
  state: string;
  status: DevelopmentStatus;
  propertyType: string;
  bedrooms: number[];
  baths: string | null;
  sqm: string | null;
  titleType: string | null;
  priceFromNgn: number;
  headline: string;
  summary: string;
  description: string[];
  amenities: string[];
  /** Approximate area-level pin until the client confirms site coordinates. */
  location: { lat: number; lng: number; approximate: boolean };
  images: DevelopmentImage[];
  featured: boolean;
};

export const statusLabel: Record<DevelopmentStatus, string> = {
  for_sale: "For Sale",
  coming_soon: "Coming Soon",
  sold_out: "Sold Out",
};

export const developments: Development[] = [
  {
    slug: "ivy-homes-abijo",
    name: "Ivy Homes",
    area: "Abijo GRA, Lekki",
    city: "Lagos",
    state: "Lagos",
    status: "for_sale",
    propertyType: "Apartments",
    bedrooms: [1, 2, 3],
    baths: null,
    sqm: null,
    titleType: null,
    priceFromNgn: 40_000_000,
    headline: "Ivy Homes is located in the prestigious Abijo GRA area of Lekki. It is the only GRA in the Lekki axis of Lagos.",
    summary: "Luxury 1, 2 and 3 bedroom residences in the only GRA on the Lekki axis.",
    description: [
      "Located in one of the fastest growing areas of Lagos State, Ivy Homes is only a 30 minute drive from the Dangote refinery and 45 minutes from Victoria Island.",
      "It has paved access roads and is less than 3 minutes from the popular Lekki-Epe Expressway.",
      "Ivy Homes has a wide range of high quality features. From fitted kitchens to fully interlocked roads, every apartment is designed with your peace and comfort in mind. All Ivy Homes apartments will be provided with 24/7 power and a fully installed solar system. Additional accessories will be provided at an extra cost subject to brand choice and market prices.",
    ],
    amenities: ["Luxury finishes", "24/7 security", "24/7 power", "Solar system", "Fitted kitchens", "Interlocked roads", "Efficient drainage", "Parking spaces"],
    location: { lat: 6.4683, lng: 3.6575, approximate: true },
    images: [
      { src: "/images/developments/ivy-abijo-01.jpg", alt: "Completed Ivy Homes apartment block in Abijo GRA, grey facade against a blue sky", width: 1920, height: 2560 },
      { src: "/images/developments/ivy-abijo-02.jpg", alt: "Artist's impression of the Ivy Homes apartment block with ground-floor parking and landscaped gardens", width: 838, height: 662, render: true },
    ],
    featured: true,
  },
  {
    slug: "ivy-homes-ogudu",
    name: "Ivy Homes II",
    area: "Ogudu GRA",
    city: "Lagos",
    state: "Lagos",
    status: "for_sale",
    propertyType: "Residences",
    bedrooms: [3, 4],
    baths: null,
    sqm: null,
    titleType: null,
    priceFromNgn: 550_000_000,
    headline: "Ogudu GRA is one of the foremost government reserved areas on the Lagos mainland.",
    summary: "3 and 4 bedroom luxury residences in one of the Lagos mainland’s foremost GRAs.",
    description: [
      "Ogudu GRA boasts a mix of affluent residents from diverse backgrounds, encompassing both high and middle classes.",
      "Centrally located and less than 45 minutes from the airport, Ogudu sits on the other side of Ikeja, the seat of government and commercial activity.",
      "Ogudu GRA is easily accessible via the Third Mainland Bridge, the direct link to Lagos Island and the business district. Given the high calibre of residents, the security system is designed to incorporate a blend of both police and private security services.",
    ],
    amenities: ["Luxury finishes", "24/7 security", "24/7 power", "Interlocked roads", "Efficient drainage", "Parking spaces"],
    location: { lat: 6.5735, lng: 3.3925, approximate: true },
    // PLACEHOLDER: the current site reuses the Abijo render here. See CONTENT-NEEDED.md.
    images: [
      { src: "/images/developments/ivy-ogudu-01.jpg", alt: "Artist's impression of a contemporary Ivy Homes residential block (placeholder image)", width: 907, height: 699, render: true },
    ],
    featured: true,
  },
  {
    slug: "brains-and-hammers",
    name: "Brains & Hammers",
    area: "Airport Road",
    city: "Abuja",
    state: "FCT",
    status: "for_sale",
    propertyType: "Semi-detached duplexes",
    bedrooms: [3, 4],
    baths: null,
    sqm: null,
    titleType: null,
    priceFromNgn: 70_000_000,
    headline: "Discover Brains & Hammers Estate on Airport Road, where mid-luxury living blends seamlessly with family-focused design in one of Abuja’s most sought-after locations.",
    summary: "Mid-luxury, family-focused 3 and 4 bedroom homes on Abuja’s Airport Road.",
    description: [
      "This carefully crafted residential community offers a secure, stylish, and convenient environment, perfect for families who refuse to settle for anything less than comfort and quality.",
      "Ideally located along the prestigious Airport Road, the estate offers unmatched access to Abuja’s major landmarks.",
      "Known for its top-tier infrastructure and strategic convenience, the Airport Road corridor connects residents effortlessly to business hubs, the international airport, and key commercial centres, making it the perfect choice for professionals and families who value both prestige and practicality.",
    ],
    amenities: ["State-of-the-art security", "Recreational facilities", "Community centre", "Green spaces", "Family-friendly environment", "Parking spaces"],
    location: { lat: 8.9806, lng: 7.3986, approximate: true },
    images: [
      { src: "/images/developments/brains-hammers-01.webp", alt: "Artist's impression of white semi-detached duplexes at Brains & Hammers Estate with pergola carports", width: 1024, height: 581, render: true },
    ],
    featured: true,
  },
];

export function getDevelopment(slug: string) {
  return developments.find((d) => d.slug === slug);
}
