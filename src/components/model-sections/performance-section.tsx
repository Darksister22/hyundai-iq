"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Locale } from "@/lib/i18n";
import type { VehicleModel, PerfStat } from "@/lib/models-data";
import ImageWithLoader from "../loaders/loading-image";

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

  /**
   * One block per engine: the engine name as its headline, then its own
   * label/value column. Per-car values (seating, transmission, ground
   * clearance, 0-100) are already repeated into every block by the data
   * layer. A car with no engine rows yet falls back to a single block
   * built from the legacy mirrored columns.
   */
  const blocks =
    perf.engines && perf.engines.length > 0
      ? perf.engines
      : [{ nameEn: perf.engineEn, nameAr: perf.engineAr, stats: perf.stats }];

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

      // each engine block reveals on its own trigger as it scrolls into view,
      // so a car with four engines doesn't fire one giant stagger up front
      gsap.utils.toArray<HTMLElement>(".perf-block").forEach((block) => {
        gsap.from(block.querySelectorAll(".perf-reveal"), {
          y: 40,
          opacity: 0,
          duration: 0.6,
          stagger: 0.12,
          ease: "power2.out",
          scrollTrigger: { trigger: block, start: "top 80%" },
        });
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
      <div className="sticky top-0 h-[100lvh] overflow-hidden">
        <div ref={bgRef} className="absolute inset-0 overflow-hidden">
          {perf.heroImage ? (
            <ImageWithLoader
              src={perf.heroImage}
              alt={isAr ? perf.engineAr : perf.engineEn}
              className="object-cover"
              unoptimized
              fill
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-500 to-gray-700 flex items-center justify-center text-white/30 text-sm">
              Performance driving image (full-bleed)
            </div>
          )}
        </div>
      </div>

      {/* content scrolls over */}
      <div className="relative -mt-screen">
        <div className="max-w-[1400px] mx-auto px-8 pt-[70lvh] pb-32">
          {/* section label sits above the first engine only */}
          <p className="text-sm opacity-70 mb-3">{heading}</p>

          {blocks.map((block, i) => (
            <EngineBlock
              key={`${block.nameEn}-${i}`}
              name={isAr ? block.nameAr : block.nameEn}
              stats={block.stats}
              isAr={isAr}
              first={i === 0}
            />
          ))}

          {perf.closingImage && (
            <div className="relative w-full aspect-[16/9] rounded-lg overflow-hidden mt-20">
              <ImageWithLoader src={perf.closingImage} alt="" unoptimized fill className="object-cover" />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function EngineBlock({
  name,
  stats,
  isAr,
  first,
}: {
  name: string;
  stats: PerfStat[];
  isAr: boolean;
  first: boolean;
}) {
  return (
    <div className={`perf-block max-w-md ${first ? "" : "mt-28 md:mt-36"}`}>
      <h2 className="perf-reveal text-4xl md:text-6xl font-bold break-words">
        {name}
      </h2>

      <div className="mt-10 space-y-10 md:space-y-12">
        {stats.map((stat) => (
          <div key={stat.labelEn} className="perf-reveal">
            <p className="text-sm opacity-70 mb-1">
              {isAr ? stat.labelAr : stat.labelEn}
            </p>
            <p className="text-3xl md:text-4xl font-bold break-words">
              {stat.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
