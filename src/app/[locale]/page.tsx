import { notFound } from "next/navigation";
import { getDictionary, isValidLocale, Locale } from "@/lib/i18n";
import { models } from "@/lib/models-data";
import HomeClient from "@/components/home-client";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  if (!isValidLocale(rawLocale)) notFound();
  const locale = rawLocale as Locale;
  const dict = await getDictionary(locale);

  // first 4 models feed the hero carousel
  const heroSlides = models.slice(0, 4).map((m) => ({
    name: locale === "ar" ? m.nameAr : m.nameEn,
    tagline: locale === "ar" ? m.overview.taglineAr : m.overview.taglineEn,
    slug: m.slug,
  }));

  return (
    <HomeClient
      locale={locale}
      dict={dict.home}
      models={models}
      heroSlides={heroSlides}
    />
  );
}
