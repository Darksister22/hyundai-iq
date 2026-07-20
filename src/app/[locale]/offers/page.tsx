import Link from "next/link";
import Image from "next/image";
import { VEHICLE_OFFERS } from "@/lib/offers-data";
import { getDictionary, Locale } from "@/lib/i18n";

export default async function OffersPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale = rawLocale as Locale;
  const dict = await getDictionary(locale);
  const t = dict.offers;
  const isAr = locale === "ar";

  return (
    <div className="bg-white">
      {/* banner */}
      <section className="relative h-[60svh] min-h-[24rem] -mt-[72px] overflow-hidden bg-gray-200">
        <Image src="/images/IONIQ_9_3.webp" alt={t.bannerTitle} fill priority sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-black/30" />

        <div className="absolute inset-0 max-w-7xl mx-auto px-6 flex flex-col justify-end pb-16">
          <nav className="mb-4 flex items-center gap-2 text-sm text-white/70">
            <Link href={`/${locale}`} className="hover:text-white transition-colors">{t.breadcrumbHome}</Link>
                <span aria-hidden className="inline-block rtl:rotate-180">›</span>            <span className="text-white">{t.breadcrumbOffers}</span>
          </nav>
          <h1 className="text-3xl md:text-4xl font-bold text-white">{t.bannerTitle}</h1>
          <p className="mt-3 max-w-2xl text-white/90">{t.bannerSubtitle}</p>
        </div>
      </section>

      {/* cards */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {VEHICLE_OFFERS.map((o) => (
            <article key={o.slug}>
              <div className="relative aspect-[16/9] rounded-lg overflow-hidden bg-gray-100">
                <Image src={o.image} alt={isAr ? o.title.ar : o.title.en} fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
              </div>
              <h2 className="mt-5 text-xl md:text-2xl font-bold text-[#111]">
                {isAr ? o.title.ar : o.title.en}
              </h2>
              <p className="mt-2 text-gray-500">{isAr ? o.subtitle.ar : o.subtitle.en}</p>
              <Link
                href={`/${locale}/offers/${o.slug}`}
                className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 border border-[#002C5F] text-[#002C5F] text-sm font-semibold hover:bg-[#002C5F] hover:text-white transition-colors"
              >
                {t.offerDetailsCta}
                <span aria-hidden className="rtl:rotate-180">›</span>
              </Link>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}