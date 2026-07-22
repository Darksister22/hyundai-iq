import { getDictionary, getDirection, Locale, locales } from "@/lib/i18n";
import type { Viewport } from "next";
import type { Metadata } from "next";
import Header from "@/components/header";
import { textHyundai, headHyundai, arabic } from "@/lib/fonts";
import Footer from "@/components/footer";
import LoadingScreen from "@/components/loading-screen";
import { getFindCarData } from "@/lib/find-car-data";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

// ISR: the layout (and its Supabase fetch) is re-rendered at most every
// 5 minutes, so CMS edits appear on the site without a redeploy.
export const revalidate = 300;

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  interactiveWidget: "resizes-content"
}
export  async function generateMetadata({params,}:{params: Promise<{locale:string}>;}):
Promise<Metadata> {
  const {locale} = await params;
  const isAr = locale ==="ar";
  return{
    metadataBase:new URL("https://hyundai-iq.vercel.app"),
    title: {
      default:isAr ? "هيونداي العراق" : "Hyundai Iraq",
      template: isAr? "%s | هيونداي العراق" : "Hyundai Iraq",
    },
    description : 
      isAr ? "الاولى موتورز الموزع المعتمد لسيارات هونداي في العراق لبيع المركبات و الخدمات و قطع الغيار الاصلية" : "Al-Oula Motors the authorize Hyundai distributor in Iraq for selling vehicles, service, and genuine parts",
    alternates:{
      canonical: `/${locale}`,
      languages: {ar: "/ar", en: "/en"}
    },
    openGraph:{
      type:"website",
      locale: isAr ? "ar_IQ" : "en_US",
      siteName: isAr ? "هونداي العراق" : "Hyundai Iraq"
    }
  }
}
export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale = (locales.includes(rawLocale as Locale) ? rawLocale : "ar") as Locale; //depending on the locale, use either en/ar
  const dir = getDirection(locale);
  const dict = await getDictionary(locale);
  const { categories, cars } = await getFindCarData();

  return (
    <html lang={locale} dir={dir} className={`${textHyundai.variable} ${headHyundai.variable} ${arabic.variable}`}>
      <body>
        <LoadingScreen />
        <Header locale={locale} dict={dict.nav} categories={categories} cars={cars} />
        <main className="pt-[72px]">{children}</main>
        <Footer locale={locale} dict={dict.footer} />
      </body>
    </html>
  );
}