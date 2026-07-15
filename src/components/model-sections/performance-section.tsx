"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Locale } from "@/lib/i18n";
import type { VehicleModel } from "@/lib/models-data";
import Image from "next/image";


gsap.registerPlugin(ScrollTrigger);

interface Props {
  locale: Locale;
  model: VehicleModel;
  heading: string;
}

export default function PerformanceSection({ locale, model, heading }: Props) {
  const isAr = locale === "ar";
  const sectionRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const perf = model.performance;

  useEffect(() => {
    const ctx = gsap.context(() => {
      // background image progressively blurs + scrolls up as you pass through
      if (bgRef.current) {
        gsap.fromTo(
          bgRef.current,
          { filter: "blur(0px)", y: 0 },
          {
            filter: "blur(12px)",
            y: -30,
            scale: 1.15,
            ease: "none",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top top",
              end: "bottom top",
              scrub: true,
            },
          }
        );
      }

      // specs reveal as they scroll over the image
      gsap.from(".perf-stat", {
        y: 40,
        opacity: 0,
        duration: 0.6,
        stagger: 0.15,
        ease: "power2.out",
        scrollTrigger: { trigger: ".perf-stats", start: "top 80%" },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="performance"
      ref={sectionRef}
      className="relative scroll-mt-36 bg-black text-white"
    >
      {/* sticky blurring background */}
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <div
          ref={bgRef}
          className="absolute -inset-8 scale-110 bg-gradient-to-br from-gray-500 to-gray-700 flex items-center justify-center text-white/30 text-sm overflow-hidden"
        >
          {perf.heroImage ? (
            <img
              src={perf.heroImage}
              alt={isAr ? perf.engineAr : perf.engineEn}
              className="w-full h-full object-cover"
            />
          ) : (
            <>Performance driving image (full-bleed)</>
          )}
        </div>

      </div>

      {/* content scrolls over */}
      <div className="relative -mt-screen">
        <div className="max-w-[1400px] mx-auto px-8 pt-[70svh] pb-32">
          <p className="text-sm opacity-70">{heading}</p>
          <h2 className="text-4xl md:text-6xl font-bold mb-20">
            {isAr ? perf.engineAr : perf.engineEn}
          </h2>

          <div className="perf-stats space-y-12 max-w-md">
            {perf.stats.map((stat) => (
              <div key={stat.labelEn} className="perf-stat">
                <p className="text-sm opacity-70 mb-1">
                  {isAr ? stat.labelAr : stat.labelEn}
                </p>
                <p className="text-3xl md:text-4xl font-bold">{stat.value}</p>
              </div>
            ))}
            <img
              src={perf.closingImage}
              alt=""
              loading="lazy"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
