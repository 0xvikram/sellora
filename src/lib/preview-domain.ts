"use client";

import { useSyncExternalStore } from "react";

// What the visitor has typed into the hero audit form, shared with the
// crawl preview so its header reads "Reading <their store>". Local only:
// nothing is fetched or sent.

let typed = "";
const listeners = new Set<() => void>();

export function setPreviewDomain(value: string) {
  if (value === typed) return;
  typed = value;
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** Reduce whatever was typed to a bare hostname, or "" if nothing usable. */
export function toHostname(raw: string): string {
  const host = raw
    .trim()
    .toLowerCase()
    .replace(/^[a-z][a-z0-9+.-]*:\/\//, "")
    .replace(/^[^@/]*@/, "")
    .split(/[/?#:\s]/)[0]
    .replace(/[^a-z0-9.-]/g, "")
    .replace(/^[.-]+|[.-]+$/g, "")
    .replace(/^www\./, "");
  return host.slice(0, 63);
}

export function usePreviewDomain(fallback: string): string {
  const raw = useSyncExternalStore(subscribe, () => typed, () => "");
  return toHostname(raw) || fallback;
}
