"use client";

import { useState, useRef, useLayoutEffect } from "react";
import gsap from "gsap";
import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import type { HomeCar } from "@/lib/find-car-data";
import CarSpinner from "./car-spinner";

interface Props {
  locale: Locale;
  car: HomeCar;
  exploreLabel: string;
  expanded: boolean;
  onExpand: (slug: string) => void;
  onCollapse: () => void;
  onTransitionSettled?: () => void; // fired once the size animation finishes
}

// stat labels aren't stored in the DB — same wording the site used before
const STAT_LABELS = {
  maxPower: { en: "Max Power", ar: "القوة القصوى" },
  maxTorque: { en: "Max Torque", ar: "عزم الدوران" },
  seating: { en: "Seating", ar: "المقاعد" },
};

export default function ModelCard({
  locale,
  car,
  exploreLabel,
  expanded,
  onExpand,
  onCollapse,
  onTransitionSettled, // ← THIS was the missing line causing your TS error
}: Props) {
  const isAr = locale === "ar";
  const name = isAr ? car.nameAr ?? car.nameEn : car.nameEn;
  const href = `/${locale}/models/${car.slug}`;

  const colors = car.colors; // already ordered, frameless colors already dropped
  const hasSpin = colors.length > 0;
  const [colorIdx, setColorIdx] = useState(0);
  const [colorOpen, setColorOpen] = useState(false);
  const frames = colors[colorIdx]?.frames ?? [];
  // idle image: first frame of the first color; hero image if no spin data
  const idleImage = colors[0]?.frames?.[0] ?? car.heroImage ?? null;

  const stats = [
    { label: STAT_LABELS.maxPower, value: isAr ? car.maxPowerAr ?? car.maxPowerEn : car.maxPowerEn },
    { label: STAT_LABELS.maxTorque, value: isAr ? car.maxTorqueAr ?? car.maxTorqueEn : car.maxTorqueEn },
    { label: STAT_LABELS.seating, value: isAr ? car.seatingAr ?? car.seatingEn : car.seatingEn },
  ].filter((s): s is { label: { en: string; ar: string }; value: string } => !!s.value);

  const stop = (e: React.MouseEvent) => e.stopPropagation();
  const cardRef = useRef<HTMLDivElement>(null);
  const isFirst = useRef(true);
  const settledRef = useRef(onTransitionSettled);
  settledRef.current = onTransitionSettled;

  useLayoutEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const target = expanded ? { width: Math.min(window.innerWidth * 0.92, 560), height: 440 } : { width: 260, height: 360 };
    if (isFirst.current) {
      isFirst.current = false;
      gsap.set(el, target);
      return
    }
    const tween = gsap.to(el, {
      ...target,
      duration: 0.65,
      ease: "power4.out",
      overwrite: "auto",
      onComplete: () => settledRef.current?.(),
    });
    return () => {
      tween.kill();
    }
  }, [expanded]);
  return (

    <div
      ref={cardRef}
      data-card-slug={car.slug}
      onClick={() => {
        if (!expanded && hasSpin) onExpand(car.slug);
      }}
      className={`group relative shrink-0 rounded-xl bg-gray-50 overflow-hidden
        transition-shadow duration-300
        ${expanded
          ? "cursor-default shadow-xl z-10"
          : `hover:shadow-xl hover:z-10 ${hasSpin ? "cursor-pointer" : "cursor-default"}`
        }`}
    >
      {/* Hover scale lives on an INNER wrapper with its own short transition, so it
          can never be swept into the 650ms width/height curve (that scale-up on
          collapse was the "jump"). Disabled entirely while expanded. */}
      <div
        className={`absolute inset-0 transition-transform duration-300 ease-out ${expanded ? "" : "group-hover:scale-[1.04]"
          }`}
      >
        {/* ─── STATE 1 (idle) + STATE 2 (hover) — always mounted, cross-faded ─── */}
        <div
          aria-hidden={expanded}
          className={`absolute inset-0 transition-opacity duration-300 ${expanded ? "opacity-0 pointer-events-none" : "opacity-100 delay-[250ms]"
            }`}
        >
          <h3 className="absolute top-6 inset-x-0 text-center text-xl font-bold text-[#111] px-4">
            {name}
          </h3>

          <div className="absolute inset-0 flex items-center justify-center p-6 pt-16">
            {idleImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={idleImage}
                alt={name}
                draggable={false}
                loading="lazy"
                className="w-full h-40 object-contain"
              />
            ) : (
              <div className="w-full h-40 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center text-xs text-gray-400">
                {car.nameEn}
              </div>
            )}
          </div>

          {/* hover-only: expand icon top-end — only when state 3 exists */}
          {hasSpin && (
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
          )}

          {/* hover-only: explore bottom-end */}
          <Link
            href={href}
            onClick={stop}
            className="absolute bottom-4 end-4 flex items-center gap-1 text-sm font-semibold text-[#002C5F] hover:text-[#00AAD2] opacity-0 group-hover:opacity-100 transition-opacity"
          >
            {exploreLabel}
            <span aria-hidden>›</span>
          </Link>
        </div>

        {/* ─── STATE 3: expanded — always mounted, cross-faded ─── */}
        <div
          aria-hidden={!expanded}
          className={`absolute inset-0 p-5 flex flex-col transition-opacity duration-300 ${expanded ? "opacity-100 delay-[250ms]" : "opacity-0 pointer-events-none"
            }`}
        >
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
                    style={{ backgroundColor: colors[colorIdx].hex ?? "#ccc" }}
                  />
                  <span className="text-sm font-semibold text-[#002C5F]">
                    {isAr
                      ? colors[colorIdx].nameAr ?? colors[colorIdx].nameEn
                      : colors[colorIdx].nameEn}
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
                        key={`${c.hex ?? ""}-${i}`}
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
                          style={{ backgroundColor: c.hex ?? "#ccc" }}
                        />
                        <span className="text-xs text-gray-700">
                          {isAr ? c.nameAr ?? c.nameEn : c.nameEn}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <span />
            )}

            {/* minimize icon */}
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
              <CarSpinner frames={frames} className="w-full h-full max-h-[160px] md:max-h-[220px]" />
            ) : (
              <div className="w-full h-full max-h-[220px] bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center text-xs text-gray-400">
                {car.nameEn}
              </div>
            )}
          </div>

          {/* bottom: stats + explore */}
          <div className="relative z-10 flex items-end justify-between">
            <div className="flex gap-8">
              {stats.map((s) => (
                <div key={s.label.en}>
                  <p className="text-xs text-gray-400 mb-1">
                    {isAr ? s.label.ar : s.label.en}
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
      </div>
    </div>
  );
}