import stringsData from './strings.json';
import routesData from './routes.json';
import { defaultLang, LANGS } from './config';
import type { TranslationEntry, TranslationList, Lang } from './types';
const base = import.meta.env.BASE_URL;

export { LANGS, defaultLang };

// keys across any language entry in i18n/routes.json
export type UiKey = keyof typeof stringsData;
export type RouteKey = keyof typeof routesData;

export function getLangStaticPaths() {
  return LANGS.map((lang) => ({ params: { lang } }));
}

export function getLangFromUrl(url: URL) {
  const [, lang] = url.pathname.split('/');
  if (typeof lang === 'string' && LANGS.includes(lang as Lang)) return lang as Lang;
  return defaultLang;
}

export function getTranslationFunction(langUrl: Lang) {
  return function t(key: UiKey|TranslationEntry, lang: Lang = langUrl): string {
    if (typeof key === 'object') { // TranslationEntry
      return (
        key[lang] ??
        key[defaultLang] ??
        ''
      );
    }
    const entry = stringsData[key as keyof typeof stringsData];

    return (
      entry?.[lang] ??
      entry?.[defaultLang] ??
      (key as unknown as string)
    );
  };
}

export function getTranslationListFunction(langUrl: Lang) {
  return function tl(list: TranslationList, lang: Lang = langUrl): string[] {
    return (
      list[lang] ??
      list[defaultLang] ??
      []
    );
  };
}

export function getUrlFromRoute(langUrl: Lang) {
  return function url(key: RouteKey, lang: Lang = langUrl) {
    const page = routesData[key]?.[lang] ?? routesData[key]?.[defaultLang as Lang];
    return `${base}${lang}/${page}`;
  }
}

export function getUrlFromPath(langUrl: Lang) {
  return function urlFromPath(path: string, lang: Lang = langUrl) {
    const normalized = path.replace(/^\/+/, '');
    return normalized ? `${base}${lang}/${normalized}` : `${base}${lang}/`;
  };
}

export function getRouteFromUrl(langUrl: Lang) {
  return function route(slug: string, lang: Lang = langUrl) {
    // reverse lookup
    const entry = Object.entries(routesData).find(([, value]) => value[lang] === slug);
    if (entry) {
      return entry[0] as RouteKey;
    }
    return undefined;
  }
}
