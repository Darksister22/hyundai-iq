import type { Locale } from "@/lib/i18n";
import { Car, Wrench, Cog, type LucideIcon } from "lucide-react";

// One branch's three department numbers.
export interface Branch {
  cityEn: string;
  cityAr: string;
  sales: string;
  service: string;
  parts: string;
}

// label + icon per department
const DEPT = {
  sales: { en: "Sales", ar: "مبيعات", Icon: Car },
  service: { en: "Service", ar: "صيانة", Icon: Wrench },
  parts: { en: "Spare Parts", ar: "قطع غيار", Icon: Cog },
} satisfies Record<string, { en: string; ar: string; Icon: LucideIcon }>;

function Row({ label, num, Icon }: { label: string; num: string; Icon: LucideIcon }) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-gray-100 last:border-0">
      <span className="flex items-center gap-2 text-sm text-gray-500">
        <Icon size={16} strokeWidth={1.8} className="text-[#002C5F]" />
        {label}
      </span>
      <a href={`tel:${num}`} dir="ltr" className="text-sm font-semibold text-[#111] tabular-nums hover:text-[#002C5F] transition-colors">
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
  branch: Branch;
}) {
  const isAr = locale === "ar";
  const keys = ["sales", "service", "parts"] as const;

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
      <h3 className="font-bold text-[#002C5F] mb-2">
        {isAr ? branch.cityAr : branch.cityEn}
      </h3>
      {keys.map((key) => (
        <Row
          key={key}
          label={isAr ? DEPT[key].ar : DEPT[key].en}
          num={branch[key]}
          Icon={DEPT[key].Icon}
        />
      ))}
    </div>
  );
}