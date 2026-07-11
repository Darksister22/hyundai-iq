import { notFound } from "next/navigation";
import { getDictionary, isValidLocale, Locale } from "@/lib/i18n";
import { getCarBySlug, getAllCarSlugs } from "@/lib/model-detail-data";
import ModelDetailClient from "@/components/model-detail-client";

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

  return <ModelDetailClient locale={locale} model={model} dict={dict.model} />;
}
