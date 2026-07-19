"use client";

import Image from "next/image";
import { useState } from "react";

export default function CallCenterPhoto({ src, alt }: { src: string; alt: string }) {
  const [failed, setFailed] = useState(false);

  return (
    // min-h guards against the wrapper collapsing if aspect-ratio fails
    <div className="relative w-full aspect-[4/3] min-h-[320px] overflow-hidden rounded-xl bg-gray-100">
      {!failed ? (
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover"
          onError={() => setFailed(true)}
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center text-gray-300">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
            <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.5" />
            <circle cx="8.5" cy="8.5" r="1.5" stroke="currentColor" strokeWidth="1.5" />
            <path d="M21 15l-5-5L5 21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>
      )}
    </div>
  );
}