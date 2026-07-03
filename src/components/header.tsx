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
  const [atTop, setAtTop] = useState(true);   // true only at the very top
  const [hidden, setHidden] = useState(false);   // is the header slid away?
  const lastScroll = useRef(0);                   // previous scroll position
  const navLink = atTop
    ? "text-white/90 hover:text-white"
    : "text-gray-800 hover:text-[#00AAD2]";
  const logoColor = atTop ? "text-white" : "text-[#002C5F]";
  const langBtn = atTop
    ? "text-white border-white/60 hover:bg-white/10"
    : "text-gray-500 border-gray-300";
  const ctaBtn = atTop
    ? "bg-white text-[#002C5F] hover:bg-white/90"          // light button on dark blur
    : "bg-[#002C5F] text-white hover:bg-[#003d7a]";        // dark button on light bg
  useEffect(() => {
    const onScroll = () => {
      const current = window.scrollY;
      setAtTop(current < 20);                  // frosted/transparent iff at top

      if (current < 80) setHidden(false);
      else if (current > lastScroll.current) setHidden(true);   // scroll down → hide
      else if (current < lastScroll.current) setHidden(false);  // scroll up → show
      lastScroll.current = current;
    };
    onScroll();                                // set initial state
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${atTop
          ? "bg-gray/30 backdrop-blur-xl"                                   // transparent + blur at top
          : "bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-200" // solid once scrolled
        } ${hidden ? "-translate-y-full" : "translate-y-0"}`}
    >
      <div className="max-w-7xl mx-auto px-6 h-[72px] flex items-center justify-between">
        <Link href={`/${locale}`} className="text-xl font-bold text-[#002C5F]">
          HYUNDAI
        </Link>
        <nav className="hidden md:flex items-center gap-8">
          {/* logo */}



          {/* nav links */}
          <Link href={`/${locale}/models/accent`} className={`text-sm font-medium transition-colors ${navLink}`}>
            {dict.findACar}
          </Link>
          <Link href={`/${locale}/about-hyundai`} className={`text-sm font-medium transition-colors ${navLink}`}>
            {dict.aboutUs}
          </Link>
          <Link href={`/${locale}/find-us`} className={`text-sm font-medium transition-colors ${navLink}`}>
            {dict.findUs}
          </Link>
          <Link href={`/${locale}/contact-us`} className={`text-sm font-medium transition-colors ${navLink}`}>
            {dict.contactUs}
          </Link>

          {/* language switch */}
          <Link href={switchedPath} className={`text-sm border px-3 py-1 rounded transition-colors ${langBtn}`}>
            {dict.langSwitch}
          </Link>

          {/* request-callback CTA */}
          <Link href={`/${locale}/contact-us`} className={`text-sm font-semibold px-5 py-2 rounded transition-colors ${ctaBtn}`}>
            {dict.requestCallback}
          </Link>
        </nav>
      </div>
    </header>
  );
}