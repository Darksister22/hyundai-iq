"use client";

import { useEffect, useRef, useState,useCallback } from "react";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Pagination, Navigation } from "swiper/modules";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Locale } from "@/lib/i18n";
import type { FindCarCategory, HomeCar, HeroBanner } from "@/lib/find-car-data";
import ParallaxImage from "@/components/parallax-image";
import ModelCard from "@/components/model-card";
// Add near the other refs:
import type { Swiper as SwiperClass } from "swiper";
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

// "all" or a category id from the DB
type CategoryFilter = "all" | number;

interface HomeClientProps {
  locale: Locale;
  dict: HomeDict;
  categories: FindCarCategory[];
  cars: HomeCar[];
  banners: HeroBanner[];
}

export default function HomeClient({
  locale,
  dict,
  categories,
  cars,
  banners,
}: HomeClientProps) {
  const isAr = locale === "ar";
  const rootRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const tabsRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const [activeCat, setActiveCat] = useState<CategoryFilter>("all");
  const modelSwiperRef = useRef<SwiperClass | null>(null);
const handleCardSettled = useCallback(() => {
  modelSwiperRef.current?.update();
}, []);

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
            start: "top 90%",
            end: "bottom 1%",
            toggleActions: "play none none play",
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

  // "All Cars" + one tab per DB category, localized with EN fallback
  const tabs: { id: CategoryFilter; label: string }[] = [
    { id: "all", label: dict.allCars },
    ...categories.map((c) => ({
      id: c.id as CategoryFilter,
      label: isAr ? c.nameAr ?? c.nameEn : c.nameEn,
    })),
  ];

  const filteredCars =
    activeCat === "all" ? cars : cars.filter((c) => c.categoryId === activeCat);

  // Swiper's loop/autoplay misbehave with a single slide

  const multiSlide = banners.length > 1;

  const bannerTitle = (b: HeroBanner) =>
    isAr ? b.titleAr ?? b.titleEn : b.titleEn;
  const bannerTagline = (b: HeroBanner) =>
    isAr ? b.taglineAr ?? b.taglineEn : b.taglineEn;


  return (
    <div ref={rootRef} className="flex flex-col">
      <div className="-mt-[72px]">
        <section ref={heroRef} className="relative h-[100svh] overflow-hidden">
          {banners.length === 0 ? (
            /* fallback when the CMS has no banners yet — single static slide */
            <div className="relative h-full bg-[#002C5F] flex items-center">
              <div className="max-w-7xl mx-auto px-6 relative z-10 text-white w-full">
                <h1 className=" font-head hero-anim text-5xl font-bold leading-tight">
                  {isAr ? "هيونداي العراق" : "Hyundai Iraq"}
                </h1>
              </div>
            </div>
          ) : (
            <Swiper
              modules={[Autoplay, EffectFade, Pagination, Navigation]}
              effect="fade"
              fadeEffect={{ crossFade: true }}
              autoplay={multiSlide ? { delay: 12000, disableOnInteraction: false } : false}
              pagination={multiSlide ? { clickable: true } : false}
              navigation={multiSlide ? { prevEl: ".hero-prev", nextEl: ".hero-next" } : false}
              loop={multiSlide}
              className="h-full"
            >
              {multiSlide && (
                <>
                  <button
                    aria-label="Previous banner"
                    className="hero-prev absolute start-4 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-black/25 hover:bg-black/45 text-white flex items-center justify-center transition-colors"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="rtl:rotate-180">
                      <path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                  <button
                    aria-label="Next banner"
                    className="hero-next absolute end-4 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-black/25 hover:bg-black/45 text-white flex items-center justify-center transition-colors"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="rtl:rotate-180">
                      <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                </>
              )}
              {banners.map((b) => (
                <SwiperSlide key={b.id}>
                  <div className="relative h-full bg-[#002C5F] flex items-end">
                    {/* media background — image or looping muted video */}
                    {b.mediaUrl &&
                      (b.mediaType === "video" ? (
                        <video
                          src={b.mediaUrl}
                          autoPlay
                          muted
                          loop
                          playsInline
                          preload="metadata"
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                      ) : (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={b.mediaUrl}
                          alt={bannerTitle(b) ?? ""}
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                      ))}

                    <div className="max-w-7xl mx-auto px-6 relative z-10 text-white w-full pb-20 md:pb-24">
                      {bannerTitle(b) && (
                        <h1 className="hero-anim text-5xl font-bold leading-tight mb-4">
                          {bannerTitle(b)}
                        </h1>
                      )}
                      {bannerTagline(b) && (
                        <p className="hero-anim text-base opacity-70 max-w-md mb-8">
                          {bannerTagline(b)}
                        </p>
                      )}
                      {b.carSlug && (
                        <div className="hero-anim">
                          <Link
                            href={`/${locale}/models/${b.carSlug}`}
                            className="inline-block px-8 py-3 bg-[#00AAD2] text-white text-sm font-semibold rounded hover:bg-[#008aad] transition-colors"
                          >
                            {dict.explore}
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          )}
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
            <div className="inline-flex bg-gray-100 rounded-full p-1 max-w-full overflow-x-auto overflow-y-hidden scrollbar-hide">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveCat(tab.id);
                    setExpandedSlug(null);
                  }}
                  className={`px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${activeCat === tab.id
                      ? "bg-white shadow text-[#111]"
                      : "text-gray-500 hover:text-gray-800"
                    }`}
                >
                  {tab.label}
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
              {filteredCars.map((car) => (
                <SwiperSlide key={car.id} className="!w-auto !h-[60svh] flex items-center">
                  <ModelCard
                    locale={locale}
                    car={car}
                    exploreLabel={dict.explore}
                    expanded={expandedSlug === car.slug}
                    onExpand={(slug) => setExpandedSlug(slug)}
                    onCollapse={() => setExpandedSlug(null)}
                    onTransitionSettled={handleCardSettled}
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
            {locale === "ar" ? "الآن نمضي قدماً" : "Next Starts Now"}
          </h2>
        </div>
      </section>
    </div>
  );
}