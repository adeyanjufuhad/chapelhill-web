"use client";

import Link from "next/link";
import FlowingMenu from "@/components/reactbits/FlowingMenu";
import { Reveal } from "@/components/motion/Reveal";
import { services } from "@/content/services";
import { stock } from "@/content/stock";

const sm = (src: string) => src.replace("/images/stock/", "/images/stock/sm/");

// One verb per service, the reference's "Buy / Sell / Rent" pattern.
const rows = [
  { verb: "Develop", slug: "property-development", image: sm(stock.siteAerial.src), marquee: "Buildings · Roads · Drainage · Structural steel" },
  { verb: "Renovate", slug: "remodeling-renovation", image: sm(stock.kitchenLight.src), marquee: "Carcass to finish · Space design · Partitions" },
  { verb: "Maintain", slug: "property-maintenance", image: sm(stock.electrician.src), marquee: "Plumbing · Electrical · AC · Roofing · Tiling" },
  { verb: "Manage", slug: "project-management", image: sm(stock.designDrafting.src), marquee: "Advisory · Consultants · Contractors" },
];

export function ServicesFlow() {
  return (
    <section aria-labelledby="services-heading" data-nav-tone="dark" className="theme-oxblood bg-oxblood-deep">
      <div className="container-luxe flex flex-col gap-6 pt-24 pb-12 sm:flex-row sm:items-end sm:justify-between sm:pt-32">
        <Reveal>
          <p className="eyebrow">What we do</p>
          <h2 id="services-heading" className="mt-4 text-[clamp(2.4rem,5.5vw,5rem)] leading-[0.98] tracking-[-0.045em]">
            How Chapelhill <span className="accent-italic">can help.</span>
          </h2>
        </Reveal>
        <Reveal delay={100}>
          <Link href="/services" className="text-gold-light text-sm font-medium underline-offset-4 hover:underline">
            All services and how we work →
          </Link>
        </Reveal>
      </div>

      <div className="h-[min(78svh,640px)] min-h-[420px]">
        <FlowingMenu
          ariaLabel="Services"
          align="left"
          showIndex
          showArrow
          imageShape="rounded"
          textColor="#f8f6f2"
          bgColor="#3f1112"
          marqueeBgColor="#dbb46b"
          marqueeTextColor="#1a1a1a"
          borderColor="rgba(248, 246, 242, 0.16)"
          items={rows.map((r) => ({
            text: r.verb,
            link: `/services#${r.slug}`,
            image: r.image,
            marquee: r.marquee,
            meta: services.find((s) => s.slug === r.slug)?.name,
          }))}
        />
      </div>
      <div className="h-16 sm:h-24" />
    </section>
  );
}
