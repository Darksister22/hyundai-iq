import { getDictionary, Locale } from "@/lib/i18n";

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale = rawLocale as Locale;
  const dict = await getDictionary(locale);
  const t = dict.contact;

  return (
    <section className="py-20">
      <div className="max-w-3xl mx-auto px-6">
        <h1 className="text-3xl font-bold text-[#002C5F] mb-2">{t.title}</h1>
        <p className="text-gray-500 mb-12">{t.subtitle}</p>

        <div className="bg-white rounded-xl border border-gray-200 p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm text-gray-600 mb-2">
                {t.name}
              </label>
              <input
                type="text"
                className="w-full px-4 py-3 border border-gray-200 rounded text-sm"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-2">
                {t.phone}
              </label>
              <input
                type="tel"
                className="w-full px-4 py-3 border border-gray-200 rounded text-sm"
              />
            </div>
          </div>
          <div className="mt-6">
            <label className="block text-sm text-gray-600 mb-2">
              {t.email}
            </label>
            <input
              type="email"
              className="w-full px-4 py-3 border border-gray-200 rounded text-sm"
            />
          </div>
          <div className="mt-6">
            <label className="block text-sm text-gray-600 mb-2">
              {t.message}
            </label>
            <textarea
              rows={5}
              className="w-full px-4 py-3 border border-gray-200 rounded text-sm resize-none"
            />
          </div>
          <button className="mt-8 px-8 py-3 bg-[#002C5F] text-white text-sm font-semibold rounded hover:bg-[#003d7a] transition-colors">
            {t.send}
          </button>
        </div>
      </div>
    </section>
  );
}
