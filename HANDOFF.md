# Handoff: Chapelhill website

Paste this file into any AI coding assistant (ChatGPT, Claude, etc.) together with the original project brief to continue the work. Keep it updated at every commit.

_Last updated: 18 October 2026. All phases are on `main`; the remaining work is performance tuning and deployment._

## Project
A premium real-estate site for **Chapelhill Multicompany International Ltd** (Lagos/Abuja property developer), replacing https://chapelhill.com.ng. Public repo: https://github.com/adeyanjufuhad/chapelhill-web. Next.js 16.4 (App Router, **Cache Components on**: read `node_modules/next/dist/docs/` before using Next APIs), TypeScript, Tailwind v4, shadcn/ui (radix-nova), GSAP + ScrollTrigger, Lenis (desktop only), Leaflet, zod, **Neon** (Postgres + Managed Better Auth + Object Storage), Resend. Windows dev machine; Git Bash available.

## Ground rules (from the owner)
- Conventional commits, committed and pushed often. **No AI attribution** in commits or PRs. The `.githooks/commit-msg` hook strips it (`git config core.hooksPath .githooks`).
- Never generate images or video with AI APIs. Construction visuals come from the owner (Google Flow).
- Secrets only in `.env.local` (gitignored). Keys are listed in `.env.example`.
- **Backend is Neon, not Supabase** (owner's decision).
- Real client content lives in `src/content/*`. Missing content uses clearly marked placeholders (`<PlaceholderTag />`, hide all with `NEXT_PUBLIC_SHOW_PLACEHOLDERS=false`) and is listed in `CONTENT-NEEDED.md`.
- Every imported component and stock photo goes in `CREDITS.md`. Stock photos: Unsplash License only, for mood, never presented as Chapelhill developments.

## Brand
Oxblood leads (#5C1A1B), gold accents (#B8893B; AA text tints `gold-ink` / `gold-light`), cream/ivory backgrounds, ink text; green is a minor accent. Geist display and body, plus Cormorant (one italic 400 face) for accent phrases. Airy "FIND"-style layout: big type, rounded image windows, floating island nav, pill CTAs with an inner icon, scroll zooms and kinetic bands. **Build all UI against `DESIGN.md`** (design system, motion rules, dials). Tokens are in `src/app/globals.css`.

## Neon setup (live)
- Project **chapelhill-web** (`withered-cherry-56803155`), region **aws-eu-central-1 (Frankfurt)** (object storage is not available in London), Postgres 18, branch `main` (`br-raspy-lab-b9w8cxle`).
- Schema: `db/migrations/0001_init.sql` (developments, images, unit types, payment plans, progress updates/media, client profiles/units, document and inspection requests, inquiries, newsletter, FX rates, testimonials, site stats). RLS is enabled on every table with no policies (no Data API access); the Next.js server connects as the owner and enforces access in `src/lib/db/*`.
- `npm run db:migrate` (tracked in `_migrations`) and `npm run db:seed` (idempotent, from `src/content`). Both have been run.
- **Auth:** Managed Better Auth, email + password. Users are in `neon_auth."user"` (`role` = `admin` or `user`). Admin = `role 'admin'`.
- **Storage:** buckets `media` (public-read: development and progress photos, referenced as `media:<key>`) and `client-documents` (private, keys under `<user_id>/`, 5-minute signed URLs after an ownership check).
- Test rows: one enquiry, one inspection request and one newsletter row from `automated-test@example.com` (enquiries marked closed). Safe to delete.

## Done
- Phases 0–5: scaffold, frame pipeline (`npm run frames:video`, `frames:check`), `<BuildSequenceHero />`, redesigned home, all public pages (About, Services, Developments with filters and map, detail pages, Compare, Calculator, Gallery, Contact).
- Phase 6: cached data layer `src/lib/db/public.ts` (`"use cache"` + `cacheTag`, falls back to `src/content` if the DB is unreachable); forms persist to Neon and email the sales inbox via Resend (`src/lib/email.ts`); admin dashboard at `/admin` (developments + photos + payment plans, construction progress with photos, enquiries, document and inspection requests, clients with invite emails, FX rates and stats, subscriber CSV export). Every admin action calls `requireAdmin()`.
- Phase 7: client portal at `/portal` (units with progress timeline and photos, document requests with secure downloads, video inspection booking, password set/reset).
- `src/proxy.ts` refreshes sessions and redirects `/admin/*` and `/portal/*` to their sign-in pages.
- Phase 8: metadata, OG image, icons, sitemap, robots, JSON-LD (Organization, Residence/Offer), consented GA4 and Hotjar, and Tawk.to after the first interaction.
- Motion and performance: a single `RevealObserver` (root layout) flips `data-in` on every `[data-reveal]` / `[data-split]`, so `Reveal` and `SplitHeading` are plain server markup animated by CSS. Below-fold motion mounts near the viewport via `useNear`. Hero frames after the first four stream on the first scroll, touch or key.

## Owner to-do (needs a human)
1. **Create the first admin:** Neon Console → project chapelhill-web → Auth → Users → add a user, then ⋯ → **Make admin**. Sign in at `/admin/login`.
2. In Neon Console → Settings → Better Auth: **turn off "Allow sign up"** (clients are created from `/admin/clients`), optionally enable **Magic Link**, and set a **custom email provider** for production (the shared sender is for development).
3. Add the production domain as a **trusted domain** in Neon Auth.
4. Add `RESEND_API_KEY`, `RESEND_FROM` (a verified domain sender) and `INQUIRY_NOTIFY_EMAIL` to `.env.local` and to Vercel.
5. Vercel: import the GitHub repo, add every variable from `.env.local`, set `NEXT_PUBLIC_SITE_URL` to the real domain, and set the function region to **fra1** (next to the database).

## Lighthouse (mobile, local `next start`, median of 3 runs)
| Page | Perf | A11y | Best practices | SEO | LCP | CLS |
|---|---|---|---|---|---|---|
| `/` | 64 (59–72) | 97 | 100 | 100 | 5.2 s | 0 |
| `/developments` | 73 | 100 | 100 | 100 | 4.7 s | 0 |
| `/developments/brains-and-hammers` | 65 (57–81) | 96 | 100 | 100 | 4.7 s | 0 |
| `/contact` | 84 | 100 | 100 | 100 | 3.4 s | 0 |

Total Blocking Time varies a lot between runs on the dev machine (150–670 ms), so measure again on the Vercel deployment with PageSpeed Insights before tuning further.

## Next steps
- **Performance to ≥85 on mobile.** Most of the remaining cost is React hydration (the react-dom chunk takes about 1.4 s of scripting under 4× CPU throttling) and about 1.5 s of style and layout on the home page. Next moves: turn more home sections into server components with CSS-only motion, check whether ScrollTrigger refreshes and pins cause the layout cost, and lazy-load the Leaflet map and its CSS on `/contact` and the detail pages.
- Home a11y 97: Scroll Reveal words briefly sit at low opacity, which fails contrast while they animate.
- Deploy on Vercel (owner to-do 5).

## How to verify
`npm run dev`, then open `/`, `/developments`, `/admin/login`, `/portal/login`. `npx tsc --noEmit`, `npx eslint src scripts` and `npm run build` must all pass.
