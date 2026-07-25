"use client";

import { useState } from "react";
import Link from "next/link";
import type { FindCarCar, FindCarCategory } from "@/lib/find-car-data";
import type { Locale } from "@/lib/i18n";

export default function FooterVehicles({
  locale,
  cars,
  categories,
  heading,
}: {
  locale: Locale;
  cars: FindCarCar[];
  categories: FindCarCategory[];
  heading: string;
}) {
  const isAr = locale === "ar";
  const [open, setOpen] = useState<number | null>(null); // one category open at a time

  // group cars under their category, keeping category sort order,
  // dropping empty categories
  const grouped = categories
    .map((cat) => ({ cat, cars: cars.filter((c) => c.categoryId === cat.id) }))
    .filter((g) => g.cars.length > 0);

  return (
    <div>
      <h4 className="text-sm font-semibold mb-4">{heading}</h4>

      <ul className="space-y-1">
        {grouped.map(({ cat, cars }) => {
          const isOpen = open === cat.id;
          return (
            <li key={cat.id}>
              <button
                onClick={() => setOpen(isOpen ? null : cat.id)}
                aria-expanded={isOpen}
                className="w-full flex items-center justify-between gap-2 py-1.5 text-sm text-white/70 hover:text-white transition-colors text-start"
              >
                {isAr ? cat.nameAr ?? cat.nameEn : cat.nameEn}
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  className={`shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                >
                  <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              {/* grid-rows trick animates to auto height without measuring */}
              <div className={`grid transition-all duration-300 ease-out ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                <div className="overflow-hidden">
                  <ul className="ps-3 py-1 space-y-2 border-s border-white/10">
                    {cars.map((car) => (
                      <li key={car.slug}>
                        <Link
                          href={`/${locale}/models/${car.slug}`}
                          className="block text-sm text-white/50 hover:text-white transition-colors"
                        >
                          {isAr ? car.nameAr ?? car.nameEn : car.nameEn}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}