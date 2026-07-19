"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import type { BranchGroup } from "@/lib/after-sales-data";

interface Labels {
  saturday: string;
  sunThu: string;
  friday: string;
  closed: string;
}

export default function AfterSalesAccordion({
  groups,
  labels,
}: {
  groups: BranchGroup[];
  labels: Labels;
}) {
  // null = all collapsed; only one group open at a time
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="bg-gray-50">
      {groups.map((group, gi) => {
        const isOpen = open === gi;
        return (
          <div key={gi} className="border-b border-gray-200 last:border-0">
            <button
              onClick={() => setOpen(isOpen ? null : gi)}
              aria-expanded={isOpen}
              className="w-full flex items-center justify-between gap-4 px-6 py-5 text-start"
            >
              <span className="font-bold text-[#111]">{group.title}</span>
              {/* single icon rotated 45° becomes a × when open */}
              <Plus
                size={20}
                strokeWidth={1.5}
                className={`shrink-0 text-gray-500 transition-transform duration-300 ${
                  isOpen ? "rotate-45" : ""
                }`}
              />
            </button>

            {/* grid-rows trick animates to auto height without measuring */}
            <div
              className={`grid transition-all duration-300 ease-out ${
                isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="overflow-hidden">
                <div className="px-6 pb-6 flex flex-col gap-4">
                  {group.branches.map((b, bi) => (
                    <div key={bi} className="rounded-xl bg-white border border-gray-200 p-5">
                      <p className="font-bold text-[#111] mb-3">{b.name}</p>
                      <Row label={labels.saturday} value={b.saturday} closed={labels.closed} />
                      <Row label={labels.sunThu} value={b.sunThu} closed={labels.closed} />
                      <Row label={labels.friday} value={b.friday} closed={labels.closed} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// One day row. "Closed" is dimmed so open hours read first.
// dir=ltr keeps time ranges like "8:30 - 12:30 / 4:30 - 8:30" in order under RTL.
function Row({ label, value, closed }: { label: string; value: string; closed: string }) {
  const isClosed = value === closed;
  return (
    <div className="py-2.5 border-b border-gray-100 last:border-0 last:pb-0">
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <p
        dir={isClosed ? undefined : "ltr"}
        className={`text-sm text-start ${isClosed ? "text-gray-400" : "text-[#111] font-medium"}`}
      >
        {value}
      </p>
    </div>
  );
}