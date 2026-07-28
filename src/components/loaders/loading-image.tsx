"use client";

import { useState } from "react";
import Image, { type ImageProps } from "next/image";

// Drop-in <Image> replacement with a centered loading spinner.
// Pass `unoptimized` for detail-critical product shots (serves the original
// file untouched — full fidelity, larger bytes). Omit it for incidental
// images to keep Next's optimization.
export default function ImageWithLoader({
  className = "",
  fill,
  sizes,
  alt,
  unoptimized = false, // opt in per image
  ...props
}: ImageProps) {
  const [loaded, setLoaded] = useState(false);

  // sizes is irrelevant when unoptimized (no variants are generated),
  // so only apply the fill default for optimized images
  const resolvedSizes = unoptimized
    ? undefined
    : fill
    ? sizes ?? "(max-width: 768px) 100vw, 50vw"
    : sizes;

  const spinner = !loaded && (
    <span className="absolute inset-0 flex items-center justify-center bg-gray-50 pointer-events-none">
      <span className="flex items-center gap-2">
        <span className="w-2.5 h-2.5 rounded-full bg-[#002C5F] animate-pulse [animation-duration:1s]" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#002C5F] animate-pulse [animation-duration:1s] [animation-delay:0.2s]" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#002C5F] animate-pulse [animation-duration:1s] [animation-delay:0.4s]" />
      </span>
    </span>
  );

  const img = (
    <Image
      {...props}
      alt={alt}
      fill={fill}
      sizes={resolvedSizes}
      unoptimized={unoptimized}
      quality={100}
      onLoad={() => setLoaded(true)}
      className={`transition-opacity duration-500 ${loaded ? "opacity-100" : "opacity-0"} ${className}`}
    />
  );

  if (fill) {
    return (
      <>
        {spinner}
        {img}
      </>
    );
  }

  return (
    <span className="relative inline-block">
      {img}
      {spinner}
    </span>
  );
}