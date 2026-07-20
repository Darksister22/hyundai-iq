"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import OfferDetails from "./offer-details";
import type { OfferCar } from "@/lib/offers-data";
import type { Locale } from "@/lib/i18n";

export default function OfferCarousel({
  locale,
  cars,
  detailsHeading,
  discoverLabel,
}: {
  locale: Locale;
  cars: OfferCar[];
  detailsHeading: string;
  discoverLabel: string;
}) {
  const isAr = locale === "ar";
  const [active, setActive] = useState(0);
  const car = cars[active];

  const go = (dir: number) => setActive((i) => (i + dir + cars.length) % cars.length);

  return (
    <div>
      {/* slide */}
      <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl bg-gray-100">
        <Image
          key={car.image}
          src={car.image}
          alt={isAr ? car.name.ar : car.name.en}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 1200px"
          className="object-cover animate-[fadeIn_300ms_ease-out]"
        />

        {cars.length > 1 && (
          <>
            {/* arrows are physical (dir=ltr) so prev is always visually left */}
            <div dir="ltr" className="absolute inset-0 flex items-center justify-between px-4 pointer-events-none">
              <button
                onClick={() => go(-1)}
                aria-label="Previous"
                className="pointer-events-auto w-11 h-11 rounded-full bg-white/85 hover:bg-white flex items-center justify-center text-[#002C5F] transition-colors"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M15 5l-7 7 7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <button
                onClick={() => go(1)}
                aria-label="Next"
                className="pointer-events-auto w-11 h-11 rounded-full bg-white/85 hover:bg-white flex items-center justify-center text-[#002C5F] transition-colors"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>

            {/* dots */}
            <div className="absolute bottom-4 inset-x-0 flex justify-center gap-2">
              {cars.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  aria-label={`Slide ${i + 1}`}
                  className={`h-2 rounded-full transition-all ${
                    active === i ? "w-6 bg-white" : "w-2 bg-white/50 hover:bg-white/80"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* car name + discover more */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-2xl md:text-3xl font-bold text-[#111]">
          {isAr ? car.name.ar : car.name.en}
        </h2>
        <Link
          href={`/${locale}/models/${car.modelSlug}`}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#002C5F] text-white text-sm font-semibold hover:bg-[#003d7a] transition-colors"
        >
          {discoverLabel}
          <span aria-hidden className="rtl:rotate-180">›</span>
        </Link>
      </div>

      {/* details for the active car */}
      <div className="mt-10 border-t border-gray-200">
        <OfferDetails
          key={car.modelSlug}
          locale={locale}
          heading={detailsHeading}
          details={car.details}
          ctaValue={car.ctaValue}
        />
      </div>
    </div>
  );
}