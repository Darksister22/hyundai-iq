"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";
import type { Locale } from "@/lib/i18n";
import type { FindCarCategory, FindCarCar } from "@/lib/find-car-data";

interface Props {
  locale: Locale;
  open: boolean;
  onClose: () => void;
  allCarsLabel: string;          // "All Cars" tab label (from dict)
  categories: FindCarCategory[]; // DB categories, already ordered by sort_order
  cars: FindCarCar[];            // DB cars, already ordered by sort_order
  navHeight?: number;
}

// "all" or a category id from the DB
type CategoryFilter = "all" | number;

export default function FindCarPanel({
  locale,
  open,
  onClose,
  allCarsLabel,
  categories,
  cars,
  navHeight = 72,
}: Props) {
  const isAr = locale === "ar";
  const panelRef = useRef<HTMLDivElement>(null);
  const catsRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const [category, setCategory] = useState<CategoryFilter>("all");
  const [mounted, setMounted] = useState(false);

  // localized label with English fallback
  const catLabel = (c: FindCarCategory) => (isAr ? c.nameAr ?? c.nameEn : c.nameEn);
  const carName = (m: FindCarCar) => (isAr ? m.nameAr ?? m.nameEn : m.nameEn);

  const tabs: { id: CategoryFilter; label: string }[] = [
    { id: "all", label: allCarsLabel },
    ...categories.map((c) => ({ id: c.id as CategoryFilter, label: catLabel(c) })),
  ];

  const filtered: FindCarCar[] =
    category === "all" ? cars : cars.filter((m) => m.categoryId === category);

  const tlRef = useRef<gsap.core.Timeline | null>(null);

  // mount as soon as the panel should open
  useEffect(() => {
    if (open) setMounted(true);
    // eslint-disable-next-line react-hooks/set-state-in-effect
  }, [open]);

  // Single animation driver for BOTH open and close.
  // Reacts to any open/mounted change, kills whatever timeline is
  // currently running, and animates from the panel's current state —
  // so interrupting a close with a reopen (or vice versa) can never
  // strand the panel in a dead open=true / mounted=false state.
  useEffect(() => {
    if (!mounted) return;
    tlRef.current?.kill();
    const tl = gsap.timeline();
    tlRef.current = tl;

    if (open) {
      tl.to(panelRef.current, { height: "auto", duration: 0.45, ease: "power3.inOut" })
        .fromTo(catsRef.current, { y: -12, opacity: 0 }, { y: 0, opacity: 1, duration: 0.3, ease: "power2.out" }, "-=0.1")
        .fromTo(gridRef.current, { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.35, ease: "power2.out" }, "-=0.05");
    } else {
      tl.to(gridRef.current, { y: 16, opacity: 0, duration: 0.25, ease: "power2.in" })
        .to(catsRef.current, { y: -12, opacity: 0, duration: 0.2, ease: "power2.in" }, "-=0.05")
        .to(panelRef.current, {
          height: 0,
          duration: 0.4,
          ease: "power3.inOut",
          onComplete: () => setMounted(false),
        });
    }

    return () => { tl.kill(); };
  }, [open, mounted]);

  useEffect(() => { //Close on click away / esc press
    if (!open) return;
    const onDown = (e: MouseEvent | TouchEvent) => {
      const target = e.target as HTMLElement;
      // clicks inside the panel OR inside the site header (e.g. the
      // "Find a Car" button) must not trigger the click-away close —
      // otherwise the header button closes and reopens in one gesture.
      if (panelRef.current && !panelRef.current.contains(target) && !target.closest("header")) {
        onClose();
      }
    };
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("touchstart", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("touchstart", onDown);
      document.removeEventListener("keydown", onKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // group fade when switching category (fixed panel height, so no re-measure)
  const onCategory = (id: CategoryFilter) => {
    if (id === category) return;
    gsap.to(gridRef.current, {
      opacity: 0,
      y: 10,
      duration: 0.15,
      ease: "power1.in",
      onComplete: () => {
        setCategory(id);
        gsap.fromTo(
          gridRef.current,
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.25, ease: "power2.out" }
        );
      },
    });
  };

  if (!mounted) return null;

  return (
    <div
      className="fixed inset-x-0 z-40"
      style={{ top: navHeight }}
      role="dialog"
      aria-modal="false"
    >
      <div
        ref={panelRef}
        className="bg-white shadow-xl overflow-hidden"
        style={{ height: 0 }}
      >
        <div className="h-[78vh] overflow-y-auto scrollbar-hide">
          <div className="max-w-[1400px] mx-auto px-8 pt-8 pb-20">
            {/* category selector (slider) + close */}
            <div ref={catsRef} className="mb-12">
              {/* close button — own row on mobile (flex end), absolute on desktop */}
              <div className="flex justify-end mb-4 md:mb-0 md:h-0 relative z-10">
                <button
                  onClick={onClose}
                  aria-label="Close"
                  className={`relative z-10 text-gray-400 hover:text-gray-700 transition-all duration-500 md:absolute md:top-0 ${isAr ? "md:left-0" : "md:right-0"
                    }`}
                >
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                    <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </button>
              </div>

              {/* category slider */}
              <div className="relative flex items-center justify-center">
                <div className="inline-flex bg-gray-100 rounded-full p-1 max-w-full overflow-x-auto overflow-y-hidden scrollbar-hide">
                  {tabs.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => onCategory(c.id)}
                      className={`px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${category === c.id ? "bg-white shadow text-[#111]" : "text-gray-500 hover:text-gray-800"
                        }`}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* car cards */}
            <div
              ref={gridRef}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filtered.map((m) => (
                <Link
                  key={m.id}
                  href={`/${locale}/models/${m.slug}`}
                  onClick={onClose}
                  className="group bg-gray-50 hover:bg-gray-100 rounded-xl p-8 transition-colors flex flex-col"
                >
                  <h3
                    className={`text-2xl font-bold text-[#111] mb-6 ${isAr ? "text-right" : "text-left"
                      }`}
                  >
                    {carName(m)}
                  </h3>
                  <div className="flex-1 flex items-center justify-center overflow-hidden min-h-[220px]">
                    {m.heroImage ? (
                      <div className="relative w-full h-[220px]">
                        <Image
                          src={m.heroImage}
                          alt={carName(m)}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="object-contain transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                    ) : (
                      // fallback when the CMS has no hero image yet
                      <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center text-xs text-gray-400 transition-transform duration-500 group-hover:scale-105">
                        {m.nameEn}
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}