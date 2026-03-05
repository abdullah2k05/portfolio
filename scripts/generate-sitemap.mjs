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
const PAGES_DIR = path.join(rootDir, "src", "pages");

const staticRoutes = [{ path: "/", changefreq: "weekly", priority: 1.0 }];

const ignoredFiles = new Set(["_app.jsx", "_document.jsx", "404.jsx"]);

const pageExtensions = new Set([".js", ".jsx", ".ts", ".tsx"]);

const toRoutePath = (filePath) => {
  const relative = path.relative(PAGES_DIR, filePath);
  const ext = path.extname(relative);
  if (!pageExtensions.has(ext)) return null;

  const normalized = relative.replace(/\\/g, "/");
  const basename = path.basename(normalized);
  if (ignoredFiles.has(basename)) return null;

  if (/\[(?:\.\.\.)?[^\]]+\]/.test(normalized)) return null;

  let route = normalized.replace(ext, "");
  if (route.endsWith("/index")) route = route.slice(0, -6);
  if (!route.startsWith("/")) route = `/${route}`;
  if (route === "") route = "/";

  return route;
};

const walk = async (dirPath) => {
  const entries = await fs.readdir(dirPath, { withFileTypes: true });
  const results = [];

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);

    if (entry.isDirectory()) {
      results.push(...(await walk(fullPath)));
      continue;
    }

    results.push(fullPath);
  }

  return results;
};

const getPageRoutes = async () => {
  try {
    await fs.access(PAGES_DIR);
  } catch {
    return [];
  }

  const files = await walk(PAGES_DIR);
  return files
    .map(toRoutePath)
    .filter(Boolean)
    .map((route) => ({
      path: route,
      changefreq: "weekly",
      priority: route === "/" ? 1.0 : 0.7,
    }));
};

const buildUrlTag = ({ path: routePath, changefreq, priority }) => {
  const normalizedPath = routePath.startsWith("/")
    ? routePath
    : `/${routePath}`;
  const loc = `${SITE_URL}${normalizedPath === "/" ? "" : normalizedPath}`;
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
  const unique = new Map();

  for (const route of routes) {
    unique.set(route.path, route);
  }

  const urlset = [...unique.values()]
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
  const pageRoutes = await getPageRoutes();
  const allRoutes = [...staticRoutes, ...pageRoutes];
  const xml = generateSitemapXml(allRoutes);

  await fs.writeFile(OUTPUT_PATH, xml, "utf8");
  console.log(`Sitemap generated: ${OUTPUT_PATH}`);
  console.log(`Total URLs: ${allRoutes.length}`);
};

run().catch((error) => {
  console.error("Failed to generate sitemap:", error);
  process.exit(1);
});
