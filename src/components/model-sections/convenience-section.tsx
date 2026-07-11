"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import ParallaxImage from "../parallax-image";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Locale } from "@/lib/i18n";
import type { VehicleModel } from "@/lib/models-data";

gsap.registerPlugin(ScrollTrigger);

interface Props {
  locale: Locale;
  model: VehicleModel;
}

export default function ConvenienceSection({ locale, model }: Props) {
  const isAr = locale === "ar";
  const ref = useRef<HTMLDivElement>(null);
  const conv = model.convenience;

  useEffect(() => {
    const ctx = gsap.context(() => {
      // bg heading block fades/scrolls in
      gsap.from(".conv-intro", {
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: { trigger: ".conv-intro", start: "top 80%", toggleActions: "play reverse play reverse" },
      });

      // card row slides in right-to-left
      gsap.from(".conv-card", {
        x: isAr ? -80 : 80,
        opacity: 0,
        duration: 0.7,
        stagger: 0.12,
        ease: "power2.out",
        scrollTrigger: { trigger: ".conv-row", start: "top 85%", toggleActions: "play reverse play reverse" },
      });


    }, ref);
    return () => ctx.revert();
  }, [isAr]);

  return (
    <section id="convenience" ref={ref} className="scroll-mt-36">
      {/* full-bleed bg with heading */}
      <div className="relative h-[60svh] min-h-[400px] bg-gradient-to-br from-gray-400 to-gray-600 flex items-end overflow-hidden">
        {conv.bgImage && (
          <>
            <img
              src={conv.bgImage}
              alt=""
              className="absolute inset-0 w-full h-full object-cover"
            />
            {/* dark scrim so the white heading stays readable on any image */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
          </>
        )}
        <div className="conv-intro relative max-w-[1400px] mx-auto px-8 w-full pb-12 text-white">
          <p className="text-sm opacity-80 mb-2">
            {isAr ? "الراحة" : "Convenience"}
          </p>
          <h2 className="text-4xl md:text-5xl font-bold mb-3">
            {isAr ? conv.headingAr : conv.headingEn}
          </h2>
        </div>
      </div>

      {/* sliding card row */}
      <div className="bg-white py-16">
        <div className="conv-row max-w-[1400px] mx-auto px-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          {conv.cards.map((card, i) => (
            <div key={`${card.titleEn}-${i}`} className="conv-card group">
              <div className="h-[200px] rounded-lg overflow-hidden mb-4">
                <ParallaxImage
                  src={card.image || undefined}
                  alt={isAr ? card.titleAr : card.titleEn}
                  label={`convenience image`}
                  className="h-full w-full"
                />
              </div>
              <h3 className="text-lg font-bold text-[#111] mb-2">
                {isAr ? card.titleAr : card.titleEn}
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                {isAr ? card.descAr : card.descEn}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
