import Link from "next/link";
import Image from "next/image";
import { getSalesOffers } from "@/lib/offers-data-db";
import { getDictionary, Locale } from "@/lib/i18n";
import { type Metadata } from "next";
import ImageWithLoader from "@/components/loaders/loading-image";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = (await getDictionary(locale as Locale)).offers;

  return {
    title: t.bannerTitle,
    description: t.bannerSubtitle,
    alternates: { canonical: `/${locale}/offers` },
  };
}

// list regenerates at most every 5 min, matching the rest of the site
export const revalidate = 300;

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

  const offers = await getSalesOffers();

  return (
    <div className="bg-white">
      {/* banner */}
      <section className="relative h-[60lvh] min-h-[24rem] -mt-[72px] overflow-hidden bg-gray-200">
        <ImageWithLoader src="/images/IONIQ_9_3.webp" unoptimized alt={t.bannerTitle} fill priority sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-black/30" />

        <div className="absolute inset-0 max-w-7xl mx-auto px-6 flex flex-col justify-end pb-16">
          <nav className="mb-4 flex items-center gap-2 text-sm text-white/70">
            <Link href={`/${locale}`} className="hover:text-white transition-colors">{t.breadcrumbHome}</Link>
            <span aria-hidden>›</span>
            <span >{t.breadcrumbOffers}</span>
                        <span aria-hidden>›</span>

          </nav>
          <h1 className="text-3xl md:text-4xl font-bold text-white">{t.bannerTitle}</h1>
          <p className="mt-3 max-w-2xl text-white/90">{t.bannerSubtitle}</p>
        </div>
      </section>

      {/* cards */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {offers.map((o) => (
            <article key={o.slug}>
              <div className="relative aspect-[16/9] rounded-lg overflow-hidden bg-gray-100">
                {o.image && (
                  <Image src={o.image} alt={isAr ? o.title.ar : o.title.en} fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
                )}
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
                <span aria-hidden>›</span>
              </Link>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
