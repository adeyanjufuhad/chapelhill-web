"use server";

import { z } from "zod";
import { sql } from "@/lib/db/client";
import { notifySales } from "@/lib/email";

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

  const d = parsed.data;
  const inspection = d.topic === "inspection";
  const blank = (v?: string) => (v ? v : null);

  let saved = false;
  if (sql) {
    try {
      // Light abuse guard: at most 5 enquiries per email address in 10 minutes.
      const [{ recent }] = (await sql`
        select count(*)::int as recent from inquiries
        where email = ${d.email} and created_at > now() - interval '10 minutes'`) as { recent: number }[];
      if (recent >= 5) {
        return { status: "error", message: "We’ve received several messages from you already. We’ll be in touch shortly." };
      }

      await sql`
        insert into inquiries (topic, development, service, name, email, phone, country, message, preferred_contact, payload)
        values (${d.topic}, ${blank(d.development)}, ${blank(d.service)}, ${d.name}, ${d.email}, ${blank(d.phone)},
                ${blank(d.country)}, ${blank(d.message)}, ${d.preferredContact},
                ${JSON.stringify({ inspectionKind: d.inspectionKind || null, preferredDate: d.preferredDate || null, preferredTime: d.preferredTime || null, timezone: d.timezone || null })})`;

      if (inspection) {
        await sql`
          insert into inspection_requests (development_id, development_name, kind, preferred_date, preferred_time, timezone, name, email, phone, message)
          values ((select id from developments where name = ${blank(d.development)} limit 1), ${blank(d.development)},
                  ${d.inspectionKind || "virtual"}, ${blank(d.preferredDate)}, ${blank(d.preferredTime)}, ${blank(d.timezone)},
                  ${d.name}, ${d.email}, ${blank(d.phone)}, ${blank(d.message)})`;
      }
      saved = true;
    } catch (err) {
      console.error("[inquiry] save failed:", err instanceof Error ? err.message : err);
    }
  }

  const emailed = await notifySales(
    inspection ? `Virtual inspection request: ${d.development ?? "a development"}` : `New ${d.topic} enquiry from ${d.name}`,
    {
      Topic: d.topic,
      Development: d.development,
      Service: d.service,
      Name: d.name,
      Email: d.email,
      "Phone / WhatsApp": d.phone,
      Country: d.country,
      "Preferred contact": d.preferredContact,
      "Inspection type": inspection ? d.inspectionKind : undefined,
      "Preferred date": d.preferredDate,
      "Preferred time": d.preferredTime ? `${d.preferredTime} (${d.timezone || "timezone unknown"})` : undefined,
      Message: d.message,
    },
    d.email,
  );

  if (!saved && !emailed && sql) {
    return {
      status: "error",
      message: "Sorry, we couldn’t send your message just now. Please try again or message us on WhatsApp.",
    };
  }

  return {
    status: "success",
    message: inspection
      ? "Thank you. We’ll confirm your virtual inspection time within 24 hours."
      : "Thank you. Our team will be in touch within 24 hours.",
  };
}
