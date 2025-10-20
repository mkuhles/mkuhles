import type { Language } from './Language';

// base navigation entry (structure-only)
export interface NavEntry {
  id: string;       // e.g. "home"
  slug: string;     // default path or fallback
  // optional ordering or meta can be added here
}

// per-locale nav item
export interface LocaleNavItem {
  title: string;
  href: string;
  target?: string;
}

// the nav map for a single locale
export type LocaleNav = Record<string, LocaleNavItem>; // keys are NavEntry.id

// index of locales
export type LocalesIndex = Record<Language["key"], { nav: LocaleNav }>;