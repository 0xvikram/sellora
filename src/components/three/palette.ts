// Colours for the hero diorama. Site tokens (src/app/globals.css) where the
// scene shows the brand (ink, lime, bone, sage), and the Oatleaf product
// tints (--store-*) for the goods on the shelves. Plain hex: three.js
// converts sRGB to linear itself (ColorManagement is on).
export const C = {
  ink: "#0a140f",
  lime: "#d3f502",
  bone: "#eef0e6", // the slab top, a shade under the card bone so it reads
  sageSide: "#8e9c80", // slab sides: sage, darker
  sageDeep: "#76856a",
  wall: "#f1ebe2", // shop walls, a warm off-white
  facade: "#e3d6c5", // the extruded facade, sand-light
  roof: "#cfc6b6",
  path: "#e2e4d8", // the walkway inset in the slab top
  door: "#1f5c63",
  window: "#ffffff",
  oak: "#d6c2a6", // shelves and counter top
  counter: "#f6f3ec",
  parcel: "#c2a58c",
  parcelSand: "#cbb38c", // conveyor parcels: yellower, so they stay sand on the sage card
  mat: "#3d4a3a", // the door mat, a dark moss
  // Oatleaf product tints (muted).
  teal: "#2d6a70",
  clay: "#c6704f",
  sand: "#c9b096",
  moss: "#6b7a5c",
} as const;

export const PRODUCT_TINTS = [C.teal, C.clay, C.sand, C.moss] as const;
