import "server-only";
import { requireAdmin } from "@/lib/auth/session";
import { mediaUrl, sql } from "./client";

// Admin-only reads. Each function re-checks the admin role, so a page or
// action can never read these without it.

function db() {
  if (!sql) throw new Error("DATABASE_URL is not configured.");
  return sql;
}

export async function getDashboardCounts() {
  await requireAdmin();
  const [row] = (await db()`
    select
      (select count(*) from inquiries where status = 'new')::int as new_inquiries,
      (select count(*) from document_requests where status in ('requested', 'in_progress'))::int as open_documents,
      (select count(*) from inspection_requests where status in ('requested', 'in_progress'))::int as open_inspections,
      (select count(*) from newsletter_subscribers where unsubscribed_at is null)::int as subscribers,
      (select count(*) from developments)::int as developments,
      (select count(distinct user_id) from client_units)::int as clients`) as Record<string, number>[];
  return row;
}

export type AdminDevelopment = {
  id: string;
  slug: string;
  name: string;
  area: string;
  city: string;
  state: string;
  status: "for_sale" | "coming_soon" | "sold_out";
  property_type: string;
  bedrooms: number[];
  baths: string | null;
  sqm: string | null;
  title_type: string | null;
  price_from_ngn: string;
  headline: string | null;
  summary: string;
  description: string[];
  amenities: string[];
  lat: number | null;
  lng: number | null;
  location_approximate: boolean;
  featured: boolean;
  published: boolean;
  sort_order: number;
  updated_at: string;
};

export async function listDevelopments() {
  await requireAdmin();
  return (await db()`select * from developments order by sort_order, name`) as AdminDevelopment[];
}

export async function getDevelopmentForEdit(id: string) {
  await requireAdmin();
  const [dev] = (await db()`select * from developments where id = ${id}`) as AdminDevelopment[];
  if (!dev) return null;
  const images = (await db()`
    select id, src, alt, width, height, is_render, sort_order from development_images
    where development_id = ${id} order by sort_order`) as { id: string; src: string; alt: string; is_render: boolean; sort_order: number }[];
  const plans = (await db()`
    select id, name, deposit_pct, tenure_months, note from payment_plans
    where development_id = ${id} order by sort_order`) as { id: string; name: string; deposit_pct: string; tenure_months: number; note: string | null }[];
  return { dev, images: images.map((i) => ({ ...i, url: mediaUrl(i.src) })), plans };
}

export async function listProgress(limit = 30) {
  await requireAdmin();
  return (await db()`
    select u.id, u.title, u.stage, u.percent_complete, u.occurred_on::text as occurred_on, d.name as development,
      (select count(*) from progress_media m where m.update_id = u.id)::int as photos
    from progress_updates u join developments d on d.id = u.development_id
    order by u.occurred_on desc, u.created_at desc limit ${limit}`) as {
    id: string;
    title: string;
    stage: string | null;
    percent_complete: number;
    occurred_on: string;
    development: string;
    photos: number;
  }[];
}

export async function listInquiries(status?: string) {
  await requireAdmin();
  return (await db()`
    select id, topic, development, service, name, email, phone, country, message, preferred_contact, status,
      payload, created_at::text as created_at
    from inquiries where (${status ?? null}::inquiry_status is null or status = ${status ?? null}::inquiry_status)
    order by created_at desc limit 200`) as {
    id: string;
    topic: string;
    development: string | null;
    service: string | null;
    name: string;
    email: string;
    phone: string | null;
    country: string | null;
    message: string | null;
    preferred_contact: string;
    status: "new" | "contacted" | "closed";
    payload: Record<string, string | null>;
    created_at: string;
  }[];
}

export async function listDocumentRequests() {
  await requireAdmin();
  return (await db()`
    select r.id, r.user_id, r.doc, r.status, r.notes, r.file_key, r.created_at::text as created_at,
      u.name as client_name, u.email as client_email, cu.unit_label, d.name as development
    from document_requests r
    left join neon_auth."user" u on u.id = r.user_id
    left join client_units cu on cu.id = r.client_unit_id
    left join developments d on d.id = cu.development_id
    order by (r.status in ('requested', 'in_progress')) desc, r.created_at desc limit 200`) as {
    id: string;
    user_id: string;
    doc: string;
    status: string;
    notes: string | null;
    file_key: string | null;
    created_at: string;
    client_name: string | null;
    client_email: string | null;
    unit_label: string | null;
    development: string | null;
  }[];
}

export async function listInspectionRequests() {
  await requireAdmin();
  return (await db()`
    select id, development_name, kind, preferred_date::text as preferred_date, preferred_time, timezone,
      name, email, phone, message, status, user_id, created_at::text as created_at
    from inspection_requests
    order by (status in ('requested', 'in_progress')) desc, created_at desc limit 200`) as {
    id: string;
    development_name: string | null;
    kind: string;
    preferred_date: string | null;
    preferred_time: string | null;
    timezone: string | null;
    name: string;
    email: string;
    phone: string | null;
    message: string | null;
    status: string;
    user_id: string | null;
    created_at: string;
  }[];
}

export async function listClients() {
  await requireAdmin();
  return (await db()`
    select u.id, u.name, u.email, u.role, u."createdAt"::text as created_at, p.phone, p.country,
      coalesce(json_agg(json_build_object('id', cu.id, 'unit', cu.unit_label, 'development', d.name, 'status', cu.status))
        filter (where cu.id is not null), '[]') as units
    from neon_auth."user" u
    left join client_profiles p on p.user_id = u.id
    left join client_units cu on cu.user_id = u.id
    left join developments d on d.id = cu.development_id
    group by u.id, p.phone, p.country
    order by u."createdAt" desc limit 300`) as {
    id: string;
    name: string;
    email: string;
    role: string | null;
    created_at: string;
    phone: string | null;
    country: string | null;
    units: { id: string; unit: string; development: string; status: string }[];
  }[];
}

export async function listSubscribers() {
  await requireAdmin();
  return (await db()`
    select email::text as email, source, consented_at::text as consented_at, unsubscribed_at::text as unsubscribed_at
    from newsletter_subscribers order by consented_at desc`) as {
    email: string;
    source: string | null;
    consented_at: string;
    unsubscribed_at: string | null;
  }[];
}

export async function getSettings() {
  await requireAdmin();
  const fx = (await db()`select currency, ngn_per_unit, updated_at::text as updated_at from fx_rates order by currency`) as {
    currency: string;
    ngn_per_unit: string;
    updated_at: string;
  }[];
  const stats = (await db()`select key, value, suffix, label, is_placeholder from site_stats order by sort_order`) as {
    key: string;
    value: string;
    suffix: string;
    label: string;
    is_placeholder: boolean;
  }[];
  return { fx, stats };
}

