"use client";

import type { Locale } from "@/lib/i18n";
import type { VehicleModel } from "@/lib/models-data";

interface Props {
  locale: Locale;
  model: VehicleModel;
}

export default function HeroSection({ locale, model }: Props) {
  const headline =
    locale === "ar" ? model.heroHeadlineAr : model.heroHeadlineEn;

  return (
<section className="relative h-[100svh] -mt-[72px] min-h-[560px] w-full overflow-hidden bg-gray-300">      {/* full-bleed exterior image */}
      {model.hero && (
        <img
          src={model.hero}
          alt={locale === "ar" ? model.nameAr : model.nameEn}
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}

      {/* dark gradient for text legibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

      {/* centered headline near bottom */}
      <div className="absolute inset-x-0 bottom-[12%] flex justify-center px-6">
        <h1 className="text-white text-4xl md:text-5xl font-bold text-center drop-shadow-lg">
          {headline}
        </h1>
      </div>
    </section>
  );
}
