import "server-only";
import { Resend } from "resend";
import { company } from "@/content/company";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const FROM = process.env.RESEND_FROM || "Chapelhill website <onboarding@resend.dev>";
const TO = process.env.INQUIRY_NOTIFY_EMAIL || company.contact.email;

const escape = (s: string) => s.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

/**
 * Notify the sales inbox. Never throws: a failed email must not lose the lead,
 * which is already saved in the database. Returns whether the email was sent.
 */
export async function notifySales(subject: string, fields: Record<string, string | null | undefined>, replyTo?: string) {
  if (!resend) {
    if (process.env.NODE_ENV !== "production") console.info("[email] RESEND_API_KEY not set; would send:", subject);
    return false;
  }
  const rows = Object.entries(fields)
    .filter(([, v]) => v)
    .map(
      ([k, v]) =>
        `<tr><td style="padding:6px 12px 6px 0;color:#5e5a52;vertical-align:top">${escape(k)}</td><td style="padding:6px 0;white-space:pre-wrap">${escape(String(v))}</td></tr>`,
    )
    .join("");
  const html = `<div style="font-family:Inter,Arial,sans-serif;color:#1a1a1a">
    <p style="font-size:12px;letter-spacing:.2em;text-transform:uppercase;color:#8a6424">Chapelhill website</p>
    <h1 style="font-size:22px;margin:0 0 16px">${escape(subject)}</h1>
    <table style="border-collapse:collapse;font-size:14px">${rows}</table>
  </div>`;
  try {
    const { error } = await resend.emails.send({ from: FROM, to: TO, subject, html, replyTo });
    if (error) throw new Error(error.message);
    return true;
  } catch (err) {
    console.error("[email] send failed:", err instanceof Error ? err.message : err);
    return false;
  }
}
