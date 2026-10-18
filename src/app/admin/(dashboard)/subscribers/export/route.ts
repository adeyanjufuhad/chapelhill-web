import { getCurrentUser } from "@/lib/auth/session";
import { listSubscribers } from "@/lib/db/admin";

// CSV export of newsletter subscribers (admins only).
const cell = (v: string | null) => {
  const s = v ?? "";
  // Quote every cell and neutralise spreadsheet formula injection.
  return `"${(/^[=+\-@]/.test(s) ? `'${s}` : s).replaceAll('"', '""')}"`;
};

export async function GET() {
  const user = await getCurrentUser();
  if (user?.role !== "admin") return new Response("Forbidden", { status: 403 });

  const rows = await listSubscribers();
  const csv = [
    ["email", "source", "consented_at", "unsubscribed_at"].join(","),
    ...rows.map((r) => [r.email, r.source, r.consented_at, r.unsubscribed_at].map(cell).join(",")),
  ].join("\r\n");

  return new Response(`﻿${csv}\r\n`, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="chapelhill-subscribers-${new Date().toISOString().slice(0, 10)}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
