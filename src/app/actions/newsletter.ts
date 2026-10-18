"use server";

import { z } from "zod";

export type NewsletterState = { status: "idle" | "success" | "error"; message: string };

const schema = z.object({
  email: z.email("Please enter a valid email address.").max(254),
  // Honeypot: real visitors never see or fill this field.
  company: z.string().max(0).optional().or(z.literal("")),
  source: z.string().max(40).optional(),
});

export async function subscribeToNewsletter(_prev: NewsletterState, formData: FormData): Promise<NewsletterState> {
  const parsed = schema.safeParse({
    email: String(formData.get("email") ?? "").trim().toLowerCase(),
    company: String(formData.get("company") ?? ""),
    source: String(formData.get("source") ?? "site"),
  });

  if (!parsed.success) {
    const honeypot = parsed.error.issues.some((i) => i.path[0] === "company");
    // Bots get a success response so they learn nothing.
    if (honeypot) return { status: "success", message: "Thank you. You’re on the list." };
    return { status: "error", message: parsed.error.issues[0]?.message ?? "Please check your email address." };
  }

  // NOT PERSISTED YET: Phase 6 inserts into Supabase `newsletter_subscribers`.
  if (process.env.NODE_ENV !== "production") {
    console.info("[newsletter] would subscribe", parsed.data.email, "from", parsed.data.source);
  }

  return { status: "success", message: "Thank you. You’re on the list." };
}
