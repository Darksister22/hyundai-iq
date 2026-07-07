"use client";

import { useEffect, useRef, useState } from "react";
import type { Locale } from "@/lib/i18n";
import type { VehicleModel } from "@/lib/models-data";
import Pannellum360 from "./pannellum-360";

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



/* very light stage: a whisper of the selected color at the top that fades
   to pure white before the car line — like the reference page */
function stageBackground(c?: { gradient?: string; hex?: string }): string {
  const g = c?.gradient;
  if (g && g.includes("gradient")) return g;
  const base = c?.hex || g || "#9A9C9E";
  return `linear-gradient(180deg,
    color-mix(in srgb, ${base} 26%, white) 0%,
    color-mix(in srgb, ${base} 10%, white) 38%,
    #ffffff 68%,
    #ffffff 100%)`;
}
/* per-color gradient wash layered OVER the background image.
   Gradient is semi-transparent so the image shows through. */
function stageOverlay(hex?: string): string {
  const base = hex || "#2c4a7c";
  return `linear-gradient(180deg,
    ${base}cc 0%,
    color-mix(in srgb, ${base} 45%, transparent) 55%,
    transparent 100%)`;
}

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
  const colors = model.visualizer.colors;
  const color = colors[colorIdx];

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
      className="scroll-mt-36 relative h-[100svh] min-h-[640px] overflow-hidden"
    >
      {tab === "exterior" ? (
        <div
          className="absolute inset-0 select-none touch-pan-y bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `${stageOverlay(color?.hex)}, url('/images/spinback.png')`,
            cursor: SPIN_CURSOR,
          }}
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

              {/* platform ellipse — very light grey, wide and shallow,
                  car wheels rest on its upper third */}
              {/* <div
                aria-hidden
                className="absolute left-1/2 top-[56%] -translate-x-1/2 w-[72%] max-w-[1250px] aspect-[3.4/1] rounded-[50%] pointer-events-none"
                style={{
                  background:
                    "radial-gradient(50% 50% at 50% 50%, #ececec 0%, #f2f2f2 55%, rgba(242,242,242,0) 74%)",
                }}
              /> */}

              {/* the car — centered, above the heading text */}
              <img
                src={frames[frame]}
                alt=""
                draggable={false}
                className="absolute inset-0 w-full h-full object-contain pointer-events-none scale-[0.56] translate-y-[3%] z-[1]"
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
        /* INTERIOR — full-stage Pannellum */
        <div className="absolute inset-0 bg-[#1a1a1a]">
          {model.visualizer.panorama360 ? (
            <Pannellum360
              id={`interior-360-${model.slug}`}
              src={model.visualizer.panorama360}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-white/50 text-sm">
              Interior 360 panorama (add panorama360 image)
            </div>
          )}
        </div>
      )}

      {/* ---- overlaid controls (both tabs) ---- */}

      {/* exterior/interior toggle — bottom-left, like the reference */}
      <div className="absolute bottom-6 left-6 md:left-10 z-[3]">
        <div className="inline-flex bg-white rounded-full p-0.5 shadow-md">
          <button
            onClick={() => setTab("exterior")}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-colors ${
              tab === "exterior" ? "bg-[#111] text-white" : "text-gray-500"
            }`}
          >
            {exteriorLabel}
          </button>
          <button
            onClick={() => setTab("interior")}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-colors ${
              tab === "interior" ? "bg-[#111] text-white" : "text-gray-500"
            }`}
          >
            {interiorLabel}
          </button>
        </div>
      </div>

      {/* color caption + swatches — bottom-center under the car */}
      <div className="absolute bottom-5 inset-x-0 z-[2] flex flex-col items-center pointer-events-none">
        <p
          className={`text-sm font-semibold mb-2 ${
            tab === "interior" ? "text-white" : "text-[#111]"
          }`}
        >
          {colorName}
        </p>
        {tab === "exterior" && (
          <div className="pointer-events-auto flex items-center gap-3 bg-white/90 backdrop-blur rounded-full px-3 py-2 shadow-md">
            <button
              onClick={() =>
                selectColor((i) => (i - 1 + colors.length) % colors.length)
              }
              className="w-8 h-8 rounded-full bg-white shadow flex items-center justify-center text-[#111]"
            >
              ‹
            </button>
            {colors.map((c, i) => (
              <button
                key={c.hex}
                onClick={() => {
                  selectColor(i);
                  setFrame(0);
                }}
                title={isAr ? c.nameAr : c.nameEn}
                className={`w-7 h-7 rounded border-2 transition-transform ${
                  colorIdx === i
                    ? "border-[#002C5F] scale-110"
                    : "border-transparent"
                }`}
                style={{ backgroundColor: c.hex }}
              />
            ))}
            <button
              onClick={() => selectColor((i) => (i + 1) % colors.length)}
              className="w-8 h-8 rounded-full bg-white shadow flex items-center justify-center text-[#111]"
            >
              ›
            </button>
          </div>
        )}
      </div>
    </section>
  );
}