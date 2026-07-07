export type Locale = "en" | "ar";

// single source of truth for the dictionary shape
type Dictionary = typeof import("../dictionaries/en.json");

const dictionaries: Record<Locale, () => Promise<Dictionary>> = {
  en: () => import("../dictionaries/en.json").then((m) => m.default),
  ar: () => import("../dictionaries/ar.json").then((m) => m.default as unknown as Dictionary),
};

export const locales: Locale[] = ["en", "ar"];
export const defaultLocale: Locale = "ar";

export function isValidLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}

export const getDictionary = (locale: Locale) =>
  dictionaries[isValidLocale(locale) ? locale : defaultLocale]();

export function getDirection(locale: Locale): "rtl" | "ltr" {
  return locale === "ar" ? "rtl" : "ltr";
}