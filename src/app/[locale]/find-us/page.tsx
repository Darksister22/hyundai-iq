import { getDictionary, Locale } from "@/lib/i18n";
import ParallaxImage from "@/components/parallax-image";
import { getLocations } from "@/lib/locations";
import LocationCard from "@/components/location-card";
import { type Metadata } from "next";
import ImageWithLoader from "@/components/loaders/loading-image";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = (await getDictionary(locale as Locale)).findUs;

  return {
    title: t.title,
    description: t.subtitle,
    alternates: { canonical: `/${locale}/find-us` },
  };
}

// regenerates at most every 5 min, matching the rest of the site
export const revalidate = 300;

export default async function FindUsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale = rawLocale as Locale;
  const dict = await getDictionary(locale);
  const locations = await getLocations();

  return (
    <>
      {/* ── Banner ── */}
<section className="relative h-[50svh] md:h-[80svh] min-h-[400px] -mt-[72px] overflow-hidden bg-gradient-to-br from-gray-200 to-gray-300">        <ImageWithLoader src="/images/find-us.webp" fill unoptimized className="object-cover" alt={dict.findUs.title} />        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        <div className="absolute inset-0 max-w-7xl mx-auto px-6 flex flex-col justify-end pb-12">
          <nav className="text-xs text-white/80 flex items-center gap-2 self-start mb-3">
            <span>{dict.findUs.home ?? (locale === "ar" ? "الرئيسية" : "Home")}</span>
            <span>/</span>
            <span className="text-white">{dict.findUs.title}</span>
          </nav>
          <h1 className="text-3xl md:text-4xl font-bold text-white">{dict.findUs.title}</h1>
        </div>
      </section>

      <section className="py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-[#002C5F] mb-2">{dict.findUs.title}</h2>
          <p className="text-gray-500 mb-12">{dict.findUs.subtitle}</p>

          {/* HQ static map image, links out to the HQ map_url */}
          {(() => {
            const hq = locations[0]; // first by sort_order = HQ
            const mapHref = hq?.map_url ?? "#";
            return (
              <a href={mapHref} target="_blank" rel="noopener noreferrer" className="block h-56 sm:h-72 md:h-96 rounded-xl overflow-hidden border border-gray-200 relative group">
                <ImageWithLoader src="/images/hq-map.webp" alt={locale === "ar" ? "موقع المقر الرئيسي" : "HQ location"} fill  className="h-auto w-auto object-cover" />
                <span className="absolute bottom-4 end-4 z-10 bg-white/90 text-[#002C5F] text-sm font-semibold px-4 py-2 rounded shadow">
                  {locale === "ar" ? "افتح في الخرائط" : "Open in Maps"}
                </span>
              </a>
            );
          })()}

          {/* location cards from Supabase */}
          {locations.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
              {locations.map((loc) => (
                <LocationCard
                  key={loc.id}
                  loc={loc}
                  locale={locale}
                  viewOnMapLabel={dict.findUs.viewOnMap}
                />
              ))}
            </div>
          ) : (
            <p className="text-gray-400 mt-12">
              {locale === "ar" ? "لا توجد مواقع حالياً." : "No locations yet."}
            </p>
          )}
        </div>
      </section>
    </>
  );
}