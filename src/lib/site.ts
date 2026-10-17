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
};

export const SERVICES: Service[] = [
  {
    id: "creative",
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
};

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

export type Teardown = {
  slug: string;
  store: string;
  metric: string;
  baseline: string;
  period: string;
  method: string;
  summary: string;
  findings: [string, string, string];
  sample: boolean;
};

// SAMPLE entries so the pages render. Every one is flagged `sample: true`
// and shows a visible "Sample" label. Replace with real teardowns.
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
      "Replenishment reminders ignored pack size, so 60-day buyers were nudged twice too early.",
      "No post-purchase flow for one-off buyers, who were 64% of first orders.",
      "Win-back started at 180 days, long after most lapsed customers had switched.",
    ],
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
      "Product schema was missing price and availability on every variant.",
      "Size and fabric details lived only in images, so assistants could not read them.",
      "Review content was loaded by script and invisible to crawlers.",
    ],
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
      "The purchase event fired from a legacy thank-you page script that no longer ran.",
      "Conversions API sent events without event IDs, so nothing de-duplicated.",
      "GA4 counted test orders from the staff account as revenue.",
    ],
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
