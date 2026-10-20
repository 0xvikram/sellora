// The pipeline scene's five gates, in the order an order passes them.
// Plain data (no three.js), so the section can list them for assistive
// tech without loading the 3D chunk.
export const PIPELINE_GATES = [
  { id: "creative", label: "Creative", note: "ads and product shots made with AI" },
  { id: "ai-search", label: "AI search", note: "assistants can find and cite the store" },
  { id: "klaviyo", label: "Klaviyo", note: "flows that bring buyers back" },
  { id: "connections", label: "Connections", note: "Shopify talking to the other tools" },
  { id: "tracking", label: "Tracking", note: "every order matched to its pixel event" },
] as const;
