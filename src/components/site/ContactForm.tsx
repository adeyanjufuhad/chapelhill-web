"use client";

import { useSearchParams } from "next/navigation";
import { InquiryForm } from "./InquiryForm";

/** Contact form that adapts when arriving from the calculator (?topic=calculator). */
export function ContactForm() {
  const fromCalculator = useSearchParams().get("topic") === "calculator";
  return fromCalculator ? (
    <InquiryForm
      topic="calculator"
      defaultMessage="I used the payment calculator and would like to discuss a payment plan."
      submitLabel="Discuss a payment plan"
    />
  ) : (
    <InquiryForm topic="general" />
  );
}
