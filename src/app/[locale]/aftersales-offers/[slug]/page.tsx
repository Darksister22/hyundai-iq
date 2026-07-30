import Link from "next/link";
import { notFound } from "next/navigation";
import OfferDetails from "@/components/offer-sections/offer-details";
import ServiceBookingForm from "@/components/service-booking-form";
import { supabase } from "@/lib/supabase";
import { getAftersalesOfferBySlug, getAftersalesOfferSlugs } from "@/lib/offers-data-db";
import { getDictionary, Locale } from "@/lib/i18n";
import ImageWithLoader from "@/components/loaders/loading-image";
import type { Metadata } from "next";

export async function generateStaticParams() {
  const slugs = await getAftersalesOfferSlugs();
  return slugs.map((slug) => ({ slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale, slug } = await params;
  const locale = rawLocale as Locale;
  const isAr = locale === "ar";

  const offer = await getAftersalesOfferBySlug(slug);
  if (!offer) return {}; // page will notFound() in the component

  const title = isAr ? offer.title.ar : offer.title.en;
  const description = isAr
    ? offer.subtitle?.ar ?? offer.title.ar
    : offer.subtitle?.en ?? offer.title.en;

  return {
    title,
    description,
    alternates: { canonical: `/${locale}/aftersales-offers/${slug}` },
    openGraph: {
      title,
      description,
      type: "website",
      images: offer.image ? [{ url: offer.image }] : undefined,
    },
  };
}
export const revalidate = 300;

export default async function AftersalesOfferDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: rawLocale, slug } = await params;
  const locale = rawLocale as Locale;
  const dict = await getDictionary(locale);
  const t = dict.aftersalesOffers;
  const sbDict = dict.serviceBooking; // ServiceBookingForm's dictionary slice
  const isAr = locale === "ar";

  const offer = await getAftersalesOfferBySlug(slug);
  if (!offer) notFound();

  // car models for the booking form — English name stored, localized label
  const { data, error } = await supabase
    .from("cars")
    .select("name_ar, name_en")
    .order("name_en");
  if (error) console.error("cars query failed:", error.message);

  const carModels = (data ?? []).map(
    (c: { name_ar: string | null; name_en: string }) => ({
      value: c.name_en,
      label: locale === "ar" ? c.name_ar ?? c.name_en : c.name_en,
    })
  );

  return (
    <div className="bg-white">
      {/* hero image */}
      <section className="relative h-[60lvh] min-h-[24rem] -mt-[72px] overflow-hidden bg-gray-200">
        {offer.image && (
          <ImageWithLoader unoptimized src={offer.image} alt={isAr ? offer.title.ar : offer.title.en} fill sizes="100vw" className="object-cover" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-black/30" />

        <div className="absolute inset-0 max-w-7xl mx-auto px-6 flex flex-col justify-end pb-16">
          <nav className="mb-4 flex items-center gap-2 text-sm text-white/70">
            <Link href={`/${locale}`} className="hover:text-white transition-colors">{t.breadcrumbHome}</Link>
            <span aria-hidden>›</span>
            <span >{t.breadcrumbOffers}</span>
            <span aria-hidden>›</span>
            <Link href={`/${locale}/aftersales-offers`} className="hover:text-white transition-colors">{isAr ? "عروض الصيانة" : "Maintenance Offers"}</Link>
            <span aria-hidden>›</span>
            

          </nav>
          <h1 className="text-3xl md:text-4xl font-bold text-white">{isAr ? offer.title.ar : offer.title.en}</h1>
          <p className="mt-3 max-w-2xl text-white/90">{isAr ? offer.subtitle.ar : offer.subtitle.en}</p>
        </div>
      </section>

      {/* offer details — bullets on the white half, title2 on the navy half,
          reservation phone from the DB */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <OfferDetails
          locale={locale}
          heading={t.offerDetailsHeading}
          callLabel={t.reservationCallLabel}
          details={offer.details}
          ctaValue={offer.ctaValue}
          callNumber={offer.phone ?? undefined}
        />
      </section>

      {/* booking form — same component as the service-booking page */}
      <section className="max-w-7xl mx-auto px-6 pb-20">
        <ServiceBookingForm locale={locale} dict={sbDict} carModels={carModels} />
      </section>
    </div>
  );
}
