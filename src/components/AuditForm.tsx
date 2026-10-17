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
  size = "md",
}: {
  id?: string;
  className?: string;
  /** Mirror what is typed into the hero crawl preview's header. */
  linkPreview?: boolean;
  /** "lg" makes the field and button taller, for the contact page. */
  size?: "md" | "lg";
}) {
  const lg = size === "lg";
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
      <label htmlFor={inputId} className={cn("block font-medium text-ink", lg ? "text-base" : "text-sm")}>
        Your store address
      </label>
      <div className={cn("mt-2 flex flex-col gap-3", lg ? "lg:flex-row" : "sm:flex-row")}>
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
          className={cn("field min-w-0 flex-1", lg && "min-h-14 text-lg")}
        />
        <button
          type="submit"
          className={cn("btn btn-primary shrink-0", lg && "min-h-14 px-7 text-lg")}
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
