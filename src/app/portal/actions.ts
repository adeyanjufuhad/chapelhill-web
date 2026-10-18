"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import type { ActionState } from "@/app/admin/actions";
import { auth } from "@/lib/auth/server";
import { requireClient } from "@/lib/auth/session";
import { sql } from "@/lib/db/client";
import { notifySales } from "@/lib/email";

const ok = (message: string): ActionState => ({ status: "success", message });
const fail = (message: string): ActionState => ({ status: "error", message });

function db() {
  if (!sql) throw new Error("DATABASE_URL is not configured.");
  return sql;
}

export async function signInClient(_prev: ActionState, formData: FormData): Promise<ActionState> {
  if (!auth) return fail("Sign-in is not available right now.");
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  if (!email || !password) return fail("Enter your email and password.");
  const { error } = await auth.signIn.email({ email, password });
  if (error) return fail(error.code?.startsWith("NETWORK") ? "Could not reach the sign-in service. Try again." : "Incorrect email or password.");
  redirect("/portal");
}

/** Sends a "set or reset your password" email. The reply never reveals whether the account exists. */
export async function requestPasswordEmail(_prev: ActionState, formData: FormData): Promise<ActionState> {
  if (!auth) return fail("This is not available right now.");
  const email = z.email().safeParse(String(formData.get("email") ?? "").trim().toLowerCase());
  if (!email.success) return fail("Enter a valid email address.");
  const site = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  await auth.requestPasswordReset({ email: email.data, redirectTo: `${site}/portal/reset` });
  return ok("If that email has a portal account, a link to set your password is on its way. Check your inbox and spam folder.");
}

export async function setNewPassword(_prev: ActionState, formData: FormData): Promise<ActionState> {
  if (!auth) return fail("This is not available right now.");
  const token = String(formData.get("token") ?? "");
  const password = String(formData.get("password") ?? "");
  const confirm = String(formData.get("confirm") ?? "");
  if (password.length < 10) return fail("Use at least 10 characters.");
  if (password !== confirm) return fail("The two passwords don’t match.");
  const { error } = await auth.resetPassword({ newPassword: password, token });
  if (error) return fail("This link has expired or was already used. Use “Need a new link?” to get a fresh one.");
  redirect("/portal/login?password=set");
}

const documentSchema = z.object({
  doc: z.enum(["allotment_letter", "survey_plan", "deed_of_assignment", "receipt", "other"]),
  client_unit_id: z.string().uuid().optional().or(z.literal("")),
  notes: z.string().trim().max(1000).optional(),
});

export async function requestDocument(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const user = await requireClient();
  const parsed = documentSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return fail("Choose a document type.");
  const { doc, client_unit_id, notes } = parsed.data;

  // The unit must belong to this client.
  const unitId = client_unit_id || null;
  if (unitId) {
    const owned = (await db()`select 1 from client_units where id = ${unitId} and user_id = ${user.id}`) as unknown[];
    if (!owned.length) return fail("That unit isn’t linked to your account.");
  }
  const [{ open }] = (await db()`
    select count(*)::int as open from document_requests
    where user_id = ${user.id} and status in ('requested', 'in_progress')`) as { open: number }[];
  if (open >= 10) return fail("You have 10 open requests. We’ll process those first.");

  await db()`insert into document_requests (user_id, client_unit_id, doc, notes) values (${user.id}, ${unitId}, ${doc}, ${notes || null})`;
  await notifySales(`Document request: ${doc.replaceAll("_", " ")}`, { Client: user.name, Email: user.email, Notes: notes }, user.email);
  return ok("Requested. We’ll notify you when it’s ready to download here.");
}

const inspectionSchema = z.object({
  client_unit_id: z.string().uuid(),
  kind: z.enum(["virtual", "video"]),
  preferred_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Choose a date."),
  preferred_time: z.enum(["morning", "afternoon", "evening"]),
  timezone: z.string().max(60).optional(),
  message: z.string().trim().max(1000).optional(),
});

export async function requestVideoInspection(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const user = await requireClient();
  const parsed = inspectionSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return fail(parsed.error.issues[0]?.message ?? "Please complete the form.");
  const v = parsed.data;

  const [unit] = (await db()`
    select cu.development_id, d.name from client_units cu join developments d on d.id = cu.development_id
    where cu.id = ${v.client_unit_id} and cu.user_id = ${user.id}`) as { development_id: string; name: string }[];
  if (!unit) return fail("That unit isn’t linked to your account.");

  const [profile] = (await db()`select phone from client_profiles where user_id = ${user.id}`) as { phone: string | null }[];
  await db()`
    insert into inspection_requests (user_id, development_id, development_name, kind, preferred_date, preferred_time, timezone, name, email, phone, message)
    values (${user.id}, ${unit.development_id}, ${unit.name}, ${v.kind}, ${v.preferred_date}, ${v.preferred_time}, ${v.timezone || null},
      ${user.name}, ${user.email}, ${profile?.phone ?? null}, ${v.message || null})`;
  await notifySales(
    `Portal inspection request: ${unit.name}`,
    { Client: user.name, Email: user.email, Type: v.kind, Date: v.preferred_date, Time: `${v.preferred_time} (${v.timezone || "timezone unknown"})`, Message: v.message },
    user.email,
  );
  return ok("Requested. We’ll confirm the time by email or WhatsApp within 24 hours.");
}
