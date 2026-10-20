"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { GROUND_SELECTOR, groundOf, type Ground } from "@/lib/ground";
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
  const pillRef = useRef<HTMLDivElement>(null);
  const [tone, setTone] = useState<Ground>("bone");

  // The pill takes the tint of the section beneath it. A 1px band across
  // the pill's vertical centre is the IntersectionObserver root margin;
  // whichever [data-ground] section crosses that band sets the tone.
  // Rebuilt on resize, because the band is in pixels.
  useEffect(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>(GROUND_SELECTOR));
    if (!sections.length || typeof IntersectionObserver === "undefined") return;
    let observer: IntersectionObserver | null = null;
    const inBand = new Set<Element>();

    const pick = () => {
      // Last in document order wins (the later section has scrolled up
      // over the band).
      const current = sections.filter((s) => inBand.has(s)).pop();
      setTone(groundOf(current));
    };

    const build = () => {
      observer?.disconnect();
      inBand.clear();
      const pill = pillRef.current;
      const mid = pill ? Math.round(pill.getBoundingClientRect().top + pill.offsetHeight / 2) : 46;
      const bottom = Math.max(0, window.innerHeight - mid - 1);
      observer = new IntersectionObserver(
        (entries) => {
          for (const e of entries) {
            if (e.isIntersecting) inBand.add(e.target);
            else inBand.delete(e.target);
          }
          pick();
        },
        { rootMargin: `-${mid}px 0px -${bottom}px 0px`, threshold: 0 },
      );
      sections.forEach((s) => observer!.observe(s));
    };

    build();
    let frame = 0;
    const onResize = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(build);
    };
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(frame);
      observer?.disconnect();
    };
  }, [pathname]);

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

  // With the menu open the pill and panel are always bone.
  const shown: Ground = open ? "bone" : tone;

  return (
    // A 92px slot in the flow (16px gap, the 60px pill, 16px gap), so pages
    // start below the fixed pill without each one adding an offset.
    <header className="relative z-50 h-[92px]">
      <div className="fixed inset-x-0 top-4 px-4">
        <div
          ref={pillRef}
          data-ground={shown}
          data-nav-pill=""
          className={cn(
            "mx-auto flex h-[60px] w-full max-w-[1240px] items-center justify-between gap-3 rounded-full border border-line py-2 pr-2 pl-5 shadow-float backdrop-blur-[16px] transition-[background-color,border-color,color] duration-300 ease-out motion-reduce:transition-none md:pl-6",
            shown === "ink" ? "bg-dark/70" : shown === "sage" ? "bg-sage/75" : "bg-bone/80",
          )}
        >
          <Link
            href="/"
            className="font-display text-[1.375rem] leading-none font-bold tracking-[0.01em] text-ink uppercase [font-stretch:70%]"
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
                className="text-sm font-medium text-ink-2 transition-colors hover:text-ink aria-[current=page]:text-ink aria-[current=page]:underline aria-[current=page]:decoration-lime-ink aria-[current=page]:decoration-2 aria-[current=page]:underline-offset-[6px]"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <a href={auditHref} className="btn btn-primary min-h-11 px-4 text-[0.9375rem] max-[359px]:hidden">
              Start the audit
            </a>
            <button
              ref={buttonRef}
              type="button"
              className="btn btn-ghost min-h-11 px-4 text-[0.9375rem] md:hidden"
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
          data-ground="bone"
          className="mx-auto mt-2 w-full max-w-[1240px] rounded-panel border border-line bg-bone shadow-float md:hidden"
        >
          <nav aria-label="Mobile" className="px-5 py-3">
            <ul className="flex flex-col">
              {NAV_LINKS.map((link) => (
                <li key={link.href} className="border-b border-line last:border-b-0">
                  <Link
                    href={link.href}
                    aria-current={isCurrent(pathname, link.href) ? "page" : undefined}
                    onClick={() => close(false)}
                    className="type-display block py-3 text-[2.5rem] text-ink aria-[current=page]:text-lime-ink aria-[current=page]:italic"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}
