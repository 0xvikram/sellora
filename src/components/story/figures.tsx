import type { CSSProperties } from "react";
import { AdShot, type Shape, type Tone } from "../preview/ProductArt";

// The five drawn figures of the Story section, one per service. Each is
// plain HTML and inline SVG in a 16:10 frame sized in container units, so
// it scales with its column. The markup is the FINAL state: that is what
// the stacked layout (phones, tablets, reduced motion, no JavaScript)
// shows. The pinned layout's scrubbed timeline (./timeline.ts) moves each
// figure from a start state to this one; the data-* hooks are for it.
//
// Every brand, number and label here is sample data.

type FigureProps = { id: string };

/* 01  AI ad creative: three 9:16 ad frames fanned out, a hook on each. */
const ADS: { hook: string; shape: Shape; tone: Tone; scene: Tone }[] = [
  { hook: "Why my skin stopped flaking", shape: "pump", tone: "teal", scene: "sand" },
  { hook: "The 30-second routine", shape: "dropper", tone: "clay", scene: "moss" },
  { hook: "Barrier cream, tested 8 weeks", shape: "jar", tone: "sand", scene: "teal" },
];

export function AdsFigure({ id }: FigureProps) {
  return (
    <div className="fg fg-ads">
      {ADS.map((ad, i) => (
        <div key={ad.hook} data-ad={i} className="fg-ad">
          <AdShot id={`${id}a${i}`} shape={ad.shape} tone={ad.tone} scene={ad.scene} />
          <span className="fg-ad-bars">
            <i />
            <i />
            <i />
          </span>
          <span className="fg-ad-tag">Ad 0{i + 1}</span>
          <span data-hook className="fg-ad-hook">
            {ad.hook}
          </span>
        </div>
      ))}
    </div>
  );
}

/* 02  AI-search visibility: an assistant's answer, Oatleaf moved from
   "not cited" at the bottom to cited first. */
const ANSWER: { brand: string; why: string; slot: number; self?: boolean }[] = [
  { brand: "Oatleaf", why: "Colloidal oat, fragrance free, 4.8 from 2,140 reviews", slot: 0, self: true },
  { brand: "Calmwell", why: "Fragrance free, pH 5.5", slot: 1 },
  { brand: "Bramble & Co", why: "Oat and ceramides", slot: 2 },
  { brand: "Softfield", why: "Gentle, low foam", slot: 3 },
];

export function AnswerFigure() {
  return (
    <div className="fg fg-answer">
      <p className="fg-q">Which oat cleanser is gentle for eczema?</p>
      <p className="fg-mono">Assistant · 4 products</p>
      <div className="fg-rows">
        <span className="fg-ranks">
          {[1, 2, 3, 4].map((n) => (
            <span key={n}>{n}</span>
          ))}
        </span>
        <div className="fg-rowlist">
          {ANSWER.map((r) => (
            <div
              key={r.brand}
              data-row={r.self ? "self" : "other"}
              className={r.self ? "fg-row fg-row-self" : "fg-row"}
              style={{ "--slot": r.slot } as CSSProperties}
            >
              <span className="fg-brand">{r.brand}</span>
              <span className="fg-why">{r.why}</span>
              {r.self ? (
                <span className="fg-tags">
                  <span data-tag="not" className="fg-tag fg-tag-not">
                    not cited
                  </span>
                  <span data-tag="cited" className="fg-tag fg-tag-cited">
                    <i data-marker />
                    cited
                  </span>
                </span>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* 03  Klaviyo retention: the post-purchase timeline, two gaps filled. */
const FLOW: { day: string; name: string; gap?: boolean }[] = [
  { day: "Order", name: "Thank you" },
  { day: "Day 3", name: "How to use" },
  { day: "Day 14", name: "Refill reminder", gap: true },
  { day: "Day 30", name: "Review ask" },
  { day: "Day 75", name: "Win-back", gap: true },
];

export function FlowFigure() {
  return (
    <div className="fg fg-flow">
      <p className="fg-mono">Klaviyo · after the first order</p>
      <div className="fg-track">
        <span className="fg-line" />
        <span data-flowline className="fg-line fg-line-fill" />
        {FLOW.map((n, i) => (
          <div key={n.day} className="fg-node" data-gap={n.gap ? "" : undefined} style={{ "--i": i } as CSSProperties}>
            <span className="fg-node-name">
              <span data-label="name" className={n.gap ? "fg-added" : undefined}>
                {n.name}
              </span>
              {n.gap ? (
                <span data-label="gap" className="fg-gap-label">
                  No email
                </span>
              ) : null}
            </span>
            <span className="fg-dot">
              <span data-fill className="fg-dot-fill" />
            </span>
            <span className="fg-node-day">{n.day}</span>
          </div>
        ))}
      </div>
      <p className="fg-legend">
        <span>
          <i className="fg-key-sent" /> Sent
        </span>
        <span>
          <i className="fg-key-added" /> Added
        </span>
      </p>
    </div>
  );
}

/* 04  Tool connections: Shopify in the middle, four tools linked by
   hairlines, a dash travelling along each link. */
const TOOLS: { name: string; what: string; x: number; y: number }[] = [
  { name: "Klaviyo", what: "profiles, orders", x: 17, y: 20 },
  { name: "3PL", what: "fulfilment", x: 83, y: 20 },
  { name: "Sheets", what: "daily stock", x: 17, y: 80 },
  { name: "Helpdesk", what: "order lookups", x: 83, y: 80 },
];

export function ConnectFigure() {
  return (
    <div className="fg fg-connect">
      {/* 160 x 100 matches the 16:10 frame, so dashes measure true. */}
      <svg viewBox="0 0 160 100" aria-hidden="true" focusable="false">
        {TOOLS.map((t) => (
          <g key={t.name}>
            <line data-link x1="80" y1="50" x2={t.x * 1.6} y2={t.y} pathLength={100} className="fg-link" />
            <line data-dash x1="80" y1="50" x2={t.x * 1.6} y2={t.y} pathLength={100} className="fg-dash" />
          </g>
        ))}
      </svg>
      <span className="fg-hub" style={{ left: "50%", top: "50%" }}>
        Shopify
      </span>
      {TOOLS.map((t) => (
        <span key={t.name} data-tool className="fg-tool" style={{ left: `${t.x}%`, top: `${t.y}%` }}>
          <span className="fg-tool-name">{t.name}</span>
          <span className="fg-tool-what">{t.what}</span>
        </span>
      ))}
    </div>
  );
}

/* 05  Tracking repair: Meta-reported orders against Shopify orders,
   before and after. */
export function TrackingFigure() {
  return (
    <div className="fg fg-track-bars">
      {(
        [
          { when: "Before", shopify: 412, meta: 54 },
          { when: "After", shopify: 398, meta: 96 },
        ] as const
      ).map((g) => (
        <div key={g.when} className="fg-group" data-group={g.when}>
          <p className="fg-mono">{g.when}</p>
          <div className="fg-bar-row">
            <span className="fg-bar-label">Shopify orders</span>
            <span className="fg-bar-track">
              <span className="fg-bar fg-bar-shop" style={{ width: "100%" }} />
            </span>
            <span className="fg-bar-value">{g.shopify}</span>
          </div>
          <div className="fg-bar-row">
            <span className="fg-bar-label">Meta reported</span>
            <span className="fg-bar-track">
              <span
                data-bar={g.when}
                className={g.when === "After" ? "fg-bar fg-bar-meta" : "fg-bar fg-bar-before"}
                style={{ width: `${g.meta}%` }}
              />
            </span>
            <span className="fg-bar-value">
              <span data-count={g.when}>{g.meta}</span>%
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
