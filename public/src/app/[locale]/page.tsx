import { notFound } from "next/navigation";
import { getDictionary, isValidLocale, Locale } from "@/lib/i18n";
import { getHomeData } from "@/lib/find-car-data";
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

  // categories, cars (specs/seating/spin), and hero banners — one fetch
  const { categories, cars, banners } = await getHomeData();

  return (
    <HomeClient
      locale={locale}
      dict={dict.home}
      categories={categories}
      cars={cars}
      banners={banners}
    />
  );
}