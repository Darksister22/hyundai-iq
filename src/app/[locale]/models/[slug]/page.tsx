import { notFound } from "next/navigation";
import { getDictionary, isValidLocale, Locale } from "@/lib/i18n";
import { getModelBySlug, getAllSlugs } from "@/lib/models-data";
import ModelDetailClient from "@/components/model-detail-client";

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export default async function ModelPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: rawLocale, slug } = await params;
  if (!isValidLocale(rawLocale)) notFound();
  const locale = rawLocale as Locale;

  const model = getModelBySlug(slug);
  if (!model) notFound();

  const dict = await getDictionary(locale);

  return <ModelDetailClient locale={locale} model={model} dict={dict.model} />;
}
