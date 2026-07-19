import Link from "next/link";
import { getDictionary, Locale } from "@/lib/i18n";

export default async function PrivacyPolicyPage({
    params,
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale: rawLocale } = await params;
    const locale = rawLocale as Locale;
    const dict = await getDictionary(locale);
    const t = dict.privacyPolicy;

    return (
        <>
            {/* Compact header band — legal page, no photo banner.
          -mt clears the fixed header; pt adds it back plus spacing. */}
            <section className="bg-[#002C5F] -mt-[72px] pt-[calc(72px+3rem)] pb-12">
                <div className="max-w-7xl mx-auto px-6">
                    <nav className="text-xs text-white/70 flex items-center gap-2 mb-4">
                        <Link href={`/${locale}`} className="hover:text-white transition-colors">
                            {t.breadcrumbHome}
                        </Link>
                        <span aria-hidden>›</span>
                        <span>{t.breadcrumbLegal}</span>
                        <span aria-hidden>›</span>
                        <span className="text-white">{t.title}</span>
                    </nav>
                    <h1 className="text-3xl md:text-4xl font-bold text-white">{t.title}</h1>
                    <p className="mt-3 text-white/80 max-w-2xl">{t.intro}</p>
                </div>
            </section>

            <section className="max-w-7xl mx-auto px-6 py-16">
                <div className="grid grid-cols-1 lg:grid-cols-[16rem_1fr] gap-12">
                    {/* sticky table of contents — desktop only */}
                    <aside className="hidden lg:block">
                        <nav className="sticky top-28">
                            <p className="text-xs uppercase tracking-[2px] text-gray-400 mb-4">
                                {t.tocTitle}
                            </p>
                            <ul className="space-y-2">
                                {t.sections.map((s, i) => (
                                    <li key={i}>
                                        <a href={`#section-${i}`} className="text-sm text-gray-500 hover:text-[#002C5F] transition-colors">
                                            {s.heading}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    </aside>

                    {/* policy body */}
                    <div className="max-w-3xl">
                        {/* meta block */}
                        <div className="pb-8 mb-8 border-b border-gray-200">
                            <p className="font-bold text-[#111]">{t.company}</p>
                            <p className="mt-1 text-sm text-gray-500">{t.lastUpdated}</p>
                            <p className="mt-4 text-sm text-gray-500 leading-relaxed">
                                {t.languageNote}
                            </p>
                        </div>

                        {t.sections.map((s, i) => (
                            // scroll-mt clears the fixed header when jumping from the ToC
                            <div key={i} id={`section-${i}`} className="scroll-mt-28 mb-10">
                                <h2 className="text-xl md:text-2xl font-bold text-[#002C5F] mb-3">
                                    {s.heading}
                                </h2>
                                <p className="text-gray-600 leading-relaxed">{s.body}</p>

                                {s.items.length > 0 && (
                                    <ul className="mt-4 space-y-2">
                                        {s.items.map((item, j) => (
                                            <li
                                                key={j}
                                                className="flex items-start gap-3 text-gray-600 leading-relaxed"
                                            >
                                                {/* bullet as a span so it sits on the start edge in both directions */}
                                                <span
                                                    className="mt-2 h-1.5 w-1.5 rounded-full bg-[#00AAD2] shrink-0"
                                                    aria-hidden
                                                />
                                                <span>{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
}