import type { Metadata } from "next";
import { Suspense } from "react";
import { PaymentCalculator } from "@/components/developments/PaymentCalculator";
import { PageHeader } from "@/components/site/PageHeader";

export const metadata: Metadata = {
  title: "Payment calculator",
  description: "Estimate deposits and monthly repayments for a Chapelhill home in naira, US dollars or pounds.",
};

export default function CalculatorPage() {
  return (
    <>
      <PageHeader
        eyebrow="Payment calculator"
        title="Plan your"
        accent="purchase."
        intro="Estimate a deposit and monthly repayments for a payment plan or mortgage, in naira, dollars or pounds."
        crumbs={[{ label: "Payment calculator" }]}
      />
      <section aria-label="Calculator" className="container-luxe pt-4 pb-24 sm:pb-36">
        <Suspense fallback={<div className="bg-stone h-[640px] animate-pulse rounded-[24px]" />}>
          <PaymentCalculator />
        </Suspense>
        <p className="text-muted-foreground mt-12 max-w-3xl text-xs leading-relaxed">
          <strong className="text-ink font-medium">Disclaimer.</strong> This calculator gives illustrative estimates only and
          is not a quote, an offer of finance or financial advice. Actual prices, payment plans, deposits, interest rates
          and terms are confirmed in writing by Chapelhill and, where applicable, your lender. Foreign-currency figures
          use display rates set by Chapelhill and will differ from the rate applied on the day you pay. Payments are made
          in naira unless agreed otherwise.
        </p>
      </section>
    </>
  );
}
