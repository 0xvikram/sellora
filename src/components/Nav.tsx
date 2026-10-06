import { BOOKING_URL, NAV_LINKS, SITE_NAME } from "@/lib/site";

export function Logo() {
  return (
    <a href="#top" className="flex items-center gap-2.5" aria-label={SITE_NAME}>
      <svg viewBox="0 0 32 32" className="h-7 w-7" aria-hidden="true">
        <rect width="32" height="32" rx="8" className="fill-ink" />
        <path
          d="M10 20.5a7 7 0 1 1 6.5 4.4"
          fill="none"
          className="stroke-paper"
          strokeWidth="2.6"
          strokeLinecap="round"
        />
        <path
          d="M8 15.5l2.2 5.2 5-2.4"
          fill="none"
          className="stroke-paper"
          strokeWidth="2.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span className="font-display text-[1.1rem] font-bold tracking-[-0.02em]">{SITE_NAME}</span>
    </a>
  );
}

export function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b border-line bg-paper/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 md:px-8">
        <Logo />
        <nav className="hidden items-center gap-8 md:flex" aria-label="Main">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-ink-2 transition-colors hover:text-ink"
            >
              {link.label}
            </a>
          ))}
        </nav>
        <a
          href={BOOKING_URL}
          className="rounded-full bg-ink px-4 py-2 text-sm font-medium text-paper transition-colors hover:bg-accent"
        >
          Book a call
        </a>
      </div>
    </header>
  );
}
