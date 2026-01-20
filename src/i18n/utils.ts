import { ui, defaultLang } from './ui';
import { routes } from './routes';

type UiLang = keyof typeof ui;
type RoutesLang = keyof typeof routes;

// keys across any language entry in ui/routes
export type UiKey = keyof (typeof ui)[UiLang];
export type RouteKey = keyof (typeof routes)[RoutesLang];

export function getLangFromUrl(url: URL) {
  const [, lang] = url.pathname.split('/');
  if (typeof lang === 'string' && lang in ui) return lang as UiLang;
  return defaultLang;
}

export function useTranslations(langUrl: UiLang) {
  return function t(key: UiKey, lang: UiLang = langUrl) {
    return (ui[lang]?.[key] ?? ui[defaultLang][key]);
  }
}

export function getUrlFromRoute(langUrl: RoutesLang) {
  return function url(key: RouteKey, lang: RoutesLang = langUrl) {
    const page = routes[lang]?.[key] ?? routes[defaultLang][key];
    return `/${lang}/${page}`;
  }
}

export function getRouteFromUrl(langUrl: RoutesLang) {
  return function route(slug: string, lang: RoutesLang = langUrl) {
    // reverse lookup
    const entry = Object.entries(routes[lang]).find(([, value]) => value === slug);
    if (entry) {
      return entry[0] as RouteKey;
    }
    return 'home' as RouteKey;
  }
}