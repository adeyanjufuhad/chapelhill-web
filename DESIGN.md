# DESIGN.md — Chapelhill

The design system for chapelhill.com.ng, in the [DESIGN.md](https://github.com/VoltAgent/awesome-design-md) format. Every agent and developer building UI in this repo follows it. It synthesises three sources, adapted to this brand:

- [Vercel Web Interface Guidelines](https://vercel.com/design/guidelines): interaction, accessibility, forms, performance.
- [Taste Skill](https://github.com/tasteskill/tasteskill) (MIT): `design-taste-frontend` and `high-end-visual-design`, used as anti-slop rules.
- The owner's reference: the "FIND Real Estate" site by @wearebrand.io (airy, kinetic, editorial).

Where the sources conflict, **owner decisions win** (noted inline).

## 1. Visual theme and atmosphere
Editorial luxury for a Nigerian developer selling to families at home and buyers abroad. Airy cream canvas, very large tight type, photography in rounded "windows", and one cinematic signature moment (the scroll-built house). Motion is constant but calm: things drift, reveal and respond, nothing bounces or flashes.

Dials (Taste Skill): **DESIGN_VARIANCE 7 · MOTION_INTENSITY 7 · VISUAL_DENSITY 3** (gallery spacing).

## 2. Colour palette and roles
| Token | Hex | Role |
|---|---|---|
| `--cream` | #F8F6F2 | Page background |
| `--ivory` | #FDFCF9 | Raised surfaces, inner bezels |
| `--ink` | #1A1A1A | Text (never pure #000) |
| `--oxblood` | #5C1A1B | **Lead brand colour**: primary buttons, dark sections, accents |
| `--oxblood-deep` | #3F1112 | Dark sections, washes over photos |
| `--oxblood-soft` | #7A2426 | Hover on dark |
| `--gold` | #B8893B | Rules, icons, large type, fills (never small text on cream) |
| `--gold-ink` / `--gold-light` | #8A6424 / #DBB46B | AA-safe small gold text on light / dark |
| `--stone` / `--stone-ink` | #E7E2D9 / #5E5A52 | Hairlines / secondary text |
| `--forest` | #2F4A3F | Minor accent only (owner: “more red, less green”) |

One accent family (oxblood + gold). No purple/blue “AI” gradients, no neon glows, no gradient text. Shadows and borders are tinted toward the surface hue.

## 3. Typography
- **Display & UI: Geist** (`--font-display`, `--font-sans`). Headlines `tracking-[-0.045em] leading-[0.95–1]`, sizes via `clamp()`; hierarchy by size and weight, not by colour noise.
- **Accent: Cormorant Garamond italic** (`.accent-italic`) for one emotional phrase per heading (“*excellence.*”). Oxblood on light, gold-light on dark.
- Body `text-base leading-relaxed max-w-[65ch]`, `text-muted-foreground` for secondary copy.
- Numbers use `tabular-nums`. Curly quotes, `…` ellipsis, non-breaking spaces in `₦40M`, `24 hours`.
- Banned: Inter, Roboto, Arial, Helvetica as display faces.

## 4. Components
- **Pill CTA (button-in-button):** `rounded-full` pill; trailing icon in its own circle that shifts toward the pointer (`group-hover:translate-x-1 -translate-y-px`), `active:scale-[0.98]`. Component: `PillLink`.
- **Eyebrow:** small uppercase tracked label (`.eyebrow`), optionally as a pill badge.
- **Double-bezel frame:** outer hairline shell with `p-1.5`, inner image/card with concentric radius (`calc(outer - 6px)`). Images never sit flat on the page.
- **Island navigation:** floating glass pill (`backdrop-blur`, hairline border, inset highlight), never edge-to-edge. Shrinks after scrolling. Mobile: full-screen staggered menu.
- **Scroll-activated rows** (services): the row nearest the viewport centre wipes in a photo band and an arrow; rows also activate on hover/focus.
- **Cards:** only when elevation means hierarchy. Otherwise group with `border-t` / `divide-y` and space.
- Icons: Lucide at **stroke 1.5** (global), always labelled when alone.
- Forms: label above, helper below, errors inline below the field; inputs ≥16px on mobile; submit never pre-disabled; loading keeps its label with a spinner.

## 5. Layout
- Container `.container-luxe`: max 1680px, `px-5 sm:px-[4vw]` (aligned with the hero window edge).
- Section rhythm `py-24 sm:py-36` minimum. Asymmetric grids (`1.4fr 1fr`, `0.9fr 2fr`), left-aligned headers; no centred heroes, no generic three-equal-column feature rows except image card rows.
- Full-height sections use `min-h-[100svh]`/`h-svh`, never `h-screen`.
- Every asymmetric layout collapses to one column below 768px.

## 6. Depth and elevation
Surfaces: cream → ivory → white. Shadows are two-layer and hue-tinted, e.g. `0 1px 2px rgb(63 17 18/.04), 0 24px 48px -28px rgb(63 17 18/.28)`. Glass only on fixed elements (nav, floating cards over photos). A fixed, pointer-events-none noise layer at 3% opacity adds paper texture.

## 7. Motion
- Easing `--ease-luxe: cubic-bezier(0.32, 0.72, 0, 1)`, durations 600–900ms for reveals, 300–500ms for hovers. Never `linear`/`ease-in-out` for UI, never `transition: all`.
- Scroll entry: fade + rise 16–24px + blur 6px → rest (`Reveal`). Stagger siblings by 80–120ms.
- Headings: word-by-word rise with mask (React Bits `SplitText`) on key section titles only.
- Kinetic marquee bands (React Bits `ScrollVelocity`) between chapters; speed reacts to scroll.
- Signature: the GSAP scroll-built house in the hero. Other pinned moments: the Abroad zoom.
- Only `transform` and `opacity` (and `clip-path` for wipes) animate. No scroll event listeners for reveals (IntersectionObserver / ScrollTrigger).
- `prefers-reduced-motion`: all of the above collapse to instant states; marquees stop.

## 8. Do’s and don’ts
**Do** use real client copy, Nigerian context (₦, Lekki, Abuja), concrete verbs (“Book a virtual inspection”), and mark placeholders with `<PlaceholderTag />`.
**Don’t** use filler copy (“Elevate”, “Seamless”, “Unleash”), emojis, generic avatars, round fake stats, purple gradients, custom cursors, edge-to-edge sticky bars, or stock photos presented as Chapelhill projects.
Owner overrides: free-licence Unsplash photography is allowed **for mood only** (Taste Skill bans it); shadcn/ui is allowed with custom radii/colours/shadows.

## 9. Responsive
Mobile first: 44px touch targets, `touch-action: manipulation`, no hover-only information (rows activate on scroll, too), sticky elements never cover focused fields, `overscroll-behavior: none` only for fine pointers. Verify at 390, 768, 1440 and 1920+ with no horizontal scroll.

## 10. Agent prompt guide
“Build this section in Chapelhill’s DESIGN.md: cream canvas, Geist headline with one Cormorant italic phrase in oxblood, eyebrow above, asymmetric 2-column grid, double-bezel photo, pill CTA with arrow circle, blur-rise reveal with 100ms stagger, everything collapses to one column under 768px.”
