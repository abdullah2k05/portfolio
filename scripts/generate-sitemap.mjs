import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

const normalizeBaseUrl = (raw) => {
  if (!raw) return null;
  const withProtocol = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
  return withProtocol.replace(/\/+$/, "");
};

const SITE_URL =
  normalizeBaseUrl(process.env.SITE_URL) ||
  normalizeBaseUrl(process.env.VERCEL_PROJECT_PRODUCTION_URL) ||
  normalizeBaseUrl(process.env.VERCEL_URL) ||
  "https://mabdullah.top";
const OUTPUT_PATH = path.join(rootDir, "public", "sitemap.xml");

const caseStudySlugs = [
  "github-reader",
  "period-tracker",
  "invoice-generator",
  "expense-tracker",
  "finance-analyzer",
  "ai-live-chat",
  "parcel-tracker",
  "focus-app",
  "rehman-royal-store",
  "cooking-oil-store",
];

const routes = [
  { path: "/", changefreq: "weekly", priority: 1.0 },
  { path: "/articles", changefreq: "weekly", priority: 0.9 },
  { path: "/products", changefreq: "weekly", priority: 0.8 },
  { path: "/privacy-policy", changefreq: "monthly", priority: 0.5 },
  { path: "/terms", changefreq: "monthly", priority: 0.5 },
  ...caseStudySlugs.map((slug) => ({
    path: `/${slug}`,
    changefreq: "monthly",
    priority: 0.7,
  })),
];

const buildUrlTag = ({ path: routePath, changefreq, priority }) => {
  const loc = `${SITE_URL}${routePath === "/" ? "" : routePath}`;
  const lastmod = new Date().toISOString();

  return [
    "  <url>",
    `    <loc>${loc}</loc>`,
    `    <lastmod>${lastmod}</lastmod>`,
    `    <changefreq>${changefreq}</changefreq>`,
    `    <priority>${priority.toFixed(1)}</priority>`,
    "  </url>",
  ].join("\n");
};

const generateSitemapXml = (routes) => {
  const urlset = routes
    .sort((a, b) => a.path.localeCompare(b.path))
    .map(buildUrlTag)
    .join("\n");

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    urlset,
    "</urlset>",
    "",
  ].join("\n");
};

const run = async () => {
  const xml = generateSitemapXml(routes);
  await fs.writeFile(OUTPUT_PATH, xml, "utf8");
  console.log(`Sitemap generated: ${OUTPUT_PATH}`);
  console.log(`Total URLs: ${routes.length}`);
};

run().catch((error) => {
  console.error("Failed to generate sitemap:", error);
  process.exit(1);
});
