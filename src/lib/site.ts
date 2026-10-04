// Everything a founder may want to change lives in this file:
// the name, the contact links, the services and their prices.

// PLACEHOLDER: the agency name is not final. Change it here only.
export const SITE_NAME = "Reorder Labs";
export const SITE_URL = "https://example.com"; // PLACEHOLDER
export const SITE_TAGLINE =
  "AI creative, AI-search visibility, retention and automation for e-commerce brands. Fixed prices, shown up front.";

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
    summary:
      "UGC-style video ads and product shots made with AI, built around hooks and angles for your product.",
    includes: [
      "3–5 short video ads sized for Meta and TikTok",
      "A different hook or angle in each, so you can see what wins",
      "Product shots for listings and ads on request",
      "Source files, so your team can cut more versions",
    ],
    note: "Happy with the batch? Ongoing creative is priced per video.",
  },
  {
    id: "ai-search",
    short: "AI-search audit",
    title: "AI-search visibility audit",
    price: "$500–1,000",
    unit: "fixed",
    summary:
      "Find out how ChatGPT, Gemini and Perplexity describe and recommend your products, and fix what holds you back.",
    includes: [
      "A baseline of how AI assistants answer the questions your buyers ask",
      "Structured-data and theme fixes, implemented",
      "Three product pages rewritten so assistants can quote them",
      "A ranked list of what to do next",
    ],
    note: "Add-on: catalog clean-up so AI shopping agents can read your products, $300–500.",
  },
  {
    id: "retention-audit",
    short: "Retention audit",
    title: "Klaviyo retention and LTV audit",
    price: "$400–800",
    unit: "fixed",
    summary:
      "We join your Shopify orders to your Klaviyo account and show where repeat revenue is leaking.",
    includes: [
      "Repeat-purchase rate and customer value by cohort",
      "Customer segments by how recently, how often and how much they buy",
      "Gaps and overlaps in your flows, plus a deliverability check",
      "Klaviyo's reported revenue compared with what Shopify recorded",
      "A ranked 30-day plan",
    ],
  },
  {
    id: "connections",
    short: "Tool connections",
    title: "Tool connections",
    price: "$300–1,000",
    unit: "per workflow",
    summary:
      "Shopify talking to your CRM, 3PL, ERP, spreadsheets and helpdesk, so nobody copies orders by hand.",
    includes: [
      "One workflow built in n8n or Make, scoped before we start",
      "Error alerts, so a failed sync never goes unnoticed",
      "A short recording and written notes your team can follow",
    ],
  },
  {
    id: "tracking",
    short: "Tracking repair",
    title: "Tracking repair",
    price: "$500–1,000",
    unit: "fixed",
    summary:
      "Get Meta and Google seeing your sales again, so ad spend is judged on real numbers.",
    includes: [
      "An audit of every pixel and event on your store",
      "Meta Conversions API and GA4 purchase events set up and de-duplicated",
      "Consent banner wired so tags wait for a yes",
      "A before-and-after check against your Shopify orders",
    ],
    note: "Shopify moved every store to its new thank-you page on 26 August 2026. Pixels added the old way stopped reporting.",
  },
];

export const LADDER = [
  {
    step: "01",
    title: "Audit",
    price: "$300–1,000",
    body: "Start with one fixed-price job from the list above. You see how we work and get something you can use, whatever you decide next.",
  },
  {
    step: "02",
    title: "Build",
    price: "$1,500–4,000",
    body: "We fix what the audit found: four to six flows, customer segments, win-back timing based on your real reorder gaps, and a dashboard.",
  },
  {
    step: "03",
    title: "Retainer",
    price: "$2,000–3,500 / month",
    body: "We run retention for you: the campaign calendar, a test every month and a cohort report measured against a holdout group.",
  },
];

export const REASONS = [
  {
    title: "Prices before the first call",
    body: "Every entry service has a fixed price on this page. You know the cost before you write to us.",
  },
  {
    title: "Two people, no hand-offs",
    body: "The people on your call are the people doing the work. There is no account manager in between.",
  },
  {
    title: "Measured against your orders",
    body: "We report against what Shopify recorded, and use holdout groups where we can, so a dashboard can't flatter the result.",
  },
  {
    title: "Inside the tools you already run",
    body: "We work in your Shopify, Klaviyo and ad accounts. Nothing new to buy unless it clearly pays for itself.",
  },
  {
    title: "A small first step",
    body: "Start with one audit. Nothing commits you to a retainer.",
  },
];

export const FAQS = [
  {
    q: "Which platforms do you work with?",
    a: "Mostly Shopify. We also work with WooCommerce and BigCommerce stores, and with the tools around them: Klaviyo, Meta and Google ad accounts, n8n and Make.",
  },
  {
    q: "What do you need from us to start?",
    a: "Collaborator or staff access to the accounts the job touches. We never ask for your passwords, and you can remove access the day we finish.",
  },
  {
    q: "Do you use AI to do the work?",
    a: "Yes, for creative, drafts and analysis. A person checks everything before it reaches you or your customers, and nothing goes live without your approval.",
  },
  {
    q: "We already have an agency. Can you work alongside them?",
    a: "Yes. The audits and tool connections are scoped so they don't touch what your agency runs. We can also hand our findings to them.",
  },
  {
    q: "Do we have to sign a retainer?",
    a: "No. Every job on this page is a one-off with a fixed price. The retainer is there if you want us to keep going.",
  },
  {
    q: "Who is behind this?",
    a: "A two-person studio based in India, working with e-commerce brands in the US, UK, Europe and Australia.",
  },
];
