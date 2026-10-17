"use client";

import { useEffect, useRef, useState } from "react";

/**
 * The email as a large mono mailto link with a Copy button. Copy uses the
 * Clipboard API; where that is missing or refused, it selects the address
 * so the visitor can copy it by hand. The label changes to "Copied" (or
 * "Selected") for two seconds and is announced politely.
 */
export function CopyEmail({ email }: { email: string }) {
  const textRef = useRef<HTMLSpanElement>(null);
  const [state, setState] = useState<"idle" | "copied" | "selected">("idle");

  useEffect(() => {
    if (state === "idle") return;
    const t = window.setTimeout(() => setState("idle"), 2000);
    return () => window.clearTimeout(t);
  }, [state]);

  function selectText() {
    const node = textRef.current;
    const sel = window.getSelection();
    if (!node || !sel) return;
    const range = document.createRange();
    range.selectNodeContents(node);
    sel.removeAllRanges();
    sel.addRange(range);
    setState("selected");
  }

  async function copy() {
    try {
      if (!navigator.clipboard?.writeText) throw new Error("no clipboard");
      await navigator.clipboard.writeText(email);
      setState("copied");
    } catch {
      selectText();
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
      <a
        href={`mailto:${email}`}
        className="font-mono text-[clamp(1.25rem,2.4vw,1.75rem)] leading-tight break-all text-ink underline decoration-line-control decoration-1 underline-offset-[6px] transition-colors hover:text-accent hover:decoration-accent"
      >
        <span ref={textRef}>{email}</span>
      </a>
      <button
        type="button"
        onClick={copy}
        className="inline-flex min-h-11 min-w-[6.5rem] items-center justify-center rounded-[var(--radius-control)] border border-line-control bg-card px-4 font-mono text-sm text-ink transition-colors hover:border-ink"
      >
        <span aria-live="polite">{state === "copied" ? "Copied" : state === "selected" ? "Selected" : "Copy"}</span>
      </button>
    </div>
  );
}
