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
  heading: string;
}

export default function GallerySection({ model, heading }: Props) {
  const [active, setActive] = useState(0);

  return (
    <section id="gallery" className="bg-white py-20 scroll-mt-36">
      <h2 className="text-4xl md:text-5xl font-bold text-[#111] text-center mb-12">
        {heading}
      </h2>

      <div className="max-w-[1400px] mx-auto px-8">
        {/* main image with fullscreen affordance */}
        <div className="relative h-[60svh] min-h-[400px] rounded-lg overflow-hidden mb-4 bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center text-gray-500 text-sm">
          Gallery image {active + 1}
          <button className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/80 w-10 h-10 rounded flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path
                d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"
                stroke="#111"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        {/* thumbnail strip */}
        <Swiper
          modules={[Navigation]}
          navigation
          spaceBetween={12}
          slidesPerView={2.5}
          breakpoints={{ 768: { slidesPerView: 5 }, 1100: { slidesPerView: 6 } }}
        >
          {model.gallery.map((_, i) => (
            <SwiperSlide key={i}>
              <button
                onClick={() => setActive(i)}
                className={`group h-24 w-full rounded overflow-hidden border-2 transition-colors ${
                  active === i ? "border-[#002C5F]" : "border-transparent"
                }`}
              >
                <div className="h-full w-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center text-[10px] text-gray-400 transition-transform duration-500 group-hover:scale-110">
                  {i + 1}
                </div>
              </button>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
