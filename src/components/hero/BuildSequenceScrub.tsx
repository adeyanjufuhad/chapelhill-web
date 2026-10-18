"use client";

import { useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";
import { BlueprintDrawing } from "./BlueprintDrawing";
import { HeroCtas } from "./HeroCtas";
import { buildStages, frameUrl, heroCopy, type BuildManifest, type FrameSetName } from "./build-manifest";

gsap.registerPlugin(ScrollTrigger);

type Mode = "frames" | "video" | "static";

const EAGER_FRAMES = 10;
const IDLE_BATCH = 6;
const INTRO_MIN_MS = 1400;
const MAX_DPR = 2;

/** Load order after the eager frames: coarse strides first, so a fast scroll still finds nearby frames. */
function idleOrder(count: number) {
  const seen = new Set<number>(Array.from({ length: Math.min(EAGER_FRAMES, count) }, (_, i) => i));
  const order: number[] = [];
  for (const stride of [16, 8, 4, 2, 1]) {
    for (let i = 0; i < count; i += stride) {
      if (!seen.has(i)) {
        seen.add(i);
        order.push(i);
      }
    }
  }
  if (!seen.has(count - 1)) order.push(count - 1);
  return order;
}

type ClientEnv = { mobile: boolean; reduced: boolean; constrained: boolean };

const queries = { mobile: "(max-width: 767px)", reduced: "(prefers-reduced-motion: reduce)" };

function subscribeEnv(onChange: () => void) {
  const lists = Object.values(queries).map((q) => window.matchMedia(q));
  lists.forEach((l) => l.addEventListener("change", onChange));
  return () => lists.forEach((l) => l.removeEventListener("change", onChange));
}

// Snapshot as a string so useSyncExternalStore compares by value.
function envSnapshot() {
  const connection = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
  const constrained = Boolean(connection?.saveData) || /(^|-)2g$/.test(connection?.effectiveType ?? "");
  return [window.matchMedia(queries.mobile).matches, window.matchMedia(queries.reduced).matches, constrained].join(",");
}

/** Viewport, motion and data-saver preferences; null during server render and hydration. */
function useClientEnv(): ClientEnv | null {
  const snapshot = useSyncExternalStore(subscribeEnv, envSnapshot, () => null);
  if (snapshot === null) return null;
  const [mobile, reduced, constrained] = snapshot.split(",").map((v) => v === "true");
  return { mobile, reduced, constrained };
}

const idle = (cb: () => void) =>
  "requestIdleCallback" in window
    ? window.requestIdleCallback(cb, { timeout: 300 })
    : (setTimeout(cb, 50) as unknown as number);

export function BuildSequenceScrub({ manifest, poster }: { manifest: BuildManifest; poster: ReactNode }) {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);
  const finaleRef = useRef<HTMLDivElement>(null);
  const captionsRef = useRef<HTMLDivElement>(null);

  const env = useClientEnv();
  const [framesFailed, setFramesFailed] = useState(false);
  const [stage, setStage] = useState(0);
  const [introVisible, setIntroVisible] = useState(true);
  const [introFading, setIntroFading] = useState(false);

  // Before hydration (env null) render the frames layout, which matches the server HTML.
  const setName: FrameSetName | null = env ? (env.mobile ? "mobile" : "desktop") : null;
  const mode: Mode = env?.reduced
    ? "static"
    : manifest.video && (framesFailed || env?.constrained)
      ? "video"
      : "frames";

  // Frame loading, drawing and the scroll timeline.
  useEffect(() => {
    if (!setName || mode === "static") return;
    const section = sectionRef.current;
    const canvas = canvasRef.current;
    if (!section) return;

    const { count } = manifest[setName];
    const frames: (HTMLImageElement | undefined)[] = new Array(count);
    // Transparent until the first frame is drawn, so the poster shows through.
    const ctx = canvas?.getContext("2d") ?? null;
    const startedAt = performance.now();
    let target = 0;
    let drawn = -1;
    let cancelled = false;
    let failures = 0;
    let idleHandle = 0;
    let rafHandle = 0;

    const nearestLoaded = (index: number) => {
      for (let d = 0; d < count; d++) {
        if (frames[index - d]) return index - d;
        if (frames[index + d]) return index + d;
      }
      return -1;
    };

    const draw = (force = false) => {
      if (!ctx || !canvas || mode !== "frames") return;
      const index = nearestLoaded(target);
      if (index < 0 || (index === drawn && !force)) return;
      const img = frames[index]!;
      const { width: cw, height: ch } = canvas;
      const scale = Math.max(cw / img.naturalWidth, ch / img.naturalHeight);
      const dw = img.naturalWidth * scale;
      const dh = img.naturalHeight * scale;
      ctx.drawImage(img, (cw - dw) / 2, (ch - dh) / 2, dw, dh);
      drawn = index;
    };

    const resize = () => {
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      canvas.width = Math.round(canvas.clientWidth * dpr);
      canvas.height = Math.round(canvas.clientHeight * dpr);
      if (ctx) ctx.imageSmoothingQuality = "high";
      draw(true);
    };

    const finishIntro = () => {
      const wait = Math.max(0, INTRO_MIN_MS - (performance.now() - startedAt));
      window.setTimeout(() => {
        if (cancelled) return;
        setIntroFading(true);
        window.setTimeout(() => !cancelled && setIntroVisible(false), 700);
      }, wait);
    };

    const load = (index: number, priority = false) =>
      new Promise<void>((resolve) => {
        const img = new Image();
        img.decoding = "async";
        if (priority) img.fetchPriority = "high";
        img.onload = () => {
          frames[index] = img;
          if (Math.abs(index - target) <= Math.abs(drawn - target) || drawn < 0) draw();
          resolve();
        };
        img.onerror = () => {
          failures += 1;
          resolve();
        };
        img.src = frameUrl(setName, index);
      });

    const update = (progress: number) => {
      target = Math.round(progress * (count - 1));
      if (mode === "frames") draw();
      else if (mode === "video") {
        const video = videoRef.current;
        if (video?.duration && !rafHandle) {
          rafHandle = requestAnimationFrame(() => {
            rafHandle = 0;
            video.currentTime = Math.min(video.duration - 0.05, progress * video.duration);
          });
        }
      }

      if (counterRef.current) counterRef.current.textContent = `${Math.round(progress * 100)}%`;
      if (barRef.current) barRef.current.style.transform = `scaleX(${progress})`;

      const next = buildStages.findIndex((s) => progress >= s.from && progress < s.to);
      if (next >= 0) setStage((prev) => (prev === next ? prev : next));

      // Finale: headline and CTAs settle in over the last stretch of the scroll.
      const f = gsap.utils.clamp(0, 1, (progress - 0.88) / 0.08);
      if (finaleRef.current) {
        finaleRef.current.style.opacity = String(f);
        finaleRef.current.style.transform = `translateY(${(1 - f) * 24}px)`;
        finaleRef.current.style.pointerEvents = f > 0.5 ? "auto" : "none";
      }
      if (captionsRef.current) captionsRef.current.style.opacity = String(1 - f * 0.6);
    };

    if (mode === "frames") {
      resize();
      window.addEventListener("resize", resize);

      const eager = Array.from({ length: Math.min(EAGER_FRAMES, count) }, (_, i) => load(i, i === 0));
      Promise.all(eager).then(() => {
        if (cancelled) return;
        if (failures >= 3 && manifest.video) {
          setFramesFailed(true);
          return;
        }
        finishIntro();
        const queue = idleOrder(count);
        const pump = () => {
          if (cancelled || queue.length === 0) return;
          Promise.all(queue.splice(0, IDLE_BATCH).map((i) => load(i))).then(() => {
            idleHandle = idle(pump);
          });
        };
        idleHandle = idle(pump);
      });
    } else {
      finishIntro();
    }

    const state = { progress: 0 };
    const tween = gsap.to(state, {
      progress: 1,
      ease: "none",
      onUpdate: () => update(state.progress),
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: "+=300%",
        pin: true,
        scrub: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      },
    });
    update(0);

    return () => {
      cancelled = true;
      window.removeEventListener("resize", resize);
      if ("cancelIdleCallback" in window) window.cancelIdleCallback(idleHandle);
      else clearTimeout(idleHandle);
      cancelAnimationFrame(rafHandle);
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [manifest, mode, setName]);

  if (mode === "static") {
    return <ReducedMotionHero manifest={manifest} />;
  }

  return (
    <section
      ref={sectionRef}
      aria-label="Chapelhill: from empty plot to finished home"
      className="theme-forest relative h-svh w-full overflow-hidden"
    >
      {/* Frame 1 as a server-rendered priority image: the LCP element. The canvas paints over it. */}
      <div className="absolute inset-0">{poster}</div>
      {mode === "frames" ? (
        <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-hidden="true" />
      ) : (
        <video
          ref={videoRef}
          src={manifest.video ?? undefined}
          muted
          playsInline
          preload="auto"
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}

      {/* Readability: dark-green wash from the left, and from the bottom on small screens. */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-forest-deep/90 via-forest-deep/45 to-transparent md:via-forest-deep/35" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-forest-deep/85 to-transparent md:h-1/3" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-forest-deep/50 to-transparent" />

      <div className="container-luxe relative flex h-full flex-col justify-between pt-28 pb-10 sm:pt-32 sm:pb-14">
        <div ref={captionsRef} className="max-w-md">
          <p className="eyebrow">{heroCopy.eyebrow}</p>
          <div className="rule-gold mt-5" />
          <div className="relative mt-6 h-28 sm:h-36" aria-live="polite">
            {buildStages.map((s, i) => (
              <div
                key={s.label}
                aria-hidden={i !== stage}
                className={cn(
                  "absolute inset-0 transition-[opacity,transform] duration-700 ease-[var(--ease-luxe)]",
                  i === stage ? "translate-y-0 opacity-100" : i < stage ? "-translate-y-3 opacity-0" : "translate-y-3 opacity-0",
                )}
              >
                <p className="text-gold-light font-sans text-xs tracking-[0.2em] tabular-nums">
                  {String(i + 1).padStart(2, "0")} / {String(buildStages.length).padStart(2, "0")}
                </p>
                <p className="font-display mt-2 text-4xl leading-none sm:text-6xl">{s.label}</p>
                <p className="text-muted-foreground mt-3 text-sm sm:text-base">{s.detail}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-8">
          <div ref={finaleRef} className="max-w-2xl opacity-0" style={{ pointerEvents: "none" }}>
            <h1 className="text-4xl leading-[1.05] sm:text-6xl lg:text-7xl">
              {heroCopy.headline} <span className="accent-italic block">{heroCopy.headlineAccent}</span>
            </h1>
            <HeroCtas className="mt-8" />
          </div>

          <div className="max-w-sm">
            <p className="text-sm">
              <span ref={counterRef} className="font-display text-gold-light text-3xl tabular-nums">
                0%
              </span>
              <span className="text-muted-foreground ml-2 tracking-wide">complete</span>
            </p>
            <span className="bg-cream/15 mt-3 block h-px w-full overflow-hidden">
              <span ref={barRef} className="bg-gold block h-full w-full origin-left scale-x-0" />
            </span>
          </div>
        </div>
      </div>

      {introVisible && (
        <div
          aria-hidden="true"
          className={cn(
            "bg-forest-deep absolute inset-0 z-10 flex items-center justify-center transition-opacity duration-700",
            introFading && "opacity-0",
          )}
        >
          <BlueprintDrawing className="text-cream w-[min(88vw,760px)]" />
        </div>
      )}
    </section>
  );
}

function ReducedMotionHero({ manifest }: { manifest: BuildManifest }) {
  return (
    <section aria-label="Chapelhill: from empty plot to finished home" className="theme-forest relative min-h-svh overflow-hidden">
      {manifest.final && (
        // eslint-disable-next-line @next/next/no-img-element -- static fallback, already optimised WebP
        <img src={manifest.final} alt="" className="absolute inset-0 h-full w-full object-cover" />
      )}
      <div className="absolute inset-0 bg-gradient-to-r from-forest-deep/90 via-forest-deep/60 to-forest-deep/20" />
      <StaticHeroContent />
    </section>
  );
}

export function StaticHeroContent() {
  return (
    <div className="container-luxe relative flex min-h-svh flex-col justify-end pt-32 pb-16">
      <p className="eyebrow">{heroCopy.eyebrow}</p>
      <div className="rule-gold mt-5" />
      <ol className="text-muted-foreground mt-6 flex flex-wrap gap-x-3 gap-y-1 text-sm">
        {buildStages.map((s, i) => (
          <li key={s.label} className="flex items-center gap-3">
            {i > 0 && <span aria-hidden="true" className="bg-gold inline-block h-px w-4" />}
            {s.label}
          </li>
        ))}
      </ol>
      <h1 className="mt-10 max-w-3xl text-4xl leading-[1.05] sm:text-6xl lg:text-7xl">
        {heroCopy.headline} <span className="accent-italic block">{heroCopy.headlineAccent}</span>
      </h1>
      <HeroCtas className="mt-8" />
    </div>
  );
}
