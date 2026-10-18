// npm run db:seed
// Seeds the database from src/content (the same data the static site uses).
// Idempotent: developments upsert by slug; their images are replaced; settings upsert.
// Runs with Node's built-in type stripping (node --experimental-strip-types).

import { Pool, neonConfig } from "@neondatabase/serverless";
import { developments } from "../../src/content/developments.ts";
import { fxRatesPlaceholder, paymentPlans, testimonials, trustStats } from "../../src/content/placeholders.ts";
import { loadEnv } from "./env.mjs";

loadEnv();
neonConfig.webSocketConstructor = globalThis.WebSocket;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const client = await pool.connect();

try {
  await client.query("begin");

  for (const [i, d] of developments.entries()) {
    const { rows } = await client.query(
      `insert into developments (slug, name, area, city, state, lat, lng, location_approximate, status, property_type,
         bedrooms, baths, sqm, title_type, price_from_ngn, headline, summary, description, amenities, featured, published, sort_order)
       values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,true,$21)
       on conflict (slug) do update set name = excluded.name, area = excluded.area, city = excluded.city,
         state = excluded.state, lat = excluded.lat, lng = excluded.lng, location_approximate = excluded.location_approximate,
         status = excluded.status, property_type = excluded.property_type, bedrooms = excluded.bedrooms,
         baths = excluded.baths, sqm = excluded.sqm, title_type = excluded.title_type, price_from_ngn = excluded.price_from_ngn,
         headline = excluded.headline, summary = excluded.summary, description = excluded.description,
         amenities = excluded.amenities, featured = excluded.featured, sort_order = excluded.sort_order
       returning id`,
      [d.slug, d.name, d.area, d.city, d.state, d.location.lat, d.location.lng, d.location.approximate, d.status,
       d.propertyType, d.bedrooms, d.baths, d.sqm, d.titleType, d.priceFromNgn, d.headline, d.summary, d.description,
       d.amenities, d.featured, i],
    );
    const id = rows[0].id;
    await client.query("delete from development_images where development_id = $1", [id]);
    for (const [j, im] of d.images.entries()) {
      await client.query(
        `insert into development_images (development_id, src, alt, width, height, is_render, sort_order)
         values ($1,$2,$3,$4,$5,$6,$7)`,
        [id, im.src, im.alt, im.width, im.height, Boolean(im.render), j],
      );
    }
    console.log(`  development  ${d.slug}  (${d.images.length} images)`);
  }

  await client.query("delete from payment_plans where development_id is null and is_placeholder");
  for (const [i, p] of paymentPlans.entries()) {
    await client.query(
      `insert into payment_plans (development_id, name, deposit_pct, tenure_months, note, is_placeholder, sort_order)
       values (null,$1,$2,$3,$4,true,$5)`,
      [p.name, p.depositPct, p.tenureMonths, p.note, i],
    );
  }

  for (const cur of ["USD", "GBP"] as const) {
    await client.query(
      `insert into fx_rates (currency, ngn_per_unit) values ($1,$2)
       on conflict (currency) do nothing`,
      [cur, fxRatesPlaceholder[cur]],
    );
  }

  await client.query("delete from testimonials where is_placeholder");
  for (const [i, t] of testimonials.entries()) {
    await client.query(
      `insert into testimonials (quote, name, location, published, is_placeholder, sort_order) values ($1,$2,$3,true,true,$4)`,
      [t.quote, t.name, t.location, i],
    );
  }

  for (const [i, s] of trustStats.entries()) {
    const key = s.label.toLowerCase().replace(/[^a-z0-9]+/g, "_");
    await client.query(
      `insert into site_stats (key, value, suffix, label, is_placeholder, sort_order) values ($1,$2,$3,$4,$5,$6)
       on conflict (key) do nothing`,
      [key, s.value, s.suffix, s.label, s.placeholder, i],
    );
  }

  await client.query("commit");
  console.log("✓ seed complete");
} catch (err) {
  await client.query("rollback");
  throw err;
} finally {
  client.release();
  await pool.end();
}
