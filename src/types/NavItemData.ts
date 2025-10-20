import type { Language } from "./Language";

export interface NavItemData extends Record<Language["key"], { title: string, href: string }> {}