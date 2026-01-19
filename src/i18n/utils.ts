import { ui, defaultLang } from './ui';
import { routes } from './routes';

type UiLang = keyof typeof ui;
type RoutesLang = keyof typeof routes;

// keys across any language entry in ui/routes
type UiKey = keyof (typeof ui)[UiLang];
type RouteKey = keyof (typeof routes)[RoutesLang];

export function getLangFromUrl(url: URL) {
  const [,, lang] = url.pathname.split('/');
  if (typeof lang === 'string' && lang in ui) return lang as UiLang;
  return defaultLang;
}

export function useTranslations(langUrl: UiLang) {
  return function t(key: UiKey, lang: UiLang = langUrl) {
    return (ui[lang]?.[key] ?? ui[defaultLang][key]);
  }
}

export function getUrlFromRoute(lang: RoutesLang) {
  return function url(key: RouteKey) {
    const page = routes[lang]?.[key] ?? routes[defaultLang][key];
    return `/${lang}/${page}`;
  }
}

export function getUrlFromPath(langUrl: RoutesLang) {
  return function urlFromPath(path: string, lang: RoutesLang = langUrl) {
    return `/${lang}/${path}`;
  }
}