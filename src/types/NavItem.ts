import type { RouteKey } from "../i18n/utils";

export interface NavEntry {
  id: RouteKey;       // e.g. "home"
  href?: string;
}
