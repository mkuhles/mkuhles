// src/utils/i18n.ts
export const LANGS = ["de", "en"] as const;

export function getLangStaticPaths() {
  return LANGS.map((lang) => ({ params: { lang } }));
}