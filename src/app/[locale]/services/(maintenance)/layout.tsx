import Image from "next/image";
import type { ReactNode } from "react";
import { ServiceBreadcrumb, ServiceTabs } from "@/components/service-nav";
import { getDictionary, Locale } from "@/lib/i18n"; // ← adjust to your loader

export default async function AftersalesLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale = rawLocale as Locale;
  const dict = (await getDictionary(locale)).serviceBooking;

  return (
    <div className="bg-white">
      {/* ---------- Banner (one image, fixed for both pages) ---------- */}
      <section className="relative h-[70svh] min-h-[28rem] -mt-[72px] overflow-hidden ">
        <Image
          src="/images/services/aftersales-banner.webp"
          alt={dict.bannerTitle}
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />

        {/* breadcrumb + title share the bottom-aligned container, same as about-us */}
        <div className="absolute inset-0 max-w-7xl mx-auto px-6 flex flex-col justify-end pb-16">
          <nav className="mb-4 self-start">
            <ServiceBreadcrumb locale={locale} dict={dict} />
          </nav>
          <h1 className="text-3xl md:text-4xl font-bold text-white">{dict.bannerTitle}</h1>
          <p className="mt-3 text-white/90">{dict.bannerSubtitle}</p>
        </div>
      </section>

      {/* ---------- Pill selector strip (bigger) ---------- */}
      <div className="flex justify-center -mt-7 relative z-10">
        <ServiceTabs locale={locale} dict={dict} />
      </div>

      {/* ---------- Page body (swaps on navigation) ---------- */}
      {children}
    </div>
  );
}