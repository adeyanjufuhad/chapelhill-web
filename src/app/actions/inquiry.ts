"use server";

import { z } from "zod";

export type InquiryTopic = "general" | "development" | "service" | "diaspora" | "inspection" | "calculator";

export type InquiryState = {
  status: "idle" | "success" | "error";
  message: string;
  fieldErrors?: Partial<Record<string, string>>;
};

const optionalText = (max: number) => z.string().trim().max(max).optional().or(z.literal(""));

const schema = z
  .object({
    topic: z.enum(["general", "development", "service", "diaspora", "inspection", "calculator"]),
    name: z.string().trim().min(2, "Please enter your name.").max(100),
    email: z.email("Please enter a valid email address.").max(254),
    phone: z
      .string()
      .trim()
      .max(24)
      .regex(/^[+\d][\d\s()-]{5,}$/, "Please enter a valid phone number, including the country code.")
      .optional()
      .or(z.literal("")),
    country: optionalText(60),
    message: optionalText(2000),
    preferredContact: z.enum(["whatsapp", "email", "phone"]).default("whatsapp"),
    development: optionalText(80),
    service: optionalText(80),
    inspectionKind: z.enum(["virtual", "video"]).optional().or(z.literal("")),
    preferredDate: optionalText(20),
    preferredTime: optionalText(20),
    timezone: optionalText(60),
    company: z.string().max(0).optional().or(z.literal("")), // honeypot
  })
  .superRefine((v, ctx) => {
    if (v.topic === "inspection" && !v.preferredDate) {
      ctx.addIssue({ code: "custom", path: ["preferredDate"], message: "Please choose a preferred date." });
    }
    if (v.preferredContact !== "email" && !v.phone) {
      ctx.addIssue({ code: "custom", path: ["phone"], message: "Please add a phone number so we can reach you." });
    }
  });

export async function submitInquiry(_prev: InquiryState, formData: FormData): Promise<InquiryState> {
  const raw = Object.fromEntries(
    [...formData.entries()].filter(([, v]) => typeof v === "string").map(([k, v]) => [k, String(v)]),
  );
  const parsed = schema.safeParse({ ...raw, email: (raw.email ?? "").trim().toLowerCase() });

  if (!parsed.success) {
    if (parsed.error.issues.some((i) => i.path[0] === "company")) {
      return { status: "success", message: "Thank you. Our team will be in touch shortly." };
    }
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0]);
      fieldErrors[key] ??= issue.message;
    }
    return { status: "error", message: "Please check the highlighted fields.", fieldErrors };
  }

  // NOT PERSISTED YET: Phase 6 inserts into Supabase `inquiries` / `inspection_requests`
  // and sends a notification to the sales inbox with Resend.
  if (process.env.NODE_ENV !== "production") {
    const { company: _honeypot, ...data } = parsed.data;
    console.info("[inquiry] would save", data);
  }

  const inspection = parsed.data.topic === "inspection";
  return {
    status: "success",
    message: inspection
      ? "Thank you. We’ll confirm your virtual inspection time within 24 hours."
      : "Thank you. Our team will be in touch within 24 hours.",
  };
}
