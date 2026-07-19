"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

// Scroll-driven guarantee section. The wrapper is N screens tall; the stage
// sticks while you scroll through it.
//   images → translated continuously, locked to scroll position (no timed
//            animation), so they move exactly as fast as you scroll
//   text   → snaps to the nearest step, with a timed fade
export default function GenuinePartsScroll({
  prefix,
  guarantees,
  images,
}: {
  prefix: string;
  guarantees: string[];
  images: string[];
}) {
  const ref = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const count = guarantees.length;

  // widest word reserves the slot so the fixed prefix never jumps
  const longest = guarantees.reduce((a, b) => (b.length > a.length ? b : a), "");

  useEffect(() => {
    const el = ref.current;
    if (!el || count === 0) return;

    const pick = () => {
      const rect = el.getBoundingClientRect();
      const scrollable = rect.height - window.innerHeight;
      if (scrollable <= 0) return;

      // 0 → 1 progress through the tall wrapper
      const p = Math.min(Math.max(-rect.top / scrollable, 0), 1);

      // Images: continuous. Written straight to the DOM rather than through
      // state, so there's no re-render per scroll frame and no easing lag.
      if (trackRef.current) {
        trackRef.current.style.transform = `translateY(-${p * (count - 1) * 100}%)`;
      }

      // Text: nearest step. Guarded so it only re-renders when it changes.
      const step = Math.round(p * (count - 1));
      setActive((prev) => (prev === step ? prev : step));
    };

    // rAF so the first read happens after layout
    const raf = requestAnimationFrame(pick);
    window.addEventListener("scroll", pick, { passive: true });
    window.addEventListener("resize", pick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", pick);
      window.removeEventListener("resize", pick);
    };
  }, [count]);

  return (
    // one viewport of scroll per guarantee
    <div ref={ref} style={{ height: `${count * 100}svh` }} className="relative">
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        {/* sliding image track — no CSS transition; scroll drives it directly */}
        <div ref={trackRef} className="h-full flex flex-col will-change-transform">
          {guarantees.map((g, i) => (
            <div key={i} className="h-full shrink-0 relative bg-gray-200">
              {images[i] && (
                <Image
                  src={images[i]}
                  alt={g}
                  fill
                  priority={i === 0}
                  sizes="100vw"
                  className="object-cover"
                />
              )}
            </div>
          ))}
        </div>

        {/* scrim so the white text stays legible over any image */}
        <div className="absolute inset-0 bg-black/35 pointer-events-none" />

        {/* fixed prefix + stepped word stack */}
        <div className="absolute inset-0 flex items-center justify-center px-6 pointer-events-none">
          <div className="flex items-center gap-3 text-3xl md:text-6xl font-bold text-white">
            <span className="whitespace-nowrap">{prefix}</span>

            <div className="relative h-[1.15em]">
              {/* invisible widest word reserves the width */}
              <span className="invisible whitespace-nowrap">{longest}</span>
              <div
                className="absolute inset-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
                style={{ transform: `translateY(-${active * 100}%)` }}
              >
                {guarantees.map((g, i) => (
                  <p
                    key={i}
                    className={`h-[1.15em] leading-[1.15em] whitespace-nowrap text-start transition-opacity duration-500 ${
                      active === i ? "opacity-100" : "opacity-30"
                    }`}
                  >
                    {g}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}