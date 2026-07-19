"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

export default function ParallaxImage({
  src, alt = "", label, className = "", priority = false,
}: {
  src?: string; alt?: string; label?: string; className?: string; priority?: boolean;
}) {
  const drift = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false); // track broken/missing image

useEffect(() => {
  if (!drift.current) return;
  const mobile = window.matchMedia("(max-width: 767px)").matches;
  const ctx = gsap.context(() => {
    gsap.fromTo(drift.current,
      { yPercent: mobile ? -10 : -18 },
      {
        yPercent: mobile ? 10 : 18,
        ease: "none",
        scrollTrigger: {
          trigger: drift.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,          
        },
      });
  });
  return () => ctx.revert();     
}, []);

  // show image only if src exists AND hasn't failed to load
  const showImage = src && !failed;

  return (
    <div className={`relative overflow-hidden group ${className}`}>
      <div ref={drift} className="absolute inset-0 scale-[1.2] md:scale-[1.35]">
        <div className="relative w-full h-full transition-transform duration-700 ease-out group-hover:scale-110">
          {showImage ? (
            <Image
              src={src!}
              alt={alt}
              fill
              priority={priority}
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
              onError={() => setFailed(true)} // invalid path → fall back to gradient
            />
          ) : (
            // gradient + optional label when no/broken src
            <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-400 flex items-center justify-center text-sm text-gray-500">
              {label ?? alt}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}