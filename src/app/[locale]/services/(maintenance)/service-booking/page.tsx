import ServiceBookingForm from "@/components/service-booking-form";
import { supabase } from "@/lib/supabase";
import { getDictionary, Locale } from "@/lib/i18n";
import { type Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = (await getDictionary(locale as Locale)).serviceBooking;

  return {
    title: t.pillBooking,
    alternates: { canonical: `/${locale}/services/service-booking` },
  };
}

export default async function ServiceBookingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
    const { locale: rawLocale } = await params;
  const locale = rawLocale as Locale;
  const dict = (await getDictionary(locale)).serviceBooking;
  
const { data, error } = await supabase
  .from("cars")
  .select("name_ar, name_en")
  .order("name_en");
if (error) console.error("cars query failed:", error.message);

  const carModels = (data ?? []).map((c: { name_ar: string | null; name_en: string }) => ({
    value: c.name_en,                              // stored in the DB
    label: locale === "ar" ? c.name_ar ?? c.name_en : c.name_en,
  }));


  return (
    <section className="max-w-7xl mx-auto px-6 py-16 ">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
        {/* sticky left text */}
        <div className="lg:sticky lg:top-24 self-start">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">{dict.bookingTitle}</h2>
          <p className="mt-4 text-gray-500">{dict.bookingSubtitle}</p>
        </div>

        {/* form */}
        <ServiceBookingForm locale={locale} dict={dict} carModels={carModels} />
      </div>
    </section>
  );
}