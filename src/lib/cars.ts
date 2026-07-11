import { supabase } from "./supabase";
import type { Locale } from "./i18n";

// ── Row shapes (subset of schema.sql) ──

export interface CategoryRow {
  id: number;
  name_ar: string | null;
  name_en: string;
  name_ku: string | null;
  sort_order: number;
}

export interface SpinColor {
  id: number;
  sort_order: number;
  color_hex: string | null;
  color_name_ar: string | null;
  color_name_en: string | null;
  color_name_ku: string | null;
  frames: string[]; // ordered by frame_index
}

export interface CarRow {
  id: string;
  slug: string;
  sort_order: number;
  name_ar: string | null;
  name_en: string;
  name_ku: string | null;
  category_id: number | null;

  hero_image: string | null;
  overview_tagline_ar: string | null;
  overview_tagline_en: string | null;
  overview_tagline_ku: string | null;

  max_power_ar: string | null;
  max_power_en: string | null;
  max_power_ku: string | null;
  max_torque_ar: string | null;
  max_torque_en: string | null;
  max_torque_ku: string | null;
  engine_ar: string | null;
  engine_en: string | null;
  engine_ku: string | null;

  spinColors: SpinColor[];
}

// ── Trilingual fallback: active locale → English ──
// ── Trilingual fallback: active locale → English ──
export function pickLang(
  row: object,
  base: string,
  locale: Locale
): string {
  const r = row as Record<string, string | null | undefined>;
  const get = (l: string) => r[`${base}_${l}`];
  const active = locale === "ar" ? get("ar") : get("en");
  return (active && active.trim()) || get("en") || "";
}
// ── Fetchers ──

export async function getCategories(): Promise<CategoryRow[]> {
  const { data, error } = await supabase
    .from("categories")
    .select("id, name_ar, name_en, name_ku, sort_order")
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Failed to fetch categories:", error.message);
    return [];
  }
  return data ?? [];
}

export async function getCars(): Promise<CarRow[]> {
  const { data, error } = await supabase
    .from("cars")
    .select(
      `
      id, slug, sort_order,
      name_ar, name_en, name_ku,
      category_id, hero_image,
      overview_tagline_ar, overview_tagline_en, overview_tagline_ku,
      max_power_ar, max_power_en, max_power_ku,
      max_torque_ar, max_torque_en, max_torque_ku,
      engine_ar, engine_en, engine_ku,
      visualizer_spin_colors (
        id, sort_order, color_hex,
        color_name_ar, color_name_en, color_name_ku,
        visualizer_spin_frames ( frame_index, image )
      )
    `
    )
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Failed to fetch cars:", error.message);
    return [];
  }

  // flatten nested spin frames into an ordered string[]
  return (data ?? []).map((car: Record<string, unknown>) => {
    const rawColors =
      (car.visualizer_spin_colors as Record<string, unknown>[] | null) ?? [];

    const spinColors: SpinColor[] = rawColors
      .slice()
      .sort(
        (a, b) => (a.sort_order as number) - (b.sort_order as number)
      )
      .map((c) => {
        const rawFrames =
          (c.visualizer_spin_frames as
            | { frame_index: number; image: string | null }[]
            | null) ?? [];
        return {
          id: c.id as number,
          sort_order: c.sort_order as number,
          color_hex: c.color_hex as string | null,
          color_name_ar: c.color_name_ar as string | null,
          color_name_en: c.color_name_en as string | null,
          color_name_ku: c.color_name_ku as string | null,
          frames: rawFrames
            .slice()
            .sort((a, b) => a.frame_index - b.frame_index)
            .map((f) => f.image)
            .filter((img): img is string => Boolean(img)),
        };
      });

    return { ...(car as unknown as CarRow), spinColors };
  });
}

// cover image: first frame of first spin color, else hero image
export function coverImage(car: CarRow): string | null {
  return car.spinColors[0]?.frames[0] ?? car.hero_image ?? null;
}

// state 3 only allowed when a spinner exists
export function hasSpinner(car: CarRow): boolean {
  return (car.spinColors[0]?.frames.length ?? 0) > 0;
}