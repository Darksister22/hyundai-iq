import type { Locale } from "@/lib/i18n";
import { locText, type BranchContactRow } from "@/lib/info";
import { Car, Wrench, Cog, type LucideIcon } from "lucide-react";

// label + icon per department; number may be null (row hidden)
const DEPT: {
  key: "sales_phone" | "service_phone" | "parts_phone";
  en: string;
  ar: string;
  Icon: LucideIcon;
}[] = [
  { key: "sales_phone", en: "Sales", ar: "مبيعات", Icon: Car },
  { key: "service_phone", en: "Service", ar: "صيانة", Icon: Wrench },
  { key: "parts_phone", en: "Spare Parts", ar: "قطع غيار", Icon: Cog },
];

function Row({ label, num, Icon }: { label: string; num: string; Icon: LucideIcon }) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-gray-100 last:border-0">
      <span className="flex items-center gap-2 text-sm text-gray-500">
        <Icon size={16} strokeWidth={1.8} className="text-[#002C5F]" />
        {label}
      </span>
      <a href={`tel:${num.replace(/[^\d+]/g, "")}`} dir="ltr" className="text-sm font-semibold text-[#111] tabular-nums hover:text-[#002C5F] transition-colors">
        {num}
      </a>
    </div>
  );
}

export default function BranchContactCard({
  locale,
  branch,
}: {
  locale: Locale;
  branch: BranchContactRow;
}) {
  const isAr = locale === "ar";

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
      <h3 className="font-bold text-[#002C5F] mb-2">
        {locText(locale, branch.city_ar, branch.city_en)}
      </h3>
      {DEPT.map(({ key, en, ar, Icon }) => {
        const num = branch[key];
        if (!num) return null; // empty in the dashboard → hidden on the site
        return <Row key={key} label={isAr ? ar : en} num={num} Icon={Icon} />;
      })}
    </div>
  );
}
