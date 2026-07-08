import { getDictionary, Locale } from "@/lib/i18n";
import ParallaxImage from "@/components/parallax-image";
export default async function FindUsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale = rawLocale as Locale;
  const dict = await getDictionary(locale);

  return (
    <>
      {/* ── Banner: placeholder, full-bleed under the fixed header ── */}
      <section className="relative h-[80svh] min-h-[590px] -mt-[72px] overflow-hidden bg-gradient-to-br from-gray-200 to-gray-300">
        {/* TODO: replace with <Image src="/images/find-us.webp" alt="" fill priority className="object-cover" /> */}
        <ParallaxImage src="/images/find-us.webp" priority className="absolute inset-0 h-full w-full" />

        {/* gradient so overlaid text stays legible on any image */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        {/* breadcrumb + title, bottom-start (RTL-aware) */}
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
          <h1 className="text-3xl font-bold text-[#002C5F] mb-2">
            {dict.findUs.title}
          </h1>
          <p className="text-gray-500 mb-12">{dict.findUs.subtitle}</p>

          {/* map placeholder */}
          <div className="h-96 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center text-sm text-gray-400 border border-gray-200">
            {locale === "ar"
              ? "خريطة المعارض — سيتم ربطها بـ Google Maps API"
              : "Showroom map — will be connected to Google Maps API"}
          </div>

          {/* showroom cards placeholder */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            {[
              {
                nameEn: "Baghdad — Karrada",
                nameAr: "بغداد — الكرادة",
                phoneEn: "+964 XXX XXX XXXX",
              },
              {
                nameEn: "Baghdad — Mansour",
                nameAr: "بغداد — المنصور",
                phoneEn: "+964 XXX XXX XXXX",
              },
              {
                nameEn: "Erbil — Showroom",
                nameAr: "أربيل — المعرض",
                phoneEn: "+964 XXX XXX XXXX",
              },
            ].map((loc) => (
              <div
                key={loc.nameEn}
                className="bg-white rounded-xl border border-gray-200 p-6"
              >
                <h3 className="font-semibold text-[#002C5F]">
                  {locale === "ar" ? loc.nameAr : loc.nameEn}
                </h3>
                <p className="text-sm text-gray-500 mt-2">{loc.phoneEn}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
