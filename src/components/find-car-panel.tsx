"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import type { Locale } from "@/lib/i18n";
import { models, type VehicleModel } from "@/lib/models-data";

interface FindCarDict {
  allCars: string;
  sedan: string;
  suv: string;
  mpv: string;
  electric: string;
}

interface Props {
  locale: Locale;
  open: boolean;
  onClose: () => void;
  dict: FindCarDict;
  navHeight?: number;
}

type Category = "all" | "sedan" | "suv" | "mpv" | "electric";

export default function FindCarPanel({
  locale,
  open,
  onClose,
  dict,
  navHeight = 72,
}: Props) {
  const isAr = locale === "ar";
  const panelRef = useRef<HTMLDivElement>(null);
  const catsRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const [category, setCategory] = useState<Category>("all");
  const [mounted, setMounted] = useState(false);
  // drives the 180° spin on the X when closing
  const [closing, setClosing] = useState(false);

  const categories: { id: Category; label: string }[] = [
    { id: "all", label: dict.allCars },
    { id: "sedan", label: dict.sedan },
    { id: "suv", label: dict.suv },
    { id: "mpv", label: dict.mpv },
    { id: "electric", label: dict.electric },
  ];

  const filtered: VehicleModel[] =
    category === "all" ? models : models.filter((m) => m.category === category);

  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const handleClose = () => {
    setClosing(true);
    onClose();
  };
  useEffect(() => { //mount on page. No more than one render. 
    if (!open) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    setClosing(false);
  }, [open]);

  useEffect(() => { //Close / unmount.
    if (open || !mounted) return;
    tlRef.current?.kill();
    const tl = gsap.timeline({ onComplete: () => setMounted(false) });
    tlRef.current = tl;
    tl.to(gridRef.current, { y: 16, opacity: 0, duration: 0.25, ease: "power2.in" })
      .to(catsRef.current, { y: -12, opacity: 0, duration: 0.2, ease: "power2.in" }, "-=0.05")
      .to(panelRef.current, { height: 0, duration: 0.4, ease: "power3.inOut" }, "-=0.05");
  }, [open, mounted]);

  useEffect(() => { //Play open animation and expand panel.
    if (!mounted || !open) return;
    tlRef.current?.kill();
    const tl = gsap.timeline();
    tlRef.current = tl;
    tl.fromTo(panelRef.current, { height: 0 }, { height: "auto", duration: 0.45, ease: "power3.inOut" })
      .fromTo(catsRef.current, { y: -12, opacity: 0 }, { y: 0, opacity: 1, duration: 0.3, ease: "power2.out" }, "-=0.1")
      .fromTo(gridRef.current, { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.35, ease: "power2.out" }, "-=0.05");
    return () => { tl.kill(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted]);

  useEffect(() => { //Close on click away / ecs press
    if (!open) return;
    const onDown = (e: MouseEvent | TouchEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) handleClose();
    };
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") handleClose(); };
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
  const onCategory = (id: Category) => {
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
                <div className="inline-flex bg-gray-100 rounded-full p-1 max-w-full overflow-x-auto scrollbar-hide">
                  {categories.map((c) => (
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
                  key={m.slug}
                  href={`/${locale}/models/${m.slug}`}
                  onClick={handleClose}
                  className="group bg-gray-50 hover:bg-gray-100 rounded-xl p-8 transition-colors flex flex-col"
                >
                  <h3
                    className={`text-2xl font-bold text-[#111] mb-6 ${isAr ? "text-right" : "text-left"
                      }`}
                  >
                    {isAr ? m.nameAr : m.nameEn}
                  </h3>
                  <div className="flex-1 flex items-center justify-center overflow-hidden min-h-[220px]">
                    <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center text-xs text-gray-400 transition-transform duration-500 group-hover:scale-105">
                      {m.nameEn}
                    </div>
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