import { getDictionary, Locale } from "@/lib/i18n";

export default async function FindUsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale = rawLocale as Locale;
  const dict = await getDictionary(locale);

  return (
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
  );
}
