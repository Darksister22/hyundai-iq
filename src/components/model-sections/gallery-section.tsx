"use client";

import { useState, useEffect, useCallback } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import type { Locale } from "@/lib/i18n";
import type { VehicleModel } from "@/lib/models-data";

import "swiper/css";
import "swiper/css/navigation";
import Reveal from "../reveal";
import ImageWithLoader from "../loaders/loading-image";

interface Props {
  locale: Locale;
  model: VehicleModel;
  heading: string;
}

export default function GallerySection({ locale, model, heading }: Props) {
  const [active, setActive] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  const total = model.gallery.length;
  const isRTL = locale === "ar";

  // Wrap around at both ends so the lightbox never dead-ends.
  const next = useCallback(() => setActive((i) => (i + 1) % total), [total]);
  const prev = useCallback(() => setActive((i) => (i - 1 + total) % total), [total]);

  // Keyboard nav + Escape. Bound only while the lightbox is open.
  useEffect(() => {
    if (!isOpen) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
      // In RTL the visual left arrow should advance forward, matching reading order.
      else if (e.key === "ArrowRight") (isRTL ? prev : next)();
      else if (e.key === "ArrowLeft") (isRTL ? next : prev)();
    };

    // Lock background scroll while the overlay is up, restore on close.
    const prevOverflow = document.body.style.overflow;
    const prevPadding = document.body.style.paddingRight;
    const scrollbarW = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    document.body.style.paddingRight = `${scrollbarW}px`;
    window.addEventListener("keydown", onKey);

    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      document.body.style.paddingRight = prevPadding;
    };
  }, [isOpen, isRTL, next, prev]);

  return (
    <section id="gallery" className="bg-white py-20 scroll-mt-36">
      <Reveal>
        <h2 className="text-4xl md:text-5xl font-bold text-[#111] text-center mb-12">
          {heading}
        </h2>
      </Reveal>

      <div className="max-w-[1400px] mx-auto px-8">
        {/* Main image — aspect-ratio box, object-contain, no cropping. */}
        <div className="relative aspect-[16/9] max-h-[70lvh] w-full rounded-lg overflow-hidden mb-4 bg-neutral-100 flex items-center justify-center text-gray-500 text-sm">
          {model.gallery[active] ? (

            <ImageWithLoader src={model.gallery[active]}
              alt={`Gallery image ${active + 1}`}
              fill
              unoptimized
              className="absolute inset-0 w-full h-full object-contain" />
          ) : (
            <>Gallery image {active + 1}</>
          )}

          {/* Opens the lightbox at the currently selected image. */}
          <button
            onClick={() => setIsOpen(true)}
            aria-label="View fullscreen"
            className="absolute top-4 right-2 z-10 -translate-x-1/2 bg-white/80 hover:bg-white w-10 h-10 rounded flex items-center justify-center transition-colors"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path
                d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"
                stroke="#111"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        {/* Thumbnail strip */}
<Swiper
          key={total}              // force re-init when the gallery count changes
          modules={[Navigation]}
          navigation
          observer                 // re-init if the DOM/slides mutate
          observeParents           // ...or if an ancestor's size changes
          spaceBetween={12}
          slidesPerView="auto"     // width comes from each slide, not a fraction
          onSwiper={(s) => console.log("[gallery] swiper init:", s.slides.length)} // TEMP: remove once confirmed
        >
          {model.gallery.map((img, i) => (
            // that don't depend on container math. ! overrides Swiper's inline width.
            <SwiperSlide key={i} className="!h-20 !w-40">
              <button
                onClick={() => setActive(i)}
                // relative + full size: anchors the fill image to THIS button
                className={`group relative h-20 w-40 rounded overflow-hidden border-2 transition-colors ${
                  active === i ? "border-[#002C5F]" : "border-transparent"
                }`}
              >
                {img ? (
                  <ImageWithLoader
                    src={img}
                    alt={`Thumbnail ${i + 1}`}
                    loading="lazy"
                    fill
                    unoptimized
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                ) : (
                  <div className="h-full w-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center text-[10px] text-gray-400">
                    {i + 1}
                  </div>
                )}
              </button>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* ---------- Lightbox ---------- */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Image gallery"
          // Backdrop click closes. dir=ltr keeps arrow placement physical,
          // so prev is always on the visual left regardless of locale.
          dir="ltr"
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center animate-[fadeIn_150ms_ease-out]"
        >
          {/* Close */}
          <button
            onClick={() => setIsOpen(false)}
            aria-label="Close"
            className="absolute top-5 right-5 z-10 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>

          {/* Counter */}
          <span className="absolute top-7 left-1/2 -translate-x-1/2 text-white/70 text-sm tabular-nums">
            {active + 1} / {total}
          </span>

          {/* Prev / Next. stopPropagation so clicking them doesn't close the dialog. */}
          {total > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); prev(); }}
                aria-label="Previous image"
                className="absolute left-4 md:left-8 z-10 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M15 5l-7 7 7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); next(); }}
                aria-label="Next image"
                className="absolute right-4 md:right-8 z-10 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </>
          )}

          {/* The image itself. stopPropagation so clicking the photo doesn't close. */}

      <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-[92vw] h-[88lvh]"
          >
            <ImageWithLoader
              src={model.gallery[active]}
              alt={`Gallery image ${active + 1}`}
              fill
              unoptimized
              className="object-contain select-none"
            />
          </div>
        </div>
      )}
    </section>
  );
}