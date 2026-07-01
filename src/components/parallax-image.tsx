"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Oversized image that drifts within a clipped frame on scroll,
// and zooms in on hover. Swap the inner div for <Image fill> later.
export default function ParallaxImage({
  label,
  className = "",
}: {
  label: string;       // placeholder text until real images arrive
  className?: string;   // height/rounded utilities for the frame
}) {
  const inner = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!inner.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        inner.current,
        { yPercent: -12 },
        {
          yPercent: 12,
          ease: "none",
          scrollTrigger: {
            trigger: inner.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        }
      );
    });
    return () => ctx.revert();
  }, []);

  return (
    <div className={`relative overflow-hidden group ${className}`}>
      {/* scale-125 = overscan for parallax; group-hover bumps it for the zoom */}
      <div
        ref={inner}
        className="absolute inset-0 scale-125 transition-transform duration-700 ease-out group-hover:scale-[1.4] bg-gradient-to-br from-gray-200 to-gray-400 flex items-center justify-center text-sm text-gray-500"
      >
        {/* replace with: <Image src="/images/about/..." alt="" fill className="object-cover" /> */}
        {label}
      </div>
    </div>
  );
}