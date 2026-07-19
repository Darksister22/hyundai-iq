"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import FindCarPanel from "@/components/find-car-panel";
import { useEffect, useRef, useState } from "react";
import { Locale } from "@/lib/i18n";
import type { FindCarCategory, FindCarCar } from "@/lib/find-car-data";
import Image from "next/image";
import { CalendarCheck, Wrench, Cog, BadgeCheck } from "lucide-react";
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
    customerPromise: string;
    serviceBookingDesc: string;
    afterSalesDesc: string;
    partsAccessoriesDesc: string;
    customerPromiseDesc: string
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
  // OR while the services dropdown is open
  const solid = !atTop || hovered || svcOpen;

  // the service destinations — single source for desktop + mobile
  const serviceLinks = [
    {
      href: `/${locale}/services/service-booking`,
      label: dict.serviceBooking,
      desc: dict.serviceBookingDesc,
      Icon: CalendarCheck,
    },
    {
      href: `/${locale}/services/after-sales`,
      label: dict.afterSales,
      desc: dict.afterSalesDesc,
      Icon: Wrench,
    },
    {
      href: `/${locale}/services/parts-accessories`,
      label: dict.partsAccessories,
      desc: dict.partsAccessoriesDesc,
      Icon: Cog,
    },
    {
      href: `/${locale}/services/customer-promise`,
      label: dict.customerPromise,
      desc: dict.customerPromiseDesc,
      Icon: BadgeCheck,
    },
  ];

  const navLink = solid
    ? "text-gray-700 hover:text-[#002C5F]"
    : "text-white/85 hover:text-white";
  const langBtn = solid
    ? "text-gray-600 hover:bg-gray-100"
    : "text-white/90 hover:bg-white/15";
  const divider = solid ? "bg-gray-200" : "bg-white/25";

  //header scroll state
  useEffect(() => {
    const onScroll = () => {
      const current = window.scrollY;
      setAtTop(current < 20);
      setSvcOpen(false);
      if (current < 80 && !subnavStuck.current) setHidden(false);
      else if (current > lastScroll.current) setHidden(true);
      else if (current < lastScroll.current && !subnavStuck.current) setHidden(false);
      lastScroll.current = current;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // while a model page's sub nav is stuck to the top, the header stays hidden
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
          ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-200"
          : "bg-black/10 backdrop-blur-xl border-b border-white/10"
          } ${hidden ? "-translate-y-full" : "translate-y-0"}`}
      >
        {/* wider container than the old max-w-7xl — the extra ~180px is what
            gives the nav room to breathe. Height stays 72px (load-bearing). */}
        <div className="max-w-[1400px] mx-auto px-6 lg:px-8 h-[72px] flex items-center justify-between gap-4">

          {/* ---------- zone 1: logo ---------- */}
          <Link href={`/${locale}`} className="flex items-center shrink-0">
            <span className="relative inline-block h-6">
              <Image
                src="/svglogo/HyundaiLogoWhite.svg"
                alt="Hyundai"
                width={180}
                height={30}
                priority
                className="h-6 w-auto"
              />
              <Image
                src="/svglogo/HyundaiLogoBlue.svg"
                alt="Hyundai"
                width={180}
                height={30}
                aria-hidden
                className={`h-6 w-auto absolute inset-0 transition-opacity duration-300 ${solid ? "opacity-100" : "opacity-0"}`}
              />
            </span>
          </Link>

          {/* ---------- zone 2: primary nav (lg and up) ---------- */}
          <nav className="hidden lg:flex items-center gap-1">
            <button
              onClick={() => setFindOpen((o) => !o)}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${navLink}`}
            >
              {dict.findACar}
            </button>

            {/* Connect to a Service dropdown */}
            <div ref={svcRef} className="relative">
              <button
                onClick={() => setSvcOpen((o) => !o)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium transition-colors ${navLink}`}
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
                className={`absolute top-full mt-3 start-0 w-[38rem] max-w-[calc(100vw-3rem)] origin-top
                  bg-white rounded-2xl shadow-[0_16px_50px_rgba(0,0,0,0.14)] border border-gray-100
                  p-3 transition-all duration-300 ease-out
                  ${svcOpen
                    ? "opacity-100 translate-y-0 scale-y-100 visible"
                    : "opacity-0 -translate-y-3 scale-y-95 invisible pointer-events-none"
                  }`}
              >
                <div className="grid grid-cols-2 gap-1">
                  {serviceLinks.map(({ href, label, desc, Icon }) => (
                    <Link
                      key={href}
                      href={href}
                      onClick={() => setSvcOpen(false)}
                      className="group flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors"
                    >
                      {/* icon tile — tints navy on hover */}
                      <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-[#002C5F] transition-colors group-hover:bg-[#002C5F] group-hover:text-white">
                        <Icon size={18} strokeWidth={1.8} />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-sm font-semibold text-gray-900 group-hover:text-[#002C5F] transition-colors">
                          {label}
                        </span>
                        <span className="block text-xs text-gray-500 leading-snug mt-0.5">
                          {desc}
                        </span>
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            <Link href={`/${locale}/about-hyundai`} className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${navLink}`}>
              {dict.aboutUs}
            </Link>
            <Link href={`/${locale}/find-us`} className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${navLink}`}>
              {dict.findUs}
            </Link>
            <Link href={`/${locale}/contact-us`} className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${navLink}`}>
              {dict.contactUs}
            </Link>
          </nav>

          {/* ---------- zone 3: actions, separated by a rule ---------- */}
          <div className="hidden lg:flex items-center gap-3 shrink-0">
            {/* divider marks where navigation ends and actions begin */}
            <span className={`h-5 w-px transition-colors ${divider}`} aria-hidden />

            {/* language toggle — borderless chip instead of the old outlined box */}
            <Link
              href={switchedPath}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${langBtn}`}
            >
              {dict.langSwitch}
            </Link>
          </div>

          {/* hamburger — now shown below lg, not below md */}
          <button
            className={`lg:hidden p-2 -me-2 rounded-md transition-colors ${solid ? "text-gray-800" : "text-white"}`}
            aria-label="menu"
            onClick={() => { setMenuVisible(true); requestAnimationFrame(() => setMenuOpen(true)); }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </header>

      {/* Mobile overlay menu */}
      {menuVisible && (
        <div className="lg:hidden fixed inset-0 z-[60]">
          {/* backdrop fades with menuOpen */}
          <div
            className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${menuOpen ? "opacity-100" : "opacity-0"}`}
            onClick={() => setMenuOpen(false)}
          />

          {/* panel slides from the end (start edge in RTL); translate-x-full when closed */}
          <nav
            onTransitionEnd={() => { if (!menuOpen) setMenuVisible(false); }}
            className={`absolute inset-y-0 end-0 w-[20rem] max-w-[85%] bg-white shadow-2xl
              flex flex-col text-gray-800 transition-transform duration-300 ease-out
              ${menuOpen ? "translate-x-0" : "translate-x-full rtl:-translate-x-full"}`}
          >
            {/* panel header — mirrors the 72px bar so the close sits where the burger was */}
            <div className="h-[72px] px-6 flex items-center justify-between border-b border-gray-100 shrink-0">
              <Image
                src="/svglogo/HyundaiLogoBlue.svg"
                alt="Hyundai"
                width={180}
                height={30}
                className="h-5 w-auto"
              />
              <button
                className="p-2 -me-2 text-gray-400 hover:text-gray-700 transition-colors"
                aria-label="close"
                onClick={() => setMenuOpen(false)}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            {/* scrollable link list */}
            <div className="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-1">
              <button
                onClick={() => { setMenuOpen(false); setFindOpen(true); }}
                className="text-start py-3 text-base font-medium"
              >
                {dict.findACar}
              </button>

              {/* Connect to a Service — accordion */}
              <div>
                <button
                  onClick={() => setSvcMobileOpen((o) => !o)}
                  className="w-full flex items-center justify-between text-start py-3 text-base font-medium"
                >
                  {dict.connectService}
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    className={`text-gray-400 transition-transform ${svcMobileOpen ? "rotate-180" : ""}`}
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
                  <div className="mb-2 ps-4 flex flex-col border-s-2 border-gray-100">
                    {serviceLinks.map(({ href, label, desc, Icon }) => (
                      <Link
                        key={href}
                        href={href}
                        onClick={() => setMenuOpen(false)}
                        className="flex items-start gap-3 py-2.5"
                      >
                        <Icon size={16} strokeWidth={1.8} className="mt-0.5 shrink-0 text-[#002C5F]" />
                        <span className="min-w-0">
                          <span className="block text-sm text-gray-800">{label}</span>
                          <span className="block text-xs text-gray-400 leading-snug">{desc}</span>
                        </span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <Link href={`/${locale}/about-hyundai`} onClick={() => setMenuOpen(false)} className="py-3 text-base font-medium">
                {dict.aboutUs}
              </Link>
              <Link href={`/${locale}/find-us`} onClick={() => setMenuOpen(false)} className="py-3 text-base font-medium">
                {dict.findUs}
              </Link>
              <Link href={`/${locale}/contact-us`} onClick={() => setMenuOpen(false)} className="py-3 text-base font-medium">
                {dict.contactUs}
              </Link>
            </div>

            {/* pinned footer actions */}
            <div className="px-6 py-6 border-t border-gray-100 flex flex-col gap-3 shrink-0">
              <Link
                href={switchedPath}
                onClick={() => setMenuOpen(false)}
                className="text-sm text-gray-600 border border-gray-300 px-4 py-2 rounded-full w-fit hover:bg-gray-50 transition-colors"
              >
                {dict.langSwitch}
              </Link>
            </div>
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