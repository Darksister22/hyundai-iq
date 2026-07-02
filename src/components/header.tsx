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
  const [menuOpen, setMenuOpen] = useState(false); //state for mobile menu
  const [menuVisible, setMenuVisible] = useState(false); // controls slide animation
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
  // ── effect 1: header scroll state (runs once) — unchanged ──
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

  // ── effect 2: lock body scroll while the mobile menu is open ──
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  return (
    <>
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
            <Link href={`/${locale}`} className={`text-xl font-bold transition-colors ${logoColor}`}>
              HYUNDAI
            </Link>


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
          <button
            className="md:hidden text-2xl text-current"
            aria-label="menu"
            onClick={() => { setMenuVisible(true);  requestAnimationFrame(() => setMenuOpen(true)); }}        >
            ☰
          </button>

        </div>
      </header>
      {/* ── Mobile overlay menu (slide + fade) ── */}
{menuVisible && (
  <div className="md:hidden fixed inset-0 z-[60]">
    {/* backdrop fades with menuOpen */}
    <div
      className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
        menuOpen ? "opacity-100" : "opacity-0"
      }`}
      onClick={() => setMenuOpen(false) }
    />

    {/* panel slides from the end (start edge in RTL); translate-x-full when closed */}
<nav
  onTransitionEnd={() => { if (!menuOpen) setMenuVisible(false); }}
  className={`absolute inset-y-0 end-0 w-72 max-w-[80vw] bg-white shadow-2xl p-6
    flex flex-col gap-6 text-gray-800 transition-transform duration-300 ease-out
    ${menuOpen
      ? "translate-x-0"
      : "translate-x-full rtl:-translate-x-full"}`}  // closed: off the correct edge per dir
>
      <button className="self-end text-2xl leading-none text-gray-500" aria-label="close" onClick={() => setMenuOpen(false)}>×</button>

      <Link href={`/${locale}/models/accent`} onClick={() => setMenuOpen(false)}>{dict.findACar}</Link>
      <Link href={`/${locale}/about-hyundai`} onClick={() => setMenuOpen(false)}>{dict.aboutUs}</Link>
      <Link href={`/${locale}/find-us`} onClick={() => setMenuOpen(false)}>{dict.findUs}</Link>
      <Link href={`/${locale}/contact-us`} onClick={() => setMenuOpen(false)}>{dict.contactUs}</Link>

      <Link href={switchedPath} onClick={() => setMenuOpen(false)} className="text-sm text-gray-500 border border-gray-300 px-3 py-1 rounded w-fit">{dict.langSwitch}</Link>
      <Link href={`/${locale}/contact-us`} onClick={() => setMenuOpen(false)} className="text-sm font-semibold bg-[#002C5F] text-white px-5 py-2 rounded text-center">{dict.requestCallback}</Link>
    </nav>
  </div>
)}
    </>
  );
}