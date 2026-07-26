"use client";

import { useState } from "react";
import Image, { type ImageProps } from "next/image";

// Drop-in replacement for content images (NOT banners). While the image
// downloads it shows a bordered placeholder with the same pulsing dots as
// RouteLoadingScreen; on load it cross-fades the photo in.
//
// Requires a positioned parent with a real height (relative + aspect/h-*),
// since it uses `fill` to sit inside whatever box you give it.
export default function LoadingImage({
  className = "",
  wrapperClassName = "",
  ...props
}: ImageProps & { wrapperClassName?: string }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className={`relative overflow-hidden ${wrapperClassName}`}>
      {/* placeholder — visible until the image reports load */}
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center rounded-[inherit] border border-gray-200 bg-gray-50">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#002C5F] animate-pulse [animation-duration:1s]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#002C5F] animate-pulse [animation-duration:1s] [animation-delay:0.2s]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#002C5F] animate-pulse [animation-duration:1s] [animation-delay:0.4s]" />
          </div>
        </div>
      )}

      <Image
        {...props}
        onLoad={() => setLoaded(true)}
        className={`transition-opacity duration-500 ${loaded ? "opacity-100" : "opacity-0"} ${className}`}
      />
    </div>
  );
}