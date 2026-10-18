import "server-only";
import { randomUUID } from "node:crypto";
import { GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// Neon Object Storage (S3-compatible). "media" is public-read (development and
// progress photos); "client-documents" is private and only reachable through
// short-lived signed URLs issued after an ownership check.

export const storageConfigured = Boolean(
  process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY && process.env.AWS_ENDPOINT_URL_S3,
);

const client = storageConfigured
  ? new S3Client({
      region: process.env.AWS_REGION ?? "eu-central-1",
      endpoint: process.env.AWS_ENDPOINT_URL_S3,
      credentials: { accessKeyId: process.env.AWS_ACCESS_KEY_ID!, secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY! },
      forcePathStyle: true,
      requestChecksumCalculation: "WHEN_REQUIRED",
    })
  : null;

const MEDIA = process.env.STORAGE_BUCKET_MEDIA ?? "media";
const DOCUMENTS = process.env.STORAGE_BUCKET_DOCUMENTS ?? "client-documents";

const IMAGE_TYPES: Record<string, string> = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" };
const DOC_TYPES: Record<string, string> = { "application/pdf": "pdf", ...IMAGE_TYPES };
const MB = 1024 * 1024;

export class UploadError extends Error {}

function requireClient() {
  if (!client) throw new UploadError("File storage is not configured.");
  return client;
}

async function put(bucket: string, key: string, file: File) {
  await requireClient().send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: Buffer.from(await file.arrayBuffer()),
      ContentType: file.type,
      CacheControl: bucket === MEDIA ? "public, max-age=31536000, immutable" : "private, no-store",
    }),
  );
}

/** Upload a photo to the public media bucket. Returns the "media:<key>" reference stored in the database. */
export async function uploadMedia(file: File, folder: string) {
  const ext = IMAGE_TYPES[file.type];
  if (!ext) throw new UploadError("Photos must be JPEG, PNG or WebP.");
  if (file.size > 12 * MB) throw new UploadError("Photos must be under 12 MB.");
  const key = `${folder.replace(/[^a-z0-9/-]/gi, "")}/${randomUUID()}.${ext}`;
  await put(MEDIA, key, file);
  return `media:${key}`;
}

/** Upload a client document under "<userId>/" in the private bucket. Returns the object key. */
export async function uploadClientDocument(userId: string, file: File) {
  const ext = DOC_TYPES[file.type];
  if (!ext) throw new UploadError("Documents must be PDF, JPEG, PNG or WebP.");
  if (file.size > 25 * MB) throw new UploadError("Documents must be under 25 MB.");
  const key = `${userId}/${randomUUID()}.${ext}`;
  await put(DOCUMENTS, key, file);
  return key;
}

/** Short-lived download link for a private document. Callers must check ownership first. */
export async function signedDocumentUrl(key: string, filename: string) {
  return getSignedUrl(
    requireClient(),
    new GetObjectCommand({
      Bucket: DOCUMENTS,
      Key: key,
      ResponseContentDisposition: `attachment; filename="${filename.replace(/[^\w.-]/g, "_")}"`,
    }),
    { expiresIn: 300 },
  );
}
