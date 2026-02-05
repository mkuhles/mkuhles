import type { TranslationEntry } from "../i18n/types";

export type ProjectLinks = {
  repo?: string;
  live?: string;
};

export type ProjectImage = {
  src: string;
  alt?: TranslationEntry;
};

export type Project = {
  key: string;
  title: TranslationEntry;
  shortDescription?: TranslationEntry;
  links: ProjectLinks;
  image?: ProjectImage;
  logo?: string;
};
