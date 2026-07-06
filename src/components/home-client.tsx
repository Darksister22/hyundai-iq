"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Pagination } from "swiper/modules";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Locale } from "@/lib/i18n";
import type { VehicleModel } from "@/lib/models-data";
import ParallaxImage from "@/components/parallax-image";
// Swiper styles
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";

gsap.registerPlugin(ScrollTrigger);

interface HomeDict {
  exploreModels: string;
  exploreModelsDesc: string;
  allCars: string;
  sedan: string;
  suv: string;
  electric: string;
  mpv: string;
  explore: string;
  whoWeAre: string;
  whoWeAreDesc: string;
  knowMore: string;
} // pull ar and en locale vars to be used in this page. 

interface HeroSlide {
  name: string;
  tagline: string;
  slug: string;
}

interface HomeClientProps {
  locale: Locale;
  dict: HomeDict;
  models: VehicleModel[];
  heroSlides: HeroSlide[];
}

export default function HomeClient({
  locale,
  dict,
  models,
  heroSlides,
}: HomeClientProps) {
  const rootRef = useRef<HTMLDivElement>(null); //Reference for the root of all the element. Changes to it might play with the item's general margins and positions.
  const headingRef = useRef<HTMLDivElement>(null); //
  const tabsRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero enterance
      gsap.from(".hero-anim", {
        y: 40,
        opacity: 0,
        duration: 0.9,
        stagger: 0.12,
        ease: "power3.out",
        delay: 0.2,
      });

      //section heading reveal
      if (headingRef.current) {
        gsap.from(headingRef.current.children, {
          y: 30,
          opacity: 0,
          duration: 0.7,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: headingRef.current,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play reverse play reverse",
          },
        });
      }

      // ─── Filter tabs slide in ───
      if (tabsRef.current) {
        gsap.from(tabsRef.current.children, {
          y: 20,
          opacity: 0,
          duration: 0.5,
          stagger: 0.06,
          ease: "power2.out",
          scrollTrigger: {
            trigger: tabsRef.current,
            start: "top 85%",
            end: "bottom 20%",
            toggleActions: "play reverse play reverse",
          },
        });
      }

      // ─── Model cards staggered reveal ───
      if (gridRef.current) {
        gsap.from(gridRef.current.children, {
          y: 50,
          opacity: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: gridRef.current,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play reverse play reverse",
          },
        });
      }
    }, rootRef);

    return () => ctx.revert();
  }, []);

  const tabs = [dict.allCars, dict.sedan, dict.suv, dict.electric, dict.mpv];

  return (
    // overflow-x-hidden guards against any full-bleed sub-pixel overflow
    <div ref={rootRef} className="flex flex-col">
      {/* ─── Hero carousel — full screen under the floating header ─── */}
      <div className="-mt-[72px]">
        <section ref={heroRef} className="relative h-[100svh] overflow-hidden">
          <Swiper
            modules={[Autoplay, EffectFade, Pagination]}
            effect="fade"
            fadeEffect={{ crossFade: true }}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            pagination={{ clickable: true }}
            loop
            className="h-full"
          >
            {heroSlides.map((slide) => (
              <SwiperSlide key={slide.slug}>
                <div className="relative h-full bg-[#002C5F] flex items-center">
                  <div className="max-w-7xl mx-auto px-6 relative z-10 text-white w-full">
                    <p className="hero-anim text-xs uppercase tracking-[3px] opacity-60 mb-3">
                      {locale === "ar" ? "البداية الآن" : "Next Starts Now"}
                    </p>
                
                    <h1 className="hero-anim text-5xl font-bold leading-tight mb-4">
                      {slide.name}
                    </h1>
                    <p className="hero-anim text-base opacity-70 max-w-md mb-8">
                      {slide.tagline}
                    </p>
                    <div className="hero-anim">
                      <Link
                        href={`/${locale}/models/${slide.slug}`}
                        className="inline-block px-8 py-3 bg-[#00AAD2] text-white text-sm font-semibold rounded hover:bg-[#008aad] transition-colors"
                      >
                        {dict.explore}
                      </Link>
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-l from-transparent to-[#002C5F] z-[1]" />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </section>
      </div>

      {/* ─── Model grid ─── */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div ref={headingRef} className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#002C5F] mb-3">
              {dict.exploreModels}
            </h2>
            <p className="text-gray-500">{dict.exploreModelsDesc}</p>
          </div>
          

          {/* category tabs */}
          <div ref={tabsRef} className="flex justify-center gap-2 mb-10">
            {tabs.map((label, i) => (
              <button
                key={label}
                className={`px-6 py-2 rounded-full text-sm border transition-colors ${i === 0
                  ? "bg-[#002C5F] text-white border-[#002C5F]"
                  : "bg-white text-gray-700 border-gray-200 hover:border-gray-400"
                  }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* model cards with zoom-on-hover */}
          <div
            ref={gridRef}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {models.map((model) => (
              <Link
                key={model.slug}
                href={`/${locale}/models/${model.slug}`}
                className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="h-44 overflow-hidden">
                  <div className="h-full w-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-xs text-gray-400 transition-transform duration-500 ease-out group-hover:scale-110">
                    {model.nameEn} image
                  </div>
                </div>
                <div className="p-5">
                  <span className="text-xs uppercase tracking-wider text-[#00AAD2] font-semibold">
                    {model.category}
                  </span>
                  <h3 className="text-lg font-bold mt-1">
                    {locale === "ar" ? model.nameAr : model.nameEn}
                  </h3>
                  <p className="text-sm text-gray-500 mt-2 line-clamp-2" />
                  <span className="inline-block mt-4 text-sm font-semibold text-[#002C5F] group-hover:text-[#00AAD2] transition-colors">
                    {dict.explore} →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Who we are — FULL-BLEED image (RTL-safe), CTA + heading below ─── */}
      <section className="py-24 overflow-hidden">
        <div className="relative full-bleed">
          <ParallaxImage src="/images/founder.webp" className="h-[70svh] min-h-[460px] w-full" />

          {/* CTA now positions against THIS wrapper */}
          <Link
            href={`/${locale}/about-hyundai`}
            className="absolute -bottom-5 start-8 inline-flex items-center gap-2 bg-[#002C5F] text-white text-sm font-semibold px-6 py-3 rounded shadow-lg hover:bg-[#003d7a] transition-colors"
          >
            {dict.knowMore}
            <span aria-hidden>›</span>
          </Link>
        </div>

        {/* label + heading in the normal container */}
        <div className="max-w-7xl mx-auto px-6 mt-12">
          <span className="text-sm text-gray-400">{dict.whoWeAre}</span>
          <h2 className="mt-2 text-2xl md:text-4xl font-bold text-[#002C5F] leading-snug max-w-4xl">
            {dict.whoWeAreDesc}
          </h2>
        </div>
      </section>

      {/* ─── Tagline banner — full-bleed, non-clickable ─── */}
      <section className="relative full-bleed overflow-hidden mb-16">
        <ParallaxImage
          src="/images/IONIQ_9_3.webp"
          className="h-[60svh] min-h-[400px] w-full"
        />
        {/* gradient for text legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        {/* tagline only — no link */}
        <div className="absolute inset-0 max-w-7xl mx-auto px-6 flex items-center">
          <h2 className="text-3xl md:text-5xl font-bold text-white">
            {locale === "ar" ? "الآن نمضي قدماً" : "Now we move forward"}
          </h2>
        </div>
      </section>
    </div>
  );
}