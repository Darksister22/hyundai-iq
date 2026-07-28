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

/* px of horizontal drag per frame step — lower = faster spin */
const PX_PER_FRAME = 8;

/* ═══════════════════════════════════════════════════════════════════
   ██  A. SECTION SIZE  ██

   One full screen at every width, matching the hero's convention.
     100svh → smallest viewport (mobile bar visible). Never resizes.
     100dvh → tracks the bar. Fuller, but resizes as you scroll.
   MIN_HEIGHT stops the stage collapsing on a landscape phone.
   ═══════════════════════════════════════════════════════════════════ */
const SECTION_HEIGHT = "calc(85svh - var(--safe-top))";
const SECTION_MIN_HEIGHT = "560px";

/* ═══════════════════════════════════════════════════════════════════
   ██  B. SAFE TOP — the sticky sub-nav  ██

   ModelSubNav is `sticky top-0 z-40` and overlays the top of this
   section: 72px on md+, ~116px on mobile (its mobile height depends
   on whether the brochure button renders, so it's measured at runtime
   rather than hardcoded). The canvas is pushed below it.

   REQUIRES a one-line edit in model-sub-nav.tsx — add the attribute:
     <div data-sticky-top className="sticky top-0 z-40 bg-white ...">

   Without it this falls back to 0 and the heading hides behind the bar.
   ═══════════════════════════════════════════════════════════════════ */
const SAFE_TOP_SELECTOR = "[data-sticky-top]";

/* ═══════════════════════════════════════════════════════════════════
   ██  C. TUNING TABLE — THIS IS THE ONLY BLOCK YOU EDIT  ██

   Six screen sizes, each with its own numbers. Change a value, save,
   look at that width only — nothing else moves.

     base → phone                             (0 – 639px)
     sm   → big phone / half of a 1440 laptop  (640 – 767px)
     md   → tablet / half of a 1920 monitor    (768 – 1023px)
     lg   → small laptop window                (1024 – 1279px)
     xl   → full screen 1440 laptop            (1280 – 1535px)
     2xl  → full screen 1920+ monitor          (1536px and up)

   Every number is a RATIO, not a pixel value, so it holds steady
   *within* its breakpoint band as you resize.
   ═══════════════════════════════════════════════════════════════════ */

type Tune = {
  /* ── THE CANVAS everything else is measured against ───────────
     ratio        canvas width ÷ height. HIGHER = wider + shorter
                  canvas, car gets smaller. LOWER = taller canvas,
                  car gets bigger. This is the master dial.
     canvasWidth  ◄── SIZE      % of SECTION width the canvas spans
     canvasY      ◄── VERTICAL  % of SECTION height, measured from
                                just below the sticky sub-nav.
                                + = DOWN. This moves the whole car +
                                text group down the screen.          */
  ratio: number;
  canvasWidth: number;
  canvasY: number;

  /* ── SPIN BACKGROUND (spinback.png) ───────────────────────────
     bgSize   ◄── SIZE      % of canvas width. 100 = exactly as wide
                            as the stage. Raise to spread the ellipse.
     bgY      ◄── VERTICAL  % of canvas height. + moves it DOWN,
                            − moves it UP. Raise to push the stage
                            further under the car.                  */
  bgSize: number;
  bgY: number;

  /* ── CAR FRAMES ───────────────────────────────────────────────
     carSize   ◄── SIZE      % of canvas width the frame box spans
     carScale  ◄── SIZE      fine multiplier on top of carSize; this
                             is the one to nudge for small changes
     carY      ◄── VERTICAL  % of canvas height. + = DOWN, − = UP    */
  carSize: number;
  carScale: number;
  carY: number;

  /* ── HEADING + COLOUR NAME ────────────────────────────────────
     headingSize  ◄── SIZE      "Which color looks best?" — in cqw
                                (1cqw = 1% of canvas width)
     nameSize     ◄── SIZE      the big colour name — in cqw
     textY        ◄── VERTICAL  top edge of the text block, % of
                                canvas height. + = DOWN, − = UP
     textGap      ◄── VERTICAL  space between the two lines, % of
                                canvas height. Negative pulls the
                                colour name up toward the heading.
                                THIS is the car-to-text distance dial
                                when paired with textY.              */
  headingSize: number;
  nameSize: number;
  textY: number;
  textGap: number;
};

const TUNE: Record<string, Tune> = {
  /* ───────────────── PHONE — 0 to 639px ───────────────── */
  base: {
    ratio: 0.95, //     master dial  (was 1.35 — see note below)
    canvasWidth: 100, //◄── SIZE      canvas
    canvasY: 8, //      ◄── VERTICAL  canvas (whole group)

    bgSize: 150, //  ◄── SIZE      spin background
    bgY: 7, //       ◄── VERTICAL  spin background

    carSize: 100, //  ◄── SIZE      car
    carScale: 0.86, //◄── SIZE      car (fine)
    carY: 5, //       ◄── VERTICAL  car

    headingSize: 3.6, // ◄── SIZE      heading
    nameSize: 11, //     ◄── SIZE      colour name
    textY: 2, //         ◄── VERTICAL  text block
    textGap: -0.5, //    ◄── VERTICAL  heading → name gap
  },

  /* ────── BIG PHONE / HALF OF 1440 LAPTOP — 640 to 767px ────── */
  sm: {
    ratio: 1.2, //      master dial  (was 1.7)
    canvasWidth: 100, //◄── SIZE      canvas
    canvasY: 5, //      ◄── VERTICAL  canvas (whole group)

    bgSize: 150, //  ◄── SIZE      spin background
    bgY: 7, //       ◄── VERTICAL  spin background

    carSize: 100, //  ◄── SIZE      car
    carScale: 0.8, // ◄── SIZE      car (fine)
    carY: 4, //       ◄── VERTICAL  car

    headingSize: 2.6, // ◄── SIZE      heading
    nameSize: 8.6, //    ◄── SIZE      colour name
    textY: 2, //         ◄── VERTICAL  text block
    textGap: -0.4, //    ◄── VERTICAL  heading → name gap
  },

  /* ────── TABLET / HALF OF 1920 MONITOR — 768 to 1023px ────── */
  md: {
    ratio: 1.6, //      master dial  (was 2.0)
    canvasWidth: 100, //◄── SIZE      canvas
    canvasY: 7, //      ◄── VERTICAL  canvas (whole group)

    bgSize: 150, //  ◄── SIZE      spin background
    bgY: 6, //       ◄── VERTICAL  spin background

    carSize: 100, //   ◄── SIZE      car
    carScale: 0.74, // ◄── SIZE      car (fine)
    carY: 3, //        ◄── VERTICAL  car

    headingSize: 2.0, // ◄── SIZE      heading
    nameSize: 6.9, //    ◄── SIZE      colour name
    textY: 2, //         ◄── VERTICAL  text block
    textGap: -0.35, //   ◄── VERTICAL  heading → name gap
  },

  /* ────────── SMALL LAPTOP WINDOW — 1024 to 1279px ────────── */
  lg: {
    ratio: 1.95, //     master dial  (was 2.15)
    canvasWidth: 100, //◄── SIZE      canvas
    canvasY: 5, //      ◄── VERTICAL  canvas (whole group)

    bgSize: 150, //  ◄── SIZE      spin background
    bgY: 6, //       ◄── VERTICAL  spin background

    carSize: 100, //   ◄── SIZE      car
    carScale: 0.7, //  ◄── SIZE      car (fine)
    carY: 2.5, //      ◄── VERTICAL  car

    headingSize: 1.7, // ◄── SIZE      heading
    nameSize: 6.2, //    ◄── SIZE      colour name
    textY: 2, //         ◄── VERTICAL  text block
    textGap: -0.3, //    ◄── VERTICAL  heading → name gap
  },

  /* ────── FULL SCREEN 1440 LAPTOP — 1280 to 1535px ──────
     these are your known-good values — change these last   */
  xl: {
    ratio: 2.25, //     master dial  (unchanged)
    canvasWidth: 100, //◄── SIZE      canvas
    canvasY: 5, //      ◄── VERTICAL  canvas (whole group)

    bgSize: 118, //  ◄── SIZE      spin background
    bgY: 6, //       ◄── VERTICAL  spin background

    carSize: 100, //   ◄── SIZE      car
    carScale: 0.68, // ◄── SIZE      car (fine)
    carY: 2, //        ◄── VERTICAL  car

    headingSize: 1.53, // ◄── SIZE      heading  (= 22px at 1440)
    nameSize: 5.83, //    ◄── SIZE      colour name (= 84px at 1440)
    textY: 2, //          ◄── VERTICAL  text block
    textGap: -0.3, //     ◄── VERTICAL  heading → name gap
  },

  /* ────── FULL SCREEN 1920+ MONITOR — 1536px and up ────── */
  "2xl": {
    ratio: 2.25, //     master dial  (unchanged)
    canvasWidth: 100, //◄── SIZE      canvas
    canvasY: 5, //      ◄── VERTICAL  canvas (whole group)

    bgSize: 118, //  ◄── SIZE      spin background
    bgY: 6, //       ◄── VERTICAL  spin background

    carSize: 100, //   ◄── SIZE      car
    carScale: 0.68, // ◄── SIZE      car (fine)
    carY: 2, //        ◄── VERTICAL  car

    headingSize: 1.53, // ◄── SIZE      heading
    nameSize: 5.83, //    ◄── SIZE      colour name
    textY: 2, //          ◄── VERTICAL  text block
    textGap: -0.3, //     ◄── VERTICAL  heading → name gap
  },
};

/* ═══════════ end of tuning table — nothing below needs editing ═══════════ */

/* min-width for each key, in Tailwind's own order */
const BREAKPOINTS: Array<[string, number | null]> = [
  ["base", null],
  ["sm", 640],
  ["md", 768],
  ["lg", 1024],
  ["xl", 1280],
  ["2xl", 1536],
];

/* turn one Tune row into CSS custom properties.
   canvasWidth / canvasY are % of the SECTION, so they emit cqw / cqh.
   everything else is % of the CANVAS: canvas height = 100cqw ÷ ratio,
   so 1% of canvas height = (1 / ratio)cqw — that's why every vertical
   knob is divided by the ratio here and nowhere else. */
function toVars(t: Tune): string {
  const ch = (pct: number) => `${(pct / t.ratio).toFixed(4)}cqw`;
  return [
    `--ratio:${t.ratio}`,
    `--canvas-w:${t.canvasWidth}cqw`,
    `--canvas-y:${t.canvasY}cqh`,
    `--bg-size:${t.bgSize}%`,
    `--bg-y:${ch(t.bgY)}`,
    `--car-size:${t.carSize}%`,
    `--car-scale:${t.carScale}`,
    `--car-y:${ch(t.carY)}`,
    `--heading-size:${t.headingSize}cqw`,
    `--name-size:${t.nameSize}cqw`,
    `--text-y:${ch(t.textY)}`,
    `--text-gap:${ch(t.textGap)}`,
  ].join(";");
}

/* built once at module load, so server and client render the same string.
   --safe-top starts at 0 and is overwritten once the sticky bar is measured. */
const STAGE_CSS =
   `#visualizer{--safe-top:116px}@media (min-width:768px){#visualizer{--safe-top:72px}}` +  BREAKPOINTS.map(([key, min]) => {
    const body = `#visualizer{${toVars(TUNE[key])}}`;
    return min === null ? body : `@media (min-width:${min}px){${body}}`;
  }).join("");

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
  const [intIdx, setIntIdx] = useState(0); // interior trim
  const colors = model.visualizer.colors;
  const color = colors[colorIdx];
  const interiors = model.visualizer.interiorColors ?? []; // trims
  const interior = interiors[intIdx];
  const panoSrc = interior?.panorama; // active trim panorama
  const heading =
    whichColor?.trim() ||
    (isAr ? "أي لون يبدو الأفضل؟" : "Which color looks best?");

  const sectionRef = useRef<HTMLElement>(null);

  // exterior spin: map drag distance → frame index
  const [frame, setFrame] = useState(0);
  const dragging = useRef(false);
  const lastX = useRef(0);
  const acc = useRef(0);
  const frames = color?.spinFrames ?? [];

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

  /* measure the sticky sub-nav → --safe-top.
     its mobile height changes with the brochure button and it reflows
     on rotate, so this watches rather than reading once */
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const bar = document.querySelector<HTMLElement>(SAFE_TOP_SELECTOR);
    const apply = () => {
      const h = bar ? bar.getBoundingClientRect().height : 0;
      section.style.setProperty("--safe-top", `${Math.round(h)}px`);
    };
    apply();
    if (!bar) return;
    const ro = new ResizeObserver(apply);
    ro.observe(bar);
    window.addEventListener("resize", apply);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", apply);
    };
  }, []);

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
    /* full screen, and the SIZE CONTAINER the canvas measures against */
    <section
      ref={sectionRef}
      id="visualizer"
      className="scroll-mt-36 relative overflow-hidden bg-white w-full"
      style={{
        containerType: "size",
        height: SECTION_HEIGHT,
        minHeight: SECTION_MIN_HEIGHT,
      }}
    >
      {/* the tuning table above, compiled to CSS variables per breakpoint */}
      <style dangerouslySetInnerHTML={{ __html: STAGE_CSS }} />

      {tab === "exterior" ? (
        <div
          className="absolute inset-0 select-none touch-pan-y"
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
              {/* ── the canvas everything is measured against ──────
                  available height = section height minus the sticky
                  sub-nav, so the canvas fits what's actually visible */}
              <div
                className="absolute left-1/2 -translate-x-1/2"
                style={{
                  width:
                    "min(var(--canvas-w), calc(100cqh * var(--ratio)))",
                  top: "var(--canvas-y)",
                  aspectRatio: "var(--ratio)",
                  containerType: "inline-size",
                }}
              >
                {/* SPIN BACKGROUND — driven by bgSize / bgY */}
                {/* eslint-disable-next-line @next/next/no-img-element -- decorative, no optimizer round-trip needed */}
                <img
                  src="/images/spinback.png"
                  alt=""
                  aria-hidden
                  draggable={false}
                  className="absolute left-1/2 top-1/2 max-w-none pointer-events-none select-none"
                  style={{
                    width: "var(--bg-size)",
                    transform: "translate(-50%, -50%) translateY(var(--bg-y))",
                  }}
                />

                {/* HEADING + COLOUR NAME — driven by textY / textGap /
                    headingSize / nameSize */}
                <div
                  className="absolute inset-x-0 text-center pointer-events-none px-[2%]"
                  style={{ top: "var(--text-y)" }}
                >
                  <p
                    className="text-[#111] font-bold"
                    style={{ fontSize: "var(--heading-size)", lineHeight: 1.2 }}
                  >
                    {heading}
                  </p>
                  <p
                    className="text-[#111] font-bold tracking-tight"
                    style={{
                      fontSize: "var(--name-size)",
                      lineHeight: 0.95,
                      marginTop: "var(--text-gap)",
                    }}
                  >
                    {colorName}
                  </p>
                </div>

                {/* CAR FRAMES — driven by carSize / carScale / carY */}
                {/* eslint-disable-next-line @next/next/no-img-element -- hot-swapped per drag frame; next/image would fire an optimize request per frame */}
                <img
                  src={frames[frame]}
                  alt=""
                  draggable={false}
                  className="absolute left-1/2 top-1/2 h-full max-w-none object-contain
                    pointer-events-none select-none z-[1]"
                  style={{
                    width: "var(--car-size)",
                    transform:
                      "translate(-50%, -50%) translateY(var(--car-y)) scale(var(--car-scale))",
                  }}
                />
              </div>

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
            <Pannellum360
              id={`interior-360-${model.slug}-${intIdx}`}
              src={panoSrc}
            />
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

      <div className="absolute bottom-5 inset-x-0 z-[2] flex flex-col items-center pointer-events-none">
        <p
          className={`text-sm font-semibold mb-2 ${
            tab === "interior" ? "text-white" : "text-[#111]"
          }`}
        >
          {tab === "exterior"
            ? isAr
              ? color?.nameAr
              : color?.nameEn
            : isAr
            ? interior?.nameAr
            : interior?.nameEn}
        </p>

        {/* exterior paint swatches */}
        {tab === "exterior" && (
          <div className="flex items-center gap-3 pointer-events-auto">
            <button
              onClick={() =>
                selectColor((i) => (i - 1 + colors.length) % colors.length)
              }
              aria-label="Previous color"
              className="w-8 h-8 rounded-full bg-white shadow flex items-center justify-center"
            >
              ‹
            </button>

            {colors.map((c, i) => (
              <button
                key={`${c.hex ?? c.nameEn}-${i}`}
                onClick={() => selectColor(i)}
                title={isAr ? c.nameAr : c.nameEn}
                className={`w-7 h-7 rounded border-2 transition-transform ${
                  colorIdx === i
                    ? "border-[#111] scale-110"
                    : "border-transparent"
                }`}
                style={{ backgroundColor: c.hex ?? "#ccc" }}
              />
            ))}

            <button
              onClick={() => selectColor((i) => (i + 1) % colors.length)}
              aria-label="Next color"
              className="w-8 h-8 rounded-full bg-white shadow flex items-center justify-center"
            >
              ›
            </button>
          </div>
        )}

        {/* interior trim swatches */}
        {tab === "interior" && interiors.length > 0 && (
          <div className="flex items-center gap-3 pointer-events-auto">
            <button
              onClick={() =>
                setIntIdx((i) => (i - 1 + interiors.length) % interiors.length)
              }
              className="w-8 h-8 rounded-full bg-white shadow flex items-center justify-center"
            >
              ‹
            </button>
            {interiors.map((c, i) => (
              <button
                key={c.hex}
                onClick={() => setIntIdx(i)}
                title={isAr ? c.nameAr : c.nameEn}
                className={`w-7 h-7 rounded border-2 transition-transform ${
                  intIdx === i ? "border-white scale-110" : "border-transparent"
                }`}
                style={{ backgroundColor: c.hex }}
              />
            ))}
            <button
              onClick={() => setIntIdx((i) => (i + 1) % interiors.length)}
              className="w-8 h-8 rounded-full bg-white shadow flex items-center justify-center"
            >
              ›
            </button>
          </div>
        )}
      </div>
    </section>
  );
}