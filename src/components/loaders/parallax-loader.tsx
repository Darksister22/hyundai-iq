"use client";
import { useEffect, useRef } from "react";
import ImageWithLoader from "@/components/loaders/loading-image";

// Subtle parallax: the wrapper drifts on scroll; image scaled up so no edge shows.
export default function ParallaxLoader({ src, alt = "" }: { src: string; alt?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onScroll = () => {
      const r = el.getBoundingClientRect();
      const progress = (r.top + r.height / 2 - window.innerHeight / 2) / window.innerHeight;
      el.style.transform = `translateY(${progress * -30}px)`;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div ref={ref} className="absolute inset-0 scale-110 will-change-transform">
      <ImageWithLoader src={src} unoptimized alt={alt} fill className="object-cover" />
    </div>
  );
}