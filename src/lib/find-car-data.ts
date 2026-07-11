// lib/find-car-data.ts
// Server-side data layer for DB-driven car UI (Find a Car panel + homepage).
// Kurdish columns are skipped because the public site is ar/en only.

import { supabase } from "@/lib/supabase";

// ─────────────────────────────────────────────────────────────────────
// Find a Car panel
// ─────────────────────────────────────────────────────────────────────

export interface FindCarCategory {
  id: number;
  nameAr: string | null;
  nameEn: string;
  sortOrder: number;
}

export interface FindCarCar {
  id: string;
  slug: string;
  nameAr: string | null;
  nameEn: string;
  heroImage: string | null; // full public URL (may be null if not uploaded yet)
  categoryId: number | null;
  sortOrder: number;
}

export interface FindCarData {
  categories: FindCarCategory[];
  cars: FindCarCar[];
}

async function fetchCategories(): Promise<FindCarCategory[]> {
  const { data, error } = await supabase
    .from("categories")
    .select("id, name_ar, name_en, sort_order")
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("[find-car-data] categories fetch failed:", error.message);
    return [];
  }
  return (data ?? []).map((c) => ({
    id: c.id,
    nameAr: c.name_ar,
    nameEn: c.name_en,
    sortOrder: c.sort_order,
  }));
}

/**
 * Fetches everything the Find a Car panel needs.
 * Fails soft: on any error it logs and returns empty arrays so the
 * layout / site never crashes because of a DB hiccup.
 */
export async function getFindCarData(): Promise<FindCarData> {
  const [categories, carsRes] = await Promise.all([
    fetchCategories(),
    supabase
      .from("cars")
      .select("id, slug, name_ar, name_en, hero_image, category_id, sort_order")
      .order("sort_order", { ascending: true }),
  ]);

  if (carsRes.error) {
    console.error("[find-car-data] cars fetch failed:", carsRes.error.message);
  }

  const cars: FindCarCar[] = (carsRes.data ?? []).map((c) => ({
    id: c.id,
    slug: c.slug,
    nameAr: c.name_ar,
    nameEn: c.name_en,
    heroImage: c.hero_image,
    categoryId: c.category_id,
    sortOrder: c.sort_order,
  }));

  return { categories, cars };
}

// ─────────────────────────────────────────────────────────────────────
// Homepage model cards
// ─────────────────────────────────────────────────────────────────────

export interface HomeCarColor {
  hex: string | null;
  nameAr: string | null;
  nameEn: string | null;
  frames: string[]; // ordered by frame_index; only non-null images
}

export interface HomeCar {
  id: string;
  slug: string;
  nameAr: string | null;
  nameEn: string;
  heroImage: string | null;
  categoryId: number | null;
  sortOrder: number;
  maxPowerAr: string | null;
  maxPowerEn: string | null;
  maxTorqueAr: string | null;
  maxTorqueEn: string | null;
  seatingAr: string | null;
  seatingEn: string | null;
  /** Spin colors ordered by sort_order; colors with zero frames are dropped. */
  colors: HomeCarColor[];
}

// ─────────────────────────────────────────────────────────────────────
// Homepage hero banners
// ─────────────────────────────────────────────────────────────────────

export interface HeroBanner {
  id: string;
  titleAr: string | null;
  titleEn: string | null;
  taglineAr: string | null;
  taglineEn: string | null;
  mediaType: "image" | "video";
  mediaUrl: string | null;
  /** slug of the linked car, if any — drives the Explore button */
  carSlug: string | null;
  sortOrder: number;
}

export interface HomeData {
  categories: FindCarCategory[];
  cars: HomeCar[];
  banners: HeroBanner[];
}

// shapes of the nested rows PostgREST returns for the queries below
interface SpinFrameRow {
  frame_index: number;
  image: string | null;
}
interface SpinColorRow {
  sort_order: number;
  color_hex: string | null;
  color_name_ar: string | null;
  color_name_en: string | null;
  frames: SpinFrameRow[] | null;
}
interface SeatingRow {
  label_ar: string | null;
  label_en: string | null;
}
interface BannerCarRow {
  slug: string;
}

/**
 * Fetches everything the homepage needs: categories for the tabs,
 * cars with specs/seating/spin data for the model cards, and hero
 * banners with their linked car's slug.
 * Fails soft like getFindCarData.
 */
export async function getHomeData(): Promise<HomeData> {
  const [categories, carsRes, bannersRes] = await Promise.all([
    fetchCategories(),
    supabase
      .from("cars")
      .select(
        `
        id, slug, name_ar, name_en, hero_image, category_id, sort_order,
        max_power_ar, max_power_en, max_torque_ar, max_torque_en,
        seating:seating_options ( label_ar, label_en ),
        spin_colors:visualizer_spin_colors (
          sort_order, color_hex, color_name_ar, color_name_en,
          frames:visualizer_spin_frames ( frame_index, image )
        )
      `
      )
      .order("sort_order", { ascending: true }),
    supabase
      .from("banners")
      .select(
        `
        id, sort_order, title_ar, title_en, tagline_ar, tagline_en,
        media_type, media_url,
        car:cars ( slug )
      `
      )
      .order("sort_order", { ascending: true }),
  ]);

  if (carsRes.error) {
    console.error("[find-car-data] home cars fetch failed:", carsRes.error.message);
  }
  if (bannersRes.error) {
    console.error("[find-car-data] banners fetch failed:", bannersRes.error.message);
  }

  const cars: HomeCar[] = (carsRes.data ?? []).map((c) => {
    // PostgREST returns the FK embed as an object (or null)
    const seating = (c.seating as unknown as SeatingRow | null) ?? null;

    const colors: HomeCarColor[] = ((c.spin_colors as unknown as SpinColorRow[]) ?? [])
      // stable display order: colors by sort_order
      .slice()
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((col) => ({
        hex: col.color_hex,
        nameAr: col.color_name_ar,
        nameEn: col.color_name_en,
        frames: (col.frames ?? [])
          .slice()
          .sort((a, b) => a.frame_index - b.frame_index)
          .map((f) => f.image)
          .filter((img): img is string => !!img),
      }))
      // a color with no usable frames can't be shown in the spinner
      .filter((col) => col.frames.length > 0);

    return {
      id: c.id,
      slug: c.slug,
      nameAr: c.name_ar,
      nameEn: c.name_en,
      heroImage: c.hero_image,
      categoryId: c.category_id,
      sortOrder: c.sort_order,
      maxPowerAr: c.max_power_ar,
      maxPowerEn: c.max_power_en,
      maxTorqueAr: c.max_torque_ar,
      maxTorqueEn: c.max_torque_en,
      seatingAr: seating?.label_ar ?? null,
      seatingEn: seating?.label_en ?? null,
      colors,
    };
  });

  const banners: HeroBanner[] = (bannersRes.data ?? []).map((b) => {
    const car = (b.car as unknown as BannerCarRow | null) ?? null;
    return {
      id: b.id,
      titleAr: b.title_ar,
      titleEn: b.title_en,
      taglineAr: b.tagline_ar,
      taglineEn: b.tagline_en,
      mediaType: b.media_type === "video" ? "video" : "image",
      mediaUrl: b.media_url,
      carSlug: car?.slug ?? null,
      sortOrder: b.sort_order,
    };
  });

  return { categories, cars, banners };
}