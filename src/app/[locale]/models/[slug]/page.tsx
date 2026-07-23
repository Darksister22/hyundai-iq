import { notFound } from "next/navigation";
import { getDictionary, isValidLocale, Locale } from "@/lib/i18n";
import { getCarBySlug, getAllCarSlugs } from "@/lib/model-detail-data";
import ModelDetailClient from "@/components/model-detail-client";
import { type Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale, slug } = await params;
  if (!isValidLocale(rawLocale)) return {};
  const locale = rawLocale as Locale;

  const model = await getCarBySlug(slug, locale);
  if (!model) return {};

  const isAr = locale === "ar";
  const name = isAr ? model.nameAr : model.nameEn;

  // Built from real model data — both name variants are included regardless
  // of locale, since people search "Tucson" even on the Arabic site.
  const keywords = [
    model.nameEn,
    model.nameAr,
    `Hyundai ${model.nameEn}`,
    isAr ? `هيونداي ${model.nameAr}` : null,
    isAr ? "هيونداي العراق" : "Hyundai Iraq",
    isAr ? "أسعار هيونداي" : "Hyundai price Iraq",
    ...model.visualizer.colors.map((c) => (isAr ? c.nameAr : c.nameEn)),
  ].filter((k): k is string => Boolean(k && k.trim()));

  return {
    title: name,
    description: isAr ? model.heroHeadlineAr : model.heroHeadlineEn,
    keywords: Array.from(new Set(keywords)).slice(0, 15),
    alternates: { canonical: `/${locale}/models/${slug}` },
    openGraph: {
      title: name,
      images: model.hero ? [model.hero] : undefined,
    },
  };
}

export async function generateStaticParams() {
  const slugs = await getAllCarSlugs();
  return slugs.map((slug) => ({ slug }));
}

// cars added/edited in the CMS appear without a redeploy:
// unknown slugs render on first visit (dynamicParams default),
// existing pages regenerate at most every 5 minutes
export const revalidate = 300;
export default async function ModelPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: rawLocale, slug } = await params;
  if (!isValidLocale(rawLocale)) notFound();
  const locale = rawLocale as Locale;

  const model = await getCarBySlug(slug, locale);
  if (!model) notFound();

  const dict = await getDictionary(locale);
  const isAr = locale === "ar";
  const PLACEHOLDER_URL = "https://hyundai-iq.example.com";

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : PLACEHOLDER_URL);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `Hyundai ${isAr ? model.nameAr : model.nameEn}`,
    description: isAr ? model.heroHeadlineAr : model.heroHeadlineEn,
    image: model.hero ? [model.hero] : undefined, brand: { "@type": "Brand", name: "Hyundai" },
    url: `${siteUrl}/${locale}/models/${slug}`,
    // Paint options double as product variants
    color: model.visualizer.colors
      .map((c) => (isAr ? c.nameAr : c.nameEn))
      .filter(Boolean),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ModelDetailClient locale={locale} model={model} dict={dict.model} />
    </>
  );
}