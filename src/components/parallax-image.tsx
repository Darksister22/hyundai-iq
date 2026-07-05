"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function ParallaxImage({
  src,
  alt = "",
  label,
  className = "",
  priority = false,
}: {
  src?: string;
  alt?: string;
  label?: string;
  className?: string;
  priority?: boolean;
}) {
  const drift = useRef<HTMLDivElement>(null); // GSAP moves this (transform: translateY)
useEffect(() => {
  if (!drift.current) return;
  const mobile = window.matchMedia("(max-width: 767px)").matches;
  const ctx = gsap.context(() => {
    gsap.fromTo(
      drift.current,
      { yPercent: mobile ? -10 : -18 },
      {
        yPercent: mobile ? 10 : 18,      // still dramatic, but within scale-1.2
        ease: "none",
        scrollTrigger: {
          trigger: drift.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      }
    );
  });
  ScrollTrigger.refresh();
  return () => ctx.revert();
}, []);
  return (
    <div className={`relative overflow-hidden group ${className}`}>
      {/* outer: GSAP-controlled vertical drift (overscan via scale-125) */}
<div ref={drift} className="absolute inset-0 scale-[1.2] md:scale-[1.35]">   {/* was scale-125 */}
            {/* inner: hover zoom lives here so it doesn't clash with GSAP's transform */}
        <div className="relative w-full h-full transition-transform duration-700 ease-out group-hover:scale-110">
          {src ? (
            <Image
              src={src}
              alt={alt}
              fill
              priority={priority}
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-400 flex items-center justify-center text-sm text-gray-500">
              {label}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}