import { LANGS } from "./config";

export type Lang = typeof LANGS[number];

export type TranslationEntryOf<T> = Record<Lang, T>;

export type TranslationEntry = TranslationEntryOf<string>;
export type TranslationList = TranslationEntryOf<string[]>;