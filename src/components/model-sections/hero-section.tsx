"use client";

import type { Locale } from "@/lib/i18n";
import type { VehicleModel } from "@/lib/models-data";

interface Props {
  locale: Locale;
  model: VehicleModel;
   onRequestPrice: () => void;
  onRequestTestDrive: () => void;
  priceLabel: string;
  testDriveLabel: string;
}

export default function HeroSection({
  locale,
  model,
  onRequestPrice,
  onRequestTestDrive,
  priceLabel,
  testDriveLabel,
}: Props) {
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
      <div className="absolute inset-x-0 bottom-[12%] flex flex-col items-center gap-6 px-6">
        <h1 className="text-white text-4xl md:text-5xl font-bold text-center drop-shadow-lg">
          {headline}
        </h1>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={onRequestPrice}
            className="px-6 py-3 bg-white text-[#002C5F] text-sm font-semibold hover:bg-white/90 transition-colors"
          >
            {priceLabel}
          </button>
          <button
            onClick={onRequestTestDrive}
            className="px-6 py-3 border border-white text-white text-sm font-semibold hover:bg-white hover:text-[#002C5F] transition-colors"
          >
            {testDriveLabel}
          </button>
        </div>
      </div>
    </section>
  );
}
