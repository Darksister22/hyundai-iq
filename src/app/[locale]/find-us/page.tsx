import { getDictionary, Locale } from "@/lib/i18n";
import ParallaxImage from "@/components/parallax-image";
import { getLocations, localized } from "@/lib/locations";
import { type Metadata } from "next";

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
      <section className="relative h-[80svh] min-h-[590px] -mt-[72px] overflow-hidden bg-gradient-to-br from-gray-200 to-gray-300">
        <ParallaxImage src="/images/find-us.webp" priority className="absolute inset-0 h-full w-full" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        <div className="absolute inset-0 max-w-7xl mx-auto px-6 flex flex-col justify-end pb-12">
          <nav className="text-xs text-white/80 flex items-center gap-2 self-start mb-3">
            <span>{dict.findUs.home ?? (locale === "ar" ? "الرئيسية" : "Home")}</span>
            <span>/</span>
            <span className="text-white">{dict.findUs.title}</span>
          </nav>
          <h1 className="text-3xl md:text-4xl font-bold text-white">{dict.findUs.title}</h1>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-[#002C5F] mb-2">{dict.findUs.title}</h2>
          <p className="text-gray-500 mb-12">{dict.findUs.subtitle}</p>

          {/* HQ static map image, links out to the HQ map_url */}
          {(() => {
            const hq = locations[0]; // first by sort_order = HQ
            const mapHref = hq?.map_url ?? "#";
            return (
              <a
                href={mapHref}
                target="_blank"
                rel="noopener noreferrer"
                className="block h-96 rounded-xl overflow-hidden border border-gray-200 relative group"
              >
                <img
                  src="/images/hq-map.webp"
                  alt={locale === "ar" ? "موقع المقر الرئيسي" : "HQ location"}
                  className="w-full h-full object-cover"
                />
                <span className="absolute bottom-4 end-4 bg-white/90 text-[#002C5F] text-sm font-semibold px-4 py-2 rounded shadow">
                  {locale === "ar" ? "افتح في الخرائط" : "Open in Maps"}
                </span>
              </a>
            );
          })()}

          {/* location cards from Supabase */}
          {locations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              {locations.map((loc) => {
                const city = localized(loc, "city", locale);
                const landmark = localized(loc, "landmark", locale);
                return (
                  <a
                    key={loc.id}
                    href={loc.map_url ?? "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow block"
                  >
                    {loc.province && (
                      <span className="text-xs uppercase tracking-wider text-[#00AAD2] font-semibold">
                        {loc.province}
                      </span>
                    )}
                    <h3 className="font-semibold text-[#002C5F] mt-1 capitalize">
                      {city}
                    </h3>
                    {landmark && (
                      <p className="text-sm text-gray-500 mt-2 capitalize">{landmark}</p>
                    )}
                    {loc.map_url && (
                      <span className="inline-flex items-center gap-1 mt-4 text-sm font-semibold text-[#002C5F] group-hover:text-[#00AAD2] transition-colors">
                        {locale === "ar" ? "على الخريطة" : "View on map"}
                        <span aria-hidden>›</span>
                      </span>
                    )}
                  </a>
                );
              })}
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