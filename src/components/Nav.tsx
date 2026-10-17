"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { NAV_LINKS, SITE_NAME } from "@/lib/site";
import { cn } from "@/lib/utils";

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
  const [condensed, setCondensed] = useState(false);

  // Condense the bar after 24px of scroll. One passive listener, at most
  // one read per animation frame. The header keeps a fixed 64px slot in
  // the flow, so the 64 -> 56 change never moves the page.
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      setCondensed(window.scrollY > 24);
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

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
    <header className="sticky top-0 z-50 h-16">
      <div
        data-condensed={condensed || undefined}
        className={cn(
          "border-b transition-[background-color,border-color] duration-200 ease-out motion-reduce:transition-none",
          open
            ? "border-line bg-ground"
            : condensed
              ? "border-line bg-ground/85 backdrop-blur-[12px]"
              : "border-transparent bg-ground",
        )}
      >
        <div
          className={cn(
            "mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-5 transition-[height] duration-200 ease-out motion-reduce:transition-none md:px-8",
            condensed ? "h-14" : "h-16",
          )}
        >
          <Link
            href="/"
            className="font-display text-[1.375rem] leading-none font-medium tracking-[-0.01em] text-ink"
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
                className="text-sm text-ink-2 transition-colors hover:text-ink aria-[current=page]:text-ink aria-[current=page]:underline aria-[current=page]:decoration-accent aria-[current=page]:underline-offset-[6px]"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <a
              href={auditHref}
              className="btn btn-primary px-4 text-[0.9375rem]"
            >
              Start the audit
            </a>
            <button
              ref={buttonRef}
              type="button"
              className="btn btn-secondary px-4 text-[0.9375rem] md:hidden"
              aria-expanded={open}
              aria-controls={panelId}
              onClick={() => (open ? close(false) : setOpen(true))}
            >
              {open ? "Close" : "Menu"}
            </button>
          </div>
        </div>
      </div>

      <div
        ref={panelRef}
        id={panelId}
        hidden={!open}
        className="border-b border-line bg-ground md:hidden"
      >
        <nav aria-label="Mobile" className="mx-auto w-full max-w-7xl px-5 py-4">
          <ul className="flex flex-col">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  aria-current={isCurrent(pathname, link.href) ? "page" : undefined}
                  onClick={() => close(false)}
                  className="block py-3 font-display text-3xl font-normal tracking-[-0.02em] text-ink aria-[current=page]:font-display-italic aria-[current=page]:text-accent aria-[current=page]:italic"
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
