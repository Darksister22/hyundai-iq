"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { Locale } from "@/lib/i18n";

export interface SubNavSection {
  id: string;
  label: string;
}

interface Props {
  locale: Locale;
  modelName: string;
  sections: SubNavSection[];
  brochureUrl?: string | null;
  brochureLabel?: string;
    onRequestPrice: () => void;
  onRequestTestDrive: () => void;
  priceLabel: string;
  testDriveLabel: string;
}

export default function ModelSubNav({
  locale,
  modelName,
  sections,
  brochureUrl,
  brochureLabel,
  onRequestPrice,
  onRequestTestDrive,
  priceLabel,
  testDriveLabel,
}: Props) {
  const [active, setActive] = useState(sections[0]?.id ?? "");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [sections]);

  const activeLabel =
    sections.find((s) => s.id === active)?.label ?? sections[0]?.label ?? "";

  const jump = (id: string) => {
    setOpen(false);
    const el = document.getElementById(id);
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 120;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  // detect when this bar becomes stuck at the top → tell the main header to collapse
  const sentinelRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        const stuck = !entry.isIntersecting;
        window.dispatchEvent(
          new CustomEvent("hyundai:subnav-stuck", { detail: stuck })
        );
      },
      { threshold: 0 }
    );
    obs.observe(sentinel);
    return () => {
      obs.disconnect();
      // restore header when leaving the page
      window.dispatchEvent(
        new CustomEvent("hyundai:subnav-stuck", { detail: false })
      );
    };
  }, []);

  // Supabase Storage serves files inline by default; the ?download query
  // param switches Content-Disposition to attachment so the browser saves
  // the file instead of opening it. The HTML `download` attribute alone
  // is ignored cross-origin, so it can't do this job.
  const brochureHref = (() => {
    if (!brochureUrl) return null;
    try {
      const u = new URL(brochureUrl);
      u.searchParams.set("download", "");
      return u.toString();
    } catch {
      return brochureUrl; // relative/odd URL — use as-is
    }
  })();

  const showBrochure = !!(brochureHref && brochureLabel);

  return (
    <>
      {/* sentinel sits where the bar would naturally be; when it scrolls
          out of view, the bar is stuck and the header should collapse */}
      <div ref={sentinelRef} className="h-0" />
      <div className="sticky top-0 z-40 bg-white border-b border-gray-100 transition-shadow">
        {/* mobile: two rows (name + dropdown / buttons); md+: one row */}
        <div
          className="max-w-[1400px] mx-auto px-4 md:px-8 py-3 md:py-0 md:h-[72px]
            flex flex-col gap-3 md:flex-row md:items-center md:justify-between"
        >
          {/* row 1 — model name + section dropdown */}
          <div className="flex items-center justify-between md:justify-start md:gap-6">
            <span className="font-bold md:font-semibold uppercase tracking-wide text-[#111] text-lg md:text-base">
              {modelName}
            </span>

            {/* dropdown showing current section, click to jump */}
            <div className="relative">
              <button
                onClick={() => setOpen((o) => !o)}
                className="flex items-center justify-between gap-3 md:gap-8 md:min-w-[200px]
                  px-3 py-2 md:px-4 md:py-2.5 rounded-lg bg-transparent md:bg-gray-100
                  text-[#002C5F] text-sm font-semibold"
              >
                {activeLabel}
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  className={`transition-transform ${open ? "rotate-180" : ""}`}
                >
                  <path
                    d="M6 9l6 6 6-6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>

              {open && (
                <div
                  className="absolute top-full mt-1 end-0 md:start-0 min-w-[200px] md:w-full
                    bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden"
                >
                  {sections.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => jump(s.id)}
                      className={`block w-full text-start px-4 py-2.5 text-sm hover:bg-gray-50 ${
                        active === s.id
                          ? "text-[#002C5F] font-semibold"
                          : "text-gray-600"
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* row 2 — action buttons: filled navy brochure + outlined contact */}
          {/* row 2 — brochure download + the two lead CTAs */}
          <div className="flex items-stretch gap-3 md:gap-4">
            {showBrochure && (
              <a href={brochureHref!} className="flex-1 md:flex-none flex items-center justify-center h-10 md:h-9 px-3 md:px-5 bg-white border border-[#002C5F] text-[#002C5F] text-sm font-semibold hover:bg-[#002C5F] hover:text-white transition-colors rounded">{brochureLabel}</a>            )}

            <button
              onClick={onRequestTestDrive}
              className="flex-1 md:flex-none flex items-center justify-center h-10 md:h-9 px-3 md:px-5 border border-[#002C5F] text-[#002C5F] text-sm font-semibold hover:bg-[#002C5F] hover:text-white transition-colors rounded"
            >
              {testDriveLabel}
            </button>

            <button
              onClick={onRequestPrice}
              className="flex-1 md:flex-none flex items-center justify-center h-10 md:h-9 px-3 md:px-5 bg-[#002C5F] text-white text-sm font-semibold hover:bg-[#00234c] transition-colors rounded"
            >
              {priceLabel}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}