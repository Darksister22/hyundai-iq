"use client";

import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import type { Locale } from "@/lib/i18n";
import type { VehicleModel } from "@/lib/models-data";

import "swiper/css";
import "swiper/css/navigation";

interface Props {
  locale: Locale;
  model: VehicleModel;
  exteriorLabel: string;
  interiorLabel: string;
}

export default function DesignSection({
  locale,
  model,
  exteriorLabel,
  interiorLabel,
}: Props) {
  const isAr = locale === "ar";
  const [tab, setTab] = useState<"exterior" | "interior">("exterior");
  const items =
    tab === "exterior" ? model.design.exterior : model.design.interior;

  return (
    <section id="design" className="bg-white scroll-mt-36">
      {/* centered design intro */}
      <div className="py-16 text-center">
        <p className="text-sm text-gray-400 mb-2">
          {isAr ? "التصميم" : "Design"}
        </p>
        <h2 className="text-3xl md:text-5xl font-bold text-[#111]">
          {isAr ? model.design.headingAr : model.design.headingEn}
        </h2>
      </div>

      {/* full-bleed design hero image */}
      <div className="h-[60vh] min-h-[400px] bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center text-gray-500 text-sm">
        Design hero image (full-bleed)
      </div>

      {/* exterior / interior toggle + gallery */}
      <div className="max-w-[1400px] mx-auto px-8 py-16">
        <div className="flex items-center gap-6 mb-10">
          <button
            onClick={() => setTab("exterior")}
            className={`text-3xl font-bold transition-colors ${
              tab === "exterior"
                ? "text-[#111] border-b-2 border-[#111] pb-1"
                : "text-gray-300"
            }`}
          >
            {exteriorLabel}
          </button>
          <button
            onClick={() => setTab("interior")}
            className={`text-3xl font-bold transition-colors ${
              tab === "interior"
                ? "text-[#111] border-b-2 border-[#111] pb-1"
                : "text-gray-300"
            }`}
          >
            {interiorLabel}
          </button>
        </div>

        <Swiper
          modules={[Navigation]}
          navigation
          spaceBetween={24}
          slidesPerView={1}
          breakpoints={{ 768: { slidesPerView: 2 } }}
          key={tab}
        >
          {items.map((item, i) => (
            <SwiperSlide key={i}>
              <div className="group">
                <div className="h-[420px] rounded-lg overflow-hidden mb-5">
                  <div className="h-full w-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center text-xs text-gray-400 transition-transform duration-700 ease-out group-hover:scale-105">
                    {tab} {i + 1}
                  </div>
                </div>
                <p className="text-lg font-semibold text-[#111] leading-snug max-w-xl">
                  {isAr ? item.captionAr : item.captionEn}
                </p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
