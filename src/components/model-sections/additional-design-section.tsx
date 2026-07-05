"use client";
import type { Locale } from "@/lib/i18n";
import type { VehicleModel } from "@/lib/models-data";
import ParallaxImage from "@/components/parallax-image";
import Reveal from "@/components/reveal";

interface Props {
  locale: Locale;
  model: VehicleModel;
}

export default function AdditionalDesignSection({ locale, model }: Props) {
  const isAr = locale === "ar";
  const rows = model.additionalDesign.rows;

  return (
    <section className="bg-white py-20">
      <div className="max-w-[1400px] mx-auto px-8">
        <Reveal>
          <p className="text-sm text-gray-400 mb-2">
            {isAr ? "تصميم إضافي" : "Additional Design"}
          </p>
        </Reveal>
        <Reveal>
          <h2 className="text-3xl md:text-5xl font-bold text-[#111] mb-16 max-w-3xl">
            {isAr ? model.additionalDesign.headingAr : model.additionalDesign.headingEn}
          </h2>
        </Reveal>

        {/* each row: image + text side by side, alternating sides — no sticky/slider */}
        <div className="space-y-16 md:space-y-24">
          {rows.map((row, i) => (
            <div
              key={i}
              className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center"
            >
              {/* image — parallax, alternates to the opposite side each row */}
              <ParallaxImage
                label={`${row.labelEn} image`}
                className={`h-72 md:h-[440px] rounded-lg ${i % 2 ? "md:order-last" : ""}`}
              />
              {/* text */}
              <Reveal>
                <p className="text-sm text-gray-400 mb-3">
                  {isAr ? row.labelAr : row.labelEn}
                </p>
                <p className="text-2xl md:text-3xl font-bold text-[#111] leading-snug">
                  {isAr ? row.titleAr : row.titleEn}
                </p>
              </Reveal>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}