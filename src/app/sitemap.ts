import type { MetadataRoute } from "next";
import { getDevelopments } from "@/lib/db/public";
import { absolute } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pages = [
    { path: "/", priority: 1, changeFrequency: "weekly" as const },
    { path: "/developments", priority: 0.9, changeFrequency: "weekly" as const },
    { path: "/services", priority: 0.7, changeFrequency: "monthly" as const },
    { path: "/about", priority: 0.6, changeFrequency: "monthly" as const },
    { path: "/gallery", priority: 0.6, changeFrequency: "monthly" as const },
    { path: "/calculator", priority: 0.6, changeFrequency: "monthly" as const },
    { path: "/compare", priority: 0.5, changeFrequency: "monthly" as const },
    { path: "/contact", priority: 0.7, changeFrequency: "yearly" as const },
  ];
  const developments = await getDevelopments();

  return [
    ...pages.map((p) => ({ url: absolute(p.path), changeFrequency: p.changeFrequency, priority: p.priority })),
    ...developments.map((d) => ({
      url: absolute(`/developments/${d.slug}`),
      changeFrequency: "weekly" as const,
      priority: 0.8,
      images: d.images.map((im) => absolute(im.src)),
    })),
  ];
}
