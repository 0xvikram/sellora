import { useId, type ReactNode } from "react";
import { HeroShot, ProductShot, type Shape, type Tone } from "./ProductArt";

// The sample store the hero preview reads: Oatleaf, a skincare and body care
// brand from the demo workspace. Drawn in code inside a browser frame. Sizes
// inside .store use container units (see globals.css), so the page scales
// with the panel and the product grid drops to two columns when narrow.

export type Region = "header" | "hero" | "products" | "tracking" | "email";

const PRODUCTS: { name: string; price: string; shape: Shape; tone: Tone; scene: Tone }[] = [
  { name: "Oat Cleanser", price: "$24", shape: "pump", tone: "sand", scene: "sand" },
  { name: "Barrier Cream", price: "$32", shape: "jar", tone: "teal", scene: "teal" },
  { name: "Night Oil", price: "$38", shape: "dropper", tone: "clay", scene: "clay" },
  { name: "Body Wash", price: "$22", shape: "pump", tone: "moss", scene: "moss" },
  { name: "Hand Balm", price: "$16", shape: "tube", tone: "clay", scene: "sand" },
  { name: "Daily SPF", price: "$28", shape: "tube", tone: "teal", scene: "moss" },
];

const LINKS = ["Shop", "Sets", "Story", "Journal"];

function BagIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false" className="store-icon">
      <path d="M3.5 5.5h9l-.8 8h-7.4z" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
      <path d="M6 5.5V4.5a2 2 0 0 1 4 0v1" fill="none" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  );
}

/** Shown instead of the links when the store is phone-width. */
function MenuIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false" className="store-icon store-menu">
      <path d="M2.5 4.5h11M2.5 8h11M2.5 11.5h11" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg viewBox="0 0 12 12" aria-hidden="true" focusable="false" className="browser-lock">
      <rect x="2.5" y="5.5" width="7" height="5" rx="1" fill="currentColor" />
      <path d="M4 5.5V4a2 2 0 0 1 4 0v1.5" fill="none" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

/**
 * `status` sits at the right of the browser bar. `findings` places one annotation chip in each region; `wash` is the
 * soft lime overlay the timeline flashes as the scan line passes.
 */
export function Storefront({
  domain,
  status,
  findings,
}: {
  domain: ReactNode;
  status: ReactNode;
  findings: Record<Region, ReactNode>;
}) {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const wash = <span data-pv="wash" aria-hidden="true" className="store-wash" />;

  return (
    <div className="browser">
      <div className="browser-bar">
        <span className="browser-dots" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        <span className="browser-url">
          <LockIcon />
          <span className="sr-only">Reading </span>
          <span className="truncate">{domain}</span>
        </span>
        {status}
      </div>

      <div className="store">
        <div data-region="header" className="store-region">
          <p className="store-announce" aria-hidden="true">Free shipping over $60</p>
          <div className="store-navwrap">
            <div className="store-nav" aria-hidden="true">
              <MenuIcon />
              <span className="store-wordmark">Oatleaf</span>
              <span className="store-links">
                {LINKS.map((l) => (
                  <span key={l}>{l}</span>
                ))}
              </span>
              <span className="store-bag">
                <BagIcon />
                <span>2</span>
              </span>
            </div>
            {/* A quiet sub-nav strip; the header finding sits at its right
                edge, below the nav row, so it never covers a link or the bag. */}
            <div className="store-subnav">
              <span aria-hidden="true" className="store-crumbs">
                <span>New</span>
                <span>Bestsellers</span>
                <span>Gift sets</span>
              </span>
              {findings.header}
            </div>
          </div>
          {wash}
        </div>

        <div data-region="hero" className="store-region store-hero">
          <div className="store-hero-art" aria-hidden="true">
            <HeroShot id={`${uid}h`} />
          </div>
          <div className="store-hero-copy">
            <div aria-hidden="true" className="store-hero-text">
              <p className="store-headline">Skincare that keeps its promises</p>
              <span className="store-cta">Shop the routine</span>
            </div>
            {findings.hero}
          </div>
          {wash}
        </div>

        <div data-region="products" className="store-region store-products">
          <div className="store-products-head">
            <span aria-hidden="true" className="store-products-title">
              <span className="store-section-title">Bestsellers</span>
              <span className="store-viewall">View all 48</span>
            </span>
            {findings.products}
          </div>
          <div className="store-grid" aria-hidden="true">
            {PRODUCTS.map((p, i) => (
              <div key={p.name} className="store-card">
                <div className="store-photo">
                  <ProductShot id={`${uid}p${i}`} shape={p.shape} tone={p.tone} scene={p.scene} />
                </div>
                <div className="store-card-meta">
                  <span className="store-name">{p.name}</span>
                  <span className="store-price">{p.price}</span>
                </div>
              </div>
            ))}
          </div>
          {wash}
        </div>

        <div data-region="tracking" className="store-region store-trust">
          <span aria-hidden="true" className="store-badges">
            <span>Free returns</span>
            <span>Cruelty free</span>
            <span>Ships in 48h</span>
          </span>
          {wash}
          {findings.tracking}
        </div>

        <div data-region="email" className="store-region store-signup">
          <span aria-hidden="true" className="store-signup-copy">10% off your first order</span>
          <span aria-hidden="true" className="store-input">Email address</span>
          {wash}
          {findings.email}
        </div>
      </div>
    </div>
  );
}
