// Hex copies of the colour tokens in src/app/globals.css ("Bone & Lime"),
// for places that cannot read CSS variables (the generated Open Graph
// image). Keep in sync.
export const TOKENS = {
  ground: "#f3f5ee", // bone
  ground2: "#e8ebe0",
  card: "#ffffff",
  ink: "#0a140f",
  ink2: "#2b352f",
  ink3: "#5a665e",
  lime: "#d3f502", // fill only: text on lime is always ink
  limeInk: "#3f5a00", // lime-coloured text on light grounds
  sage: "#b7c3a7",
  clay: "#ff5a2c", // fill only
  groundDark: "#0a140f", // the dark ground is ink; bone text, lime stays lime
} as const;
