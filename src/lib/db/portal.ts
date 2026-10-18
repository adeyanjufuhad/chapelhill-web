import "server-only";
import { requireClient } from "@/lib/auth/session";
import { mediaUrl, sql } from "./client";

// Client-portal reads. Every query is scoped to the signed-in user's id, which
// comes from the verified session (never from the request).

function db() {
  if (!sql) throw new Error("DATABASE_URL is not configured.");
  return sql;
}

export type MyUnit = {
  id: string;
  unit_label: string;
  status: string;
  purchased_on: string | null;
  development_id: string;
  development: string;
  slug: string;
  area: string;
  city: string;
  cover: string | null;
  cover_alt: string | null;
};

export async function getMyUnits() {
  const user = await requireClient();
  const rows = (await db()`
    select cu.id, cu.unit_label, cu.status, cu.purchased_on::text as purchased_on, d.id as development_id,
      d.name as development, d.slug, d.area, d.city,
      (select src from development_images i where i.development_id = d.id order by sort_order limit 1) as cover,
      (select alt from development_images i where i.development_id = d.id order by sort_order limit 1) as cover_alt
    from client_units cu join developments d on d.id = cu.development_id
    where cu.user_id = ${user.id} and cu.status <> 'cancelled'
    order by cu.created_at`) as MyUnit[];
  return { user, units: rows.map((u) => ({ ...u, cover: u.cover ? mediaUrl(u.cover) : null })) };
}

export async function getMyDocumentRequests() {
  const user = await requireClient();
  const rows = (await db()`
    select r.id, r.doc, r.status, r.notes, (r.file_key is not null) as has_file, r.created_at::text as created_at,
      r.updated_at::text as updated_at, cu.unit_label, d.name as development
    from document_requests r
    left join client_units cu on cu.id = r.client_unit_id
    left join developments d on d.id = cu.development_id
    where r.user_id = ${user.id}
    order by r.created_at desc`) as {
    id: string;
    doc: string;
    status: string;
    notes: string | null;
    has_file: boolean;
    created_at: string;
    updated_at: string;
    unit_label: string | null;
    development: string | null;
  }[];
  return { user, requests: rows };
}

/** The file key for a fulfilled request, only if it belongs to the signed-in user. */
export async function getMyDocumentFile(requestId: string) {
  const user = await requireClient();
  const [row] = (await db()`
    select doc, file_key from document_requests
    where id = ${requestId} and user_id = ${user.id} and status = 'fulfilled' and file_key is not null`) as {
    doc: string;
    file_key: string;
  }[];
  return row ?? null;
}

export async function getMyInspectionRequests() {
  const user = await requireClient();
  return (await db()`
    select id, development_name, kind, preferred_date::text as preferred_date, preferred_time, status, created_at::text as created_at
    from inspection_requests where user_id = ${user.id} order by created_at desc limit 20`) as {
    id: string;
    development_name: string | null;
    kind: string;
    preferred_date: string | null;
    preferred_time: string | null;
    status: string;
    created_at: string;
  }[];
}
