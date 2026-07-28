"use client";
import { useEffect, useRef, useState } from "react";
import type { Locale } from "@/lib/i18n";
import type { VehicleModel } from "@/lib/models-data";
import ImageWithLoader from "../loaders/loading-image";
interface Props {
  locale: Locale;
  model: VehicleModel;
}

export default function AdditionalDesignSection({ locale, model }: Props) {
  const isAr = locale === "ar";
  const rows = model.additionalDesign.rows;
  const [active, setActive] = useState(0);
  const containerRef = useRef<HTMLElement>(null);
  const mobileListRef = useRef<HTMLDivElement>(null);
  const desktopListRef = useRef<HTMLDivElement>(null);


  // Scroll-spy drives BOTH layouts' sticky image. Only the layout that's
  // visible at the current breakpoint has laid-out (intersecting) rows, so
  // the hidden one's [data-row] elements never fire.
  useEffect(() => {
    const pick = () => {
      const mid = window.innerHeight / 2;
      let best = 0;
      let bestDist = Infinity;

      const scan = (root: HTMLElement | null, attr: string) => {
        if (!root) return;
        root.querySelectorAll<HTMLElement>(`[${attr}]`).forEach((el) => {
          const r = el.getBoundingClientRect();
          if (r.height === 0) return; // hidden breakpoint — skip
          const dist = Math.abs(r.top + r.height / 2 - mid);
          if (dist < bestDist) {
            bestDist = dist;
            best = Number(el.dataset[attr === "data-mrow" ? "mrow" : "row"]);
          }
        });
      };

      scan(mobileListRef.current, "data-mrow");
      scan(desktopListRef.current, "data-row");
      setActive(best);
    };

    pick();
    window.addEventListener("scroll", pick, { passive: true });
    window.addEventListener("resize", pick);
    return () => {
      window.removeEventListener("scroll", pick);
      window.removeEventListener("resize", pick);
    };
  }, []);

  // Shared sliding image track: changing `active` translates the stack by one
  // container-height, so images scroll past instead of fading through white.
  const imageTrack = (
    <div className="absolute inset-0 overflow-hidden">
      <div
        className="h-full flex flex-col transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
        style={{ transform: `translateY(-${active * 100}%)` }}
      >
        {rows.map((row, i) => (
          <div key={i} className="relative h-full shrink-0">
            {row.image ? (
              <ImageWithLoader
                src={row.image}
                alt={isAr ? row.titleAr : row.titleEn}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center text-xs text-gray-400">
                {isAr ? row.titleAr : row.titleEn}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
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

        {/* MOBILE: sticky sliding image on top, captions scroll beneath */}
        <div className="md:hidden">
          <div className="sticky top-[72px] z-10 h-64 rounded-lg overflow-hidden mb-4">
            {imageTrack}
          </div>
          <div ref={mobileListRef}>
            {rows.map((row, i) => (
              <div
                key={i}
                data-mrow={i}
                className="min-h-[65svh] flex flex-col justify-center">
                <p className="text-sm text-gray-400 mb-3">{isAr ? row.labelAr : row.labelEn}</p>
                <p className="text-2xl font-bold text-[#111] leading-snug">
                  {isAr ? row.titleAr : row.titleEn}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* DESKTOP: sticky sliding image beside scrolling text */}
        <div className="hidden md:grid grid-cols-2 gap-12">
          <div>
            <div className="sticky top-40 h-[500px] rounded-lg overflow-hidden">
              {imageTrack}
            </div>
          </div>
          <div ref={desktopListRef}>
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