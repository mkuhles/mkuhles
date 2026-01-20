import stringsData from './strings.json';
import routesData from './routes.json';
import { defaultLang, LANGS } from './config';

export { LANGS, defaultLang };

type UiLang = keyof typeof stringsData;
type RoutesLang = keyof typeof routesData;

// keys across any language entry in ui/routes
export type UiKey = keyof typeof stringsData[UiLang];
export type RouteKey = keyof typeof routesData[RoutesLang];

export function getLangStaticPaths() {
  return LANGS.map((lang) => ({ params: { lang } }));
}

export function getLangFromUrl(url: URL) {
  const [, lang] = url.pathname.split('/');
  if (typeof lang === 'string' && lang in stringsData) return lang as UiLang;
  return defaultLang;
}

export function useTranslations(langUrl: UiLang) {
  return function t(key: UiKey, lang: UiLang = langUrl) {
    const strings = stringsData[lang] || stringsData[defaultLang];
    return (strings[key as keyof typeof strings] ?? stringsData[defaultLang][key as keyof typeof stringsData[UiLang]]) as string;
  }
}

export function getUrlFromRoute(langUrl: RoutesLang) {
  return function url(key: RouteKey, lang: RoutesLang = langUrl) {
    const page = routesData[lang]?.[key] ?? routesData[defaultLang as RoutesLang][key];
    return `/${lang}/${page}`;
  }
}

export function getRouteFromUrl(langUrl: RoutesLang) {
  return function route(slug: string, lang: RoutesLang = langUrl) {
    // reverse lookup
    const entry = Object.entries(routesData[lang]).find(([, value]) => value === slug);
    if (entry) {
      return entry[0] as RouteKey;
    }
    return 'home' as RouteKey;
  }
}
