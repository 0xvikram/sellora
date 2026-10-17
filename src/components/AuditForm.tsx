"use client";

import { useId, type FormEvent } from "react";
import { setPreviewDomain } from "@/lib/preview-domain";
import { DEMO_START_URL } from "@/lib/site";
import { cn } from "@/lib/utils";

/**
 * The single-field audit form. It is a plain GET form to the demo workspace
 * (DEMO_START_URL?url=<value>, new tab), so it works without JavaScript.
 * With JavaScript it trims stray whitespace before the browser submits and,
 * in the hero, mirrors the typed address into the crawl preview header.
 */
export function AuditForm({
  id,
  className,
  linkPreview = false,
}: {
  id?: string;
  className?: string;
  /** Mirror what is typed into the hero crawl preview's header. */
  linkPreview?: boolean;
}) {
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
          onChange={linkPreview ? (e) => setPreviewDomain(e.currentTarget.value) : undefined}
          className="field min-w-0 flex-1"
        />
        <button
          type="submit"
          className="btn btn-primary shrink-0"
        >
          Start the audit
        </button>
      </div>
      <p id={hintId} className="mt-2.5 text-sm text-ink-3">
        Opens the audit workspace in a new tab.
      </p>
    </form>
  );
}
