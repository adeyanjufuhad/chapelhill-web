"use server";

import { z } from "zod";
import { sql } from "@/lib/db/client";

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

  if (sql) {
    try {
      await sql`
        insert into newsletter_subscribers (email, source) values (${parsed.data.email}, ${parsed.data.source ?? "site"})
        on conflict (email) do update set unsubscribed_at = null`;
    } catch (err) {
      console.error("[newsletter] save failed:", err instanceof Error ? err.message : err);
      return { status: "error", message: "Sorry, something went wrong. Please try again." };
    }
  } else if (process.env.NODE_ENV !== "production") {
    console.info("[newsletter] DATABASE_URL not set; would subscribe", parsed.data.email);
  }

  return { status: "success", message: "Thank you. You’re on the list." };
}
