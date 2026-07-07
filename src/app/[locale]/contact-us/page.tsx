import Link from "next/link";
import { getDictionary, Locale } from "@/lib/i18n";
import ContactForm from "@/components/contact-form";
import Image from "next/image";

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
    <>
      {/* Hero banner */}
      <section className="relative h-[492px] -mt-[72px] overflow-hidden bg-gradient-to-br from-gray-200 to-gray-300">       
        <Image
          src="/images/contact-us.webp"
          alt=""            
          fill
          priority          
          className="object-cover"
        />

        {/* dark gradient so overlaid text stays readable on any image */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-black/20" />

        <div className="relative h-full max-w-7xl mx-auto px-6 flex flex-col justify-end pb-10">
          <nav className="text-xs text-white/80 flex items-center gap-2 self-start mb-3">
            <Link href={`/${locale}`} className="hover:text-white">
              {t.home}
            </Link>
            <span>/</span>
            <span>{t.breadcrumbSupport}</span>
            <span>/</span>
            <span className="text-white">{t.title}</span>
          </nav>
          <h1 className="text-4xl md:text-5xl font-bold text-white">{t.title}</h1>
        </div>
      </section>

      {/* Form section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <ContactForm locale={locale} dict={t} />

            <aside className="lg:order-first">
              <h2 className="text-2xl font-bold text-[#002C5F]">{t.subtitle}</h2>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}
