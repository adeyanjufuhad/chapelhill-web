"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Check, Minus, Plus, X } from "lucide-react";
import { selectClass } from "@/components/site/InquiryForm";
import { statusLabel, type Development } from "@/content/developments";
import { formatBeds, formatNgnShort } from "@/lib/format";
import { cn } from "@/lib/utils";

const MAX = 3;

const rows: { label: string; value: (d: Development) => React.ReactNode }[] = [
  { label: "Location", value: (d) => `${d.area}, ${d.city}` },
  { label: "Status", value: (d) => statusLabel[d.status] },
  { label: "Starting price", value: (d) => <span className="text-oxblood font-medium">{formatNgnShort(d.priceFromNgn)}</span> },
  { label: "Homes", value: (d) => formatBeds(d.bedrooms) },
  { label: "Property type", value: (d) => d.propertyType },
  { label: "Bathrooms", value: (d) => d.baths ?? <OnRequest /> },
  { label: "Floor area", value: (d) => d.sqm ?? <OnRequest /> },
  { label: "Title", value: (d) => d.titleType ?? <OnRequest /> },
];

function OnRequest() {
  return <span className="text-muted-foreground">On request</span>;
}

export function CompareTable({ developments }: { developments: Development[] }) {
  const allAmenities = [...new Set(developments.flatMap((d) => d.amenities))];
  const getDevelopment = (slug: string) => developments.find((d) => d.slug === slug);
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const picked = (params.get("d") ?? "")
    .split(",")
    .map((s) => getDevelopment(s))
    .filter((d): d is Development => Boolean(d))
    .slice(0, MAX);
  const selected = picked.length ? picked : developments.slice(0, 2);
  const available = developments.filter((d) => !selected.some((s) => s.slug === d.slug));

  const setSelected = (slugs: string[]) =>
    router.replace(`${pathname}?d=${slugs.join(",")}`, { scroll: false });

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3">
        <p className="text-muted-foreground text-sm">
          Comparing {selected.length} of {MAX}
        </p>
        {selected.length < MAX && available.length > 0 && (
          <label className="flex items-center gap-2">
            <Plus className="text-oxblood size-4" aria-hidden="true" />
            <span className="sr-only">Add a development to compare</span>
            <select
              value=""
              onChange={(e) => e.target.value && setSelected([...selected.map((s) => s.slug), e.target.value])}
              className={cn(selectClass, "h-10 w-auto rounded-full")}
            >
              <option value="">Add a development</option>
              {available.map((d) => (
                <option key={d.slug} value={d.slug}>
                  {d.name}, {d.city}
                </option>
              ))}
            </select>
          </label>
        )}
      </div>

      <div className="mt-8 overflow-x-auto pb-4" data-lenis-prevent>
        <table className="w-full min-w-[720px] border-collapse text-left">
          <caption className="sr-only">Side-by-side comparison of selected developments</caption>
          <thead>
            <tr>
              <th scope="col" className="w-44 align-bottom">
                <span className="sr-only">Feature</span>
              </th>
              {selected.map((d) => (
                <th key={d.slug} scope="col" className="px-3 pb-6 align-top font-normal">
                  <div className="bg-stone relative aspect-[4/3] overflow-hidden rounded-[18px]">
                    <Image src={d.images[0].src} alt={d.images[0].alt} fill sizes="320px" className="object-cover" />
                    {selected.length > 1 && (
                      <button
                        type="button"
                        onClick={() => setSelected(selected.filter((s) => s.slug !== d.slug).map((s) => s.slug))}
                        aria-label={`Remove ${d.name} from comparison`}
                        className="bg-cream/90 text-ink absolute top-3 right-3 inline-flex size-9 items-center justify-center rounded-full"
                      >
                        <X className="size-4" aria-hidden="true" />
                      </button>
                    )}
                  </div>
                  <p className="mt-4 text-2xl font-medium tracking-[-0.03em]">{d.name}</p>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.label} className="border-ink/10 border-t">
                <th scope="row" className="text-muted-foreground py-4 pr-4 text-sm font-normal">
                  {r.label}
                </th>
                {selected.map((d) => (
                  <td key={d.slug} className="px-3 py-4">
                    {r.value(d)}
                  </td>
                ))}
              </tr>
            ))}
            {allAmenities.map((a) => (
              <tr key={a} className="border-ink/10 border-t">
                <th scope="row" className="text-muted-foreground py-3 pr-4 text-sm font-normal">
                  {a}
                </th>
                {selected.map((d) => (
                  <td key={d.slug} className="px-3 py-3">
                    {d.amenities.includes(a) ? (
                      <Check className="text-oxblood size-4" aria-label="Included" />
                    ) : (
                      <Minus className="text-muted-foreground/50 size-4" aria-label="Not listed" />
                    )}
                  </td>
                ))}
              </tr>
            ))}
            <tr className="border-ink/10 border-t">
              <td />
              {selected.map((d) => (
                <td key={d.slug} className="px-3 pt-6">
                  <Link
                    href={`/developments/${d.slug}`}
                    className="bg-oxblood text-cream hover:bg-oxblood-soft inline-flex h-11 items-center rounded-full px-5 text-sm font-medium transition-colors"
                  >
                    View {d.name}
                  </Link>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
