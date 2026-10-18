"use client";

import Link from "next/link";
import { useActionState } from "react";
import { useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import type { ActionState } from "@/app/admin/actions";
import { requestPasswordEmail, setNewPassword, signInClient } from "@/app/portal/actions";
import { inputClass } from "@/components/admin/AdminForm";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const idle: ActionState = { status: "idle", message: "" };

function Message({ state }: { state: ActionState }) {
  if (!state.message) return null;
  return (
    <p role={state.status === "error" ? "alert" : "status"} className={cn("text-sm", state.status === "error" ? "text-destructive" : "text-forest")}>
      {state.message}
    </p>
  );
}

function Submit({ pending, children }: { pending: boolean; children: React.ReactNode }) {
  return (
    <Button type="submit" disabled={pending} className="h-11 rounded-full">
      {pending && <Loader2 className="animate-spin" aria-hidden="true" />}
      {children}
    </Button>
  );
}

export function ClientLoginForm() {
  const [state, action, pending] = useActionState(signInClient, idle);
  const passwordSet = useSearchParams().get("password") === "set";
  return (
    <form action={action} className="mt-8 grid gap-4">
      {passwordSet && !state.message && (
        <p role="status" className="text-forest text-sm">
          Password saved. Sign in to continue.
        </p>
      )}
      <div>
        <label htmlFor="email" className="text-sm font-medium">
          Email
        </label>
        <input id="email" name="email" type="email" autoComplete="username" required className={`${inputClass} mt-1.5 h-11`} />
      </div>
      <div>
        <label htmlFor="password" className="text-sm font-medium">
          Password
        </label>
        <input id="password" name="password" type="password" autoComplete="current-password" required className={`${inputClass} mt-1.5 h-11`} />
      </div>
      <Message state={state} />
      <Submit pending={pending}>Sign in</Submit>
      <Link href="/portal/reset" className="text-oxblood text-center text-sm underline-offset-4 hover:underline">
        First time here, or forgot your password?
      </Link>
    </form>
  );
}

export function RequestPasswordForm() {
  const [state, action, pending] = useActionState(requestPasswordEmail, idle);
  return (
    <form action={action} className="mt-8 grid gap-4">
      <div>
        <label htmlFor="email" className="text-sm font-medium">
          Email used with Chapelhill
        </label>
        <input id="email" name="email" type="email" autoComplete="email" required className={`${inputClass} mt-1.5 h-11`} />
      </div>
      <Message state={state} />
      <Submit pending={pending}>Email me a link</Submit>
      <Link href="/portal/login" className="text-muted-foreground text-center text-sm hover:underline">
        Back to sign in
      </Link>
    </form>
  );
}

export function NewPasswordForm({ token }: { token: string }) {
  const [state, action, pending] = useActionState(setNewPassword, idle);
  return (
    <form action={action} className="mt-8 grid gap-4">
      <input type="hidden" name="token" value={token} />
      <div>
        <label htmlFor="password" className="text-sm font-medium">
          New password
        </label>
        <input id="password" name="password" type="password" autoComplete="new-password" minLength={10} required className={`${inputClass} mt-1.5 h-11`} />
        <p className="text-muted-foreground mt-1 text-xs">At least 10 characters.</p>
      </div>
      <div>
        <label htmlFor="confirm" className="text-sm font-medium">
          Confirm password
        </label>
        <input id="confirm" name="confirm" type="password" autoComplete="new-password" minLength={10} required className={`${inputClass} mt-1.5 h-11`} />
      </div>
      <Message state={state} />
      <Submit pending={pending}>Save password</Submit>
      <Link href="/portal/reset" className="text-muted-foreground text-center text-sm hover:underline">
        Need a new link?
      </Link>
    </form>
  );
}
