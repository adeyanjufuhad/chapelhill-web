import type { Metadata } from "next";
import { Suspense } from "react";
import { ClosingCta } from "@/components/home/ClosingCta";
import { DevelopmentsExplorer, DevelopmentsGridFallback } from "@/components/developments/DevelopmentsExplorer";
import { PageHeader } from "@/components/site/PageHeader";
import { stock } from "@/content/stock";
import { getDevelopments } from "@/lib/db/public";

export const metadata: Metadata = {
  title: "Developments",
  description: "Homes for sale by Chapelhill in Abijo GRA and Ogudu GRA, Lagos, and on Airport Road, Abuja.",
};

export default async function DevelopmentsPage() {
  const developments = await getDevelopments();
  return (
    <>
      <PageHeader
        eyebrow="Developments"
        title="Find your"
        accent="next address."
        intro="Apartments and family homes in Lagos and Abuja, with flexible payment plans for buyers at home and abroad."
        crumbs={[{ label: "Developments" }]}
        image={{ src: stock.lagosBridgePylon.src, alt: stock.lagosBridgePylon.alt, position: "50% 35%" }}
      />
      <section aria-labelledby="all-developments" className="container-luxe pt-10 pb-24 sm:pt-16 sm:pb-36">
        <h2 id="all-developments" className="sr-only">
          All developments
        </h2>
        <Suspense fallback={<DevelopmentsGridFallback developments={developments} />}>
          <DevelopmentsExplorer developments={developments} />
        </Suspense>
      </section>
      <ClosingCta />
    </>
  );
}
