"use client";

import { useId, type FormEvent } from "react";
import { DEMO_START_URL } from "@/lib/site";
import { cn } from "@/lib/utils";

/**
 * The single-field audit form. It is a plain GET form to the demo workspace
 * (DEMO_START_URL?url=<value>, new tab), so it works without JavaScript.
 * With JavaScript it only trims stray whitespace before the browser submits.
 */
export function AuditForm({ id, className }: { id?: string; className?: string }) {
  const inputId = useId();
  const hintId = useId();

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    const input = event.currentTarget.elements.namedItem("url");
    if (input instanceof HTMLInputElement) input.value = input.value.trim();
  }

  return (
    <form
      id={id}
      action={DEMO_START_URL}
      method="get"
      target="_blank"
      rel="noopener"
      onSubmit={onSubmit}
      className={cn("max-w-xl", className)}
    >
      <label htmlFor={inputId} className="block text-sm font-medium text-ink">
        Your store address
      </label>
      <div className="mt-2 flex flex-col gap-3 sm:flex-row">
        <input
          id={inputId}
          name="url"
          type="text"
          inputMode="url"
          autoComplete="url"
          autoCapitalize="none"
          spellCheck={false}
          required
          placeholder="yourstore.com"
          aria-describedby={hintId}
          className="min-h-12 w-full min-w-0 flex-1 rounded-full border border-line-2 bg-card px-5 text-base text-ink placeholder:text-ink-2"
        />
        <button
          type="submit"
          className="min-h-12 shrink-0 rounded-full bg-ink px-6 text-base font-medium text-ground transition-colors hover:bg-accent"
        >
          Start the audit
        </button>
      </div>
      <p id={hintId} className="mt-2 text-sm text-ink-2">
        Opens the audit workspace in a new tab.
      </p>
    </form>
  );
}
