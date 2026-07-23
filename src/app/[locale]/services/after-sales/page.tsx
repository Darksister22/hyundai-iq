import Link from "next/link";
import Image from "next/image";
import AfterSalesAccordion, {
  type AccordionGroup,
} from "@/components/after-sales-accordion";
import { Phone, Mail, Clock } from "lucide-react";
import { getDictionary, Locale } from "@/lib/i18n";
import {
  getCallCenterInfo,
  getOpenHoursCards,
  callCenterPhones,
  locText,
  OPEN_HOURS_SECTIONS,
  type OpenHoursSection,
} from "@/lib/info";
import { type Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = (await getDictionary(locale as Locale)).afterSales;

  return {
    title: t.bannerTitle,
    description: t.bannerSubtitle,
    alternates: { canonical: `/${locale}/after-sales` },
  };
}


export default async function AfterSalesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale = rawLocale as Locale;
  const dict = await getDictionary(locale);
  const t = dict.afterSales;

  const [cards, info] = await Promise.all([
    getOpenHoursCards(),
    getCallCenterInfo(),
  ]);

  // DB cards → accordion groups in the fixed section order, locale
  // resolved here so the client component stays plain-string. Sections
  // without cards are skipped.
  const sectionTitles = t.sections as Record<OpenHoursSection, string>;
  const groups: AccordionGroup[] = OPEN_HOURS_SECTIONS.map((section) => ({
    title: sectionTitles[section],
    cards: cards
      .filter((c) => c.section === section)
      .map((c) => ({
        name: locText(locale, c.title_ar, c.title_en),
        rows: c.day_rows
          .map((r) => ({
            label: locText(locale, r.label_ar, r.label_en),
            value: locText(locale, r.value_ar, r.value_en),
          }))
          .filter((r) => r.label || r.value),
      })),
  })).filter((g) => g.cards.length > 0);

  const phones = callCenterPhones(info);
  const email = info?.email ?? null;

  return (
    <div className="bg-white">
      {/* Banner — starts at the top, under the fixed header */}
      <section className="relative h-[60svh] min-h-[24rem] -mt-[72px] overflow-hidden bg-gray-100">
        <Image src="/images/customer-promise.webp" alt={t.bannerTitle} fill priority sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

        <div className="absolute inset-0 max-w-7xl mx-auto px-6 flex flex-col justify-end pb-16">
          <nav className="mb-4 flex items-center gap-2 text-sm text-white/70">
            <Link href={`/${locale}`} className="hover:text-white transition-colors">
              {t.breadcrumbHome}
            </Link>
            <span aria-hidden>›</span>
            <span>{t.breadcrumbService}</span>
            <span aria-hidden>›</span>
            <span className="text-white">{t.breadcrumbAfterSales}</span>
          </nav>
          <h1 className="text-3xl md:text-4xl font-bold text-white">{t.bannerTitle}</h1>
          <p className="mt-3 max-w-2xl text-white/90">{t.bannerSubtitle}</p>
        </div>
      </section>

      {/* Content — copy + hours + contact on one side, image on the other */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">

          {/* text column (first in DOM → start edge: right in RTL) */}
          <div>
            <h2 className="text-2xl md:text-4xl font-bold text-[#111]">{t.introTitle}</h2>
            <p className="mt-4 text-gray-500 leading-relaxed">{t.introBody}</p>

            {/* hours — only when the dashboard has cards */}
            {groups.length > 0 ? (
              <div className="border-t border-gray-200 mt-10 pt-8">
                <p className="flex items-center gap-2 text-sm text-gray-500 mb-5">
                  <Clock size={18} strokeWidth={1.6} className="shrink-0" />
                  {t.hoursTitle}
                </p>

                <AfterSalesAccordion groups={groups} closedLabel={t.closed} />
              </div>
            ) : null}

            {/* contact — phone list + email from call_center_info */}
            <div className="border-t border-gray-200 mt-10 pt-8 flex flex-col gap-6">
              {phones.length > 0 ? (
                <div>
                  <p className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                    <Phone size={18} strokeWidth={1.6} className="shrink-0" />
                    {t.phoneLabel}
                  </p>
                  {phones.map((p, i) => (
                    <a
                      key={i}
                      href={`tel:${p.replace(/[^\d+]/g, "")}`}
                      dir="ltr"
                      className="block text-[#111] hover:text-[#002C5F] transition-colors"
                    >
                      {p}
                    </a>
                  ))}
                </div>
              ) : null}

              {email ? (
                <div>
                  <p className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                    <Mail size={18} strokeWidth={1.6} className="shrink-0" />
                    {t.emailLabel}
                  </p>
                  <a href={`mailto:${email}`} dir="ltr" className="block text-[#111] break-all hover:text-[#002C5F] transition-colors">{email}</a>
                </div>
              ) : null}

              <Link
                href={`/${locale}/contact-us`}
                className="mt-2 w-fit px-6 py-3 rounded-full bg-[#002C5F] text-white text-sm font-semibold hover:bg-[#003d7a] transition-colors"
              >
                {t.contactCta}
              </Link>
            </div>
          </div>

          {/* image column — sticky so it stays in view while the accordion expands */}
          <div className="lg:sticky lg:top-28 order-first lg:order-none">
            {/* relative + aspect gives `fill` a positioned parent with real height */}
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-gray-100">
              <Image src="/images/services/call-center-photo.webp" alt={t.introTitle} fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
