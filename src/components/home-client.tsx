
"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Pagination } from "swiper/modules";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Locale } from "@/lib/i18n";
import type { VehicleModel } from "@/lib/models-data";
import ParallaxImage from "@/components/parallax-image";
import ModelCard from "@/components/model-card";
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
  const rootRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const tabsRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState(0);

  // which car card is expanded to state 3 (only one at a time)
  const [expandedSlug, setExpandedSlug] = useState<string | null>(null);

  // click outside the expanded card collapses it back to state 1/2
  useEffect(() => {
    if (!expandedSlug) return;
    const onDown = (e: MouseEvent) => {
      const el = e.target as HTMLElement;
      if (!el.closest(`[data-card-slug="${expandedSlug}"]`)) {
        setExpandedSlug(null);
      }
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [expandedSlug]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".hero-anim", {
        y: 40,
        opacity: 0,
        duration: 0.9,
        stagger: 0.12,
        ease: "power3.out",
        delay: 0.2,
      });

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

      if (tabsRef.current) {
        gsap.from(tabsRef.current.querySelectorAll("button"), {
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

      if (gridRef.current) {
        gsap.fromTo(
          gridRef.current.querySelectorAll(".swiper-slide"),
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            stagger: 0.1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: gridRef.current,
              start: "top 90%",
              toggleActions: "play none none none",
            },
          }
        );
      }
    }, rootRef);

    return () => ctx.revert();
  }, []);

  const tabs = [dict.allCars, dict.sedan, dict.suv, dict.electric, dict.mpv];

  const filteredModels = models.filter((model) => {
    const cats = ["all", "sedan", "suv", "electric", "mpv"] as const;
    const active = cats[activeTab];
    return active === "all" ? true : model.category === active;
  });

  return (
    <div ref={rootRef} className="flex flex-col">
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

      <section className="py-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div ref={headingRef} className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#002C5F] mb-3">
              {dict.exploreModels}
            </h2>
            <p className="text-gray-500">{dict.exploreModelsDesc}</p>
          </div>

          <div ref={tabsRef} className="flex justify-center mb-10">
            <div className="inline-flex bg-gray-100 rounded-full p-1">
              {tabs.map((label, i) => (
                <button
                  key={label}
                  onClick={() => {
                    setActiveTab(i);
                    setExpandedSlug(null);
                  }}
                  className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${
                    activeTab === i
                      ? "bg-white shadow text-[#111]"
                      : "text-gray-500 hover:text-gray-800"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* model cards — carousel, square pagination */}
          <div ref={gridRef}>
            <Swiper
              modules={[Pagination]}
              slidesPerView="auto"
              spaceBetween={20}
              pagination={{ clickable: true }}
              className="model-swiper !pb-10"
            >
              {filteredModels.map((model) => (
                <SwiperSlide key={model.slug} className="!w-auto">
                  <ModelCard
                    locale={locale}
                    model={model}
                    exploreLabel={dict.explore}
                    expanded={expandedSlug === model.slug}
                    onExpand={(slug) => setExpandedSlug(slug)}
                    onCollapse={() => setExpandedSlug(null)}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </section>

      <section className="py-24 overflow-hidden">
        <div className="relative w-screen mx-[calc(50%-50vw)]">
          <ParallaxImage
            src="/images/founder.webp"
            className="h-[70vh] min-h-[460px] w-full"
          />
          <Link
            href={`/${locale}/about-hyundai`}
            className="absolute -bottom-5 start-8 inline-flex items-center gap-2 bg-[#002C5F] text-white text-sm font-semibold px-6 py-3 rounded shadow-lg hover:bg-[#003d7a] transition-colors"
          >
            {dict.knowMore}
            <span aria-hidden>›</span>
          </Link>
        </div>

        <div className="max-w-7xl mx-auto px-6 mt-12">
          <span className="text-sm text-gray-400">{dict.whoWeAre}</span>
          <h2 className="mt-2 text-2xl md:text-4xl font-bold text-[#002C5F] leading-snug max-w-4xl">
            {dict.whoWeAreDesc}
          </h2>
        </div>
      </section>

      <section className="relative w-screen mx-[calc(50%-50vw)] overflow-hidden mb-16">
        <ParallaxImage
          src="/images/IONIQ_9_3.webp"
          className="h-[60vh] min-h-[400px] w-full"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        <div className="absolute inset-0 max-w-7xl mx-auto px-6 flex items-center">
          <h2 className="text-3xl md:text-5xl font-bold text-white">
            {locale === "ar" ? "الآن نمضي قدماً" : "Now we move forward"}
          </h2>
        </div>
      </section>
    </div>
  );
}