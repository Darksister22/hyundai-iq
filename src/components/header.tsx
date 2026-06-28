"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Locale } from "@/lib/i18n";

interface HeaderProps {
  locale: Locale;
  dict: {
    findACar: string;
    aboutUs: string;
    findUs: string;
    contactUs: string;
    requestCallback: string;
    langSwitch: string;
    langCode: string;
  };
}

export default function Header({ locale, dict }: HeaderProps) {
  const pathname = usePathname();
  const switchedPath = pathname.replace(`/${locale}`, `/${dict.langCode}`);

  const [hidden, setHidden] = useState(false);   // is the header slid away?
  const lastScroll = useRef(0);                   // previous scroll position

  useEffect(() => {
    const onScroll = () => {
      const current = window.scrollY;

      if (current < 80) {
        setHidden(false);                         // always show near the top
      } else if (current > lastScroll.current) {
        setHidden(true);                          // scrolling down → hide
      } else if (current < lastScroll.current) {
        setHidden(false);                         // scrolling up → show
      }

      lastScroll.current = current;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      // slide up out of view when hidden; transition makes it smooth
      className={`sticky top-0 z-50 bg-white border-b border-gray-200 transition-transform duration-300 ${
        hidden ? "-translate-y-full" : "translate-y-0"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-[72px] flex items-center justify-between">
        <Link href={`/${locale}`} className="text-xl font-bold text-[#002C5F]">
          HYUNDAI
        </Link>
        <nav className="hidden md:flex items-center gap-8">
          <Link
            href={`/${locale}/models/accent`}
            className="text-sm font-medium text-gray-800 hover:text-[#00AAD2] transition-colors"
          >
            {dict.findACar}
          </Link>
          <Link
            href={`/${locale}/about-hyundai`}
            className="text-sm font-medium text-gray-800 hover:text-[#00AAD2] transition-colors"
          >
            {dict.aboutUs}
          </Link>
          <Link
            href={`/${locale}/find-us`}
            className="text-sm font-medium text-gray-800 hover:text-[#00AAD2] transition-colors"
          >
            {dict.findUs}
          </Link>
          <Link
            href={`/${locale}/contact-us`}
            className="text-sm font-medium text-gray-800 hover:text-[#00AAD2] transition-colors"
          >
            {dict.contactUs}
          </Link>
          <Link
            href={switchedPath}
            className="text-sm text-gray-500 border border-gray-300 px-3 py-1 rounded"
          >
            {dict.langSwitch}
          </Link>
          <Link
            href={`/${locale}/contact-us`}
            className="text-sm font-semibold bg-[#002C5F] text-white px-5 py-2 rounded hover:bg-[#003d7a] transition-colors"
          >
            {dict.requestCallback}
          </Link>
        </nav>
      </div>
    </header>
  );
}