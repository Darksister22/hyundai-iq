"use client";

import { useRef,useEffect } from "react";
import Image from "next/image";

interface Props {
  hoverVideo?: string | null;
  hoverImage?: string | null;
  alt: string;
  label:string;
  active: boolean;
}


export default function CarHoverMedia({ hoverVideo, hoverImage, alt, active ,label}: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);

  // Play/pause driven by the parent's hover state rather than the video's own
  // mouse events, so it can't desync from the card's visual state.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (active) {
      video.play().catch(() => {}); // autoplay can reject; not worth surfacing
    } else {
      video.pause();
      video.currentTime = 0;
    }
  }, [active]);

  if (!hoverVideo && !hoverImage) return null;

  return (
    <div
      className={`absolute inset-0 transition-opacity duration-500 ${
        active ? "opacity-100" : "opacity-0"
      }`}
    >
      {hoverVideo ? (
        <video
          ref={videoRef}
          src={hoverVideo}
          poster={hoverImage ?? undefined}
          muted
          loop
          playsInline
          preload="none"
          className="w-full h-full object-cover"
        />
      ) : (
        <Image
          src={hoverImage!}
          alt={alt}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover"
        />
      )}

{/* dark scrim + centered discover text */}
      <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
        <span className="inline-flex items-center gap-2 text-white text-lg font-semibold">
          {label}
          <span aria-hidden className="inline-block">›</span>
        </span>
      </div>
    </div>
  );
}