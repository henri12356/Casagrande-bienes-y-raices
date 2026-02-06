// app/robots.ts
import type { MetadataRoute } from "next";

const SITE_URL = "https://www.casagrande-inmobilaria.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/_next/", "/admin/", "/private/", "/*?*"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
