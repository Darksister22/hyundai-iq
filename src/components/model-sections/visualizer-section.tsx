"use client";

import { useEffect, useRef, useState } from "react";
import type { Locale } from "@/lib/i18n";
import type { VehicleModel } from "@/lib/models-data";
import Pannellum360 from "./pannellum-360";
import Image from "next/image";

interface Props {
  locale: Locale;
  model: VehicleModel;
  exteriorLabel: string;
  interiorLabel: string;
  whichColor: string; // heading above the car; falls back if empty
}

/* custom cursor: small grey badge with ‹ › arrows, shown while hovering
   the spin stage (matches the reference's hover hint) */
const SPIN_CURSOR_SVG = encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="40" height="28" viewBox="0 0 40 28"><rect width="40" height="28" rx="4" fill="#9c9c9c" fill-opacity="0.85"/><path d="M14 9l-5 5 5 5M26 9l5 5-5 5" stroke="#fff" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>`
);
const SPIN_CURSOR = `url("data:image/svg+xml,${SPIN_CURSOR_SVG}") 20 14, ew-resize`;





export default function VisualizerSection({
  locale,
  model,
  exteriorLabel,
  interiorLabel,
  whichColor,
}: Props) {
  const isAr = locale === "ar";
  const [tab, setTab] = useState<"exterior" | "interior">("exterior");
  const [colorIdx, setColorIdx] = useState(0);
  const [intIdx, setIntIdx] = useState(0);                    //  interior trim
  const colors = model.visualizer.colors;
  const color = colors[colorIdx];
  const interiors = model.visualizer.interiorColors ?? [];    //  trims
  const interior = interiors[intIdx];
  const panoSrc = interior?.panorama;                          // active trim panorama
  const heading =
    whichColor?.trim() ||
    (isAr ? "أي لون يبدو الأفضل؟" : "Which color looks best?");

  // exterior spin: map drag distance → frame index
  const [frame, setFrame] = useState(0);
  const dragging = useRef(false);
  const lastX = useRef(0);
  const acc = useRef(0);
  const frames = color?.spinFrames ?? [];

  // px of horizontal drag per frame step — lower = faster spin
  const PX_PER_FRAME = 8;

  // preload the active color's frames so spinning is seamless
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    if (frames.length === 0) return;
    let done = 0;
    let cancelled = false;
    const imgs: HTMLImageElement[] = [];
    frames.forEach((src) => {
      const img = new window.Image();
      img.onload = img.onerror = () => {
        done += 1;
        if (!cancelled && done === frames.length) setLoaded(true);
      };
      img.src = src;
      imgs.push(img);
    });
    return () => {
      cancelled = true;
      imgs.forEach((i) => (i.onload = i.onerror = null));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [colorIdx]);

  const onDown = (clientX: number) => {
    dragging.current = true;
    lastX.current = clientX;
    acc.current = 0;
  };
  const onMove = (clientX: number) => {
    if (!dragging.current || frames.length === 0) return;
    acc.current += clientX - lastX.current;
    lastX.current = clientX;
    const steps = Math.trunc(acc.current / PX_PER_FRAME);
    if (steps !== 0) {
      acc.current -= steps * PX_PER_FRAME;
      setFrame((f) => (f + steps + frames.length * 100) % frames.length);
    }
  };
  const onUp = () => {
    dragging.current = false;
  };

  const selectColor = (updater: number | ((i: number) => number)) => {
    setLoaded(false);
    setColorIdx((i) => (typeof updater === "function" ? updater(i) : updater));
  };

  const colorName = isAr ? color?.nameAr : color?.nameEn;

  return (
    /* one full-viewport stage; heading, car, ellipse and all controls are
       layered inside it so the car is the centered anchor of the page */
    <section
      id="visualizer"
      className="scroll-mt-36 relative overflow-hidden h-[78vw] min-h-[400px] md:h-[70svh] md:min-h-[640px] md:max-h-none"
    >
      {tab === "exterior" ? (
        <div
          className="absolute inset-0 select-none touch-pan-y bg-white"
          style={{ cursor: SPIN_CURSOR }}
          onMouseDown={(e) => onDown(e.clientX)}
          onMouseMove={(e) => onMove(e.clientX)}
          onMouseUp={onUp}
          onMouseLeave={onUp}
          onTouchStart={(e) => onDown(e.touches[0].clientX)}
          onTouchMove={(e) => onMove(e.touches[0].clientX)}
          onTouchEnd={onUp}
        >
          {frames.length > 0 ? (
            <>
              {/* heading + big color name — dark text, top-center, the car
                  overlaps the name's lower edge like the reference */}
              <div className="absolute top-[10%] inset-x-0 text-center pointer-events-none px-4">
                <p className="text-[#111] font-bold text-lg md:text-[22px]">
                  {heading}
                </p>
                <p className="text-[#111] font-bold leading-[0.95] tracking-tight text-5xl md:text-7xl lg:text-[84px] -mt-0.5">
                  {colorName}
                </p>
              </div>


              {/* the car — centered, above the heading text */}
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 translate-y-[8%]
                w-[85%] max-w-[560px] md:max-w-[680px] aspect-[2/1] pointer-events-none select-none z-0">
                <Image
                  src="/images/spinback.png"
                  alt=""
                  aria-hidden
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 85vw, 680px"
                  priority
                />
              </div>

              {/* eslint-disable-next-line @next/next/no-img-element -- hot-swapped per drag frame; next/image would fire an optimize request per frame */}
              <img
                src={frames[frame]}
                alt=""
                draggable={false}
                className="absolute inset-0 w-full h-full object-contain pointer-events-none
                  scale-[0.92] md:scale-[0.68] translate-y-[6%] md:translate-y-[2%] z-[1]"
              />

              {/* loading state until frames are cached */}
              {!loaded && (
                <div className="absolute inset-0 z-[2] flex items-center justify-center bg-white/40 backdrop-blur-sm">
                  <div className="w-10 h-10 border-2 border-[#111]/20 border-t-[#111]/70 rounded-full animate-spin" />
                </div>
              )}
            </>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-[#111]/60 text-sm">
              <div className="flex flex-col items-center gap-2">
                <span>{exteriorLabel} spin — add spinFrames images</span>
                <span className="text-xs text-[#111]/40">({colorName})</span>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* INTERIOR — full-stage Pannellum, panorama per trim */
        <div className="absolute inset-0 bg-[#1a1a1a]">
          {panoSrc ? (
            <Pannellum360 id={`interior-360-${model.slug}-${intIdx}`} src={panoSrc} />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-white/50 text-sm">
              Interior 360 panorama (add interiorColors)
            </div>
          )}
        </div>
      )}


      {/* exterior/interior toggle */}
      <div className="absolute bottom-24 md:bottom-6 left-1/2 -translate-x-1/2 md:left-6 md:translate-x-0 z-[3]">
        <div className="inline-flex bg-white rounded-full p-0.5 shadow-md">
          <button
            onClick={() => setTab("exterior")}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-colors ${tab === "exterior" ? "bg-[#111] text-white" : "text-gray-500"
              }`}
          >
            {exteriorLabel}
          </button>
          <button
            onClick={() => setTab("interior")}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-colors ${tab === "interior" ? "bg-[#111] text-white" : "text-gray-500"
              }`}
          >
            {interiorLabel}
          </button>
        </div>
      </div>

      <div className="absolute bottom-5 inset-x-0 z-[2] flex flex-col items-center pointer-events-none">
        <p className={`text-sm font-semibold mb-2 ${tab === "interior" ? "text-white" : "text-[#111]"}`}>
          {tab === "exterior"
            ? (isAr ? color?.nameAr : color?.nameEn)
            : (isAr ? interior?.nameAr : interior?.nameEn)}
        </p>

        {/* exterior paint swatches*/}
        {tab === "exterior" && (
          <div className="flex items-center gap-3 pointer-events-auto">
            <button
              onClick={() => selectColor((i) => (i - 1 + colors.length) % colors.length)}
              aria-label="Previous color"
              className="w-8 h-8 rounded-full bg-white shadow flex items-center justify-center"
            >‹</button>

            {colors.map((c, i) => (
              <button
                key={`${c.hex ?? c.nameEn}-${i}`}
                onClick={() => selectColor(i)}
                title={isAr ? c.nameAr : c.nameEn}
                className={`w-7 h-7 rounded border-2 transition-transform ${colorIdx === i ? "border-[#111] scale-110" : "border-transparent"
                  }`}
                style={{ backgroundColor: c.hex ?? "#ccc" }}
              />
            ))}

            <button
              onClick={() => selectColor((i) => (i + 1) % colors.length)}
              aria-label="Next color"
              className="w-8 h-8 rounded-full bg-white shadow flex items-center justify-center"
            >›</button>    </div>
        )}

        {/* interior trim swatches */}
        {tab === "interior" && interiors.length > 0 && (
          <div className="flex items-center gap-3 pointer-events-auto">
            <button
              onClick={() => setIntIdx((i) => (i - 1 + interiors.length) % interiors.length)}
              className="w-8 h-8 rounded-full bg-white shadow flex items-center justify-center"
            >‹</button>
            {interiors.map((c, i) => (
              <button
                key={c.hex}
                onClick={() => setIntIdx(i)}
                title={isAr ? c.nameAr : c.nameEn}
                className={`w-7 h-7 rounded border-2 transition-transform ${intIdx === i ? "border-white scale-110" : "border-transparent"
                  }`}
                style={{ backgroundColor: c.hex }}
              />
            ))}
            <button
              onClick={() => setIntIdx((i) => (i + 1) % interiors.length)}
              className="w-8 h-8 rounded-full bg-white shadow flex items-center justify-center"
            >›</button>
          </div>
        )}
      </div>
    </section>
  );
}