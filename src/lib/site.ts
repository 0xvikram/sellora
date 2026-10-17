// Everything a founder may want to change lives in this file:
// the name, the contact links, the services, prices and page copy.

export const SITE_NAME = "Sellora";
export const SITE_URL = "https://sellora.example"; // PLACEHOLDER: real domain not bought yet.
export const SITE_TAGLINE =
  "AI creative, AI-search visibility, retention and automation for online stores. Fixed prices, shown up front. Start by pasting your store address.";

// PLACEHOLDER: dummy inbox until the real one exists.
export const CONTACT_EMAIL = "hello@sellora.example";
// PLACEHOLDER: replace with the real booking link (Cal.com or similar).
export const BOOKING_URL = "#contact";

// The real demo workspace. It accepts ?url=<store url>.
export const DEMO_START_URL = "https://oatleaf-demo.vikrams-builds.workers.dev/start";

export const REPLY_PROMISE = "We reply within one business day.";

export const NAV_LINKS = [
  { label: "Work", href: "/teardowns" },
  { label: "Prices", href: "/prices" },
  { label: "Studio", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export type Service = {
  id: string;
  short: string; // used on the hero receipt and chips
  title: string;
  price: string;
  unit: string;
  summary: string;
  includes: string[];
  note?: string;
  rangeNote: string; // what moves a job to the top of its price range
  days: string; // typical working days (sample values until confirmed)
};

export const SERVICES: Service[] = [
  {
    id: "creative",
    rangeNote: "More videos, more hooks, or extra formats per video",
    days: "7–10",
    short: "AI ad creative",
    title: "AI ad creative",
    price: "$300–600",
    unit: "test batch of 3–5 videos",
    summary: "UGC-style video ads and product shots, made with AI.",
    includes: [
      "3–5 short ads for Meta and TikTok",
      "A different hook in each",
      "Source files included",
    ],
    note: "Ongoing creative is priced per video.",
  },
  {
    id: "ai-search",
    rangeNote: "More products, more markets, or a heavily customised theme",
    days: "10–14",
    short: "AI-search audit",
    title: "AI-search visibility audit",
    price: "$500–1,000",
    unit: "fixed",
    summary: "See how ChatGPT, Gemini and Perplexity recommend your products, then fix it.",
    includes: [
      "Baseline of how assistants answer buyer questions",
      "Structured-data and theme fixes, implemented",
      "Three product pages rewritten",
    ],
    note: "Add-on: catalog clean-up for AI shopping agents, $300–500.",
  },
  {
    id: "retention-audit",
    rangeNote: "More SKUs, more flows, or two markets",
    days: "5–7",
    short: "Retention audit",
    title: "Klaviyo retention and LTV audit",
    price: "$400–800",
    unit: "fixed",
    summary: "Where repeat revenue leaks, from your Shopify and Klaviyo data.",
    includes: [
      "Repeat rate and customer value by cohort",
      "Flow gaps, overlaps and deliverability",
      "A ranked 30-day plan",
    ],
  },
  {
    id: "connections",
    rangeNote: "More apps in the chain, or a two-way sync",
    days: "5–10",
    short: "Tool connections",
    title: "Tool connections",
    price: "$300–1,000",
    unit: "per workflow",
    summary: "Shopify talking to your CRM, 3PL, sheets and helpdesk.",
    includes: [
      "One workflow in n8n or Make, scoped first",
      "Alerts when a sync fails",
      "A short recording for your team",
    ],
  },
  {
    id: "tracking",
    rangeNote: "More ad platforms, or a custom checkout",
    days: "5–7",
    short: "Tracking repair",
    title: "Tracking repair",
    price: "$500–1,000",
    unit: "fixed",
    summary: "Meta and Google seeing your real sales again.",
    includes: [
      "Every pixel and event audited",
      "Conversions API and GA4 set up, de-duplicated",
      "Checked against your Shopify orders",
    ],
    note: "Shopify's 26 Aug 2026 thank-you page change broke many old pixels.",
  },
];

export const LADDER = [
  {
    step: "01",
    title: "Audit",
    price: "$300–1,000",
    body: "One fixed-price job. Useful on its own.",
  },
  {
    step: "02",
    title: "Build",
    price: "$1,500–4,000",
    body: "Flows, segments, win-back and a dashboard.",
  },
  {
    step: "03",
    title: "Retainer",
    price: "$2,000–3,500 / month",
    body: "We run retention, measured against a holdout group.",
  },
];

export const STUDIO = {
  line: "Two people. No account managers. The people on the call do the work.",
  // The words of `line` set in the italic accent; must appear in `line`.
  accent: "do the work.",
  location: "India, working with brands in the US, UK, Europe and Australia",
  hours: "Overlap with US mornings and UK/EU afternoons",
  how: "Two people in India do every job, from the first read of the store to the hand-over. We overlap with US mornings and UK and EU afternoons for calls, and we work inside the tools you already use.",
};

// The tools we work inside. Shown as a plain mono list, never as logos.
export const TOOLS = [
  "Shopify",
  "WooCommerce",
  "Klaviyo",
  "n8n",
  "Make",
  "Meta",
  "GA4",
  "Gorgias",
  "Recharge",
];

export const NOT_DO = [
  "No retainers to start.",
  "No passwords. Collaborator access only.",
  "No claims without a baseline.",
  "No AI output shipped unchecked.",
];

export type ProofBadge = {
  label: string;
  status?: "placeholder" | "verified";
  value?: string;
};

// PLACEHOLDER: partner statuses stay "placeholder" until the partnerships
// are real. Do not mark one "verified" before then.
export const PROOF: ProofBadge[] = [
  { label: "Shopify Partner", status: "placeholder" },
  { label: "Klaviyo Partner", status: "placeholder" },
  { label: "Teardowns published", value: "3" },
];

export type Finding = {
  title: string;
  body: string; // two sentences: what we saw, what changed
  label: string; // what the before/after bars measure
  before: number;
  after: number;
  unit: string; // "%" sits on the number; anything else follows a space
  max?: number; // bar scale; defaults to 100 for "%", else the larger value
};

export type Teardown = {
  slug: string;
  store: string;
  metric: string;
  baseline: string;
  period: string;
  method: string;
  summary: string;
  // The first finding carries the headline number (used on the cards).
  findings: [Finding, Finding, Finding];
  // "How we found it": the data source, the query and the check.
  howFound: { source: string; query: string; check: string };
  sample: boolean;
};

export function formatValue(value: number, unit: string) {
  return unit === "%" ? `${value}%` : `${value} ${unit}`;
}

// SAMPLE entries so the pages render. Every one is flagged `sample: true`
// and shows a visible "Sample" label. Every before/after value is a sample
// value too. Replace with real teardowns.
export const TEARDOWNS: Teardown[] = [
  {
    slug: "sample-supplements-us",
    store: "Sample: supplements brand (US)",
    metric: "+18% repeat rate in 60 days",
    baseline: "Repeat rate 21% (90-day cohorts, Shopify orders)",
    period: "60 days",
    method: "Klaviyo flows rebuilt; 10% holdout group kept out of every new flow.",
    summary:
      "A subscription-heavy store whose replenishment emails went out on a fixed 30-day timer, regardless of pack size.",
    findings: [
      {
        title: "Reminders ignored pack size",
        body: "Replenishment emails went out every 30 days whatever the pack, so 60-day buyers were nudged twice too early. Reminders now follow the pack size bought.",
        label: "Repeat rate, 90-day cohorts",
        before: 21,
        after: 24.8,
        unit: "%",
      },
      {
        title: "No flow for one-off buyers",
        body: "One-off buyers were 64% of first orders and got no email after delivery. A three-email post-purchase flow now runs for them.",
        label: "Second-order rate, one-off buyers",
        before: 9,
        after: 13,
        unit: "%",
      },
      {
        title: "Win-back started too late",
        body: "Win-back began at 180 days, long after most lapsed customers had switched. It now starts at 75 days from the last order.",
        label: "Win-back starts after",
        before: 180,
        after: 75,
        unit: "days",
      },
    ],
    howFound: {
      source: "Shopify orders export, 12 months",
      query: "Cohort by first-order month, repeat within 90 days",
      check: "Verified against Klaviyo flow sends and the 10% holdout",
    },
    sample: true,
  },
  {
    slug: "sample-apparel-uk",
    store: "Sample: apparel brand (UK)",
    metric: "Cited in 4 of 10 AI-assistant answers",
    baseline: "Cited in 0 of 10 tracked buyer questions",
    period: "45 days",
    method:
      "Ten buyer questions asked weekly in ChatGPT, Gemini and Perplexity; structured data and product copy fixed.",
    summary:
      "A well-reviewed store that never appeared when assistants were asked for recommendations in its category.",
    findings: [
      {
        title: "Reviews were invisible to crawlers",
        body: "Review content loaded by script after the page rendered, so assistants never read it. Reviews now render in the page HTML.",
        label: "Buyer questions citing the store",
        before: 0,
        after: 4,
        unit: "of 10",
        max: 10,
      },
      {
        title: "Schema had no price or stock",
        body: "Product schema was missing price and availability on every variant. Every variant now carries both.",
        label: "Variants with price and stock in schema",
        before: 0,
        after: 100,
        unit: "%",
      },
      {
        title: "Size and fabric lived in images",
        body: "Size charts and fabric details were images only, which assistants cannot read. They are now text on every product page.",
        label: "Product pages with size and fabric as text",
        before: 6,
        after: 100,
        unit: "%",
      },
    ],
    howFound: {
      source: "10 buyer questions, asked weekly in 3 assistants",
      query: "Answers logged; store citations counted per question",
      check: "Schema checked with Google's Rich Results Test",
    },
    sample: true,
  },
  {
    slug: "sample-homewares-au",
    store: "Sample: homewares brand (AU)",
    metric: "Meta reporting 94% of Shopify orders",
    baseline: "Meta reporting 58% of Shopify orders",
    period: "14 days",
    method: "Pixel and Conversions API rebuilt, de-duplicated and checked order by order.",
    summary:
      "Ad spend decisions were being made on half the real purchases after a checkout change broke the old pixel.",
    findings: [
      {
        title: "The purchase event stopped firing",
        body: "The purchase event came from a legacy thank-you page script that no longer ran after the checkout change. It now fires from a customer events pixel.",
        label: "Shopify orders reported in Meta",
        before: 58,
        after: 94,
        unit: "%",
      },
      {
        title: "Nothing was de-duplicated",
        body: "Conversions API sent events without event IDs, so browser and server purchases were counted twice. Both now share one event ID.",
        label: "Duplicate purchase events",
        before: 31,
        after: 2,
        unit: "%",
      },
      {
        title: "Test orders counted as revenue",
        body: "GA4 counted orders placed from the staff account as revenue. Staff and test orders are now filtered out.",
        label: "Test orders in GA4 revenue, per month",
        before: 14,
        after: 0,
        unit: "orders",
      },
    ],
    howFound: {
      source: "Shopify orders and Meta Events Manager, 14 days",
      query: "Orders matched to purchase events by order ID",
      check: "Checked order by order against Shopify",
    },
    sample: true,
  },
];

export const FAQS = [
  {
    q: "Which platforms?",
    a: "Mostly Shopify, plus WooCommerce and BigCommerce, with Klaviyo, Meta, Google, n8n and Make around them.",
  },
  {
    q: "What do you need to start?",
    a: "Collaborator access to the accounts the job touches. Never your passwords.",
  },
  {
    q: "Do you use AI?",
    a: "Yes, for creative, drafts and analysis. A person checks everything before it goes live.",
  },
  {
    q: "Do we have to sign a retainer?",
    a: "No. Every job here is a one-off at a fixed price.",
  },
  {
    q: "Who is behind this?",
    a: "A small studio based in India. The Studio page covers who does the work and our working hours.",
  },
];
