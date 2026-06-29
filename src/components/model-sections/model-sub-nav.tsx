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
  contactLabel: string;
}

export default function ModelSubNav({
  locale,
  modelName,
  sections,
  contactLabel,
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

  return (
    <>
      {/* sentinel sits where the bar would naturally be; when it scrolls
          out of view, the bar is stuck and the header should collapse */}
      <div ref={sentinelRef} className="h-0" />
      <div className="sticky top-0 z-40 bg-white border-b border-gray-100 transition-shadow">
        <div className="max-w-[1400px] mx-auto px-8 h-[72px] flex items-center justify-between">
        <div className="flex items-center gap-6">
          <span className="font-semibold tracking-wide text-[#111]">
            {modelName}
          </span>

          {/* dropdown showing current section, click to jump */}
          <div className="relative">
            <button
              onClick={() => setOpen((o) => !o)}
              className="flex items-center gap-8 min-w-[200px] justify-between px-4 py-2.5 rounded-lg bg-gray-100 text-[#002C5F] text-sm font-semibold"
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
              <div className="absolute top-full mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
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

        <Link
          href={`/${locale}/contact-us`}
          className="flex items-center gap-2 text-[#002C5F] text-sm font-semibold"
        >
          {contactLabel}
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path
              d="M6 9l6 6 6-6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Link>
      </div>
      </div>
    </>
  );
}
