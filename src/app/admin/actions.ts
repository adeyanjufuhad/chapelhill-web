"use server";

import { randomBytes } from "node:crypto";
import { redirect } from "next/navigation";
import { updateTag } from "next/cache";
import { z } from "zod";
import { auth } from "@/lib/auth/server";
import { requireAdmin } from "@/lib/auth/session";
import { sql } from "@/lib/db/client";
import { TAGS } from "@/lib/db/public";
import { UploadError, uploadClientDocument, uploadMedia } from "@/lib/storage";

export type ActionState = { status: "idle" | "success" | "error"; message: string };
const ok = (message: string): ActionState => ({ status: "success", message });
const fail = (message: string): ActionState => ({ status: "error", message });

function db() {
  if (!sql) throw new Error("DATABASE_URL is not configured.");
  return sql;
}

const text = (max = 500) => z.string().trim().max(max);
const optional = (max = 500) => text(max).optional().transform((v) => (v ? v : null));
const lines = (v: FormDataEntryValue | null) =>
  String(v ?? "")
    .split(/\r?\n/)
    .map((s) => s.trim())
    .filter(Boolean);

function firstIssue(err: z.ZodError) {
  const i = err.issues[0];
  return i ? `${String(i.path[0] ?? "Form")}: ${i.message}` : "Please check the form.";
}

/* ---------------------------------------------------------------- Auth */

export async function signInAdmin(_prev: ActionState, formData: FormData): Promise<ActionState> {
  if (!auth) return fail("Authentication is not configured.");
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  if (!email || !password) return fail("Enter your email and password.");

  const { data, error } = await auth.signIn.email({ email, password });
  if (error) return fail(error.code?.startsWith("NETWORK") ? "Could not reach the sign-in service. Try again." : "Incorrect email or password.");
  const role = (data?.user as { role?: string } | undefined)?.role;
  if (role !== "admin") {
    await auth.signOut();
    return fail("This account does not have admin access.");
  }
  redirect("/admin");
}

export async function signOutAction(formData: FormData) {
  await auth?.signOut();
  redirect(String(formData.get("to") ?? "/admin/login") === "/portal/login" ? "/portal/login" : "/admin/login");
}

/* -------------------------------------------------------- Developments */

const developmentSchema = z.object({
  id: z.string().uuid().optional().or(z.literal("")),
  slug: z.string().trim().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "use lowercase letters, numbers and hyphens"),
  name: text(120).min(2),
  area: text(120).min(2),
  city: text(60).min(2),
  state: text(60).min(2),
  status: z.enum(["for_sale", "coming_soon", "sold_out"]),
  property_type: text(80).min(2),
  bedrooms: z.string().transform((v) =>
    v
      .split(/[,\s]+/)
      .map(Number)
      .filter((n) => Number.isInteger(n) && n > 0 && n < 20),
  ),
  baths: optional(60),
  sqm: optional(60),
  title_type: optional(120),
  price_from_ngn: z.coerce.number().int().min(0).max(1e13),
  headline: optional(400),
  summary: text(400).min(10),
  lat: z.coerce.number().min(-90).max(90).optional().or(z.literal("")),
  lng: z.coerce.number().min(-180).max(180).optional().or(z.literal("")),
  sort_order: z.coerce.number().int().min(0).max(1000).default(0),
});

export async function saveDevelopment(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin();
  const parsed = developmentSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return fail(firstIssue(parsed.error));
  const v = parsed.data;
  const description = lines(formData.get("description"));
  const amenities = lines(formData.get("amenities"));
  const flags = {
    featured: formData.get("featured") === "on",
    published: formData.get("published") === "on",
    approximate: formData.get("location_approximate") === "on",
  };
  const lat = v.lat === "" || v.lat === undefined ? null : v.lat;
  const lng = v.lng === "" || v.lng === undefined ? null : v.lng;

  try {
    if (v.id) {
      await db()`
        update developments set slug = ${v.slug}, name = ${v.name}, area = ${v.area}, city = ${v.city}, state = ${v.state},
          status = ${v.status}, property_type = ${v.property_type}, bedrooms = ${v.bedrooms}, baths = ${v.baths}, sqm = ${v.sqm},
          title_type = ${v.title_type}, price_from_ngn = ${v.price_from_ngn}, headline = ${v.headline}, summary = ${v.summary},
          description = ${description}, amenities = ${amenities}, lat = ${lat}, lng = ${lng},
          location_approximate = ${flags.approximate}, featured = ${flags.featured}, published = ${flags.published},
          sort_order = ${v.sort_order}
        where id = ${v.id}`;
    } else {
      const [row] = (await db()`
        insert into developments (slug, name, area, city, state, status, property_type, bedrooms, baths, sqm, title_type,
          price_from_ngn, headline, summary, description, amenities, lat, lng, location_approximate, featured, published, sort_order)
        values (${v.slug}, ${v.name}, ${v.area}, ${v.city}, ${v.state}, ${v.status}, ${v.property_type}, ${v.bedrooms}, ${v.baths},
          ${v.sqm}, ${v.title_type}, ${v.price_from_ngn}, ${v.headline}, ${v.summary}, ${description}, ${amenities}, ${lat}, ${lng},
          ${flags.approximate}, ${flags.featured}, ${flags.published}, ${v.sort_order})
        returning id`) as { id: string }[];
      updateTag(TAGS.developments);
      redirect(`/admin/developments/${row.id}?created=1`);
    }
  } catch (err) {
    if (err instanceof Error && /duplicate key/.test(err.message)) return fail("That URL slug is already used by another development.");
    throw err;
  }
  updateTag(TAGS.developments);
  return ok("Saved. The public site updates within seconds.");
}

export async function addDevelopmentImages(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin();
  const id = z.string().uuid().parse(formData.get("development_id"));
  const files = formData.getAll("photos").filter((f): f is File => f instanceof File && f.size > 0);
  const alt = text(200).parse(formData.get("alt") ?? "");
  const isRender = formData.get("is_render") === "on";
  if (!files.length) return fail("Choose at least one photo.");
  if (alt.length < 5) return fail("Describe the photo for screen readers (alt text).");

  try {
    const [{ next }] = (await db()`select coalesce(max(sort_order) + 1, 0)::int as next from development_images where development_id = ${id}`) as { next: number }[];
    for (const [i, file] of files.entries()) {
      const src = await uploadMedia(file, `developments/${id}`);
      await db()`
        insert into development_images (development_id, src, alt, is_render, sort_order)
        values (${id}, ${src}, ${files.length > 1 ? `${alt} (${i + 1})` : alt}, ${isRender}, ${next + i})`;
    }
  } catch (err) {
    if (err instanceof UploadError) return fail(err.message);
    throw err;
  }
  updateTag(TAGS.developments);
  return ok(`${files.length} photo${files.length > 1 ? "s" : ""} added.`);
}

export async function removeDevelopmentImage(formData: FormData) {
  await requireAdmin();
  const id = z.string().uuid().parse(formData.get("image_id"));
  // The object stays in storage; only the gallery reference is removed (recoverable).
  await db()`delete from development_images where id = ${id}`;
  updateTag(TAGS.developments);
}

const planSchema = z.object({
  development_id: z.string().uuid(),
  name: text(80).min(2),
  deposit_pct: z.coerce.number().min(0).max(100),
  tenure_months: z.coerce.number().int().min(0).max(360),
  note: optional(300),
});

export async function addPaymentPlan(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin();
  const parsed = planSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return fail(firstIssue(parsed.error));
  const p = parsed.data;
  await db()`
    insert into payment_plans (development_id, name, deposit_pct, tenure_months, note, sort_order)
    values (${p.development_id}, ${p.name}, ${p.deposit_pct}, ${p.tenure_months}, ${p.note},
      (select coalesce(max(sort_order) + 1, 0) from payment_plans where development_id = ${p.development_id}))`;
  updateTag(TAGS.plans);
  return ok("Payment plan added.");
}

export async function removePaymentPlan(formData: FormData) {
  await requireAdmin();
  const id = z.string().uuid().parse(formData.get("plan_id"));
  await db()`delete from payment_plans where id = ${id} and development_id is not null`;
  updateTag(TAGS.plans);
}

/* ------------------------------------------------------------- Progress */

const progressSchema = z.object({
  development_id: z.string().uuid(),
  title: text(140).min(3),
  stage: optional(60),
  percent_complete: z.coerce.number().int().min(0).max(100),
  occurred_on: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "pick a date"),
  body: optional(2000),
});

export async function postProgress(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const admin = await requireAdmin();
  const parsed = progressSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return fail(firstIssue(parsed.error));
  const p = parsed.data;
  const files = formData.getAll("photos").filter((f): f is File => f instanceof File && f.size > 0);

  try {
    const [row] = (await db()`
      insert into progress_updates (development_id, title, stage, percent_complete, occurred_on, body, created_by)
      values (${p.development_id}, ${p.title}, ${p.stage}, ${p.percent_complete}, ${p.occurred_on}, ${p.body}, ${admin.id})
      returning id`) as { id: string }[];
    for (const [i, file] of files.entries()) {
      const src = await uploadMedia(file, `progress/${p.development_id}`);
      await db()`insert into progress_media (update_id, src, alt, sort_order) values (${row.id}, ${src}, ${`${p.title} (${i + 1})`}, ${i})`;
    }
  } catch (err) {
    if (err instanceof UploadError) return fail(err.message);
    throw err;
  }
  updateTag(TAGS.progress);
  return ok(`Update posted${files.length ? ` with ${files.length} photo${files.length > 1 ? "s" : ""}` : ""}. Clients see it in the portal.`);
}

/* ------------------------------------------------------------- Requests */

export async function setInquiryStatus(formData: FormData) {
  await requireAdmin();
  const id = z.string().uuid().parse(formData.get("id"));
  const status = z.enum(["new", "contacted", "closed"]).parse(formData.get("status"));
  await db()`update inquiries set status = ${status} where id = ${id}`;
}

export async function setInspectionStatus(formData: FormData) {
  await requireAdmin();
  const id = z.string().uuid().parse(formData.get("id"));
  const status = z.enum(["requested", "in_progress", "fulfilled", "declined"]).parse(formData.get("status"));
  await db()`update inspection_requests set status = ${status} where id = ${id}`;
}

export async function updateDocumentRequest(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin();
  const id = z.string().uuid().parse(formData.get("id"));
  const status = z.enum(["requested", "in_progress", "fulfilled", "declined"]).parse(formData.get("status"));
  const file = formData.get("file");

  const [req] = (await db()`select user_id from document_requests where id = ${id}`) as { user_id: string }[];
  if (!req) return fail("Request not found.");

  let fileKey: string | null = null;
  if (file instanceof File && file.size > 0) {
    try {
      fileKey = await uploadClientDocument(req.user_id, file);
    } catch (err) {
      if (err instanceof UploadError) return fail(err.message);
      throw err;
    }
  }
  if (status === "fulfilled" && !fileKey) {
    const [existing] = (await db()`select file_key from document_requests where id = ${id}`) as { file_key: string | null }[];
    if (!existing?.file_key) return fail("Attach the document before marking the request fulfilled.");
  }
  await db()`
    update document_requests set status = ${status}, file_key = coalesce(${fileKey}, file_key)
    where id = ${id}`;
  return ok(fileKey ? "Document attached. The client can download it from the portal." : "Status updated.");
}

/* -------------------------------------------------------------- Clients */

const clientSchema = z.object({
  name: text(120).min(2),
  email: z.email().max(254),
  phone: optional(30),
  country: optional(60),
  development_id: z.string().uuid().optional().or(z.literal("")),
  unit_label: optional(80),
});

/**
 * Create a portal account for a buyer. A random password is set and never
 * shown; the buyer receives a "set your password" email instead.
 */
export async function createClientAccount(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin();
  if (!auth) return fail("Authentication is not configured.");
  const parsed = clientSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return fail(firstIssue(parsed.error));
  const c = parsed.data;
  const email = c.email.toLowerCase();

  const { data, error } = await auth.admin.createUser({
    email,
    name: c.name,
    password: randomBytes(24).toString("base64url"),
    role: "user",
  });
  if (error || !data) return fail(error?.message ?? "Could not create the account.");
  const userId = (data as { user?: { id: string } }).user?.id;
  if (!userId) return fail("The account was created but its id was not returned. Refresh and try again.");

  await db()`
    insert into client_profiles (user_id, phone, country) values (${userId}, ${c.phone}, ${c.country})
    on conflict (user_id) do update set phone = excluded.phone, country = excluded.country`;
  if (c.development_id && c.unit_label) {
    await db()`insert into client_units (user_id, development_id, unit_label) values (${userId}, ${c.development_id}, ${c.unit_label})`;
  }

  const site = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const { error: resetError } = await auth.requestPasswordReset({ email, redirectTo: `${site}/portal/reset` });
  return resetError
    ? ok(`Account created for ${email}, but the welcome email failed (${resetError.message}). Ask them to use "Set or reset your password" on the portal sign-in page.`)
    : ok(`Account created. ${email} has been emailed a link to set their password.`);
}

export async function assignUnit(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin();
  const userId = z.string().uuid().parse(formData.get("user_id"));
  const developmentId = z.string().uuid().safeParse(formData.get("development_id"));
  const label = text(80).min(1).safeParse(formData.get("unit_label"));
  if (!developmentId.success || !label.success) return fail("Choose a development and enter the unit (e.g. Block C, Unit 4).");
  await db()`insert into client_units (user_id, development_id, unit_label) values (${userId}, ${developmentId.data}, ${label.data})`;
  return ok("Unit assigned.");
}

/* ------------------------------------------------------------- Settings */

export async function saveFxRates(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const admin = await requireAdmin();
  const rates = z
    .object({ USD: z.coerce.number().positive().max(1e6), GBP: z.coerce.number().positive().max(1e6) })
    .safeParse(Object.fromEntries(formData));
  if (!rates.success) return fail("Enter positive naira amounts for both currencies.");
  for (const [currency, value] of Object.entries(rates.data)) {
    await db()`
      insert into fx_rates (currency, ngn_per_unit, updated_by) values (${currency}, ${value}, ${admin.id})
      on conflict (currency) do update set ngn_per_unit = excluded.ngn_per_unit, updated_at = now(), updated_by = excluded.updated_by`;
  }
  updateTag(TAGS.fx);
  return ok("Display rates saved. The calculator uses them immediately.");
}

export async function saveStats(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin();
  const keys = formData.getAll("key").map(String);
  for (const key of keys) {
    const value = Number(formData.get(`value:${key}`));
    if (!Number.isFinite(value) || value < 0) return fail(`Enter a valid number for ${key}.`);
    const confirmed = formData.get(`confirmed:${key}`) === "on";
    await db()`update site_stats set value = ${value}, is_placeholder = ${!confirmed} where key = ${key}`;
  }
  updateTag(TAGS.stats);
  return ok("Stats saved.");
}

