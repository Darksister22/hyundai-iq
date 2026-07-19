// app/[locale]/services/(aftersales)/layout.tsx
// Persistent shell for service-booking + call-center. Because this is a
// layout, the banner and pill strip stay mounted while navigating between
// the two child pages — only the page body swaps.
//
// FOLDER MOVE (URLs unchanged — route groups don't affect the path):
//   app/[locale]/services/service-booking/  →  app/[locale]/services/(aftersales)/service-booking/
//   app/[locale]/services/call-center/      →  app/[locale]/services/(aftersales)/call-center/
//
// components/service-page-shell.tsx is replaced by this file + service-nav.tsx — delete it.

import Image from "next/image";
import type { ReactNode } from "react";
import { ServiceBreadcrumb, ServiceTabs } from "@/components/service-nav";
import { getDictionary, Locale } from "@/lib/i18n"; // ← adjust to your loader

export default async function AftersalesLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const dict = (await getDictionary(locale)).serviceBooking;

  return (
    <div>
      {/* ---------- Banner (one image, fixed for both pages) ---------- */}
      <section className="relative h-[420px] w-full overflow-hidden">
        <Image
          src="/images/services/aftersales-banner.webp"  // ← drop your image here
          alt={dict.bannerTitle}
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-black/40" />

        {/* breadcrumb — below the fixed 60px header; last segment tracks the route */}
        <nav className="absolute top-[76px] inset-x-0">
          <ServiceBreadcrumb locale={locale} dict={dict} />
        </nav>

        <div className="absolute bottom-10 inset-x-0">
          <div className="max-w-7xl mx-auto px-6">
            <h1 className="text-white text-5xl md:text-6xl font-bold">{dict.bannerTitle}</h1>
            <p className="mt-3 text-white font-medium">{dict.bannerSubtitle}</p>
          </div>
        </div>
      </section>

      {/* ---------- Pill selector strip (bigger) ---------- */}
      <section className="py-8 bg-gray-50 flex items-center justify-center">
        <ServiceTabs locale={locale} dict={dict} />
      </section>

      {/* ---------- Page body (swaps on navigation) ---------- */}
      {children}
    </div>
  );
}