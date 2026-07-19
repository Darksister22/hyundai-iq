"use client";
// components/service-nav.tsx
// Client pieces of the shared aftersales layout. Both derive the active
// route from the pathname since the layout persists across navigation.
//   <ServiceBreadcrumb> — breadcrumb row inside the banner
//   <ServiceTabs>      — pill bar, same style as the home page / find-car
//                        category tabs (gray-100 track, white shadow pill
//                        on the active tab — no sliding indicator)

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Locale } from "@/lib/i18n";

interface NavDict {
  breadcrumbHome: string;
  breadcrumbService: string;
  pillBooking: string;
  pillCallCenter: string;
}

function useActiveIndex() {
  const pathname = usePathname();
  return pathname.includes("/services/call-center") ? 1 : 0;
}

export function ServiceBreadcrumb({ locale, dict }: { locale: Locale; dict: NavDict }) {
  const active = useActiveIndex();
  const current = active === 1 ? dict.pillCallCenter : dict.pillBooking;

  return (
    <div className="max-w-7xl mx-auto px-6 flex items-center gap-2 text-sm text-white/70">
      <Link href={`/${locale}`} className="hover:text-white transition-colors">
        {dict.breadcrumbHome}
      </Link>
      <span aria-hidden>›</span>
      <span>{dict.breadcrumbService}</span>
      <span aria-hidden>›</span>
      <span className="text-white">{current}</span>
    </div>
  );
}

export function ServiceTabs({ locale, dict }: { locale: Locale; dict: NavDict }) {
  const active = useActiveIndex();

  // Local index so the highlight flips the moment the user presses,
  // instead of waiting for the server round-trip to change the pathname.
  const [pending, setPending] = useState<number | null>(null);
  const [lastActive, setLastActive] = useState(active);
  // Sync back to the real route: covers back/forward buttons, direct URL
  // entry, and snaps the highlight back if a navigation never completes.
  if (active !== lastActive) {
    setLastActive(active);
    setPending(null);   // real route caught up; drop the optimistic value
  }
  const index = pending ?? active;

  const tabs = [
    { href: `/${locale}/services/service-booking`, label: dict.pillBooking },
    { href: `/${locale}/services/call-center`, label: dict.pillCallCenter },
  ];

  return (
    <div className="inline-flex bg-white shadow-md rounded-full p-1 text-sm">
      {tabs.map((t, i) => (
        <Link
          key={t.href}
          href={t.href}
          onClick={() => setPending(i)}
          className={`px-6 py-2 rounded-full whitespace-nowrap transition-colors ${index === i ? "bg-[#002C5F] text-white" : "text-gray-600 hover:text-gray-900"
            }`}
        >
          {t.label}
        </Link>
      ))}
    </div>
  );
}