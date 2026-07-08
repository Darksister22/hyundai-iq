import { getDictionary, getDirection, Locale, locales } from "@/lib/i18n";
import type { Viewport } from "next";
import Header from "@/components/header";
import "@fontsource-variable/cairo";
import Footer from "@/components/footer";
import LoadingScreen from "@/components/loading-screen";
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  interactiveWidget: "resizes-content"
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

  return (
    <html lang={locale} dir={dir} >
      <body>
        <LoadingScreen />
        <Header locale={locale} dict={dict.nav} />
        <main className="pt-[72px]">{children}</main>
        <Footer locale={locale} dict={dict.footer} />
      </body>
    </html>
  );
}
