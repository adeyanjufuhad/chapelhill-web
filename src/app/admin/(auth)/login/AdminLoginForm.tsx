"use client";

import { useActionState } from "react";
import { useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { signInAdmin, type ActionState } from "@/app/admin/actions";
import { inputClass } from "@/components/admin/AdminForm";
import { Button } from "@/components/ui/button";

const idle: ActionState = { status: "idle", message: "" };

export function AdminLoginForm() {
  const [state, action, pending] = useActionState(signInAdmin, idle);
  const forbidden = useSearchParams().get("error") === "forbidden";
  const message = state.message || (forbidden ? "That account does not have admin access." : "");

  return (
    <form action={action} className="mt-8 grid gap-4">
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
      {message && (
        <p role="alert" className="text-destructive text-sm">
          {message}
        </p>
      )}
      <Button type="submit" disabled={pending} className="h-11 rounded-full">
        {pending && <Loader2 className="animate-spin" aria-hidden="true" />}
        Sign in
      </Button>
    </form>
  );
}
