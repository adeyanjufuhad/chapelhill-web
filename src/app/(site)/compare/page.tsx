import type { Metadata } from "next";
import { Suspense } from "react";
import { CompareTable } from "@/components/developments/CompareTable";
import { PageHeader } from "@/components/site/PageHeader";
import { getDevelopments } from "@/lib/db/public";

export const metadata: Metadata = {
  title: "Compare developments",
  description: "Compare Chapelhill developments side by side: location, price, homes, specifications and amenities.",
};

export default async function ComparePage() {
  const developments = await getDevelopments();
  return (
    <>
      <PageHeader
        eyebrow="Compare"
        title="Side by side,"
        accent="at a glance."
        intro="Choose up to three developments to compare location, price, homes, specifications and amenities."
        crumbs={[{ label: "Developments", href: "/developments" }, { label: "Compare" }]}
      />
      <section aria-label="Comparison" className="container-luxe pt-4 pb-24 sm:pb-36">
        <Suspense fallback={<div className="bg-stone h-[640px] animate-pulse rounded-[24px]" />}>
          <CompareTable developments={developments} />
        </Suspense>
      </section>
    </>
  );
}
