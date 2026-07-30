"use client";
import { useEffect, useRef } from "react";
import ImageWithLoader from "@/components/loaders/loading-image";

export default function ParallaxLoader({
  src,
  alt = "",
  unoptimized = false,   // opt in per image, like ImageWithLoader
}: {
  src: string;
  alt?: string;
  unoptimized?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onScroll = () => {
      const r = el.parentElement!.getBoundingClientRect();
      const progress = (r.top + r.height / 2 - window.innerHeight / 2) / window.innerHeight;
      el.style.transform = `translateY(${progress * -30}px)`;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden">
      <div ref={ref} className="absolute inset-0 scale-y-110 will-change-transform">
        <ImageWithLoader src={src} alt={alt} fill unoptimized={unoptimized} className="object-cover" />
      </div>
    </div>
  );
}