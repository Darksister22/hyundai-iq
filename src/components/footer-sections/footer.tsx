import Link from "next/link";
import { Locale } from "@/lib/i18n";
import Image from "next/image";
import FooterVehicles from "./footer-vehicles";
import FooterServices from "./footer-services";
import { SocialIcon, SOCIAL_LABELS } from "./social-icons";
import type { SocialLink } from "@/lib/social";
import { FindCarCar, FindCarCategory } from "@/lib/find-car-data";

interface FooterProps {
  locale: Locale;
  cars: FindCarCar[];
  categories: FindCarCategory[];
  socials: SocialLink[];
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
    salesOffers: string;
    aftersalesOffers: string;
  };
}

export default function Footer({ locale, dict, cars, categories, socials }: FooterProps) {
  const isAr = locale === "ar";

  return (
    <footer className="bg-[#111] text-white">
      {/* logo + link columns side by side */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex flex-col lg:flex-row lg:items-start gap-10">
          {/* logo — to the side, not below; shrink-0 keeps it from squashing */}
          <Image
            src="/svglogo/AloulaVertical.svg"
            alt="Al-Oula Motors"
            width={160}
            height={44}
            className="h-20 w-auto shrink-0"
          />

          {/* the four link columns take the remaining width */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 flex-1">
            <FooterVehicles
              locale={locale}
              cars={cars}
              categories={categories}
              heading={dict.vehicles}
            />

            {/* <FooterServices
              heading={dict.services}
              links={[
                { href: `/${locale}/services/service-booking`, label: dict.serviceBooking },
                { href: `/${locale}/services/call-center`, label: dict.callCenter },
                { href: `/${locale}/services/after-sales`, label: dict.afterSales },
                { href: `/${locale}/services/parts-accessories`, label: dict.partsAccessories },
                { href: `/${locale}/customer-promise`, label: dict.customerPromise },
                { href: `/${locale}/offers`, label: dict.salesOffers },
                { href: `/${locale}/aftersales-offers`, label: dict.aftersalesOffers },
              ]}
            /> */}

            <div>
              <h4 className="text-sm font-semibold mb-4">{dict.support}</h4>
              <ul className="space-y-2">
                <li>
                  <Link href={`/${locale}/contact-us`} className="text-sm text-white/50 hover:text-white transition-colors">
                    {isAr ? "اتصل بنا" : "Contact Us"}
                  </Link>
                </li>
                <li>
                  <Link href={`/${locale}/find-us`} className="text-sm text-white/50 hover:text-white transition-colors">
                    {isAr ? "مواقعنا" : "Find Us"}
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold mb-4">{dict.story}</h4>
              <ul className="space-y-2">
                <li>
                  <Link href={`/${locale}/about-hyundai`} className="text-sm text-white/50 hover:text-white transition-colors">
                    {isAr ? "نبذة عن هيونداي" : "About Hyundai"}
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* legal bar — socials · legal links · logo */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-6">

          <div className="flex items-center gap-5 order-2 md:order-1">
            {socials.map((s) => (
              <a
                key={s.platform}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={SOCIAL_LABELS[s.platform]}
                className="text-white/60 hover:text-white transition-colors"
              >
                <SocialIcon platform={s.platform} size={20} />
              </a>
            ))}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-xs text-white/50 order-1 md:order-2">
            <Link href={`https://www.hyundai.com/worldwide/en/footer/contact-legal/privacy-policy`} className="hover:text-white transition-colors">{dict.privacyPolicy}</Link>
            <span>{dict.legalTerms}</span>
            <span>{isAr ? "سياسة ملفات تعريف الارتباط" : "Cookie Policy"}</span>
          </div>

<Image src="/svglogo/HyundaiLogoWhite.svg" alt="Hyundai" width={140} height={24} style={{ height: "1.5rem", width: "auto" }} className="order-3" />
        </div>
      </div>
    </footer>
  );
}