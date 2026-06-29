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
  whichColor: string; // kept for prop compatibility; text now baked into image
}

export default function VisualizerSection({
  locale,
  model,
  exteriorLabel,
  interiorLabel,
}: Props) {
  const isAr = locale === "ar";
  const [tab, setTab] = useState<"exterior" | "interior">("exterior");
  const [colorIdx, setColorIdx] = useState(0);
  const colors = model.visualizer.colors;
  const color = colors[colorIdx];

  // exterior spin: map drag distance → frame index
  const [frame, setFrame] = useState(0);
  const dragging = useRef(false);
  const lastX = useRef(0);
  const frames = color?.spinFrames ?? [];

  // preload the active color's frames so spinning is seamless (no flash)
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    if (frames.length === 0) return;
    setLoaded(false);
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
  };
  const onMove = (clientX: number) => {
    if (!dragging.current || frames.length === 0) return;
    const dx = clientX - lastX.current;
    if (Math.abs(dx) > 20) {
      const dir = dx > 0 ? 1 : -1;
      setFrame((f) => (f + dir + frames.length) % frames.length);
      lastX.current = clientX;
    }
  };
  const onUp = () => {
    dragging.current = false;
  };

  return (
    <section
      id="visualizer"
      className="scroll-mt-36 h-screen min-h-[640px] flex flex-col"
    >
      {/* EXTERIOR — gradient changes per color; "which color" text is part
          of the spin image itself, so nothing is pinned here */}
      {tab === "exterior" ? (
        <div
          className="relative flex-1 min-h-0 flex items-center justify-center cursor-ew-resize select-none overflow-hidden"
          style={{ background: color?.gradient ?? "#9A9C9E" }}
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
              {/* render only the active frame; all frames are preloaded
                  into browser cache so swapping src is instant (no flash) */}
              <img
                src={frames[frame]}
                alt=""
                draggable={false}
                className="absolute inset-0 w-full h-full object-contain pointer-events-none scale-[0.78]"
              />

              {/* loading state until frames are cached */}
              {!loaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/10 backdrop-blur-sm">
                  <div className="w-10 h-10 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                </div>
              )}

              {/* drag handle hint */}
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white shadow px-3 py-2 rounded pointer-events-none">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M8 8l-4 4 4 4M16 8l4 4-4 4"
                    stroke="#111"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </>
          ) : (
            <div className="text-white/70 text-sm flex flex-col items-center gap-2">
              <span>{exteriorLabel} spin — add spinFrames images</span>
              <span className="text-xs text-white/40">
                ({isAr ? color?.nameAr : color?.nameEn})
              </span>
            </div>
          )}
        </div>
      ) : (
        /* INTERIOR — large Pannellum stage, zoom disabled */
        <div className="relative flex-1 min-h-0 overflow-hidden bg-[#1a1a1a]">
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

      {/* bottom controls — single row: toggle left, color picker centered */}
      <div className="shrink-0 bg-white py-4">
        <div className="max-w-[1400px] mx-auto px-8 flex items-center">
          {/* exterior / interior toggle — small, left */}
          <div className="inline-flex bg-gray-100 rounded-full p-0.5 shrink-0">
            <button
              onClick={() => setTab("exterior")}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                tab === "exterior" ? "bg-white shadow text-[#111]" : "text-gray-500"
              }`}
            >
              {exteriorLabel}
            </button>
            <button
              onClick={() => setTab("interior")}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                tab === "interior" ? "bg-white shadow text-[#111]" : "text-gray-500"
              }`}
            >
              {interiorLabel}
            </button>
          </div>

          {/* color picker — centered in remaining space (exterior only) */}
          <div className="flex-1 flex flex-col items-center">
            {tab === "exterior" && (
              <>
                <p className="text-sm font-semibold text-[#111] mb-2">
                  {isAr ? color?.nameAr : color?.nameEn}
                </p>
                <div className="flex items-center justify-center gap-3">
                  <button
                    onClick={() =>
                      setColorIdx((i) => (i - 1 + colors.length) % colors.length)
                    }
                    className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center"
                  >
                    ‹
                  </button>
                  {colors.map((c, i) => (
                    <button
                      key={c.hex}
                      onClick={() => {
                        setColorIdx(i);
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
                    onClick={() => setColorIdx((i) => (i + 1) % colors.length)}
                    className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center"
                  >
                    ›
                  </button>
                </div>
              </>
            )}
            {tab === "interior" && (
              <p className="text-sm font-semibold text-[#111]">
                {isAr ? color?.nameAr : color?.nameEn}
              </p>
            )}
          </div>

          {/* spacer to balance the toggle width so picker stays centered */}
          <div className="shrink-0 w-[140px]" aria-hidden />
        </div>
      </div>
    </section>
  );
}
