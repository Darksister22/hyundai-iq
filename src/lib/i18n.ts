export type Locale = "en" | "ar";

const dictionaries = {
  en: () => import("../dictionaries/en.json").then((m) => m.default),
  ar: () => import("../dictionaries/ar.json").then((m) => m.default),
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
