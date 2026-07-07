"use client";

import { useEffect, useRef, useState } from "react";

interface Props {
  frames: string[];
  className?: string;
}

export default function CarSpinner({ frames, className = "" }: Props) {
  const [frame, setFrame] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const dragging = useRef(false);
  const lastX = useRef(0);

  // preload all frames so rotation is seamless (no flash)
  useEffect(() => {
    if (frames.length === 0) return;
    setLoaded(false);
    setFrame(0);
    let done = 0;
    let cancelled = false;
    const imgs: HTMLImageElement[] = [];
    frames.forEach((src) => {
      const img = new window.Image();
      img.onload = img.onerror = () => {
        done += 1;
        if (!cancelled && done === frames.length) setLoaded(true);
      };
      img.src = src;
      imgs.push(img);
    });
    return () => {
      cancelled = true;
      imgs.forEach((i) => (i.onload = i.onerror = null));
    };
  }, [frames]);

  const down = (x: number) => {
    dragging.current = true;
    lastX.current = x;
  };
  const move = (x: number) => {
    if (!dragging.current || frames.length === 0) return;
    const dx = x - lastX.current;
    if (Math.abs(dx) > 12) {
      const dir = dx > 0 ? 1 : -1;
      setFrame((f) => (f + dir + frames.length) % frames.length);
      lastX.current = x;
    }
  };
  const up = () => {
    dragging.current = false;
  };

  if (frames.length === 0) return null;

  return (
    <div
      className={`relative select-none spin-cursor swiper-no-swiping ${className}`}
      onMouseDown={(e) => {
        e.stopPropagation();
        down(e.clientX);
      }}
      onMouseMove={(e) => move(e.clientX)}
      onMouseUp={up}
      onMouseLeave={up}
      onTouchStart={(e) => {
        e.stopPropagation();
        down(e.touches[0].clientX);
      }}
      onTouchMove={(e) => {
        e.stopPropagation();
        move(e.touches[0].clientX);
      }}
      onTouchEnd={up}
    >
      <img
        src={frames[frame]}
        alt=""
        draggable={false}
        className="w-full h-full object-contain pointer-events-none"
      />

      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
        </div>
      )}

      {/* drag handle hint
      <div className="absolute left-1/2 bottom-2 -translate-x-1/2 bg-white shadow px-2 py-1 rounded pointer-events-none">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path
            d="M8 8l-4 4 4 4M16 8l4 4-4 4"
            stroke="#111"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div> */}
    </div>
  );
}