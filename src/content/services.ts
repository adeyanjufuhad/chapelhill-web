// Service copy from chapelhill.com.ng/services (verbatim descriptions;
// `scope` lists are the short versions from the project brief).

export type Service = {
  slug: string;
  number: string;
  name: string;
  summary: string;
  description: string;
  scope: string[];
};

export const services: Service[] = [
  {
    slug: "property-development",
    number: "01",
    name: "Property Development",
    summary: "Buildings, industrial properties and the infrastructure around them.",
    description:
      "We excel in designing and constructing diverse projects, from buildings to industrial properties. Our expertise spans automated architectural designs, road construction, drainage, and structural steel work for clients and corporations alike.",
    scope: ["Residential buildings", "Industrial properties", "Architectural design", "Roads", "Drainage", "Structural steel"],
  },
  {
    slug: "remodeling-renovation",
    number: "02",
    name: "Remodeling & Renovation",
    summary: "Impeccable finishing, from carcass to completed home.",
    description:
      "We specialize in impeccable finishing for structures, from carcasses to semi-completed projects. Our expertise extends to remodeling, renovation, and innovative space design, including rapid wall partitions.",
    scope: ["Finishing from carcass", "Semi-completed structures", "Space design", "Rapid wall partitions"],
  },
  {
    slug: "property-maintenance",
    number: "03",
    name: "Property Maintenance",
    summary: "Care for your property, so you can focus on what matters.",
    description:
      "Regular maintenance of our customers’ property and facilities: plumbing, electrical works, air-conditioning repairs, tiling, building works, roof leakages and reclamation of land in waterfront areas, to enable them to focus on their core businesses.",
    scope: ["Plumbing", "Electrical", "Air-conditioning", "Tiling", "Building works", "Roof leaks", "Waterfront land reclamation"],
  },
  {
    slug: "project-management",
    number: "04",
    name: "Project Management",
    summary: "Specialist advice and oversight at every stage.",
    description:
      "We offer specialist advice on property purchase, construction and development as well as management of consultants and contractors at both pre and post-contract stages to meet our clients’ requirements.",
    scope: ["Purchase advisory", "Construction advisory", "Development advisory", "Consultant management", "Contractor management", "Pre- and post-contract"],
  },
];

// "How we work", from chapelhill.com.ng/services.
export const processSteps = [
  {
    title: "Initial Consultation",
    body: "We start with a conversation to understand your vision, goals, and budget. This helps us align our services with your exact needs.",
  },
  {
    title: "Site Visit & Assessment",
    body: "Our team visits your site to evaluate the environment, collect data, and identify project opportunities or challenges.",
  },
  {
    title: "Proposal & Quotation",
    body: "We prepare a detailed project proposal, including the scope of work, design concepts (if applicable), timelines, and a transparent cost breakdown.",
  },
  {
    title: "Agreement & Kickoff",
    body: "Once approved, we formalize the agreement and assign a dedicated project manager to lead your project from start to finish.",
  },
  {
    title: "Project Execution & Updates",
    body: "We execute with precision and keep you informed through regular updates, site reports, and open communication.",
  },
  {
    title: "Final Delivery & Ongoing Support",
    body: "After final inspection and handover, we remain available for any needed maintenance or support to ensure long-term satisfaction.",
  },
];

export const whyChooseUs = {
  heading: "Real Estate Solutions That Click",
  body: "With a foundation built on years of dedicated service in property development, construction, remodeling, renovation, and maintenance, Chapelhill Multicompany International has established a legacy of unmatched expertise.",
};
