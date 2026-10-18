"use client";

import dynamic from "next/dynamic";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo, useTransition } from "react";
import { LayoutGrid, Map as MapIcon, RotateCcw } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { DevelopmentCard } from "@/components/site/DevelopmentCard";
import { selectClass } from "@/components/site/InquiryForm";
import { developments, statusLabel, type DevelopmentStatus } from "@/content/developments";
import { formatNgnShort } from "@/lib/format";
import { cn } from "@/lib/utils";

const DevelopmentsMap = dynamic(() => import("@/components/site/DevelopmentsMap").then((m) => m.DevelopmentsMap), {
  ssr: false,
  loading: () => <div className="bg-stone h-[560px] w-full animate-pulse rounded-[24px]" />,
});

const PRICE_STEP = 10_000_000;
const PRICE_MAX = Math.ceil(Math.max(...developments.map((d) => d.priceFromNgn)) / 100_000_000) * 100_000_000;
const cities = ["all", ...new Set(developments.map((d) => d.city))];
const types = ["all", ...new Set(developments.map((d) => d.propertyType))];
const statuses: ("all" | DevelopmentStatus)[] = ["all", "for_sale", "coming_soon", "sold_out"];

export function DevelopmentsExplorer() {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [, startTransition] = useTransition();

  const city = params.get("city") ?? "all";
  const type = params.get("type") ?? "all";
  const status = (params.get("status") ?? "all") as "all" | DevelopmentStatus;
  const view = params.get("view") === "map" ? "map" : "grid";
  const minPrice = Number(params.get("min") ?? 0);
  const maxPrice = Number(params.get("max") ?? PRICE_MAX);

  const setParams = (patch: Record<string, string | number | null>) => {
    const next = new URLSearchParams(params);
    for (const [k, v] of Object.entries(patch)) {
      if (v === null || v === "all" || v === "") next.delete(k);
      else next.set(k, String(v));
    }
    if (Number(next.get("min")) === 0) next.delete("min");
    if (Number(next.get("max")) === PRICE_MAX) next.delete("max");
    const qs = next.toString();
    startTransition(() => router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false }));
  };

  const results = useMemo(
    () =>
      developments.filter(
        (d) =>
          (city === "all" || d.city === city) &&
          (type === "all" || d.propertyType === type) &&
          (status === "all" || d.status === status) &&
          d.priceFromNgn >= minPrice &&
          d.priceFromNgn <= maxPrice,
      ),
    [city, type, status, minPrice, maxPrice],
  );

  const filtered = city !== "all" || type !== "all" || status !== "all" || minPrice > 0 || maxPrice < PRICE_MAX;

  return (
    <div>
      <div
        role="search"
        aria-label="Filter developments"
        className="bg-ivory border-border sticky top-16 z-30 -mx-4 grid gap-5 rounded-none border-y px-4 py-5 sm:mx-0 sm:rounded-[22px] sm:border sm:px-6 md:top-[84px] lg:grid-cols-[auto_auto_1fr_1.2fr_auto] lg:items-end lg:gap-8"
      >
        <fieldset>
          <legend className="text-muted-foreground mb-2 text-xs">Location</legend>
          <div className="flex flex-wrap gap-1.5">
            {cities.map((c) => (
              <Pill key={c} active={city === c} onClick={() => setParams({ city: c })}>
                {c === "all" ? "All" : c}
              </Pill>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className="text-muted-foreground mb-2 text-xs">Status</legend>
          <div className="flex flex-wrap gap-1.5">
            {statuses.map((s) => (
              <Pill key={s} active={status === s} onClick={() => setParams({ status: s })}>
                {s === "all" ? "All" : statusLabel[s]}
              </Pill>
            ))}
          </div>
        </fieldset>

        <div>
          <label htmlFor="dev-type" className="text-muted-foreground mb-2 block text-xs">
            Type
          </label>
          <select id="dev-type" value={type} onChange={(e) => setParams({ type: e.target.value })} className={cn(selectClass, "rounded-full bg-transparent")}>
            {types.map((t) => (
              <option key={t} value={t}>
                {t === "all" ? "All types" : t}
              </option>
            ))}
          </select>
        </div>

        <div>
          <div className="mb-3 flex items-center justify-between text-xs">
            <span id="price-label" className="text-muted-foreground">
              Starting price
            </span>
            <span className="tabular-nums">
              {formatNgnShort(minPrice || 0)} – {maxPrice >= PRICE_MAX ? `${formatNgnShort(PRICE_MAX)}+` : formatNgnShort(maxPrice)}
            </span>
          </div>
          <Slider
            aria-labelledby="price-label"
            min={0}
            max={PRICE_MAX}
            step={PRICE_STEP}
            value={[minPrice, maxPrice]}
            onValueChange={([min, max]) => setParams({ min, max })}
            className="[&_[data-slot=slider-range]]:bg-oxblood [&_[data-slot=slider-thumb]]:border-oxblood py-2"
          />
        </div>

        <div className="flex items-center gap-2">
          <div role="group" aria-label="View" className="border-ink/15 flex rounded-full border p-1">
            {(
              [
                { v: "grid", label: "Grid", Icon: LayoutGrid },
                { v: "map", label: "Map", Icon: MapIcon },
              ] as const
            ).map(({ v, label, Icon }) => (
              <button
                key={v}
                type="button"
                aria-pressed={view === v}
                onClick={() => setParams({ view: v === "grid" ? null : v })}
                className={cn(
                  "inline-flex h-9 items-center gap-1.5 rounded-full px-3.5 text-sm transition-colors",
                  view === v ? "bg-ink text-cream" : "hover:bg-ink/5",
                )}
              >
                <Icon className="size-4" aria-hidden="true" />
                {label}
              </button>
            ))}
          </div>
          {filtered && (
            <button
              type="button"
              onClick={() => setParams({ city: null, type: null, status: null, min: null, max: null })}
              className="text-muted-foreground hover:text-oxblood inline-flex size-9 items-center justify-center rounded-full"
              aria-label="Clear filters"
              title="Clear filters"
            >
              <RotateCcw className="size-4" aria-hidden="true" />
            </button>
          )}
        </div>
      </div>

      <p aria-live="polite" className="text-muted-foreground mt-8 text-sm">
        {results.length} {results.length === 1 ? "development" : "developments"}
        {filtered ? " match your filters" : ""}
      </p>

      {results.length === 0 ? (
        <div className="border-ink/15 mt-6 rounded-[22px] border border-dashed p-12 text-center">
          <p className="text-2xl font-medium tracking-[-0.03em]">No developments match.</p>
          <p className="text-muted-foreground mt-2">Try widening the price range or clearing a filter.</p>
        </div>
      ) : view === "map" ? (
        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_380px]">
          <DevelopmentsMap
            className="h-[560px] rounded-[24px]"
            zoom={11}
            points={results.map((d) => ({
              slug: d.slug,
              name: d.name,
              area: `${d.area}, ${d.city}`,
              href: `/developments/${d.slug}`,
              lat: d.location.lat,
              lng: d.location.lng,
              approximate: d.location.approximate,
            }))}
          />
          <ul className="grid content-start gap-8" data-lenis-prevent>
            {results.map((d) => (
              <li key={d.slug}>
                <DevelopmentCard development={d} sizes="380px" />
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <ul className="mt-6 grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((d) => (
            <li key={d.slug}>
              <DevelopmentCard development={d} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function Pill({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "h-9 rounded-full border px-4 text-sm transition-colors",
        active ? "bg-oxblood border-oxblood text-cream" : "border-ink/15 hover:border-ink/40",
      )}
    >
      {children}
    </button>
  );
}

/** Static fallback rendered into the prerendered shell before search params are read. */
export function DevelopmentsGridFallback() {
  return (
    <ul className="mt-6 grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
      {developments.map((d) => (
        <li key={d.slug}>
          <DevelopmentCard development={d} />
        </li>
      ))}
    </ul>
  );
}
