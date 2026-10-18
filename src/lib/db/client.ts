import "server-only";
import { neon } from "@neondatabase/serverless";

/** Neon HTTP driver: one round trip per query, ideal for serverless and cached reads. */
export const sql = process.env.DATABASE_URL ? neon(process.env.DATABASE_URL) : null;

export const dbConfigured = sql !== null;

/** Public URL for an object in the public-read media bucket. */
export function mediaUrl(src: string) {
  if (!src.startsWith("media:")) return src;
  const endpoint = process.env.AWS_ENDPOINT_URL_S3;
  const bucket = process.env.STORAGE_BUCKET_MEDIA ?? "media";
  return `${endpoint}/${bucket}/${src.slice("media:".length)}`;
}
