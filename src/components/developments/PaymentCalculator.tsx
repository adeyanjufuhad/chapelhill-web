"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useId, useMemo, useState } from "react";
import { Slider } from "@/components/ui/slider";
import { PlaceholderTag } from "@/components/site/Placeholder";
import { developments } from "@/content/developments";
import { currencies, formatMoney, fxRates, fxUpdatedAt, type Currency } from "@/lib/fx";
import { formatNgnShort } from "@/lib/format";
import { cn } from "@/lib/utils";

const sliderClass = "[&_[data-slot=slider-range]]:bg-oxblood [&_[data-slot=slider-thumb]]:border-oxblood py-2";

/** Standard amortised monthly repayment; interest-free plans divide evenly. */
function monthlyRepayment(principal: number, annualRatePct: number, months: number) {
  if (months <= 0) return 0;
  const r = annualRatePct / 100 / 12;
  if (r === 0) return principal / months;
  return (principal * r) / (1 - Math.pow(1 + r, -months));
}

const tenureLabel = (m: number) => (m % 12 === 0 ? `${m / 12} ${m === 12 ? "year" : "years"}` : `${m} months`);

export function PaymentCalculator() {
  const params = useSearchParams();
  const id = useId();
  const initialPrice = Number(params.get("price")) || developments[0].priceFromNgn;

  const [price, setPrice] = useState(initialPrice);
  const [depositPct, setDepositPct] = useState(30);
  const [months, setMonths] = useState(24);
  const [rate, setRate] = useState(0);
  const [currency, setCurrency] = useState<Currency>("NGN");

  const result = useMemo(() => {
    const deposit = (price * depositPct) / 100;
    const principal = price - deposit;
    const monthly = monthlyRepayment(principal, rate, months);
    const total = deposit + monthly * months;
    return { deposit, principal, monthly, total, interest: total - price };
  }, [price, depositPct, months, rate]);

  const money = (n: number) => formatMoney(n, currency);

  return (
    <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
      <div className="space-y-10">
        <div>
          <p className="text-muted-foreground text-xs">Start from a development</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {developments.map((d) => (
              <button
                key={d.slug}
                type="button"
                aria-pressed={price === d.priceFromNgn}
                onClick={() => setPrice(d.priceFromNgn)}
                className={cn(
                  "h-9 rounded-full border px-4 text-sm transition-colors",
                  price === d.priceFromNgn ? "bg-oxblood border-oxblood text-cream" : "border-ink/15 hover:border-ink/40",
                )}
              >
                {d.name} · {formatNgnShort(d.priceFromNgn)}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor={`${id}-price`} className="text-sm font-medium">
            Property price (₦)
          </label>
          <input
            id={`${id}-price`}
            inputMode="numeric"
            value={price.toLocaleString("en-NG")}
            onChange={(e) => setPrice(Number(e.target.value.replace(/\D/g, "")) || 0)}
            className="border-ink/20 focus:border-oxblood mt-2 w-full border-b bg-transparent py-3 text-3xl font-medium tracking-[-0.03em] tabular-nums outline-none"
          />
        </div>

        <Field label="Deposit" value={`${depositPct}% · ${money(result.deposit)}`} id={`${id}-deposit`}>
          <Slider id={`${id}-deposit`} aria-label="Deposit percentage" min={0} max={100} step={5} value={[depositPct]} onValueChange={([v]) => setDepositPct(v)} className={sliderClass} />
        </Field>

        <Field label="Tenure" value={tenureLabel(months)} id={`${id}-tenure`}>
          <Slider id={`${id}-tenure`} aria-label="Tenure in months" min={3} max={300} step={3} value={[months]} onValueChange={([v]) => setMonths(v)} className={sliderClass} />
        </Field>

        <Field label="Interest rate (per year)" value={rate === 0 ? "0% · interest-free plan" : `${rate.toFixed(1)}%`} id={`${id}-rate`}>
          <Slider id={`${id}-rate`} aria-label="Annual interest rate" min={0} max={30} step={0.5} value={[rate]} onValueChange={([v]) => setRate(v)} className={sliderClass} />
        </Field>
      </div>

      <div className="lg:sticky lg:top-28 lg:self-start">
        <div className="theme-oxblood rounded-[24px] p-6 sm:p-10">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="eyebrow">Your estimate</p>
            <div role="group" aria-label="Display currency" className="bg-oxblood-deep/60 flex rounded-full p-1">
              {currencies.map((c) => (
                <button
                  key={c.code}
                  type="button"
                  aria-pressed={currency === c.code}
                  aria-label={c.label}
                  onClick={() => setCurrency(c.code)}
                  className={cn(
                    "h-8 min-w-10 rounded-full px-3 text-sm transition-colors",
                    currency === c.code ? "bg-cream text-ink" : "text-cream/80 hover:text-cream",
                  )}
                >
                  {c.symbol}
                </button>
              ))}
            </div>
          </div>

          <p className="text-muted-foreground mt-8 text-sm">Monthly repayment</p>
          <p aria-live="polite" className="mt-1 text-[clamp(2.6rem,5vw,4.2rem)] leading-none font-medium tracking-[-0.045em] tabular-nums">
            {money(result.monthly)}
          </p>
          <p className="text-muted-foreground mt-2 text-sm">for {tenureLabel(months)}</p>

          <dl className="border-border mt-8 grid gap-0 border-t text-sm">
            {[
              ["Deposit", money(result.deposit)],
              ["Amount financed", money(result.principal)],
              ["Total interest", money(result.interest)],
              ["Total cost", money(result.total)],
            ].map(([k, v]) => (
              <div key={k} className="border-border flex justify-between gap-4 border-b py-3">
                <dt className="text-muted-foreground">{k}</dt>
                <dd className="font-medium tabular-nums">{v}</dd>
              </div>
            ))}
          </dl>

          {currency !== "NGN" && (
            <p className="text-muted-foreground mt-4 text-xs">
              Converted at ₦{fxRates[currency].toLocaleString("en-NG")} per {currencies.find((c) => c.code === currency)?.symbol}1, set{" "}
              {new Date(fxUpdatedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}.{" "}
              <PlaceholderTag label="Rates TBC" />
            </p>
          )}

          <Link
            href="/contact?topic=calculator"
            className="bg-gold text-ink hover:bg-gold-light mt-8 inline-flex h-12 w-full items-center justify-center rounded-full text-sm font-medium transition-colors"
          >
            Discuss a payment plan
          </Link>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, id, children }: { label: string; value: string; id: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-3 flex items-baseline justify-between gap-4">
        <label htmlFor={id} className="text-sm font-medium">
          {label}
        </label>
        <span className="text-muted-foreground text-sm tabular-nums">{value}</span>
      </div>
      {children}
    </div>
  );
}
