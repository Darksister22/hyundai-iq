"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import type { Locale } from "@/lib/i18n";
import type { VehicleModel } from "@/lib/models-data";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

interface ModelDict {
  highlights: string;
  atAGlance: string;
  engine: string;
  maxPower: string;
  maxTorque: string;
  drive: string;
  design: string;
  performance: string;
  safety: string;
  convenience: string;
  requestCallback: string;
  requestTestDrive: string;
  exterior: string;
  interior: string;
  specification: string;
  colors: string;
  view360: string;
  viewSpecs: string;
}

interface Props {
  locale: Locale;
  model: VehicleModel;
  dict: ModelDict;
}

export default function ModelDetailClient({ locale, model, dict }: Props) {
  const isAr = locale === "ar";
  const name = isAr ? model.nameAr : model.nameEn;
  const tagline = isAr ? model.taglineAr : model.taglineEn;

  // which sections actually have content → drive the tab nav
  const sections = [
    { id: "highlights", label: dict.highlights, has: model.highlights.length > 0 },
    { id: "exterior", label: dict.exterior, has: model.exterior.gallery.length > 0 },
    { id: "interior", label: dict.interior, has: model.interior.gallery.length > 0 },
    { id: "performance", label: dict.performance, has: model.performance.length > 0 },
    { id: "safety", label: dict.safety, has: model.safety.length > 0 },
    { id: "convenience", label: dict.convenience, has: model.convenience.length > 0 },
    { id: "specification", label: dict.specification, has: model.specification.length > 0 },
  ].filter((s) => s.has);

  const [activeTab, setActiveTab] = useState(sections[0]?.id ?? "highlights");
  const [activeColor, setActiveColor] = useState(0);

  // scroll-spy: highlight the tab for whichever section is in view
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveTab(entry.target.id);
        });
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );

    sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 120;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  return (
    <div>
      {/* ─── Hero ─── */}
      <section className="relative h-[460px] bg-[#002C5F] flex items-end overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-white w-full pb-16">
          <span className="text-xs uppercase tracking-[3px] opacity-50">
            {model.category}
          </span>
          <h1 className="text-5xl font-bold mt-2">{name}</h1>
          <p className="text-base opacity-60 max-w-md mt-3">{tagline}</p>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#002C5F] to-transparent z-[1]" />
      </section>

      {/* ─── Specs strip ─── */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4">
          {[
            { value: model.specs.engine, label: dict.engine },
            { value: model.specs.power, label: dict.maxPower },
            { value: model.specs.torque, label: dict.maxTorque },
            { value: model.specs.drive, label: dict.drive },
          ].map((spec) => (
            <div
              key={spec.label}
              className="py-6 text-center border-b md:border-b-0 md:border-e border-gray-100 last:border-0"
            >
              <div className="text-2xl font-bold text-[#002C5F]">
                {spec.value}
              </div>
              <div className="text-xs text-gray-500 mt-1">{spec.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Sticky tab nav ─── */}
      <nav className="sticky top-[72px] z-40 bg-white/95 backdrop-blur border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex gap-1 overflow-x-auto">
            {sections.map((s) => (
              <button
                key={s.id}
                onClick={() => scrollTo(s.id)}
                className={`px-4 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === s.id
                    ? "border-[#00AAD2] text-[#002C5F]"
                    : "border-transparent text-gray-500 hover:text-gray-800"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
          <Link
            href={`/${locale}/contact-us`}
            className="hidden md:inline-block flex-shrink-0 px-5 py-2 bg-[#002C5F] text-white text-sm font-semibold rounded hover:bg-[#003d7a] transition-colors"
          >
            {dict.requestTestDrive}
          </Link>
        </div>
      </nav>

      {/* ─── Highlights ─── */}
      {model.highlights.length > 0 && (
        <section id="highlights" className="py-20 scroll-mt-32">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-3xl font-bold text-[#002C5F] mb-12">
              {dict.highlights}
            </h2>
            <div className="space-y-16">
              {model.highlights.map((hl, i) => (
                <div
                  key={hl.category}
                  className={`grid grid-cols-1 md:grid-cols-2 gap-10 items-center ${
                    i % 2 === 1 ? "md:[direction:rtl]" : ""
                  }`}
                >
                  <div className="[direction:ltr] h-72 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center text-xs text-gray-400">
                    {hl.category} image
                  </div>
                  <div className="[direction:ltr]">
                    <span className="text-xs uppercase tracking-wider text-[#00AAD2] font-semibold">
                      {dict[hl.category as keyof ModelDict] || hl.category}
                    </span>
                    <h3 className="text-2xl font-bold mt-2 mb-3 text-[#002C5F]">
                      {isAr ? hl.titleAr : hl.titleEn}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {isAr ? hl.descAr : hl.descEn}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── Exterior ─── */}
      {model.exterior.gallery.length > 0 && (
        <section
          id="exterior"
          className="py-20 bg-white scroll-mt-32 border-t border-gray-100"
        >
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-3xl font-bold text-[#002C5F] mb-8">
              {dict.exterior}
            </h2>

            {/* color picker swaps the main image */}
            {model.exterior.colors.length > 0 && (
              <div className="mb-8">
                <div className="h-96 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center text-sm text-gray-400 mb-5">
                  {isAr
                    ? model.exterior.colors[activeColor].nameAr
                    : model.exterior.colors[activeColor].nameEn}{" "}
                  — image
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-500">{dict.colors}:</span>
                  {model.exterior.colors.map((color, i) => (
                    <button
                      key={color.hex}
                      onClick={() => setActiveColor(i)}
                      title={isAr ? color.nameAr : color.nameEn}
                      className={`w-9 h-9 rounded-full border-2 transition-transform ${
                        activeColor === i
                          ? "border-[#00AAD2] scale-110"
                          : "border-gray-300"
                      }`}
                      style={{ backgroundColor: color.hex }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* exterior gallery */}
            <Swiper
              modules={[Navigation, Pagination]}
              navigation
              pagination={{ clickable: true }}
              spaceBetween={16}
              slidesPerView={1}
              breakpoints={{ 768: { slidesPerView: 2 } }}
            >
              {model.exterior.gallery.map((item, i) => (
                <SwiperSlide key={i}>
                  <div className="h-64 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center text-xs text-gray-400">
                    Exterior {i + 1}
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </section>
      )}

      {/* ─── Interior ─── */}
      {model.interior.gallery.length > 0 && (
        <section id="interior" className="py-20 scroll-mt-32">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-3xl font-bold text-[#002C5F] mb-8">
              {dict.interior}
            </h2>

            {/* 360 viewer slot */}
            {model.interior.panorama360 && (
              <div className="mb-8 h-96 bg-[#0a1830] rounded-xl flex flex-col items-center justify-center text-white/60 gap-2">
                <span className="text-3xl">360°</span>
                <span className="text-sm">{dict.view360}</span>
                <span className="text-xs text-white/30">
                  Pannellum / Panolens viewer mounts here
                </span>
              </div>
            )}

            {/* interior gallery */}
            <Swiper
              modules={[Navigation, Pagination]}
              navigation
              pagination={{ clickable: true }}
              spaceBetween={16}
              slidesPerView={1}
              breakpoints={{ 768: { slidesPerView: 2 } }}
            >
              {model.interior.gallery.map((item, i) => (
                <SwiperSlide key={i}>
                  <div className="h-64 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center text-xs text-gray-400">
                    Interior {i + 1}
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </section>
      )}

      {/* ─── Performance / Safety / Convenience (shared card layout) ─── */}
      {(
        [
          { id: "performance", label: dict.performance, items: model.performance, bg: "bg-white" },
          { id: "safety", label: dict.safety, items: model.safety, bg: "" },
          { id: "convenience", label: dict.convenience, items: model.convenience, bg: "bg-white" },
        ] as const
      ).map(
        (sec) =>
          sec.items.length > 0 && (
            <section
              key={sec.id}
              id={sec.id}
              className={`py-20 scroll-mt-32 border-t border-gray-100 ${sec.bg}`}
            >
              <div className="max-w-7xl mx-auto px-6">
                <h2 className="text-3xl font-bold text-[#002C5F] mb-8">
                  {sec.label}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {sec.items.map((item, i) => (
                    <div
                      key={i}
                      className="bg-white rounded-xl border border-gray-200 overflow-hidden"
                    >
                      <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-xs text-gray-400">
                        {sec.id} image
                      </div>
                      <div className="p-6">
                        <h3 className="text-base font-semibold mb-2">
                          {isAr ? item.titleAr : item.titleEn}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {isAr ? item.descAr : item.descEn}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )
      )}

      {/* ─── Specification ─── */}
      {model.specification.length > 0 && (
        <section
          id="specification"
          className="py-20 scroll-mt-32 border-t border-gray-100"
        >
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-3xl font-bold text-[#002C5F] mb-8">
              {dict.specification}
            </h2>
            <div className="space-y-8">
              {model.specification.map((group) => (
                <div
                  key={group.groupEn}
                  className="bg-white rounded-xl border border-gray-200 overflow-hidden"
                >
                  <div className="bg-[#002C5F] text-white px-6 py-3 text-sm font-semibold">
                    {isAr ? group.groupAr : group.groupEn}
                  </div>
                  <table className="w-full">
                    <tbody>
                      {group.rows.map((row, i) => (
                        <tr
                          key={i}
                          className="border-b border-gray-100 last:border-0"
                        >
                          <td className="px-6 py-3 text-sm text-gray-500 w-1/3">
                            {isAr ? row.labelAr : row.labelEn}
                          </td>
                          <td className="px-6 py-3 text-sm font-medium text-gray-800">
                            {row.value}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── Bottom CTA ─── */}
      <section className="bg-[#002C5F] text-white py-16">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-2xl font-bold mb-2">{name}</h2>
          <p className="opacity-60 mb-6">{tagline}</p>
          <Link
            href={`/${locale}/contact-us`}
            className="inline-block px-8 py-3 bg-[#00AAD2] text-white text-sm font-semibold rounded hover:bg-[#008aad] transition-colors"
          >
            {dict.requestCallback}
          </Link>
        </div>
      </section>
    </div>
  );
}
