// npm run db:migrate
// Applies db/migrations/*.sql in name order, once each, recorded in _migrations.

import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { Pool, neonConfig } from "@neondatabase/serverless";
import { loadEnv } from "./env.mjs";

loadEnv();
neonConfig.webSocketConstructor = globalThis.WebSocket;

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const dir = "db/migrations";

try {
  await pool.query("create table if not exists _migrations (name text primary key, applied_at timestamptz not null default now())");
  const done = new Set((await pool.query("select name from _migrations")).rows.map((r) => r.name));
  const files = readdirSync(dir).filter((f) => f.endsWith(".sql")).sort();

  for (const file of files) {
    if (done.has(file)) {
      console.log(`  skip  ${file}`);
      continue;
    }
    const client = await pool.connect();
    try {
      await client.query("begin");
      await client.query(readFileSync(join(dir, file), "utf8"));
      await client.query("insert into _migrations (name) values ($1)", [file]);
      await client.query("commit");
      console.log(`  apply ${file}`);
    } catch (err) {
      await client.query("rollback");
      throw new Error(`${file}: ${err.message}`);
    } finally {
      client.release();
    }
  }
  console.log("✓ migrations up to date");
} finally {
  await pool.end();
}
