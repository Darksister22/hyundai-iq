"use client";

import { useState } from "react";
import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import type { VehicleModel } from "@/lib/models-data";
import CarSpinner from "./car-spinner";
interface Props {
  locale: Locale;
  model: VehicleModel;
  exploreLabel: string;
  expanded: boolean;
  onExpand: (slug: string) => void;
  onCollapse: () => void;
}

export default function ModelCard({
  locale,
  model,
  exploreLabel,
  expanded,
  onExpand,
  onCollapse,
}: Props) {
  const isAr = locale === "ar";
  const name = isAr ? model.nameAr : model.nameEn;
  const href = `/${locale}/models/${model.slug}`;

  const colors = model.visualizer.colors;
  const [colorIdx, setColorIdx] = useState(0);
  const [colorOpen, setColorOpen] = useState(false);
  const frames = colors[colorIdx]?.spinFrames ?? [];
  // first frame doubles as the idle/hover image
  const idleImage = colors[0]?.spinFrames?.[0];
  const stats = model.overview.stats.slice(0, 3);

  const stop = (e: React.MouseEvent) => e.stopPropagation();

  return (
    <div
      data-card-slug={model.slug}
      onClick={() => {
        if (!expanded) onExpand(model.slug);
      }}
      className={`group relative shrink-0 rounded-xl bg-gray-50 overflow-hidden transition-all duration-700 ease-out ${expanded
          ? "w-[92vw] max-w-[560px] h-[440px] max-h-[80svh] cursor-default"   // fits phone; caps at 560 on desktop
          : "w-[260px] h-[360px] cursor-pointer hover:scale-[1.04] hover:z-10 hover:shadow-xl"
        }`}
    >
      {expanded ? (
        /* ─── STATE 3: expanded ─── */
        <div className="relative w-full h-full p-5 flex flex-col">
          {/* watermark name — TOP of card, behind the car */}
          <span className="absolute top-4 inset-x-0 text-center text-6xl md:text-8xl font-extrabold text-gray-300 pointer-events-none select-none z-0 leading-none">
            {name}
          </span>

          {/* top bar — above everything (z-30) */}
          <div className="relative z-30 flex items-start justify-between">
            {colors.length > 0 ? (
              <div className="relative" onClick={stop} onMouseDown={stop}>
                <button
                  onClick={(e) => {
                    stop(e);
                    setColorOpen((o) => !o);
                  }}
                  className="flex items-center gap-2"
                >
                  <span
                    className="w-5 h-5 rounded"
                    style={{ backgroundColor: colors[colorIdx].hex }}
                  />
                  <span className="text-sm font-semibold text-[#002C5F]">
                    {isAr ? colors[colorIdx].nameAr : colors[colorIdx].nameEn}
                  </span>
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    className={`text-[#002C5F] transition-transform ${colorOpen ? "rotate-180" : ""
                      }`}
                  >
                    <path
                      d="M6 9l6 6 6-6"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>

                {colorOpen && (
                  <div className="absolute top-full mt-2 bg-white shadow-lg rounded-lg p-1 z-40 min-w-[160px]">
                    {colors.map((c, i) => (
                      <button
                        key={c.hex}
                        onClick={(e) => {
                          stop(e);
                          setColorIdx(i);
                          setColorOpen(false);
                        }}
                        onMouseDown={stop}
                        className="flex items-center gap-2 px-2 py-1.5 hover:bg-gray-50 w-full rounded text-start"
                      >
                        <span
                          className="w-4 h-4 rounded shrink-0"
                          style={{ backgroundColor: c.hex }}
                        />
                        <span className="text-xs text-gray-700">
                          {isAr ? c.nameAr : c.nameEn}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <span />
            )}

            {/* minimize icon — spins on toggle */}
            <button
              onClick={(e) => {
                stop(e);
                onCollapse();
              }}
              onMouseDown={stop}
              aria-label="Minimize"
              className="text-gray-500 hover:text-gray-800"
            >
              <span className="inline-block transition-transform duration-500 rotate-180">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </button>
          </div>

          {/* spinner sits above watermark (z-10) but below top bar */}
          <div className="relative z-10 flex-1 flex items-center justify-center min-h-0">
            {frames.length > 0 ? (
              <CarSpinner frames={frames} className="w-full h-full max-h-[160px] md:max-h-[220px]" />) : (
              <div className="w-full h-full max-h-[220px] bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center text-xs text-gray-400">
                {model.nameEn}
              </div>
            )}
          </div>

          {/* bottom: stats + explore */}
          <div className="relative z-10 flex items-end justify-between">
            <div className="flex gap-8">
              {stats.map((s) => (
                <div key={s.labelEn}>
                  <p className="text-xs text-gray-400 mb-1">
                    {isAr ? s.labelAr : s.labelEn}
                  </p>
                  <p className="text-base font-bold text-[#111]">{s.value}</p>
                </div>
              ))}
            </div>
            <Link
              href={href}
              onClick={stop}
              className="flex items-center gap-1 text-sm font-semibold text-[#002C5F] hover:text-[#00AAD2] transition-colors"
            >
              {exploreLabel}
              <span aria-hidden>›</span>
            </Link>
          </div>
        </div>
      ) : (
        /* ─── STATE 1 (idle) + STATE 2 (hover) ─── */
        <>
          <h3 className="absolute top-6 inset-x-0 text-center text-xl font-bold text-[#111] px-4">
            {name}
          </h3>

          <div className="absolute inset-0 flex items-center justify-center p-6 pt-16">
            {idleImage ? (
              <img
                src={idleImage}
                alt={name}
                draggable={false}
                className="w-full h-40 object-contain transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-40 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center text-xs text-gray-400 transition-transform duration-500 group-hover:scale-105">
                {model.nameEn}
              </div>
            )}
          </div>

          {/* hover-only: expand icon top-end */}
          <div className="absolute top-4 end-4 opacity-0 group-hover:opacity-100 transition-opacity text-gray-500">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path
                d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          {/* hover-only: explore bottom-end */}
          <Link
            href={href}
            onClick={stop}
            className="absolute bottom-4 end-4 flex items-center gap-1 text-sm font-semibold text-[#002C5F] hover:text-[#00AAD2] opacity-0 group-hover:opacity-100 transition-opacity"
          >
            {exploreLabel}
            <span aria-hidden>›</span>
          </Link>
        </>
      )}
    </div>
  );
}