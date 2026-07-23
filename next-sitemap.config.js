/** @type {import('next-sitemap').IConfig} */

const PLACEHOLDER_URL = "https://hyundai-iq.example.com";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : PLACEHOLDER_URL);
const LOCALES = ["ar", "en"];

module.exports = {
  siteUrl,
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  outDir: "public",
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/_next/"],
      },
    ],
  },
  alternateRefs: LOCALES.map((l) => ({
    href: `${siteUrl}/${l}`,
    hreflang: l,
  })),

  exclude: [
    "/api/*",
    "/*/not-found",
    "/icon*",
    "/apple-icon*",
  ],

  transform: async (config, path) => {
    // Model pages are the commercial pages — rank them highest.
    const isModel = /^\/(ar|en)\/models\/[^/]+$/.test(path);
    // Locale roots next, then everything else.
    const isHome = /^\/(ar|en)$/.test(path);

    return {
      loc: path,
      changefreq: isModel || isHome ? "weekly" : "monthly",
      priority: isHome ? 1.0 : isModel ? 0.9 : 0.7,
      lastmod: new Date().toISOString(),
      alternateRefs: config.alternateRefs ?? [],
    };
  },

  additionalPaths: async (config) => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) {
      console.warn("[next-sitemap] Supabase env missing — skipping model URLs");
      return [];
    }

    try {
      const res = await fetch(`${url}/rest/v1/cars?select=slug&order=sort_order`, {
        headers: { apikey: key, Authorization: `Bearer ${key}` },
      });
      if (!res.ok) throw new Error(`status ${res.status}`);
      const cars = await res.json();

      return Promise.all(
        cars.flatMap((c) =>
          LOCALES.map((l) => config.transform(config, `/${l}/models/${c.slug}`))
        )
      );
    } catch (err) {
      // Never fail the build over a sitemap — log and ship without them.
      console.warn("[next-sitemap] model fetch failed:", err.message);
      return [];
    }
  },
};