"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Locale } from "@/lib/i18n";
import type { VehicleModel } from "@/lib/models-data";

gsap.registerPlugin(ScrollTrigger);

interface Props {
  locale: Locale;
  model: VehicleModel;
}

export default function OverviewSection({ locale, model }: Props) {
  const isAr = locale === "ar";
  const ref = useRef<HTMLDivElement>(null);
  const ov = model.overview;

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".ov-reveal", {
        y: 30,
        opacity: 0,
        duration: 0.7,
        stagger: 0.1,
        ease: "power2.out",
        scrollTrigger: { trigger: ref.current, start: "top 75%" },
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section id="overview" ref={ref} className="bg-white py-20 scroll-mt-36">
      <div className="max-w-[1400px] mx-auto px-8">
        {/* big headline */}
        <h2 className="ov-reveal text-4xl md:text-6xl font-bold text-[#111] mb-6">
          {isAr ? ov.headlineAr : ov.headlineEn}
        </h2>

        {/* tagline */}
        <p className="ov-reveal text-lg text-gray-500 max-w-xl mb-10">
          {isAr ? ov.taglineAr : ov.taglineEn}
        </p>

        {/* engine line with divider */}
        <p className="ov-reveal text-xl font-semibold text-[#111] mb-3">
          {isAr ? ov.engineAr : ov.engineEn}
        </p>
        <hr className="ov-reveal border-gray-200 mb-8" />

        {/* spec row */}
        <div className="ov-reveal grid grid-cols-2 md:grid-cols-4 gap-8">
          {ov.stats.map((stat) => (
            <div key={stat.labelEn}>
              <div className="text-sm text-gray-400 mb-1">
                {isAr ? stat.labelAr : stat.labelEn}
              </div>
              <div className="text-2xl font-bold text-[#111]">{stat.value}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
