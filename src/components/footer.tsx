import Link from "next/link";
import { Locale } from "@/lib/i18n";
import { models } from "@/lib/models-data";
import Image from "next/image";

interface FooterProps {
  locale: Locale;
  dict: {
    newsletter: string;
    newsletterDesc: string;
    emailPlaceholder: string;
    subscribe: string;
    vehicles: string;
    services: string;
    support: string;
    story: string;
    privacyPolicy: string;
    legalTerms: string;
    rights: string;
    serviceBooking: string;
    callCenter: string;
    afterSales: string;
    partsAccessories: string;
    customerPromise: string;
  };
}

export default function Footer({ locale, dict }: FooterProps) {
  return (
    <footer className="bg-[#111] text-white">
      {/* link columns */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
          <div>
            <h4 className="text-sm font-semibold mb-4">{dict.vehicles}</h4>
            <ul className="space-y-2">
              {models.map((model) => (
                <li key={model.slug}>
                  <Link
                    href={`/${locale}/models/${model.slug}`}
                    className="text-sm text-white/50 hover:text-white transition-colors"
                  >
                    {locale === "ar" ? model.nameAr : model.nameEn}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
<div>
            <h4 className="text-sm font-semibold mb-4">{dict.services}</h4>
            <ul className="space-y-2">
              {[
                { href: `/${locale}/services/service-booking`, label: dict.serviceBooking },
                { href: `/${locale}/services/call-center`, label: dict.callCenter },
                { href: `/${locale}/services/after-sales`, label: dict.afterSales },
                { href: `/${locale}/services/parts-accessories`, label: dict.partsAccessories },
                { href: `/${locale}/customer-promise`, label: dict.customerPromise },
              ].map((s) => (
                <li key={s.href}>
                  <Link href={s.href} className="text-sm text-white/50 hover:text-white transition-colors">
                    {s.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold mb-4">{dict.support}</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href={`/${locale}/contact-us`}
                  className="text-sm text-white/50 hover:text-white transition-colors"
                >
                  {locale === "ar" ? "اتصل بنا" : "Contact Us"}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/find-us`}
                  className="text-sm text-white/50 hover:text-white transition-colors"
                >
                  {locale === "ar" ? "مواقعنا" : "Find Us"}
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold mb-4">{dict.story}</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href={`/${locale}/about-hyundai`}
                  className="text-sm text-white/50 hover:text-white transition-colors"
                >
                  {locale === "ar" ? "نبذة عن هيونداي" : "About Hyundai"}
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <Image
          src='svglogo/AloulaVertical.svg'
          alt="Al-Oula Motors"
          width={160}
          height={44}
          className="block mr-auto h-20 w-auto mt-16"
        />
      </div>

      {/* legal bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row justify-between items-center text-xs text-white/30 gap-4">
          <span>{dict.rights}</span>
          <div className="flex gap-6">
            <Link
              href={`/${locale}/privacy-policy`}
              className="hover:text-white/60 transition-colors"
            >
              {dict.privacyPolicy}
            </Link>            <span>{dict.legalTerms}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
