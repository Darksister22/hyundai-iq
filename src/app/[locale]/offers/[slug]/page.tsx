import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import OfferCarousel from "@/components/offer-sections/offer-carousel";
import OfferForm from "@/components/offer-sections/offer-form";
import { VEHICLE_OFFERS, findOffer } from "@/lib/offers-data";
import { getDictionary, Locale } from "@/lib/i18n";

export function generateStaticParams() {
  return VEHICLE_OFFERS.map((o) => ({ slug: o.slug }));
}

export default async function OfferDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: rawLocale, slug } = await params;
  const locale = rawLocale as Locale;
  const dict = await getDictionary(locale);
  const t = dict.offers;
  const isAr = locale === "ar";

  const offer = findOffer(VEHICLE_OFFERS, slug);
  if (!offer) notFound();

  return (
    <div className="bg-white">
      {/* hero image */}
      <section className="relative h-[60svh] min-h-[24rem] -mt-[72px] overflow-hidden bg-gray-200">
        <Image src={offer.image} alt={isAr ? offer.title.ar : offer.title.en} fill priority sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-black/30" />

        <div className="absolute inset-0 max-w-7xl mx-auto px-6 flex flex-col justify-end pb-16">
          <nav className="mb-4 flex items-center gap-2 text-sm text-white/70">
            <Link href={`/${locale}`} className="hover:text-white transition-colors">{t.breadcrumbHome}</Link>
            <span aria-hidden>›</span>
            <Link href={`/${locale}/offers`} className="hover:text-white transition-colors">{t.breadcrumbOffers}</Link>
            <span aria-hidden>›</span>
            <span className="text-white">{isAr ? offer.title.ar : offer.title.en}</span>
          </nav>
          <h1 className="text-3xl md:text-4xl font-bold text-white">{isAr ? offer.title.ar : offer.title.en}</h1>
          <p className="mt-3 max-w-2xl text-white/90">{isAr ? offer.subtitle.ar : offer.subtitle.en}</p>
        </div>
      </section>

      {/* carousel + per-car details */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <OfferCarousel
          locale={locale}
          cars={offer.cars}
          detailsHeading={t.offerDetailsHeading}
          discoverLabel={t.discoverMore}
        />
      </section>

      {/* enquiry form */}
      <section className="max-w-7xl mx-auto px-6 pb-20">
        <OfferForm
          locale={locale}
          offerOptions={offer.cars.map((c) =>
            `${isAr ? offer.title.ar : offer.title.en} — ${isAr ? c.name.ar : c.name.en}`
          )}
          dict={t}
        />
      </section>
    </div>
  );
}