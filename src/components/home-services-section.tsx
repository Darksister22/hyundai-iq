"use client";

import Link from "next/link";
import Image from "next/image";
import type { Locale } from "@/lib/i18n";
import Reveal from "./reveal";

export interface HomeServicesDict {
  eyebrow: string;
  heading: string;
  callCenter: string;
  afterSales: string;
  serviceBooking: string;
}

export default function HomeServicesSection({
  locale,
  dict,
}: {
  locale: Locale;
  dict: HomeServicesDict;
}) {
  const isAr = locale === "ar";

  const cards = [
    { href: `/${locale}/services/call-center`, label: dict.callCenter, img: "/images/services/call-center-photo.webp" },
    { href: `/${locale}/services/after-sales`, label: dict.afterSales, img: "/images/services/aftersales-banner.webp" },
    { href: `/${locale}/services/service-booking`, label: dict.serviceBooking, img: "/images/customer-promise.webp" },
  ];

  // Notch cut out of the image's bottom start-corner, where the chevron sits.
  // clip-path is physical, not logical, so it needs mirroring for RTL.
  const notch = isAr
    ? "polygon(0 0, 100% 0, 100% calc(100% - 3rem), calc(100% - 4.75rem) calc(100% - 3rem), calc(100% - 3.5rem) 100%, 0 100%)"
    : "polygon(0 0, 100% 0, 100% 100%, 3.5rem 100%, 4.75rem calc(100% - 3rem), 0 calc(100% - 3rem))";

  return (
    <section className="bg-white py-20">
      <div className="max-w-7xl mx-auto px-6">
        <Reveal>
          <p className="text-sm text-gray-400 text-center mb-2">{dict.eyebrow}</p>
          <h2 className="text-3xl md:text-4xl font-bold text-[#111] text-center mb-12">
            {dict.heading}
          </h2>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {cards.map((c) => (
            <Reveal key={c.href}>
<Link href={c.href} className="group block">
                {/* relative wrapper anchors the chevron to the IMAGE, not the card.
                    clipPath stays on the inner div so it doesn't clip the chevron. */}
                <div className="relative">
                  <div
                    className="relative aspect-[16/10] overflow-hidden bg-gray-100"
                    style={{ clipPath: notch }}
                  >
                    <Image
                      src={c.img}
                      alt={c.label}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>

                  {/* chevron sits in the notch */}
                  <span className="absolute bottom-0 start-0 w-14 h-12 flex items-center justify-center text-[#002C5F] pointer-events-none">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="rtl:rotate-180 transition-transform duration-300 group-hover:translate-x-1 rtl:group-hover:-translate-x-1">
                      <path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </div>

                <h3 className="mt-3 text-start text-xl md:text-2xl font-bold text-[#111] group-hover:text-[#002C5F] transition-colors">
                  {c.label}
                </h3>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}