import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { developments as staticDevelopments, type Development, type DevelopmentStatus } from "@/content/developments";
import {
  fxRatesPlaceholder,
  paymentPlans as staticPlans,
  progressPlaceholder,
  testimonials as staticTestimonials,
  trustStats,
} from "@/content/placeholders";
import { mediaUrl, sql } from "./client";

// Public, cached reads. Each falls back to the static content in src/content
// when the database is not configured or unreachable, so the marketing site
// always renders. Admin writes invalidate these with updateTag(<tag>).

export const TAGS = {
  developments: "developments",
  plans: "payment-plans",
  progress: "progress",
  fx: "fx-rates",
  testimonials: "testimonials",
  stats: "site-stats",
} as const;

async function withFallback<T>(label: string, query: () => Promise<T>, fallback: T): Promise<T> {
  if (!sql) return fallback;
  try {
    return await query();
  } catch (err) {
    console.error(`[db] ${label} failed, using static content:`, err instanceof Error ? err.message : err);
    return fallback;
  }
}

type DevelopmentRow = {
  id: string;
  slug: string;
  name: string;
  area: string;
  city: string;
  state: string;
  lat: number | null;
  lng: number | null;
  location_approximate: boolean;
  status: DevelopmentStatus;
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
  featured: boolean;
  images: { src: string; alt: string; width: number; height: number; is_render: boolean }[] | null;
};

export type DevelopmentWithId = Development & { id?: string };

function toDevelopment(r: DevelopmentRow): DevelopmentWithId {
  return {
    id: r.id,
    slug: r.slug,
    name: r.name,
    area: r.area,
    city: r.city,
    state: r.state,
    status: r.status,
    propertyType: r.property_type,
    bedrooms: r.bedrooms,
    baths: r.baths,
    sqm: r.sqm,
    titleType: r.title_type,
    priceFromNgn: Number(r.price_from_ngn),
    headline: r.headline ?? r.summary,
    summary: r.summary,
    description: r.description,
    amenities: r.amenities,
    location: { lat: r.lat ?? 6.5244, lng: r.lng ?? 3.3792, approximate: r.location_approximate },
    images: (r.images ?? []).map((im) => ({
      src: mediaUrl(im.src),
      alt: im.alt,
      width: im.width,
      height: im.height,
      render: im.is_render,
    })),
    featured: r.featured,
  };
}

export async function getDevelopments(): Promise<DevelopmentWithId[]> {
  "use cache";
  cacheTag(TAGS.developments);
  cacheLife("hours");

  return withFallback(
    "developments",
    async () => {
      const rows = (await sql!`
        select d.*,
          (select json_agg(json_build_object('src', i.src, 'alt', i.alt, 'width', i.width, 'height', i.height, 'is_render', i.is_render)
                           order by i.sort_order)
             from development_images i where i.development_id = d.id and i.kind = 'gallery') as images
        from developments d
        where d.published
        order by d.sort_order, d.name`) as DevelopmentRow[];
      const list = rows.map(toDevelopment).filter((d) => d.images.length > 0);
      return list.length ? list : staticDevelopments;
    },
    staticDevelopments,
  );
}

export async function getDevelopmentBySlug(slug: string) {
  return (await getDevelopments()).find((d) => d.slug === slug);
}

export type PaymentPlan = { name: string; depositPct: number; tenureMonths: number; note: string | null; placeholder: boolean };

export async function getPaymentPlans(developmentId?: string): Promise<PaymentPlan[]> {
  "use cache";
  cacheTag(TAGS.plans);
  cacheLife("hours");

  const fallback = staticPlans.map((p) => ({ ...p, placeholder: true }));
  return withFallback(
    "payment plans",
    async () => {
      const rows = (await sql!`
        select name, deposit_pct, tenure_months, note, is_placeholder from payment_plans
        where development_id = ${developmentId ?? null} or development_id is null
        order by (development_id is null), sort_order`) as {
        name: string;
        deposit_pct: string;
        tenure_months: number;
        note: string | null;
        is_placeholder: boolean;
      }[];
      // A development's own plans replace the global defaults.
      const own = rows.filter((r) => !r.is_placeholder);
      const chosen = own.length ? own : rows;
      return chosen.length
        ? chosen.map((r) => ({ name: r.name, depositPct: Number(r.deposit_pct), tenureMonths: r.tenure_months, note: r.note, placeholder: r.is_placeholder }))
        : fallback;
    },
    fallback,
  );
}

export type ProgressUpdate = { date: string; title: string; body?: string | null; stage: string; pct: number; media: { src: string; alt: string }[] };

/** Progress for a development; `placeholder` is true when nothing has been posted yet. */
export async function getProgress(developmentId?: string): Promise<{ updates: ProgressUpdate[]; placeholder: boolean }> {
  "use cache";
  cacheTag(TAGS.progress);
  cacheLife("minutes");

  const fallback = { updates: progressPlaceholder.map((u) => ({ ...u, media: [] })), placeholder: true };
  if (!developmentId) return fallback;
  return withFallback(
    "progress",
    async () => {
      const rows = (await sql!`
        select u.title, u.body, u.stage, u.percent_complete, u.occurred_on::text as occurred_on,
          coalesce((select json_agg(json_build_object('src', m.src, 'alt', m.alt) order by m.sort_order)
                    from progress_media m where m.update_id = u.id), '[]') as media
        from progress_updates u where u.development_id = ${developmentId}
        order by u.occurred_on desc, u.created_at desc limit 20`) as {
        title: string;
        body: string | null;
        stage: string | null;
        percent_complete: number;
        occurred_on: string;
        media: { src: string; alt: string }[];
      }[];
      if (!rows.length) return fallback;
      return {
        placeholder: false,
        updates: rows.map((r) => ({
          date: r.occurred_on,
          title: r.title,
          body: r.body,
          stage: r.stage ?? "",
          pct: r.percent_complete,
          media: r.media.map((m) => ({ ...m, src: mediaUrl(m.src) })),
        })),
      };
    },
    fallback,
  );
}

export type FxRates = { USD: number; GBP: number; updatedAt: string; placeholder: boolean };

export async function getFxRates(): Promise<FxRates> {
  "use cache";
  cacheTag(TAGS.fx);
  cacheLife("hours");

  const fallback = { USD: fxRatesPlaceholder.USD, GBP: fxRatesPlaceholder.GBP, updatedAt: fxRatesPlaceholder.updatedAt, placeholder: true };
  return withFallback(
    "fx rates",
    async () => {
      const rows = (await sql!`select currency, ngn_per_unit, updated_at::date::text as updated_at from fx_rates`) as {
        currency: "USD" | "GBP";
        ngn_per_unit: string;
        updated_at: string;
      }[];
      const usd = rows.find((r) => r.currency === "USD");
      const gbp = rows.find((r) => r.currency === "GBP");
      if (!usd || !gbp) return fallback;
      // Seeded values equal the placeholders until an admin saves real rates.
      const untouched = Number(usd.ngn_per_unit) === fxRatesPlaceholder.USD && Number(gbp.ngn_per_unit) === fxRatesPlaceholder.GBP;
      return {
        USD: Number(usd.ngn_per_unit),
        GBP: Number(gbp.ngn_per_unit),
        updatedAt: usd.updated_at > gbp.updated_at ? usd.updated_at : gbp.updated_at,
        placeholder: untouched,
      };
    },
    fallback,
  );
}

export type Testimonial = { quote: string; name: string; location: string | null; placeholder: boolean };

export async function getTestimonials(): Promise<Testimonial[]> {
  "use cache";
  cacheTag(TAGS.testimonials);
  cacheLife("hours");

  const fallback = staticTestimonials.map((t) => ({ ...t }));
  return withFallback(
    "testimonials",
    async () => {
      const rows = (await sql!`select quote, name, location, is_placeholder from testimonials where published order by sort_order`) as {
        quote: string;
        name: string;
        location: string | null;
        is_placeholder: boolean;
      }[];
      return rows.length ? rows.map((r) => ({ quote: r.quote, name: r.name, location: r.location, placeholder: r.is_placeholder })) : fallback;
    },
    fallback,
  );
}

export type SiteStat = { value: number; suffix: string; label: string; placeholder: boolean };

export async function getSiteStats(): Promise<SiteStat[]> {
  "use cache";
  cacheTag(TAGS.stats);
  cacheLife("hours");

  const fallback = trustStats.map((s) => ({ ...s }));
  return withFallback(
    "site stats",
    async () => {
      const rows = (await sql!`select value, suffix, label, is_placeholder from site_stats order by sort_order`) as {
        value: string;
        suffix: string;
        label: string;
        is_placeholder: boolean;
      }[];
      return rows.length ? rows.map((r) => ({ value: Number(r.value), suffix: r.suffix, label: r.label, placeholder: r.is_placeholder })) : fallback;
    },
    fallback,
  );
}
