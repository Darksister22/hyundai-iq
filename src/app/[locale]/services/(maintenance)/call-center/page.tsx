// app/[locale]/services/(aftersales)/call-center/page.tsx
// Body only — the banner + pill strip live in the (aftersales) layout.
// Phone + working hours come from the single-row call_center_info table
// (editable from the dashboard); dict strings are the fallback when the
// row is missing or a field is empty.

import { supabase } from "@/lib/supabase";
import CallCenterPhoto from "@/components/call-center-photo";
import { getDictionary, Locale } from "@/lib/i18n"; // ← adjust to your loader

interface CallCenterRow {
  phone: string | null;
  sat_wed_hours_ar: string | null;
  sat_wed_hours_en: string | null;
  sat_wed_hours_ku: string | null;
  thu_hours_ar: string | null;
  thu_hours_en: string | null;
  thu_hours_ku: string | null;
  fri_note_ar: string | null;
  fri_note_en: string | null;
  fri_note_ku: string | null;
}

// localized value with English fallback, same convention as the rest of the site
// localized value with English fallback
function loc(locale: Locale, ar: string | null, en: string | null): string | null {
  return locale === "ar" ? ar ?? en : en;
}

export default async function CallCenterPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const dict = (await getDictionary(locale)).serviceBooking;

  const { data: row } = await supabase
    .from("call_center_info")
    .select("*")
    .eq("id", 1)
    .maybeSingle<CallCenterRow>();

// DB value → dict fallback, so the page never renders empty
// multiple numbers may be stored comma-separated → render stacked
const phones = [
  ...new Set(
    (row?.phone ?? "+964 XXX XXX XXXX")
      .split(/[,،]/)
      .map((p) => p.trim())
      .filter(Boolean)
  ),
];
const telHref = (p: string) => `tel:${p.replace(/[^\d+]/g, "")}`;
      const satWedHours =
      (row && loc(locale, row.sat_wed_hours_ar, row.sat_wed_hours_en)) ?? dict.satWedHours;
    const thuHours =
      (row && loc(locale, row.thu_hours_ar, row.thu_hours_en)) ?? dict.thuHours;
    const friNote =
      (row && loc(locale, row.fri_note_ar, row.fri_note_en)) ?? dict.closed;
  return (
    <section className="max-w-7xl mx-auto px-6 py-16">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
        {/* photo — client component with placeholder fallback */}
        <CallCenterPhoto
          src="/images/services/call-center-photo.webp"
          alt={dict.callCenterHeading}
        />

        {/* info */}
        <div className="flex flex-col">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            {dict.callCenterHeading}
          </h2>

          <div className="mt-12 border-t border-gray-200 pt-8 flex flex-col gap-8">
            {/* Telephone */}
            <div className="flex items-start gap-3">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="mt-0.5 text-gray-400">
                <path
                  d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.08 4.18 2 2 0 0 1 4.06 2h3a2 2 0 0 1 2 1.72c.127.96.362 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"
                  stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
                />
              </svg>
              <div>
              <p className="text-sm text-gray-500">{dict.telephoneNo}</p>
              <div className="mt-1 flex flex-col gap-1">
                {phones.map((p, i) => (
                  <a key={i} href={telHref(p)} className="block font-bold text-gray-900" dir="ltr">
                    {p}
                  </a>
                ))}
              </div>
            </div></div>

            {/* Working hours */}
            <div className="flex items-start gap-3">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="mt-0.5 text-gray-400">
                <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
                <path d="M12 7v5l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <div>
                <p className="text-sm text-gray-500">{dict.workingHours}</p>
                <div className="mt-2 flex flex-col gap-4 text-gray-900">
                  <div>
                    <p className="font-bold">{dict.satWed}:</p>
                    <p>{satWedHours}</p>
                  </div>
                  <div>
                    <p className="font-bold">{dict.thu}:</p>
                    <p>{thuHours}</p>
                  </div>
                  <div>
                    <p className="font-bold">{dict.friday}:</p>
                    <p>{friNote}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}