"use client";

import { useRef, useState, useEffect } from "react";
import type { Locale } from "@/lib/i18n";
import type { VehicleModel } from "@/lib/models-data";
import Reveal from "../reveal";

interface Props {
  locale: Locale;
  model: VehicleModel;
}

export default function SafetySection({ locale, model }: Props) {
  const isAr = locale === "ar";
  const scrollRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0); // 0..1 scrollbar handle position

  const sync = () => {
    const el = scrollRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setProgress(max > 0 ? el.scrollLeft / max : 0);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", sync, { passive: true });
    return () => el.removeEventListener("scroll", sync);
  }, []);

  // drag the handle → scroll the row
  const dragging = useRef(false);
  const trackRef = useRef<HTMLDivElement>(null);

  const onHandleMove = (clientX: number) => {
    if (!dragging.current || !trackRef.current || !scrollRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    let p = (clientX - rect.left) / rect.width;
    p = Math.max(0, Math.min(1, p));
    const el = scrollRef.current;
    el.scrollLeft = p * (el.scrollWidth - el.clientWidth);
  };

  useEffect(() => {
    const move = (e: MouseEvent) => onHandleMove(e.clientX);
    const up = () => (dragging.current = false);
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", up);
    };
  }, []);

  return (
    <section id="safety" className="bg-white py-20 scroll-mt-36">
      <div className="max-w-[1400px] mx-auto px-8">
        <Reveal>
        <p className="text-sm text-gray-400 mb-2">SmartSense</p>
        <h2 className="text-3xl md:text-5xl font-bold text-[#111] mb-12 max-w-3xl">
          {isAr ? model.safety.headingAr : model.safety.headingEn}
        </h2></Reveal>
      </div>

      {/* horizontal card row */}
      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto px-8 scrollbar-hide max-w-[1400px] mx-auto"
        style={{ scrollbarWidth: "none" }}
      >
        {model.safety.cards.map((card, i) => (
          <div key={`${card.titleEn}-${i}`} className="group shrink-0 w-[340px]">
            <div className="h-[220px] rounded-lg overflow-hidden mb-4">
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
            <h3 className="font-bold text-[#111] mb-2">
              {isAr ? card.titleAr : card.titleEn}
            </h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              {isAr ? card.descAr : card.descEn}
            </p>
          </div>
        ))}
      </div>

      {/* custom dotted drag scrollbar */}
      <div className="max-w-[1400px] mx-auto px-8 mt-8 flex items-center gap-3">
        <div
          ref={trackRef}
          className="relative flex-1 h-[1px] border-t border-dotted border-gray-400"
        >
          <button
            onMouseDown={() => (dragging.current = true)}
            className="absolute -top-3 w-9 h-6 bg-black rounded flex items-center justify-center cursor-ew-resize"
            style={{
              left: `calc(${progress * 100}% - 18px)`,
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path
                d="M8 8l-4 4 4 4M16 8l4 4-4 4"
                stroke="#fff"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
