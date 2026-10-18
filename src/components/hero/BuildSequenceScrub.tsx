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
/** Share of the pinned scroll spent expanding the window to full-bleed. */
const EXPAND = 0.16;
const PIN_LENGTH = "+=400%";

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

const ease = gsap.parseEase("power2.inOut");
const clamp01 = gsap.utils.clamp(0, 1);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export function BuildSequenceScrub({ manifest, poster }: { manifest: BuildManifest; poster: ReactNode }) {
  const sectionRef = useRef<HTMLElement>(null);
  const slotRef = useRef<HTMLDivElement>(null);
  const windowRef = useRef<HTMLDivElement>(null);
  const zoomRef = useRef<HTMLDivElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const mistRef = useRef<HTMLDivElement>(null);
  const chromeRef = useRef<HTMLDivElement>(null);
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

  useEffect(() => {
    if (!setName || mode === "static") return;
    const section = sectionRef.current;
    const slot = slotRef.current;
    const windowEl = windowRef.current;
    const canvas = canvasRef.current;
    if (!section || !slot || !windowEl) return;

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
    let lastProgress = 0;
    // Window start insets (px), measured from the layout slot.
    let inset = { top: 0, right: 0, bottom: 0, left: 0, radius: 28 };
    // How far the window's centre sits below the section's centre, so the
    // opening crop shows the middle of the frame rather than its lower half.
    let centreOffset = 0;

    const measure = () => {
      const s = section.getBoundingClientRect();
      const r = slot.getBoundingClientRect();
      inset = {
        top: r.top - s.top,
        right: s.right - r.right,
        bottom: s.bottom - r.bottom,
        left: r.left - s.left,
        radius: parseFloat(getComputedStyle(slot).borderTopLeftRadius) || 28,
      };
      centreOffset = r.top + r.height / 2 - (s.top + s.height / 2);
    };

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
      measure();
      if (canvas) {
        const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
        canvas.width = Math.round(canvas.clientWidth * dpr);
        canvas.height = Math.round(canvas.clientHeight * dpr);
        if (ctx) ctx.imageSmoothingQuality = "high";
        draw(true);
      }
      update(lastProgress);
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

    function update(progress: number) {
      lastProgress = progress;
      const e = ease(clamp01(progress / EXPAND));
      const fp = clamp01((progress - EXPAND) / (1 - EXPAND));

      // 1. Window expands from the slot to full-bleed while the camera pulls back.
      const t = lerp(inset.top, 0, e);
      const r = lerp(inset.right, 0, e);
      const b = lerp(inset.bottom, 0, e);
      const l = lerp(inset.left, 0, e);
      windowEl!.style.clipPath = `inset(${t}px ${r}px ${b}px ${l}px round ${lerp(inset.radius, 0, e)}px)`;
      if (zoomRef.current) {
        zoomRef.current.style.transform = `translateY(${centreOffset * (1 - e)}px) scale(${lerp(1.08, 1, e)})`;
      }
      if (introRef.current) {
        introRef.current.style.opacity = String(1 - clamp01(e / 0.7));
        introRef.current.style.transform = `translateY(${-48 * e}px)`;
      }
      if (mistRef.current) mistRef.current.style.opacity = String(1 - clamp01(e / 0.6));
      if (chromeRef.current) chromeRef.current.style.opacity = String(clamp01((e - 0.6) / 0.4));
      section!.dataset.navTone = e > 0.85 ? "dark" : "light";

      // 2. Frame scrub across the rest of the pin.
      target = Math.round(fp * (count - 1));
      if (mode === "frames") draw();
      else if (mode === "video") {
        const video = videoRef.current;
        if (video?.duration && !rafHandle) {
          rafHandle = requestAnimationFrame(() => {
            rafHandle = 0;
            video.currentTime = Math.min(video.duration - 0.05, fp * video.duration);
          });
        }
      }

      if (counterRef.current) counterRef.current.textContent = String(Math.round(fp * 100));
      if (barRef.current) barRef.current.style.transform = `scaleX(${fp})`;

      const next = buildStages.findIndex((s) => fp >= s.from && fp < s.to);
      if (next >= 0) setStage((prev) => (prev === next ? prev : next));

      // 3. Finale over the finished home.
      const f = clamp01((fp - 0.88) / 0.08);
      if (finaleRef.current) {
        finaleRef.current.style.opacity = String(f);
        finaleRef.current.style.transform = `translateY(${(1 - f) * 24}px)`;
        finaleRef.current.style.pointerEvents = f > 0.5 ? "auto" : "none";
      }
      if (captionsRef.current) captionsRef.current.style.opacity = String(1 - f);
    }

    resize();
    window.addEventListener("resize", resize);

    if (mode === "frames") {
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
        end: PIN_LENGTH,
        pin: true,
        scrub: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        // Pins further down the page must measure after this 400% spacer exists.
        refreshPriority: 1,
        onRefresh: () => {
          measure();
          update(state.progress);
        },
      },
    });
    update(0);
    ScrollTrigger.sort();
    ScrollTrigger.refresh();

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
    return (
      <StaticBuildHero>
        {manifest.final && (
          // eslint-disable-next-line @next/next/no-img-element -- static fallback, already optimised WebP
          <img src={manifest.final} alt="The finished Chapelhill duplex at dusk" className="absolute inset-0 h-full w-full object-cover" />
        )}
      </StaticBuildHero>
    );
  }

  return (
    <section
      ref={sectionRef}
      data-nav-tone="light"
      aria-label="Chapelhill: from empty plot to finished home"
      className="bg-cream relative flex h-svh w-full flex-col overflow-hidden"
    >
      {/* Opening state: headline on cream, above the window slot. */}
      <div ref={introRef} className="relative z-0">
        <HeroIntro />
      </div>
      <div ref={slotRef} aria-hidden="true" className="mx-4 mb-4 flex-1 rounded-[22px] sm:mx-[4vw] sm:mb-[4vh] sm:rounded-[32px]" />

      {/* The window: full-section layer, clipped to the slot and opened on scroll. */}
      <div
        ref={windowRef}
        className="theme-oxblood absolute inset-0 z-10 overflow-hidden"
        style={{ clipPath: "inset(45% 4vw 4vh 4vw round 32px)" }}
      >
        <div ref={zoomRef} className="absolute inset-0 origin-[50%_60%] will-change-transform">
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
        </div>

        {/* Soft white mist across the top of the window that parts as it opens. */}
        <div ref={mistRef} aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className="absolute top-[34%] left-[-12%] h-[18%] w-[60%] rounded-full bg-white/35 blur-3xl" />
          <div className="absolute top-[32%] right-[-14%] h-[16%] w-[55%] rounded-full bg-white/30 blur-3xl" />
        </div>

        {/* Readability washes, captions and counter appear once the window is open. */}
        <div ref={chromeRef} className="absolute inset-0 opacity-0">
          <div className="from-oxblood-deep/80 via-oxblood-deep/25 pointer-events-none absolute inset-x-0 bottom-0 h-3/4 bg-gradient-to-t to-transparent" />
          <div className="from-ink/45 pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b to-transparent" />

          <div className="container-luxe relative flex h-full flex-col justify-end pt-28 pb-8 sm:pb-12">
            <div className="flex items-end justify-between gap-6">
              <div ref={captionsRef} className="relative h-36 min-w-0 flex-1 sm:h-44" aria-live="polite">
                {buildStages.map((s, i) => (
                  <div
                    key={s.label}
                    aria-hidden={i !== stage}
                    className={cn(
                      "absolute inset-x-0 bottom-0 transition-[opacity,transform] duration-700 ease-[var(--ease-luxe)]",
                      i === stage ? "translate-y-0 opacity-100" : i < stage ? "-translate-y-3 opacity-0" : "translate-y-3 opacity-0",
                    )}
                  >
                    <p className="text-gold-light text-xs tracking-[0.2em] tabular-nums">
                      {String(i + 1).padStart(2, "0")} / {String(buildStages.length).padStart(2, "0")}
                    </p>
                    <p className="font-display mt-2 text-[clamp(2.5rem,7vw,6.5rem)] leading-[0.95] font-medium tracking-[-0.04em]">
                      {s.label}
                    </p>
                    <p className="text-muted-foreground mt-3 text-sm sm:text-base">{s.detail}</p>
                  </div>
                ))}
              </div>
              <div className="w-24 shrink-0 text-right sm:w-56">
                <p className="font-display text-[clamp(2.25rem,5vw,4.5rem)] leading-none font-medium tracking-[-0.04em] tabular-nums">
                  <span ref={counterRef}>0</span>
                  <span className="text-gold-light text-[0.5em] align-top">%</span>
                </p>
                <p className="text-muted-foreground mt-1 text-xs tracking-[0.18em] uppercase">complete</p>
                <span className="bg-cream/20 mt-3 hidden h-px w-full overflow-hidden sm:block">
                  <span ref={barRef} className="bg-gold block h-full w-full origin-left scale-x-0" />
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Finale over the finished home. */}
        <div
          ref={finaleRef}
          className="container-luxe pointer-events-none absolute inset-x-0 bottom-0 pb-10 opacity-0 sm:pb-16"
        >
          <p className="eyebrow">Welcome home</p>
          <h2 className="mt-4 max-w-4xl text-[clamp(2.6rem,7vw,6.5rem)] leading-[0.98] tracking-[-0.045em]">
            Your home, finished. <span className="accent-italic block">{heroCopy.headlineAccent}</span>
          </h2>
          <HeroCtas className="mt-8" />
        </div>

        {introVisible && (
          <div
            aria-hidden="true"
            className={cn(
              "bg-oxblood-deep absolute inset-0 z-10 flex items-center justify-center pt-[38vh] transition-opacity duration-700 sm:pt-[30vh]",
              introFading && "opacity-0",
            )}
          >
            <BlueprintDrawing className="text-cream w-[min(70vw,520px)]" />
          </div>
        )}
      </div>
    </section>
  );
}

/** Headline block shown on cream before the window opens. Shared with the static hero. */
function HeroIntro() {
  return (
    <div className="container-luxe pt-24 sm:pt-32">
      <div className="grid items-end gap-6 lg:grid-cols-[1.4fr_1fr] lg:gap-16">
        <div>
          <p className="eyebrow">{heroCopy.eyebrow}</p>
          <h1 className="mt-4 text-[clamp(2.6rem,7.6vw,7.25rem)] leading-[0.95] tracking-[-0.05em]">
            Homes built with <span className="accent-italic text-oxblood">excellence.</span>
          </h1>
        </div>
        <div className="hidden pb-2 sm:block">
          <p className="text-muted-foreground max-w-sm text-base leading-relaxed">
            Property development, construction and care in Lagos and Abuja, for families at home and buyers abroad.
          </p>
          <HeroCtas tone="light" className="mt-6" />
        </div>
      </div>
      <p className="text-muted-foreground mt-5 mb-5 flex items-center gap-3 text-xs tracking-[0.18em] uppercase sm:mt-8 sm:mb-6">
        <span aria-hidden="true" className="bg-gold inline-block h-px w-8" />
        Scroll to watch a home rise
      </p>
    </div>
  );
}

/** Reduced motion and no-manifest fallback: same layout, no pin, window already framed. */
export function StaticBuildHero({ children }: { children?: ReactNode }) {
  return (
    <section data-nav-tone="light" aria-label="Chapelhill" className="bg-cream relative flex min-h-svh flex-col">
      <HeroIntro />
      <div className="theme-oxblood relative mx-4 mb-4 min-h-[48svh] flex-1 overflow-hidden rounded-[22px] sm:mx-[4vw] sm:mb-[4vh] sm:rounded-[32px]">
        {children ?? (
          <div className="flex h-full items-center justify-center p-10">
            <BlueprintDrawing animate className="text-cream w-[min(80vw,620px)]" />
          </div>
        )}
        <div className="from-oxblood-deep/85 absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t to-transparent" />
        <div className="container-luxe absolute inset-x-0 bottom-0 pb-8">
          <ol className="text-muted-foreground flex flex-wrap gap-x-3 gap-y-1 text-sm">
            {buildStages.map((s, i) => (
              <li key={s.label} className="flex items-center gap-3">
                {i > 0 && <span aria-hidden="true" className="bg-gold inline-block h-px w-4" />}
                {s.label}
              </li>
            ))}
          </ol>
          <HeroCtas className="mt-6 sm:hidden" />
        </div>
      </div>
    </section>
  );
}
