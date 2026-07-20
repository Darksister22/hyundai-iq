import { CheckCircle2, Tag, ClipboardCheck } from "lucide-react";
import type { Bilingual } from "@/lib/offers-data";
import type { Locale } from "@/lib/i18n";

export default function OfferDetails({
  locale,
  heading,
  details,
  ctaValue,
}: {
  locale: Locale;
  heading: string;
  details: Bilingual[];
  ctaValue: Bilingual;
}) {
  const isAr = locale === "ar";
  const tx = (b: Bilingual) => (isAr ? b.ar : b.en);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 items-stretch">
      {/* white half — the detail list */}
      <div className="py-10 md:pe-10">
        <h3 className="flex items-center gap-3 text-xl md:text-2xl font-bold text-[#111] mb-6">
          <Tag size={24} strokeWidth={1.8} className="shrink-0" />
          {heading}
        </h3>
        <ul className="space-y-4">
          {details.map((d, i) => (
            <li key={i} className="flex items-start gap-3 text-gray-700 leading-relaxed">
              <CheckCircle2 size={20} strokeWidth={1.8} className="mt-0.5 shrink-0 text-[#002C5F]" />
              <span>{tx(d)}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* navy half — the call to action */}
      <div className="bg-[#002C5F] text-white flex flex-col justify-center px-8 py-12 md:px-12">
        <ClipboardCheck size={36} strokeWidth={1.6} className="mb-5" />
        <p className="text-2xl md:text-4xl font-bold leading-tight">{tx(ctaValue)}</p>
      </div>
    </div>
  );
}