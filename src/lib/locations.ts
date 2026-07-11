import { supabase } from "./supabase";
import type { Locale } from "./i18n";

export interface LocationRow {
  id: string;
  sort_order: number;
  province: string | null;
  city_ar: string | null;
  city_en: string | null;
  city_ku: string | null;
  landmark_ar: string | null;
  landmark_en: string | null;
  landmark_ku: string | null;
  map_url: string | null;
}

export async function getLocations(): Promise<LocationRow[]> {
  const { data, error } = await supabase
    .from("locations")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Failed to fetch locations:", error.message);
    return [];
  }
  return data ?? [];
}

// pick the field for the active locale; fall back to English if null/empty
export function localized(
  row: LocationRow,
  field: "city" | "landmark",
  locale: Locale
): string {
  const pick = (l: "ar" | "en" | "ku") =>
    row[`${field}_${l}` as keyof LocationRow] as string | null;

  // UI locale is en/ar; data may also hold ku. Try active locale, then English.
  const active = locale === "ar" ? pick("ar") : pick("en");
  return (active && active.trim()) || pick("en") || "";
}