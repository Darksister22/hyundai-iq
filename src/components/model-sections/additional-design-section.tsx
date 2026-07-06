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
  const containerRef = useRef<HTMLElement>(null); // observe all [data-row] within

  // scroll-spy across BOTH layouts; only the visible one has laid-out rows
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(Number(e.target.getAttribute("data-row")));
        });
      },
      { rootMargin: "-50% 0px -50% 0px" }
    );
    // query the DOM instead of a shared ref array → no index collisions
    const els = containerRef.current?.querySelectorAll("[data-row]") ?? [];
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const imageLayers = (
    <>
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
    </>
  );

  return (
    <section ref={containerRef} className="bg-white py-20">
      <div className="max-w-[1400px] mx-auto px-8">
        <p className="text-sm text-gray-400 mb-2">
          {isAr ? "تصميم إضافي" : "Additional Design"}
        </p>
        <h2 className="text-3xl md:text-5xl font-bold text-[#111] mb-16 max-w-3xl">
          {isAr ? model.additionalDesign.headingAr : model.additionalDesign.headingEn}
        </h2>

        {/* MOBILE: sticky image on top, text scrolls beneath */}
        <div className="md:hidden">
          <div className="sticky top-[72px] z-10 h-64 rounded-lg overflow-hidden mb-8 bg-white">
            {imageLayers}
          </div>
          <div>
            {rows.map((row, i) => (
              <div key={i} data-row={i} className="min-h-[30svh] flex flex-col justify-center">
                <p className="text-sm text-gray-400 mb-3">{isAr ? row.labelAr : row.labelEn}</p>
                <p className="text-2xl font-bold text-[#111] leading-snug">
                  {isAr ? row.titleAr : row.titleEn}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* DESKTOP: sticky image beside scrolling text */}
        <div className="hidden md:grid grid-cols-2 gap-12">
          <div>
            <div className="sticky top-40 h-[500px] rounded-lg overflow-hidden">
              {imageLayers}
            </div>
          </div>
          <div>
            {rows.map((row, i) => (
              <div key={i} data-row={i} className="min-h-[60svh] flex flex-col justify-center">
                <p className="text-sm text-gray-400 mb-3">{isAr ? row.labelAr : row.labelEn}</p>
                <p className="text-3xl font-bold text-[#111] leading-snug">
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