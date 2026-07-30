import ServiceBookingForm from "@/components/service-booking-form";
import { supabase } from "@/lib/supabase";
import { getDictionary, Locale } from "@/lib/i18n";
import { type Metadata } from "next";

/** Row shape shared by service_types and maintenance_vehicles. */
type ListRow = {
  name_ar: string | null;
  name_en: string;
};

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

  // Both dropdowns are now dashboard-managed lists. `name_en` is the value
  // stored on the booking (snapshot convention, same as city / car_model).
  const [servicesRes, vehiclesRes] = await Promise.all([
    supabase
      .from("service_types")
      .select("name_ar, name_en")
      .eq("is_active", true)
      .order("sort_order")
      .order("id"),
    supabase
      .from("maintenance_vehicles")
      .select("name_ar, name_en")
      .eq("is_active", true)
      .order("sort_order")
      .order("id"),
  ]);

  if (servicesRes.error)
    console.error("service_types query failed:", servicesRes.error.message);
  if (vehiclesRes.error)
    console.error("maintenance_vehicles query failed:", vehiclesRes.error.message);

  const toOptions = (rows: ListRow[] | null) =>
    (rows ?? []).map((r) => ({
      value: r.name_en, // stored in the DB
      label: locale === "ar" ? r.name_ar ?? r.name_en : r.name_en,
    }));

  const serviceTypes = toOptions(servicesRes.data as ListRow[] | null);
  const carModels = toOptions(vehiclesRes.data as ListRow[] | null);

  return (
    <section className="max-w-7xl mx-auto px-6 py-16 ">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
        {/* sticky left text */}
        <div className="lg:sticky lg:top-24 self-start">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">{dict.bookingTitle}</h2>
          <p className="mt-4 text-gray-500">{dict.bookingSubtitle}</p>
        </div>

        {/* form */}
        <ServiceBookingForm
          locale={locale}
          dict={dict}
          carModels={carModels}
          serviceTypes={serviceTypes}
        />
      </div>
    </section>
  );
}