"use client";

import type { Locale } from "@/lib/i18n";
import type { VehicleModel } from "@/lib/models-data";
import ModelSubNav, { SubNavSection } from "./model-sections/model-sub-nav";
import HeroSection from "./model-sections/hero-section";
import OverviewSection from "./model-sections/overview-section";
import HighlightsSection from "./model-sections/highlights-section";
import DesignSection from "./model-sections/design-section";
import AdditionalDesignSection from "./model-sections/additional-design-section";
import VisualizerSection from "./model-sections/visualizer-section";
import PerformanceSection from "./model-sections/performance-section";
import SafetySection from "./model-sections/safety-section";
import ConvenienceSection from "./model-sections/convenience-section";
import GallerySection from "./model-sections/gallery-section";

interface ModelDict {
  highlights: string;
  design: string;
  exterior: string;
  interior: string;
  performance: string;
  safety: string;
  convenience: string;
  gallery: string;
  overview: string;
  contact: string;
  requestCallback: string;
  view360: string;
  colors: string;
  whichColor: string;
}

interface Props {
  locale: Locale;
  model: VehicleModel;
  dict: ModelDict;
}

export default function ModelDetailClient({ locale, model, dict }: Props) {
  const has = {
    highlights: model.highlights.length > 0,
    design: model.design.exterior.length > 0,
    additional: model.additionalDesign.rows.length > 0,
    visualizer: model.visualizer.colors.length > 0,
    performance: model.performance.stats.length > 0,
    safety: model.safety.cards.length > 0,
    convenience: model.convenience.cards.length > 0,
    gallery: model.gallery.length > 0,
  };

  const sections: SubNavSection[] = (
    [
      { id: "overview", label: dict.overview, on: true },
      { id: "highlights", label: dict.highlights, on: has.highlights },
      { id: "design", label: dict.design, on: has.design },
      { id: "visualizer", label: dict.view360, on: has.visualizer },
      { id: "performance", label: dict.performance, on: has.performance },
      { id: "safety", label: dict.safety, on: has.safety },
      { id: "convenience", label: dict.convenience, on: has.convenience },
      { id: "gallery", label: dict.gallery, on: has.gallery },
    ] as const
  )
    .filter((s) => s.on)
    .map(({ id, label }) => ({ id, label }));

  return (
    <div>
      <HeroSection locale={locale} model={model} />

      <ModelSubNav
        locale={locale}
        modelName={locale === "ar" ? model.nameAr : model.nameEn}
        sections={sections}
        contactLabel={dict.contact}
      />

      <OverviewSection locale={locale} model={model} />

      {has.highlights && (
        <HighlightsSection locale={locale} model={model} heading={dict.highlights} />
      )}

      {has.design && (
        <DesignSection
          locale={locale}
          model={model}
          exteriorLabel={dict.exterior}
          interiorLabel={dict.interior}
        />
      )}

      {has.additional && (
        <AdditionalDesignSection locale={locale} model={model} />
      )}

      {has.visualizer && (
        <VisualizerSection
          locale={locale}
          model={model}
          exteriorLabel={dict.exterior}
          interiorLabel={dict.interior}
          whichColor={dict.whichColor}
        />
      )}

      {has.performance && (
        <PerformanceSection locale={locale} model={model} heading={dict.performance} />
      )}

      {has.safety && <SafetySection locale={locale} model={model} />}

      {has.convenience && <ConvenienceSection locale={locale} model={model} />}

      {has.gallery && (
        <GallerySection locale={locale} model={model} heading={dict.gallery} />
      )}
    </div>
  );
}
