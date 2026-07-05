"use client";

import { useEffect, useRef, useState } from "react";
import type { Locale } from "@/lib/i18n";
import type { VehicleModel } from "@/lib/models-data";

interface Props {
  locale: Locale;
  model: VehicleModel;
}

export default function AdditionalDesignSection({ locale, model }: Props) {
  const isAr = locale === "ar";
  const rows = model.additionalDesign.rows;
  const [active, setActive] = useState(0);
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);

  // scroll-spy: track which text row is centered → swap the pinned image
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = Number(entry.target.getAttribute("data-row"));
            setActive(idx);
          }
        });
      },
      { rootMargin: "-50% 0px -50% 0px" }
    );
    rowRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section className="bg-white py-20">
      <div className="max-w-[1400px] mx-auto px-8">
        <p className="text-sm text-gray-400 mb-2">
          {isAr ? "تصميم إضافي" : "Additional Design"}
        </p>
        <h2 className="text-3xl md:text-5xl font-bold text-[#111] mb-16 max-w-3xl">
          {isAr
            ? model.additionalDesign.headingAr
            : model.additionalDesign.headingEn}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* pinned image column — swaps with crossfade */}
          <div className="hidden md:block">
            <div className="sticky top-40 h-[500px] rounded-lg overflow-hidden">
              {rows.map((row, i) => (
                <div
                  key={i}
                  className={`absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center text-xs text-gray-400 transition-opacity duration-500 ${
                    active === i ? "opacity-100" : "opacity-0"
                  }`}
                >
                  {row.labelEn} image
                </div>
              ))}
            </div>
          </div>

          {/* scrolling text rows */}
          <div>
            {rows.map((row, i) => (
              <div
                key={i}
                data-row={i}
                ref={(el) => {
                  rowRefs.current[i] = el;
                }}
                className="min-h-[60svh] flex flex-col justify-center"
              >
                {/* image shown inline on mobile only */}
                <div className="md:hidden h-72 rounded-lg overflow-hidden mb-6 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center text-xs text-gray-400">
                  {row.labelEn} image
                </div>
                <p className="text-sm text-gray-400 mb-3">
                  {isAr ? row.labelAr : row.labelEn}
                </p>
                <p className="text-2xl md:text-3xl font-bold text-[#111] leading-snug">
                  {isAr ? row.titleAr : row.titleEn}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
