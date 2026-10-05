// Everything a founder may want to change lives in this file:
// the name, the contact links, the services and their prices.

// PLACEHOLDER: the agency name is not final. Change it here only.
export const SITE_NAME = "Reorder Labs";
export const SITE_URL = "https://example.com"; // PLACEHOLDER
export const SITE_TAGLINE =
  "AI creative, AI-search visibility, retention and automation for online stores. Fixed prices, shown up front.";

// PLACEHOLDER: replace with the real booking link and inbox.
export const BOOKING_URL = "#contact";
export const CONTACT_EMAIL = "hello@example.com";

// PLACEHOLDER: set to the demo store URL once it is live.
export const DEMO_STORE_URL = "";

export const NAV_LINKS = [
  { label: "Services", href: "#services" },
  { label: "How it works", href: "#how" },
  { label: "Why us", href: "#why" },
  { label: "FAQ", href: "#faq" },
];

export const TOOLS = [
  "Shopify",
  "WooCommerce",
  "Klaviyo",
  "n8n",
  "Make",
  "Meta Ads",
  "Google Analytics 4",
  "Higgsfield",
  "Recharge",
  "Gorgias",
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

export const REASONS = [
  {
    title: "Prices before the first call",
    body: "Every entry job is priced on this page.",
  },
  {
    title: "Two people, no hand-offs",
    body: "The people on the call do the work.",
  },
  {
    title: "Measured against your orders",
    body: "Shopify numbers and holdout groups, not dashboards.",
  },
  {
    title: "Inside your tools",
    body: "Your Shopify, Klaviyo and ad accounts. Nothing new to buy.",
  },
  {
    title: "A small first step",
    body: "Start with one audit. No retainer required.",
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
    a: "A two-person studio in India, working with brands in the US, UK, Europe and Australia.",
  },
];
