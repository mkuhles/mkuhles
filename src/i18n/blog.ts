import type { Lang } from "./types";

export function langFromSlug(slug: string): Lang | null {
  const prefix = slug.split("/")[1];
  if (prefix === "de" || prefix === "en") return prefix;
  return null;
}

export function normalizeSlug(slug: string, lang: string): string {
  return slug.endsWith(`/${lang}`)
    ? slug.slice(0,slug.length - lang.length - 1)
    : slug;
}

export function postUrl(slug: string, lang: string): string {
  return `/${lang}/blog/${normalizeSlug(slug, lang)}`;
}
