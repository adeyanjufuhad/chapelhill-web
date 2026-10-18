"use client";

import { useActionState, useId, useSyncExternalStore, type ReactNode } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { submitInquiry, type InquiryState, type InquiryTopic } from "@/app/actions/inquiry";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

const initialState: InquiryState = { status: "idle", message: "" };

const subscribeNoop = () => () => {};
const browserTimezone = () => Intl.DateTimeFormat().resolvedOptions().timeZone;

export const selectClass =
  "border-input bg-transparent focus-visible:border-ring focus-visible:ring-ring/40 h-11 w-full rounded-md border px-3 text-base outline-none focus-visible:ring-3 sm:text-sm";

export function InquiryForm({
  topic,
  development,
  service,
  submitLabel = "Send enquiry",
  messagePlaceholder = "Tell us what you’re looking for",
  defaultMessage,
  extraFields,
  className,
}: {
  topic: InquiryTopic;
  development?: string;
  service?: string;
  submitLabel?: string;
  messagePlaceholder?: string;
  defaultMessage?: string;
  extraFields?: ReactNode;
  className?: string;
}) {
  const [state, formAction, pending] = useActionState(submitInquiry, initialState);
  const id = useId();
  const timezone = useSyncExternalStore(subscribeNoop, browserTimezone, () => "");
  const err = (field: string) => state.fieldErrors?.[field];
  const inspection = topic === "inspection";

  if (state.status === "success") {
    return (
      <div role="status" className={cn("border-border bg-card flex gap-4 rounded-sm border p-6", className)}>
        <CheckCircle2 className="text-gold size-6 shrink-0" aria-hidden="true" />
        <div>
          <p className="font-display text-2xl">Received.</p>
          <p className="text-muted-foreground mt-1">{state.message}</p>
        </div>
      </div>
    );
  }

  const field = (name: string) => ({
    id: `${id}-${name}`,
    name,
    "aria-invalid": err(name) ? true : undefined,
    "aria-describedby": err(name) ? `${id}-${name}-error` : undefined,
  });
  const errorText = (name: string) =>
    err(name) ? (
      <p id={`${id}-${name}-error`} className="text-destructive mt-1.5 text-sm">
        {err(name)}
      </p>
    ) : null;

  return (
    <form action={formAction} noValidate className={cn("grid gap-5", className)}>
      <input type="hidden" name="topic" value={topic} />
      {development && <input type="hidden" name="development" value={development} />}
      {service && <input type="hidden" name="service" value={service} />}
      <input type="hidden" name="timezone" value={timezone} />
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor={`${id}-company`}>Company</label>
        <input id={`${id}-company`} name="company" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor={`${id}-name`}>Full name</Label>
          <Input {...field("name")} autoComplete="name" required className="mt-2 h-11" />
          {errorText("name")}
        </div>
        <div>
          <Label htmlFor={`${id}-email`}>Email</Label>
          <Input {...field("email")} type="email" inputMode="email" autoComplete="email" required className="mt-2 h-11" />
          {errorText("email")}
        </div>
        <div>
          <Label htmlFor={`${id}-phone`}>Phone or WhatsApp</Label>
          <Input
            {...field("phone")}
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="+44 7700 900000"
            className="mt-2 h-11"
          />
          {errorText("phone")}
        </div>
        <div>
          <Label htmlFor={`${id}-country`}>Country of residence</Label>
          <Input {...field("country")} autoComplete="country-name" placeholder="e.g. United Kingdom" className="mt-2 h-11" />
        </div>
      </div>

      {inspection && (
        <fieldset className="grid gap-5 sm:grid-cols-3">
          <legend className="sr-only">Inspection details</legend>
          <div>
            <Label htmlFor={`${id}-inspectionKind`}>Inspection type</Label>
            <select {...field("inspectionKind")} defaultValue="virtual" className={cn(selectClass, "mt-2")}>
              <option value="virtual">Live video call</option>
              <option value="video">Recorded video walkthrough</option>
            </select>
          </div>
          <div>
            <Label htmlFor={`${id}-preferredDate`}>Preferred date</Label>
            <Input {...field("preferredDate")} type="date" className="mt-2 h-11" />
            {errorText("preferredDate")}
          </div>
          <div>
            <Label htmlFor={`${id}-preferredTime`}>Preferred time</Label>
            <select {...field("preferredTime")} defaultValue="morning" className={cn(selectClass, "mt-2")}>
              <option value="morning">Morning</option>
              <option value="afternoon">Afternoon</option>
              <option value="evening">Evening</option>
            </select>
          </div>
          {timezone && (
            <p className="text-muted-foreground -mt-2 text-xs sm:col-span-3">Times are in your timezone ({timezone}).</p>
          )}
        </fieldset>
      )}

      {extraFields}

      <div>
        <Label htmlFor={`${id}-message`}>Message {inspection && <span className="text-muted-foreground">(optional)</span>}</Label>
        <Textarea
          {...field("message")}
          rows={4}
          defaultValue={defaultMessage}
          placeholder={messagePlaceholder}
          className="mt-2 min-h-28"
        />
      </div>

      <fieldset>
        <legend className="text-sm font-medium">Preferred contact</legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {(["whatsapp", "phone", "email"] as const).map((v) => (
            <label
              key={v}
              className="border-input has-[:checked]:border-oxblood has-[:checked]:bg-oxblood/5 has-[:focus-visible]:ring-ring/40 cursor-pointer rounded-full border px-4 py-2 text-sm capitalize transition-colors has-[:focus-visible]:ring-3"
            >
              <input type="radio" name="preferredContact" value={v} defaultChecked={v === "whatsapp"} className="sr-only" />
              {v === "whatsapp" ? "WhatsApp" : v}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p aria-live="polite" className={cn("text-sm", state.status === "error" ? "text-destructive" : "text-muted-foreground")}>
          {state.status === "error" ? state.message : "We respond within 24 hours, 7 days a week."}
        </p>
        <Button type="submit" size="lg" disabled={pending} className="h-12 px-7">
          {pending && <Loader2 className="animate-spin" aria-hidden="true" />}
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
