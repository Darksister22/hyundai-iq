"use client";

import { useState } from "react";
import Link from "next/link";

interface ServiceLink { href: string; label: string; }

export default function FooterServices({ heading, links }: { heading: string; links: ServiceLink[] }) {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <button onClick={() => setOpen((o) => !o)} aria-expanded={open} className="w-full flex items-center justify-between gap-2 text-sm font-semibold mb-4 text-start">
        {heading}
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className={`shrink-0 transition-transform duration-300 ${open ? "rotate-180" : ""}`}>
          <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <div className={`grid transition-all duration-300 ease-out ${open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
        <ul className="overflow-hidden space-y-2">
          {links.map((s) => (
            <li key={s.href}>
              <Link href={s.href} className="text-sm text-white/50 hover:text-white transition-colors">{s.label}</Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}