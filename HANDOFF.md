# Handoff: Chapelhill website

Paste this file into any AI coding assistant (ChatGPT, Claude, etc.) together with the original project brief to continue the work. Keep it updated at every commit.

_Last updated: 18 October 2026, on branch `redesign` (pushed; not yet merged to main)._

## Project
A premium real-estate site for **Chapelhill Multicompany International Ltd** (Lagos/Abuja property developer), replacing https://chapelhill.com.ng. Public repo: https://github.com/adeyanjufuhad/chapelhill-web. Next.js 16.4 (App Router, **Cache Components on**: read `node_modules/next/dist/docs/` before using Next APIs), TypeScript, Tailwind v4, shadcn/ui (radix-nova), GSAP + ScrollTrigger, Lenis (desktop only), Leaflet, zod. Windows dev machine; Git Bash available.

## Ground rules (from the owner)
- Conventional commits, committed and pushed often. **No AI attribution** in commits or PRs. The `.githooks/commit-msg` hook strips it (`git config core.hooksPath .githooks`).
- Never generate images or video with AI APIs. Construction visuals come from the owner (Google Flow).
- Secrets only in `.env.local` (gitignored). Keys are listed in `.env.example`. `API_KEY_21ST` is for installing 21st.dev components.
- Ask before any database step whether to use the Supabase MCP.
- Real client content lives in `src/content/*`. Missing content uses clearly marked placeholders (`<PlaceholderTag />`) and is listed in `CONTENT-NEEDED.md`.
- Every imported component and stock photo goes in `CREDITS.md`.
- Stock photos are Unsplash License only, used for mood. Never present them as Chapelhill developments. Pinterest is for inspiration only (copyright).

## Brand (as changed by the owner)
- **Oxblood leads** (#5C1A1B, from the logo), with gold accents (#B8893B; AA-safe text tints `gold-ink` #8A6424 on light and `gold-light` #DBB46B on dark), cream/ivory backgrounds and ink text. **Green is a minor accent only.** Tokens are in `src/app/globals.css`, with theme classes `.theme-oxblood` / `.theme-ink` / `.theme-forest`.
- **Direction change (current work):** a full redesign towards the reference video (the "FIND Real Estate" site by @wearebrand.io): bright and airy, mostly white/cream, huge type, lots of space, scroll-driven zooms, a giant image-filled wordmark, oversized service rows with image reveals on hover (React Bits **Flowing Menu**), and clean image cards. The hero is also redesigned: an airy cream start, with the build video in an inset window that expands to full-bleed on scroll, then the frame scrub.

## Done
- Phase 0 plan, Phase 1 scaffold (tokens, fonts, hook, env example, content docs).
- Phase 2/3 frame pipeline: `npm run frames:video` (ffmpeg via `ffmpeg-static` fallback; `scripts/build-frames/*`) and `npm run frames:check`. Output goes to `public/build/` plus `manifest.json` (desktop 150 frames at 1280×720, mobile 90 at 960×540, mobile MP4 1.8 MB). Source video is in `assets/video/build-source.mp4` (gitignored).
- `<BuildSequenceHero />` (`src/components/hero/`): manifest-driven canvas scrub, blueprint SVG intro, captions with timings in `build-manifest.ts`, % counter, reduced-motion and MP4 fallbacks. Test page: `/dev/hero`.
- Phase 4 home page (`src/app/(site)/page.tsx`) and site chrome: Navbar (transparent over `[data-hero]`), restyled React Bits StaggeredMenu for mobile, Footer, floating WhatsApp, newsletter form (server action, **not persisted yet**).
- Phase 5 shared parts: `PageHeader`, `InquiryForm` plus `submitInquiry` action (inspection mode, **not persisted yet**), `Lightbox`, lazy `DevelopmentsMap` (Leaflet + CARTO tiles), React Bits ScrollStack and Masonry installed.
- 17 Unsplash photos in `public/images/stock/` (960px variants in `stock/sm/`) with metadata in `src/content/stock.ts`.
- **Home redesign done** (branch `redesign`). Type is Inter Tight display + Cormorant italic accents (`.accent-italic` uses `--accent-ink`: oxblood on light, gold-light on dark). `.container-luxe` aligns to 4vw edges. Hero (`BuildSequenceScrub`): cream headline, then an inset window (clip-path measured from a layout slot) expands to full-bleed over the first 16% of a 400% pin, then the frame scrub, then a "Your home, finished" finale. Sections: `Statement` (React Bits ScrollReveal + counters), `Wordmark` (image-filled text), `FeaturedDevelopments` (clean rounded cards), `AbroadZoom` (pinned clip-path zoom + 4 steps), `ServicesFlow` (React Bits FlowingMenu), `TrackerTeaser`, `Testimonials`, `FaqSection`, `ClosingCta` (Lekki bridge sky), oxblood `Footer` with giant wordmark.
- Navbar tone: sections set `data-nav-tone="light" | "dark"` (pinned sections update it on scroll); elsewhere the bar is solid cream.
- The React Compiler lint rules are relaxed for `src/components/reactbits/**` only (vendored code; see `eslint.config.mjs`).

## Next steps
1. Owner review of the redesign, then merge `redesign` into main. When `API_KEY_21ST` is in `.env.local`, use 21st.dev components where they beat the current ones.
2. Phase 5 pages in the new style (restyle `PageHeader` to the light airy look first): About, Services (ScrollStack process + per-service enquiry), Developments (filters: location/type/status/price, list/map toggle, `useSearchParams` inside `<Suspense>`), Development detail (`generateStaticParams` for the 3 slugs; gallery + lightbox, specs "On request" when null, placeholder payment plans, map, placeholder progress timeline, enquiry, WhatsApp prefilled, virtual inspection form), Compare (2–3 side by side), Calculator (price, deposit %, tenure, rate; ₦/$/£ with placeholder FX; disclaimer), Gallery (Masonry + lightbox), Contact (map, phones, email, form).
3. Phase 6: ask about the Supabase MCP, then schema + RLS (see the plan in the Phase 0 notes), admin dashboard, persist inquiries and newsletter, Resend notifications, FX rates in the admin.
4. Phase 7: diaspora portal (magic link). Phase 8: SEO/JSON-LD/sitemap, GA4/Hotjar/Tawk, Lighthouse ≥85 on mobile, accessibility, Vercel deploy.

## How to verify
`npm run dev`, then open `/`, `/dev/hero` and `/dev/brand`. `npx tsc --noEmit`, `npx eslint src scripts` and `npm run build` must all pass.
