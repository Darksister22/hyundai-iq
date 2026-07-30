"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

interface Props {
  hoverImage?: string | null; // may be an image OR a video URL
  alt: string;
  label: string;
  active: boolean;
}

// treat common video extensions as video, everything else as image
const isVideo = (url: string) => /\.(mp4|webm|mov|m4v)(\?|$)/i.test(url);

export default function CarHoverMedia({ hoverImage, alt, label, active }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (active) video.play().catch(() => {});
    else { video.pause(); video.currentTime = 0; }
  }, [active]);

  if (!hoverImage) return null;

  const video = isVideo(hoverImage);

  return (
    <div className={`absolute inset-0 transition-opacity duration-500 ${active ? "opacity-100" : "opacity-0"}`}>
      {video ? (
        <video
          ref={videoRef}
          src={hoverImage}
          muted
          loop
          playsInline
          preload="none"
          className="w-full h-full object-cover"
        />
      ) : (
        <Image
          src={hoverImage}
          alt={alt}
          fill
          unoptimized
          className="object-cover"
        />
      )}

      <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
        <span className="inline-flex items-center gap-2 text-white text-lg font-semibold">
          {label}
          <span aria-hidden className="inline-block rtl:rotate-180">›</span>
        </span>
      </div>
    </div>
  );
}