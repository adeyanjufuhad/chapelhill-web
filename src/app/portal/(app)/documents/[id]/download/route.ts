import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { getMyDocumentFile } from "@/lib/db/portal";
import { signedDocumentUrl } from "@/lib/storage";

// Redirects the owner of a fulfilled document request to a 5-minute signed URL.
export async function GET(request: Request, { params }: RouteContext<"/portal/documents/[id]/download">) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.redirect(new URL("/portal/login", request.url));

  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/.test(id)) return new Response("Not found", { status: 404 });

  const file = await getMyDocumentFile(id);
  if (!file) return new Response("Not found", { status: 404 });

  const ext = file.file_key.split(".").pop() ?? "pdf";
  const url = await signedDocumentUrl(file.file_key, `chapelhill-${file.doc.replaceAll("_", "-")}.${ext}`);
  return NextResponse.redirect(url, { headers: { "Cache-Control": "no-store" } });
}
