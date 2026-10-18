"use client";

import { useActionState, useId } from "react";
import { ArrowRight, Check } from "lucide-react";
import { subscribeToNewsletter, type NewsletterState } from "@/app/actions/newsletter";
import { cn } from "@/lib/utils";

const initialState: NewsletterState = { status: "idle", message: "" };

export function NewsletterForm({ source, className }: { source: string; className?: string }) {
  const [state, formAction, pending] = useActionState(subscribeToNewsletter, initialState);
  const id = useId();
  const done = state.status === "success";

  return (
    <form action={formAction} className={cn("w-full max-w-md", className)} noValidate>
      <input type="hidden" name="source" value={source} />
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor={`${id}-company`}>Company</label>
        <input id={`${id}-company`} name="company" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <label htmlFor={`${id}-email`} className="sr-only">
        Email address
      </label>
      <div className="border-foreground/30 focus-within:border-gold flex items-center border-b transition-colors">
        <input
          id={`${id}-email`}
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          required
          disabled={done}
          placeholder="Your email address"
          aria-invalid={state.status === "error" || undefined}
          aria-describedby={`${id}-status`}
          className="placeholder:text-muted-foreground min-w-0 flex-1 bg-transparent py-3 text-base outline-none disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={pending || done}
          aria-label={done ? "Subscribed" : "Subscribe"}
          className="hover:text-gold inline-flex size-11 shrink-0 items-center justify-center transition-colors disabled:opacity-60"
        >
          {done ? <Check className="size-5" aria-hidden="true" /> : <ArrowRight className="size-5" aria-hidden="true" />}
        </button>
      </div>
      <p
        id={`${id}-status`}
        aria-live="polite"
        className={cn("mt-3 min-h-5 text-sm", state.status === "error" ? "text-destructive" : "text-muted-foreground")}
      >
        {state.message || "Quarterly updates on new developments and construction progress. No spam."}
      </p>
    </form>
  );
}
