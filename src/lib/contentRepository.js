import { defaultPortfolioContent } from "../data/defaultPortfolioContent";
import { isSupabaseConfigured, supabase } from "./supabaseClient";

const parseTags = (value) => {
  if (Array.isArray(value))
    return value.map((t) => String(t).trim()).filter(Boolean);
  if (typeof value === "string")
    return value
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
  return [];
};

const hasRenderableValue = (value) => {
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === "string") return value.trim().length > 0;
  return Boolean(value);
};

const hasRenderableEntryData = (entry) => {
  return Object.entries(entry)
    .filter(([key]) => key !== "id")
    .some(([, value]) => hasRenderableValue(value));
};

const sectionParsers = {
  aboutParagraphs: (entry) => ({
    id: entry.id,
    text: String(entry.data?.text ?? ""),
  }),
  aboutStats: (entry) => ({
    id: entry.id,
    value: String(entry.data?.value ?? ""),
    label: String(entry.data?.label ?? ""),
  }),
  aboutHighlights: (entry) => ({
    id: entry.id,
    icon: String(entry.data?.icon ?? ""),
    title: String(entry.data?.title ?? ""),
    text: String(entry.data?.text ?? ""),
    linkLabel: String(entry.data?.linkLabel ?? ""),
    linkUrl: String(entry.data?.linkUrl ?? ""),
  }),
  skills: (entry) => ({
    id: entry.id,
    icon: String(entry.data?.icon ?? ""),
    title: String(entry.data?.title ?? ""),
    tags: parseTags(entry.data?.tags),
  }),
  projects: (entry) => ({
    id: entry.id,
    title: String(entry.data?.title ?? ""),
    description: String(entry.data?.description ?? ""),
    tech: parseTags(entry.data?.tech),
    liveUrl: String(entry.data?.liveUrl ?? "#"),
    githubUrl: String(entry.data?.githubUrl ?? "#"),
  }),
  photoSlides: (entry) => ({
    id: entry.id,
    label: String(entry.data?.label ?? ""),
    image: String(entry.data?.image ?? ""),
  }),
  events: (entry) => ({
    id: entry.id,
    year: String(entry.data?.year ?? ""),
    title: String(entry.data?.title ?? ""),
    org: String(entry.data?.org ?? ""),
    role: String(entry.data?.role ?? ""),
  }),
  experience: (entry) => ({
    id: entry.id,
    title: String(entry.data?.title ?? ""),
    role: String(entry.data?.role ?? ""),
    subtitle: String(entry.data?.subtitle ?? ""),
    description: String(entry.data?.description ?? ""),
  }),
  education: (entry) => ({
    id: entry.id,
    period: String(entry.data?.period ?? ""),
    title: String(entry.data?.title ?? ""),
    subtitle: String(entry.data?.subtitle ?? ""),
    description: String(entry.data?.description ?? ""),
  }),
};

export const portfolioSections = Object.keys(sectionParsers);

const emptyGrouped = () =>
  portfolioSections.reduce((acc, key) => {
    acc[key] = [];
    return acc;
  }, {});

export const transformEntriesToContent = (entries) => {
  const grouped = emptyGrouped();

  entries.forEach((entry) => {
    const parser = sectionParsers[entry.section];
    if (!parser) return;
    const parsed = parser(entry);
    if (!hasRenderableEntryData(parsed)) return;
    grouped[entry.section].push(parsed);
  });

  const merged = { ...defaultPortfolioContent };
  portfolioSections.forEach((section) => {
    if (grouped[section].length > 0) merged[section] = grouped[section];
  });
  return merged;
};

export const fetchContentEntries = async () => {
  if (!isSupabaseConfigured) {
    return { data: [], error: null };
  }

  const { data, error } = await supabase
    .from("content_entries")
    .select("id, section, sort_order, data")
    .order("section", { ascending: true })
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  return { data: data ?? [], error };
};

export const fallbackContent = defaultPortfolioContent;
