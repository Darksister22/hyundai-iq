import { getDictionary, Locale } from "@/lib/i18n";

export default async function AboutPage({
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
        <h1 className="text-3xl font-bold text-[#002C5F] mb-4">
          {dict.about.title}
        </h1>
        <p className="text-gray-500 max-w-2xl">{dict.about.subtitle}</p>

        {/* placeholder for CMS content */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="h-80 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center text-sm text-gray-400">
            About image
          </div>
          <div className="space-y-4">
            <p className="text-gray-600 leading-relaxed">
              {locale === "ar"
                ? "محتوى صفحة من نحن سيتم تحميله من لوحة التحكم. هذا نص مؤقت."
                : "About page content will be loaded from the dashboard. This is placeholder text."}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
