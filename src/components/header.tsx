"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import FindCarPanel from "@/components/find-car-panel";
import { useEffect, useRef, useState } from "react";
import { Locale } from "@/lib/i18n";
import type { FindCarCategory, FindCarCar } from "@/lib/find-car-data";
import Image from "next/image";

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
    allCars: string;
    sedan: string;
    suv: string;
    mpv: string;
    electric: string;
    connectService: string;
    serviceBooking: string;
    afterSales: string;
    partsAccessories: string;
  };
  categories: FindCarCategory[];
  cars: FindCarCar[];
}

export default function Header({ locale, dict, categories, cars }: HeaderProps) {
  const pathname = usePathname();
  const switchedPath = pathname.replace(`/${locale}`, `/${dict.langCode}`);
  const [atTop, setAtTop] = useState(true);   // true only at the very top
  const [hidden, setHidden] = useState(false);   // is the header slid away?
  const [hovered, setHovered] = useState(false); // pointer over the header bar
  const lastScroll = useRef(0);                   // previous scroll position
  const [menuOpen, setMenuOpen] = useState(false); //state for mobile menu
  const [menuVisible, setMenuVisible] = useState(false); // controls slide animation
  const [findOpen, setFindOpen] = useState(false); // Find car panel
  const subnavStuck = useRef(false); // model page sub nav is pinned → stay hidden
  const [svcOpen, setSvcOpen] = useState(false);        // desktop services dropdown
  const svcRef = useRef<HTMLDivElement>(null);          // for outside-click close
  const [svcMobileOpen, setSvcMobileOpen] = useState(false); // mobile services accordion

  // the header renders its solid (white) look when scrolled OR hovered
  // OR while the services dropdown is open — so the white panel never
  // hangs off a transparent bar
  const solid = !atTop || hovered || svcOpen;

  // the three service destinations — single source for desktop + mobile
  const serviceLinks = [
    { href: `/${locale}/services/service-booking`, label: dict.serviceBooking },
    { href: `/${locale}/services/after-sales`, label: dict.afterSales },
    { href: `/${locale}/services/parts-accessories`, label: dict.partsAccessories },
  ];

  const navLink = solid
    ? "text-gray-800 hover:text-[#00AAD2]"
    : "text-white/90 hover:text-white";
  const langBtn = solid
    ? "text-gray-500 border-gray-300"
    : "text-white border-white/60 hover:bg-white/10";
  const ctaBtn = solid
    ? "bg-[#002C5F] text-white hover:bg-[#003d7a]"         // dark button on light bg
    : "bg-white text-[#002C5F] hover:bg-white/90";         // light button on dark blur
  //header scroll state
  useEffect(() => {
    const onScroll = () => {
      const current = window.scrollY;
      setAtTop(current < 20);                  // frosted/transparent iff at top
      setSvcOpen(false);                       // collapse services list (animated)
      if (current < 80 && !subnavStuck.current) setHidden(false);
      else if (current > lastScroll.current) setHidden(true);   // scroll down → hide
      else if (current < lastScroll.current && !subnavStuck.current) setHidden(false); // scroll up → show
      lastScroll.current = current;
    };
    onScroll();                                // set initial state
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // while a model page's sub nav is stuck to the top, the header stays
  // hidden even on scroll-up — the sub nav owns the top edge
  useEffect(() => {
    const onStuck = (e: Event) => {
      const stuck = (e as CustomEvent<boolean>).detail;
      subnavStuck.current = stuck;
      if (stuck) setHidden(true);
    };
    window.addEventListener("hyundai:subnav-stuck", onStuck);
    return () => window.removeEventListener("hyundai:subnav-stuck", onStuck);
  }, []);

  // close the desktop services dropdown on outside click
  useEffect(() => {
    if (!svcOpen) return;
    const onDown = (e: MouseEvent) => {
      if (svcRef.current && !svcRef.current.contains(e.target as Node)) {
        setSvcOpen(false);
      }
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [svcOpen]);

  //lock body scroll while the mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  return (
    <>
      <header
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${solid
          ? "bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-200" // solid: scrolled, hovered, or dropdown open
          : "bg-gray/30 backdrop-blur-xl"                                    // transparent + blur otherwise
          } ${hidden ? "-translate-y-full" : "translate-y-0"}`}
      >
        <div className="max-w-7xl mx-auto px-6 h-[72px] flex items-center justify-between">
          <Link href={`/${locale}`} className="flex items-center gap-3">
            <span className="relative inline-block h-6">
              <Image
                src='/svglogo/HyundaiLogoWhite.svg'
                alt="Hyundai"
                width={180}
                height={30}
                priority
                className="h-6 w-auto"
              />
              <Image
                src='/svglogo/HyundaiLogoBlue.svg'
                alt="Hyundai"
                width={180}
                height={30}
                aria-hidden
                className={`h-6 w-auto absolute inset-0 transition-opacity duration-300 ${solid ? "opacity-100" : "opacity-0"}`}
              />
            </span>
          </Link>


          <nav className="hidden md:flex items-center gap-8">
            {/* nav links */}
            <button
              onClick={() => setFindOpen((o) => !o)}
              className={`text-sm font-medium transition-colors ${navLink}`}
            >
              {dict.findACar}
            </button>

            {/* Connect to a Service dropdown */}
            <div ref={svcRef} className="relative">
              <button
                onClick={() => setSvcOpen((o) => !o)}
                className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${navLink}`}
              >
                {dict.connectService}
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  className={`transition-transform duration-300 ${svcOpen ? "rotate-180" : ""}`}
                >
                  <path
                    d="M6 9l6 6 6-6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>

              {/* fall-down panel: always mounted, animated via transform + opacity */}
              <div
                className={`absolute top-full mt-4 start-0 min-w-[260px] origin-top
                  bg-white shadow-[0_12px_40px_rgba(0,0,0,0.12)] border border-gray-100
                  py-3 transition-all duration-300 ease-out
                  ${svcOpen
                    ? "opacity-100 translate-y-0 scale-y-100 visible"
                    : "opacity-0 -translate-y-3 scale-y-95 invisible pointer-events-none"
                  }`}
              >
                {serviceLinks.map((s) => (
                  <Link
                    key={s.href}
                    href={s.href}
                    onClick={() => setSvcOpen(false)}
                    className="block px-6 py-3 text-[15px] text-gray-700 hover:text-[#002C5F] hover:bg-gray-50/80 transition-colors"
                  >
                    {s.label}
                  </Link>
                ))}
              </div>
            </div>

            <Link href={`/${locale}/about-hyundai`} className={`text-sm font-medium transition-colors ${navLink}`}>
              {dict.aboutUs}
            </Link>
            <Link href={`/${locale}/find-us`} className={`text-sm font-medium transition-colors ${navLink}`}>
              {dict.findUs}
            </Link>
            <Link href={`/${locale}/contact-us`} className={`text-sm font-medium transition-colors ${navLink}`}>
              {dict.contactUs}
            </Link>
            <Link href={switchedPath} className={`text-sm border px-3 py-1 rounded transition-colors ${langBtn}`}>
              {dict.langSwitch}
            </Link>
            <Link href={`/${locale}/contact-us`} className={`text-sm font-semibold px-5 py-2 rounded transition-colors ${ctaBtn}`}>
              {dict.requestCallback}
            </Link>
          </nav>
          <button
            className="md:hidden text-2xl text-current"
            aria-label="menu"
            onClick={() => { setMenuVisible(true); requestAnimationFrame(() => setMenuOpen(true)); }}        >
            ☰
          </button>

        </div>
      </header>
      {/* Mobile overlay menu */}
      {menuVisible && (
        <div className="md:hidden fixed inset-0 z-[60]">
          {/* backdrop fades with menuOpen */}
          <div
            className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${menuOpen ? "opacity-100" : "opacity-0"
              }`}
            onClick={() => setMenuOpen(false)}
          />

          {/* panel slides from the end (start edge in RTL); translate-x-full when closed */}
          <nav
            onTransitionEnd={() => { if (!menuOpen) setMenuVisible(false); }}
            className={`absolute inset-y-0 end-0 w-72 max-w-[80vw] bg-white shadow-2xl p-6
    flex flex-col gap-6 text-gray-800 transition-transform duration-300 ease-out
    ${menuOpen
                ? "translate-x-0"
                : "translate-x-full rtl:-translate-x-full"}`}
          >
            <button className="self-end text-2xl leading-none text-gray-500" aria-label="close" onClick={() => setMenuOpen(false)}>×</button>

            <button
              onClick={() => { setMenuOpen(false); setFindOpen(true); }}
              className="text-start"
            >
              {dict.findACar}
            </button>

            {/* Connect to a Service — accordion */}
            <div>
              <button
                onClick={() => setSvcMobileOpen((o) => !o)}
                className="w-full flex items-center justify-between text-start"
              >
                {dict.connectService}
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  className={`transition-transform ${svcMobileOpen ? "rotate-180" : ""}`}
                >
                  <path
                    d="M6 9l6 6 6-6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              {svcMobileOpen && (
                <div className="mt-3 ps-4 flex flex-col gap-3 border-s-2 border-gray-100">
                  {serviceLinks.map((s) => (
                    <Link
                      key={s.href}
                      href={s.href}
                      onClick={() => setMenuOpen(false)}
                      className="text-sm text-gray-600"
                    >
                      {s.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link href={`/${locale}/about-hyundai`} onClick={() => setMenuOpen(false)}>{dict.aboutUs}</Link>
            <Link href={`/${locale}/find-us`} onClick={() => setMenuOpen(false)}>{dict.findUs}</Link>
            <Link href={`/${locale}/contact-us`} onClick={() => setMenuOpen(false)}>{dict.contactUs}</Link>

            <Link href={switchedPath} onClick={() => setMenuOpen(false)} className="text-sm text-gray-500 border border-gray-300 px-3 py-1 rounded w-fit">{dict.langSwitch}</Link>
            <Link href={`/${locale}/contact-us`} onClick={() => setMenuOpen(false)} className="text-sm font-semibold bg-[#002C5F] text-white px-5 py-2 rounded text-center">{dict.requestCallback}</Link>
          </nav>
        </div>
      )}
      <FindCarPanel
        locale={locale}
        open={findOpen}
        onClose={() => setFindOpen(false)}
        allCarsLabel={dict.allCars}
        categories={categories}
        cars={cars}
        navHeight={72}
      />
    </>
  );
}