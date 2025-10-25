import { ui, defaultLang } from './ui';
import { routes } from './routes';

type UiLang = keyof typeof ui;
type RoutesLang = keyof typeof routes;

export function getLangFromUrl(url: URL) {
  const [,, lang] = url.pathname.split('/');
  if (lang in ui) return lang as UiLang;
  return defaultLang;
}

export function useTranslations(langUrl: UiLang) {
  return function t(key: UiLang[typeof defaultLang], lang: (UiLang) = langUrl) {
    return ui[lang][key] || ui[defaultLang][key];
  }
}

export function getUrlFromRoute(lang: RoutesLang) {
  return function url(key: RoutesLang[typeof defaultLang]) {
    lang = lang || defaultLang;
    const page = routes[lang][key] || routes[defaultLang][key];
    return "/mkuhles/" + lang + "/" + page;
  }
}

export function getUrlFromPath(langUrl: RoutesLang) {
  return function urlFromPath(path: string, lang: RoutesLang = langUrl) {
    lang = lang || defaultLang;
    return "/mkuhles/" + lang + "/" + path;
  }
}

export function getAllLanguages() {

}