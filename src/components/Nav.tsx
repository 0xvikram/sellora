"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { NAV_LINKS, SITE_NAME } from "@/lib/site";

function isCurrent(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Nav() {
  const pathname = usePathname() ?? "/";
  const auditHref = pathname === "/" ? "#audit" : "/#audit";
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const close = useCallback((returnFocus: boolean) => {
    setOpen(false);
    if (returnFocus) buttonRef.current?.focus();
  }, []);

  // While the menu is open: Escape closes it, Tab stays inside the button
  // and the panel, and a click outside the header closes it.
  useEffect(() => {
    if (!open) return;
    const panel = panelRef.current;
    panel?.querySelector<HTMLElement>("a")?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        close(true);
        return;
      }
      if (event.key !== "Tab" || !panel || !buttonRef.current) return;
      const items = [buttonRef.current, ...panel.querySelectorAll<HTMLElement>("a")];
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement as HTMLElement | null;
      if (!active || !items.includes(active)) {
        event.preventDefault();
        first.focus();
      } else if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    }

    function onPointerDown(event: PointerEvent) {
      const header = buttonRef.current?.closest("header");
      if (header && !header.contains(event.target as Node)) close(false);
    }

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open, close]);

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-paper">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-4 px-5 md:px-8">
        <Link
          href="/"
          className="font-display text-xl font-bold tracking-[-0.02em] text-ink"
          aria-current={pathname === "/" ? "page" : undefined}
        >
          {SITE_NAME}
        </Link>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Main">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={isCurrent(pathname, link.href) ? "page" : undefined}
              className="text-sm text-ink-2 transition-colors hover:text-ink aria-[current=page]:text-ink"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={auditHref}
            className="rounded-full bg-ink px-4 py-2 text-sm font-medium whitespace-nowrap text-paper transition-colors hover:bg-accent"
          >
            Start the audit
          </a>
          <button
            ref={buttonRef}
            type="button"
            className="inline-flex h-10 items-center rounded-full border border-line-2 px-4 text-sm font-medium text-ink md:hidden"
            aria-expanded={open}
            aria-controls={panelId}
            onClick={() => (open ? close(false) : setOpen(true))}
          >
            {open ? "Close" : "Menu"}
          </button>
        </div>
      </div>

      <div
        ref={panelRef}
        id={panelId}
        hidden={!open}
        className="border-t border-line bg-paper md:hidden"
      >
        <nav aria-label="Mobile" className="mx-auto w-full max-w-7xl px-5 py-4">
          <ul className="flex flex-col">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  aria-current={isCurrent(pathname, link.href) ? "page" : undefined}
                  onClick={() => close(false)}
                  className="block py-3 font-display text-2xl font-semibold tracking-[-0.02em] text-ink aria-[current=page]:text-accent"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
