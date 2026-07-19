import Link from "next/link";
import PartsTabs from "@/components/parts-tabs";
import type { PartTab } from "@/lib/parts-data";
import { getDictionary, Locale } from "@/lib/i18n";
import ParallaxImage from "@/components/parallax-image";

export default async function PartsAccessoriesPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ active_tab?: string }>;
}) {
  const { locale: rawLocale } = await params;
  const { active_tab } = await searchParams;
  const locale = rawLocale as Locale;
  const dict = await getDictionary(locale);
  const t = dict.partsAccessories;
  const tabs = t.tabs as PartTab[];

  return (
    <>
<section className="relative h-[60svh] min-h-[24rem] -mt-[72px] overflow-hidden">
        <ParallaxImage src="/images/services/accessories-banner.webp" label={t.bannerTitle} priority className="absolute inset-0 h-full" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        <div className="absolute inset-0 max-w-7xl mx-auto px-6 flex flex-col justify-end pb-16">
          <nav className="mb-4 flex items-center gap-2 text-sm text-white/70">
            <Link href={`/${locale}`} className="hover:text-white transition-colors">
              {t.breadcrumbHome}
            </Link>
            <span aria-hidden>›</span>
            <span>{t.breadcrumbService}</span>
            <span aria-hidden>›</span>
            <span className="text-white">{t.breadcrumbParts}</span>
          </nav>
          <h1 className="text-3xl md:text-4xl font-bold text-white">{t.bannerTitle}</h1>
          <p className="mt-3 max-w-2xl text-white/90">{t.bannerSubtitle}</p>
        </div>
      </section>

      <PartsTabs tabs={tabs} initialTab={active_tab ?? tabs[0].id}         guaranteePrefix={t.guaranteePrefix} />
    </>
  );
}