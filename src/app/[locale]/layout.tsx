import { getDictionary, getDirection, Locale, locales } from "@/lib/i18n";
import Header from "@/components/header";
import "@fontsource-variable/cairo";
import Footer from "@/components/footer";
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
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
        <Header locale={locale} dict={dict.nav} />
        <main className="pt-[72px]">{children}</main>
        <Footer locale={locale} dict={dict.footer} />
      </body>
    </html>
  );
}
