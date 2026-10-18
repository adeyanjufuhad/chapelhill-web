# Chapelhill web

Premium website for **Chapelhill Multicompany International Ltd**, a property developer in Lagos and Abuja. Built with Next.js 16 (App Router), TypeScript, Tailwind CSS v4, shadcn/ui, GSAP + ScrollTrigger, and Lenis.

## Getting started
```bash
npm install
cp .env.example .env.local   # fill in keys
npm run dev
```

## Build-sequence hero
The landing-page hero scrubs a frame sequence generated from a video. It reads only `public/build/manifest.json`, so replacing the video is one command:

```bash
npm run frames:video     # assets/video/* → public/build/*
npm run frames:check     # frame counts and sizes; fails if mobile > 4 MB
```

## Project docs
- `CONTENT-NEEDED.md`: outstanding items for the client
- `CREDITS.md`: third-party components and licenses

## Git
Commits follow Conventional Commits. A `commit-msg` hook in `.githooks/` strips AI attribution trailers. Enable it after cloning:

```bash
git config core.hooksPath .githooks
```
