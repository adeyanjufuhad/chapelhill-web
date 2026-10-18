// Company facts copied from chapelhill.com.ng (October 2026).
// Items still awaiting client confirmation are listed in CONTENT-NEEDED.md.

export const company = {
  name: "Chapelhill Multicompany International Ltd",
  shortName: "Chapelhill",
  tagline: "Excellence in Property Development",
  description:
    "Chapelhill is a premier enterprise specializing in property development, construction, remodeling, renovation, and maintenance. We are committed to delivering exceptional quality and operational efficiency, consistently exceeding client expectations.",
  intro:
    "Embark on a journey of innovation and excellence with Chapelhill Multicompany International. Whether you have a specific project in mind or are seeking inspiration, we look forward to collaborating with you.",
  positioning: [
    "Property development",
    "Construction",
    "Remodeling & renovation",
    "Maintenance",
    "Project management",
  ],
  mission:
    "Exceeding customers' expectations through excellent delivery of construction services, property development, space design, and maintenance solutions.",
  vision:
    "To be the leading brand reputed for quality in the property development, construction and maintenance industry.",
  values: [
    { name: "Quality", body: "Uncompromising standards in materials, craft and finish." },
    { name: "Reliability", body: "Clear timelines, honest reporting and homes delivered as promised." },
    { name: "Efficiency", body: "Disciplined project management that respects your budget and time." },
  ],
  story: [
    "At Chapelhill Multicompany International, we specialize in property development, construction, remodeling, renovation, and maintenance, delivering top-tier solutions tailored to our clients' unique needs. With a commitment to quality, innovation, and precision, we transform spaces into enduring masterpieces.",
    "Our leadership team brings decades of expertise, serving high-net-worth individuals and leading corporate entities. With a meticulous focus on innovation, craftsmanship, and attention to detail, we create inspiring spaces that stand the test of time.",
  ],
  goals: {
    heading: "Where Home Meets Happiness",
    body: "At Chapelhill, we understand that every client is unique. That's why we tailor our services to match individual visions, turning ideas into reality with precision and excellence.",
    points: [
      "Expertise you can trust, results you'll love",
      "Maximizing value, exceeding expectations",
      "Finding your perfect match in real estate",
    ],
  },
  contact: {
    address: {
      line1: "Road 3, Block B4 357, HFP Shopping Complex",
      line2: "Abraham Adesanya Junction, Lekki-Epe Expressway",
      city: "Lekki",
      state: "Lagos",
      country: "Nigeria",
    },
    // PENDING CLIENT CONFIRMATION: the current site lists both numbers
    // inconsistently. See CONTENT-NEEDED.md.
    phones: [
      { label: "Primary", display: "+234 803 286 5488", e164: "+2348032865488" },
      { label: "Office", display: "+234 903 913 0207", e164: "+2349039130207" },
    ],
    email: "chapelhillmulticompanyltd@gmail.com",
    hours: "Mon to Sat, 8am to 6pm WAT",
  },
  // PLACEHOLDER: the current site links to "#". See CONTENT-NEEDED.md.
  socials: [
    { name: "Instagram", href: "#" },
    { name: "Facebook", href: "#" },
    { name: "LinkedIn", href: "#" },
  ],
} as const;

export const whatsappNumber = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "2348032865488").replace(/\D/g, "");
