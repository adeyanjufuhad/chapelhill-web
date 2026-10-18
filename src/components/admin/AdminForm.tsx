"use client";

import { useActionState, type ReactNode } from "react";
import { Loader2 } from "lucide-react";
import type { ActionState } from "@/app/admin/actions";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const idle: ActionState = { status: "idle", message: "" };

/** Form bound to a server action with pending and result states. */
export function AdminForm({
  action,
  children,
  submitLabel = "Save",
  className,
  resetOnSuccess = false,
}: {
  action: (prev: ActionState, formData: FormData) => Promise<ActionState>;
  children: ReactNode;
  submitLabel?: string;
  className?: string;
  resetOnSuccess?: boolean;
}) {
  const [state, formAction, pending] = useActionState(action, idle);

  return (
    <form
      action={formAction}
      key={resetOnSuccess && state.status === "success" ? state.message : undefined}
      className={cn("grid gap-5", className)}
    >
      {children}
      <div className="flex flex-wrap items-center gap-4">
        <Button type="submit" disabled={pending} className="h-11 rounded-full px-6">
          {pending && <Loader2 className="animate-spin" aria-hidden="true" />}
          {submitLabel}
        </Button>
        <p
          role="status"
          aria-live="polite"
          className={cn("text-sm", state.status === "error" ? "text-destructive" : "text-muted-foreground")}
        >
          {state.message}
        </p>
      </div>
    </form>
  );
}

export function Field({
  label,
  name,
  hint,
  className,
  children,
}: {
  label: string;
  name: string;
  hint?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={className}>
      <label htmlFor={name} className="text-sm font-medium">
        {label}
      </label>
      <div className="mt-1.5">{children}</div>
      {hint && <p className="text-muted-foreground mt-1 text-xs">{hint}</p>}
    </div>
  );
}

export const inputClass =
  "border-input focus-visible:border-ring focus-visible:ring-ring/40 h-10 w-full rounded-md border bg-white px-3 text-sm outline-none focus-visible:ring-3";
export const textareaClass =
  "border-input focus-visible:border-ring focus-visible:ring-ring/40 min-h-24 w-full rounded-md border bg-white px-3 py-2 text-sm outline-none focus-visible:ring-3";
