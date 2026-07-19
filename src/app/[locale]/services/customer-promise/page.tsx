import Link from "next/link";
import Image from "next/image";
import { CheckCircle2 } from "lucide-react";
import { getDictionary, Locale } from "@/lib/i18n";
import ParallaxImage from "@/components/parallax-image";

export default async function CustomerPromisePage({
    params,
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale: rawLocale } = await params;
    const locale = rawLocale as Locale;
    const dict = await getDictionary(locale);
    const t = dict.customerPromise; // section for this page

    return (
        <>
            {/* Hero banner — mirrors the contact-us hero */}
            <section className="relative h-[492px] -mt-[72px] overflow-hidden bg-gradient-to-br from-gray-200 to-gray-300">
                <Image
                    src="/images/customer-promise.webp" // add this asset to /public/images
                    alt=""
                    fill
                    priority
                    className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-black/20" />

                <div className="relative h-full max-w-7xl mx-auto px-6 flex flex-col justify-end pb-10">
                    <nav className="text-xs text-white/80 flex items-center gap-2 self-start mb-3">
                        <Link href={`/${locale}`} className="hover:text-white">{t.breadcrumbHome}</Link>
                        <span>/</span>
                        <span>{t.breadcrumbService}</span>
                        <span>/</span>
                        <span className="text-white">{t.title}</span>
                    </nav>
                    <h1 className="text-4xl md:text-5xl font-bold text-white">{t.title}</h1>
                    <p className="mt-3 max-w-2xl text-white/90">{t.subtitle}</p>
                </div>
            </section>

            {/* Bold intro tagline */}
            <section className="py-14 bg-white">
                <div className="max-w-4xl mx-auto px-6">
                    <p className="text-xl md:text-2xl font-bold text-[#111] leading-relaxed ">
                        {t.tagline}
                    </p>
                </div>
            </section>

            {/* Image + checklist — full-bleed, two equal flush halves */}
            <div className="px-4 md:px-8 py-8 md:py-12 bg-white">
                <section className="grid grid-cols-1 md:grid-cols-2 items-stretch rounded-2xl overflow-hidden">
                    {/* image half — first child → right side in RTL */}
                    <div className="relative min-h-[420px] md:min-h-0">
                        <ParallaxImage src="/images/promise.webp" label="t.listHeading" className="object-cover h-full w-full" />
                    </div>

                    {/* checklist half */}
                    <div className="bg-gray-100 flex items-center">
                        <div className="w-full max-w-xl px-6 md:px-12 py-16 md:py-24 me-auto">
                            <h2 className="text-2xl md:text-4xl font-bold text-[#111] mb-2">{t.listHeading}</h2>
                            <p className="text-gray-500 mb-8">{t.listIntro}</p>

                            <ul className="space-y-4">
                                {t.promises.map((promise, i) => (
                                    <li key={i} className="flex items-start gap-3">
                                        <CheckCircle2 size={20} strokeWidth={2} className="text-[#00AAD2] shrink-0 mt-1" />
                                        <span className="text-[#111] leading-relaxed">{promise}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
}

