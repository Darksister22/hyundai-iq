// lib/model-detail-data.ts
// Server-side data layer for the model detail page.
// Fetches one car with ALL its child collections in a single nested
// Supabase query and adapts the result into the existing VehicleModel
// shape, so the section components keep working unchanged.
// Kurdish columns are skipped because the public site is ar/en only.

import { supabase } from "@/lib/supabase";
import type {
  VehicleModel,
  OverviewStat,
  FeatureCard,
  CaptionedImage,
  ColorOption,
  InteriorOption,
  DesignRow,
  PerfStat,
} from "@/lib/models-data";
import type { Locale } from "@/lib/i18n";

/** VehicleModel plus the CMS visibility flags — sections are shown/hidden
    purely by these flags; empty data renders as a skeleton, not hidden */
export interface CarDetail extends VehicleModel {
  brochureUrl: string | null;
  featHero: boolean;
  featOverview: boolean;
  featHighlights: boolean;
  featDesign: boolean;
  featAdditional: boolean;
  featVisualizer: boolean;
  featPerformance: boolean;
  featSafety: boolean;
  featConvenience: boolean;
  featGallery: boolean;
}

// ── nested row shapes returned by PostgREST ─────────────────────────
interface LabelRow {
  label_ar: string | null;
  label_en: string | null;
}
interface HighlightRow {
  sort_order: number;
  title_ar: string | null;
  title_en: string | null;
  description_ar: string | null;
  description_en: string | null;
  image: string | null;
}
interface DesignCardRow {
  kind: "exterior" | "interior";
  sort_order: number;
  caption_ar: string | null;
  caption_en: string | null;
  image: string | null;
}
interface AdditionalItemRow {
  sort_order: number;
  label_ar: string | null;
  label_en: string | null;
  image: string | null;
}
interface SafetyConvRow {
  sort_order: number;
  title_ar: string | null;
  title_en: string | null;
  description_ar: string | null;
  description_en: string | null;
  image: string | null;
}
interface GalleryRow {
  sort_order: number;
  image: string | null;
}
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
interface Color360Row {
  sort_order: number;
  color_hex: string | null;
  color_name_ar: string | null;
  color_name_en: string | null;
  image: string | null;
}

const bySort = <T extends { sort_order: number }>(rows: T[] | null | undefined): T[] =>
  (rows ?? []).slice().sort((a, b) => a.sort_order - b.sort_order);

/** All slugs, for generateStaticParams. */
export async function getAllCarSlugs(): Promise<string[]> {
  const { data, error } = await supabase.from("cars").select("slug");
  if (error) {
    console.error("[model-detail-data] slugs fetch failed:", error.message);
    return [];
  }
  return (data ?? []).map((r) => r.slug);
}

/**
 * Fetches one car by slug with every child collection, adapted to the
 * VehicleModel shape. `locale` is needed because stat VALUES (seating,
 * power, etc.) are stored per-language in the DB but VehicleModel keeps
 * a single value string per stat.
 * Returns null when the slug doesn't exist (→ notFound()).
 */
export async function getCarBySlug(
  slug: string,
  locale: Locale
): Promise<CarDetail | null> {
  const isAr = locale === "ar";
  /** localized value with EN fallback */
  const loc = (ar: string | null, en: string | null): string =>
    (isAr ? ar ?? en : en) ?? "";
  /** Arabic field with English fallback — so a missing translation shows
      the English text on the Arabic site instead of an empty string */
  const arf = (ar: string | null | undefined, en: string | null | undefined): string =>
    ar ?? en ?? "";

  const { data: c, error } = await supabase
    .from("cars")
    .select(
      `
      id, slug, name_ar, name_en,brochure_url,
      feat_hero, feat_overview, feat_highlights, feat_design, feat_additional,
      feat_visualizer, feat_performance, feat_safety, feat_convenience, feat_gallery,
      hero_image, hero_headline_ar, hero_headline_en,
      overview_headline_ar, overview_headline_en,
      overview_tagline_ar, overview_tagline_en,
      engine_ar, engine_en,
      max_power_ar, max_power_en,
      max_torque_ar, max_torque_en,
      design_title_ar, design_title_en, design_hero_image,
      additional_design_heading_ar, additional_design_heading_en,
      perf_hero_image, transmission_ar, transmission_en,
      accel_0_100_ar, accel_0_100_en, perf_closing_image,
      safety_heading_ar, safety_heading_en,
      convenience_heading_ar, convenience_heading_en, convenience_image,
      seating:seating_options ( label_ar, label_en ),
      drive:drive_options ( label_ar, label_en ),
      highlight_cards ( sort_order, title_ar, title_en, description_ar, description_en, image ),
      design_cards ( kind, sort_order, caption_ar, caption_en, image ),
      additional_design_items ( sort_order, label_ar, label_en, image ),
      safety_cards ( sort_order, title_ar, title_en, description_ar, description_en, image ),
      convenience_cards ( sort_order, title_ar, title_en, description_ar, description_en, image ),
      gallery_images ( sort_order, image ),
      visualizer_spin_colors (
        sort_order, color_hex, color_name_ar, color_name_en,
        frames:visualizer_spin_frames ( frame_index, image )
      ),
      visualizer_360_colors ( sort_order, color_hex, color_name_ar, color_name_en, image )
    `
    )
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    console.error("[model-detail-data] car fetch failed:", error.message);
    return null;
  }
  if (!c) return null;

  const seating = (c.seating as unknown as LabelRow | null) ?? null;
  const drive = (c.drive as unknown as LabelRow | null) ?? null;

  // ── OVERVIEW stats: Max Power / Max Torque / Seating / Drive ──────
  // Labels aren't stored in the DB — same wording the site used before.
  const overviewStats: OverviewStat[] = [
    { labelEn: "Max Power", labelAr: "القوة القصوى", value: loc(c.max_power_ar, c.max_power_en) },
    { labelEn: "Max Torque", labelAr: "عزم الدوران", value: loc(c.max_torque_ar, c.max_torque_en) },
    { labelEn: "Seating", labelAr: "المقاعد", value: loc(seating?.label_ar ?? null, seating?.label_en ?? null) },
    { labelEn: "Drive", labelAr: "الدفع", value: loc(drive?.label_ar ?? null, drive?.label_en ?? null) },
  ].filter((s) => s.value !== "");

  // ── PERFORMANCE stats: Max Power / Max Torque / Transmission / 0-100 ──
  const perfStats: PerfStat[] = [
    { labelEn: "Max Power", labelAr: "القوة القصوى", value: loc(c.max_power_ar, c.max_power_en) },
    { labelEn: "Max Torque", labelAr: "عزم الدوران", value: loc(c.max_torque_ar, c.max_torque_en) },
    { labelEn: "Transmission", labelAr: "ناقل الحركة", value: loc(c.transmission_ar, c.transmission_en) },
    { labelEn: "0-100 kph", labelAr: "٠-١٠٠ كم/س", value: loc(c.accel_0_100_ar, c.accel_0_100_en) },
  ].filter((s) => s.value !== "");

  // ── collections — always mapped; feat_* flags control visibility
  //    in the client, so empty sections can render as skeletons ─────
  const highlights: FeatureCard[] = bySort(
    c.highlight_cards as unknown as HighlightRow[]
  ).map((h) => ({
        // no category column in the DB → chip simply doesn't render
        titleEn: h.title_en ?? "",
        titleAr: arf(h.title_ar, h.title_en),
        descEn: h.description_en ?? "",
        descAr: arf(h.description_ar, h.description_en),
        image: h.image ?? "",
      }));

  const designCards = bySort(c.design_cards as unknown as DesignCardRow[]);
  const toCaptioned = (kind: "exterior" | "interior"): CaptionedImage[] =>
    designCards
      .filter((d) => d.kind === kind)
      .map((d) => ({
        image: d.image ?? "",
        captionEn: d.caption_en ?? "",
        captionAr: arf(d.caption_ar, d.caption_en),
      }));

  // NOTE: additional_design_items has label + image but NO title columns,
  // while the section renders label (small) + title (big). The label goes
  // into the big title slot; the small label line renders empty. If you
  // want both, that's an ALTER TABLE + CMS form field — separate task.
  const additionalRows: DesignRow[] = bySort(
    c.additional_design_items as unknown as AdditionalItemRow[]
  ).map((r) => ({
    labelEn: "",
    labelAr: "",
    titleEn: r.label_en ?? "",
    titleAr: arf(r.label_ar, r.label_en),
    image: r.image ?? "",
  }));

  const toFeatureCards = (rows: SafetyConvRow[] | null): FeatureCard[] =>
    bySort(rows).map((r) => ({
      titleEn: r.title_en ?? "",
      titleAr: arf(r.title_ar, r.title_en),
      descEn: r.description_en ?? "",
      descAr: arf(r.description_ar, r.description_en),
      image: r.image ?? "",
    }));

  const colors: ColorOption[] = bySort(
    c.visualizer_spin_colors as unknown as SpinColorRow[]
  )
        .map((col) => ({
          nameEn: col.color_name_en ?? "",
          nameAr: arf(col.color_name_ar, col.color_name_en),
          hex: col.color_hex ?? "#9A9C9E",
          gradient: "", // no gradient column — stageBackground() falls back to hex
          spinFrames: (col.frames ?? [])
            .slice()
            .sort((a, b) => a.frame_index - b.frame_index)
            .map((f) => f.image)
            .filter((img): img is string => !!img),
        }))
        .filter((col) => col.spinFrames.length > 0);

  const interiorColors: InteriorOption[] = bySort(
    c.visualizer_360_colors as unknown as Color360Row[]
  )
        .filter((r) => !!r.image)
        .map((r) => ({
          nameEn: r.color_name_en ?? "",
          nameAr: arf(r.color_name_ar, r.color_name_en),
          hex: r.color_hex ?? "#cccccc",
          panorama: r.image as string,
        }));

  const gallery: string[] = bySort(c.gallery_images as unknown as GalleryRow[])
    .map((g) => g.image)
    .filter((img): img is string => !!img);

  return {
    slug: c.slug,
    nameEn: c.name_en,
    nameAr: c.name_ar ?? c.name_en,
    category: "sedan", // legacy field, unused by the detail page
    hero: c.hero_image ?? "",
    heroHeadlineEn: c.hero_headline_en ?? "",
    heroHeadlineAr: arf(c.hero_headline_ar, c.hero_headline_en),
    overview: {
      headlineEn: c.overview_headline_en ?? "",
      headlineAr: arf(c.overview_headline_ar, c.overview_headline_en),
      taglineEn: c.overview_tagline_en ?? "",
      taglineAr: arf(c.overview_tagline_ar, c.overview_tagline_en),
      engineEn: c.engine_en ?? "",
      engineAr: arf(c.engine_ar, c.engine_en),
      stats: overviewStats,
    },
    highlights,
    design: {
      headingEn: c.design_title_en ?? "",
      headingAr: arf(c.design_title_ar, c.design_title_en),
      heroImage: c.design_hero_image ?? "",
      exterior: toCaptioned("exterior"),
      interior: toCaptioned("interior"),
    },
    additionalDesign: {
      headingEn: c.additional_design_heading_en ?? "",
      headingAr: arf(c.additional_design_heading_ar, c.additional_design_heading_en),
      rows: additionalRows,
    },
    visualizer: {
      colors,
      interiorColors,
    },
    performance: {
      heroImage: c.perf_hero_image ?? "",
      engineEn: c.engine_en ?? "",
      engineAr: arf(c.engine_ar, c.engine_en),
      stats: perfStats,
      closingImage: c.perf_closing_image ?? "",
    },
    safety: {
      headingEn: c.safety_heading_en ?? "",
      headingAr: arf(c.safety_heading_ar, c.safety_heading_en),
      cards: toFeatureCards(c.safety_cards as unknown as SafetyConvRow[]),
    },
    convenience: {
      headingEn: c.convenience_heading_en ?? "",
      headingAr: arf(c.convenience_heading_ar, c.convenience_heading_en),
      bgImage: c.convenience_image ?? "",
      cards: toFeatureCards(c.convenience_cards as unknown as SafetyConvRow[]),
    },
    gallery,
    brochureUrl: c.brochure_url ?? null,
    featHero: c.feat_hero,
    featOverview: c.feat_overview,
    featHighlights: c.feat_highlights,
    featDesign: c.feat_design,
    featAdditional: c.feat_additional,
    featVisualizer: c.feat_visualizer,
    featPerformance: c.feat_performance,
    featSafety: c.feat_safety,
    featConvenience: c.feat_convenience,
    featGallery: c.feat_gallery,
  };
}