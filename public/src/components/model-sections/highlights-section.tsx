"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import type { Locale } from "@/lib/i18n";
import Reveal from "@/components/reveal";
import type { VehicleModel } from "@/lib/models-data";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

interface Props {
  locale: Locale;
  model: VehicleModel;
  heading: string;
}

export default function HighlightsSection({ locale, model, heading }: Props) {
  const isAr = locale === "ar";

  return (
    <section id="highlights" className="bg-white py-20 scroll-mt-36">
      <div className="max-w-[1400px] mx-auto px-8">
        <Reveal><p className="text-sm text-gray-400 mb-2">{heading}</p></Reveal>
        <Reveal><h2 className="text-3xl md:text-5xl font-bold text-[#111] mb-12 max-w-2xl">
          {isAr
            ? `اكتشف لماذا تجعل ${model.nameAr} كل رحلة استثنائية`
            : `Find Out Why ${model.nameEn} Makes Every Drive Exceptional`}
        </h2></Reveal>
        <Swiper
          modules={[Navigation, Pagination]}
          navigation
          pagination={{ clickable: true }}
          spaceBetween={24}
          slidesPerView={1.1}
          breakpoints={{
            768: { slidesPerView: 2.2 },
            1100: { slidesPerView: 3 },
          }}
          className="highlights-swiper !pb-12"
        >
          {model.highlights.map((card, i) => (
            <SwiperSlide key={`${card.titleEn}-${i}`}>
              <div className="group">
                {/* image with hover zoom */}
                <div className="h-[300px] rounded-lg overflow-hidden mb-5">
                  {card.image ? (
                    <img
                      src={card.image}
                      alt={isAr ? card.titleAr : card.titleEn}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                  ) : (
                    <div className="h-full w-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center text-xs text-gray-400 transition-transform duration-700 ease-out group-hover:scale-105" />
                  )}
                </div>
                <h3 className="text-xl font-bold text-[#111] mb-2">
                  {isAr ? card.titleAr : card.titleEn}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {isAr ? card.descAr : card.descEn}
                </p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
