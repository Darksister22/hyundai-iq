"use client";

import { useRef,useEffect } from "react";
import Image from "next/image";

interface Props {
  hoverVideo?: string | null;
  hoverImage?: string | null;
  alt: string;
  /** true while the parent card is hovered */
  active: boolean;
}


export default function CarHoverMedia({ hoverVideo, hoverImage, alt, active }: Props) {
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
      aria-hidden
    >
      {hoverVideo ? (
        <video
          ref={videoRef}
          src={hoverVideo}
          poster={hoverImage ?? undefined}
          muted
          loop
          playsInline
          preload="none"            // don't download until it's actually needed
          className="w-full h-full object-contain"
        />
      ) : (
        <Image
          src={hoverImage!}
          alt={alt}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-contain"
        />
      )}
    </div>
  );
}