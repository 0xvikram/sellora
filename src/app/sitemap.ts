import type { MetadataRoute } from "next";
import { SITE_URL, TEARDOWNS } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "/teardowns", "/prices", "/about", "/contact"];
  return [
    ...pages.map((path) => ({ url: `${SITE_URL}${path}` })),
    ...TEARDOWNS.map((t) => ({ url: `${SITE_URL}/teardowns/${t.slug}` })),
  ];
}
