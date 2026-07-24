"use client";
import { useEffect, useRef, useState } from "react";
import Reveal from "@/components/reveal";
import ParallaxImage from "@/components/parallax-image";

interface Milestone { year: string; events: string[];image?:string; }
interface AboutTabsDict { philosophyTab: string; historyTab: string; historyIntro: string; }

// era buckets (right-hand nav)
const ERAS = [
  { label: "2021-2023", from: 2021, to: 2023 },
  { label: "2016-2020", from: 2016, to: 2020 },
  { label: "2011-2015", from: 2011, to: 2015 },
  { label: "2006-2010", from: 2006, to: 2010 },
  { label: "2001-2005", from: 2001, to: 2005 },
  { label: "1967-2000", from: 1967, to: 2000 },
];

export default function AboutTabs({
  dict, philosophy, milestones,
}: {
  dict: AboutTabsDict;
  philosophy: React.ReactNode;
  milestones: Milestone[];
}) {
  const [tab, setTab] = useState<"philosophy" | "history">("philosophy");
  const [activeEra, setActiveEra] = useState(ERAS[0].label);
  const yearRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    if (tab !== "history") return;

    const pick = () => {
      const mid = window.innerHeight / 2;
      let best: string | null = null;
      let bestDist = Infinity;

      Object.entries(yearRefs.current).forEach(([year, el]) => {
        if (!el) return;
        const r = el.getBoundingClientRect();
        const dist = Math.abs(r.top + r.height / 2 - mid);
        if (dist < bestDist) {
          bestDist = dist;
          best = year;
        }
      });

      if (best) setActiveEra(eraOf(best));
    };

    const raf = requestAnimationFrame(pick); // set correct era on mount
    window.addEventListener("scroll", pick, { passive: true });
    window.addEventListener("resize", pick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", pick);
      window.removeEventListener("resize", pick);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);
  // which era does a given year fall into
  const eraOf = (year: string) => {
    const y = Number(year);
    return ERAS.find((e) => y >= e.from && y <= e.to)?.label ?? ERAS[0].label;
  };

  // scroll-spy: highlight the era of whichever year is centered
  useEffect(() => {
    if (tab !== "history") return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActiveEra(eraOf(e.target.getAttribute("data-year")!));
        });
      },
      { rootMargin: "-45% 0px -45% 0px" }
    );
    Object.values(yearRefs.current).forEach((el) => el && obs.observe(el));
    return () => obs.disconnect();
  }, [tab]);

  // jump to the first year of an era when its link is clicked
  const goToEra = (label: string) => {
    const era = ERAS.find((e) => e.label === label)!;
    const target = milestones.find((m) => {
      const y = Number(m.year);
      return y >= era.from && y <= era.to;
    });
    if (target) yearRefs.current[target.year]?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
    <>
      {/* Pill tabs */}
      <div className="flex justify-center -mt-7 relative z-10">
        <div className="inline-flex bg-white shadow-md rounded-full p-1 text-sm">
          <button
            onClick={() => setTab("philosophy")}
            className={`px-6 py-2 rounded-full transition-colors ${tab === "philosophy" ? "bg-[#002C5F] text-white" : "text-gray-600"}`}
          >
            {dict.philosophyTab}
          </button>
          <button
            onClick={() => setTab("history")}
            className={`px-6 py-2 rounded-full transition-colors ${tab === "history" ? "bg-[#002C5F] text-white" : "text-gray-600"}`}
          >
            {dict.historyTab}
          </button>
        </div>
      </div>

      {tab === "philosophy" && philosophy}

      {tab === "history" && (
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-6">
            <Reveal>
              <p className="text-gray-600 leading-relaxed mb-12 text-lg max-w-3xl">{dict.historyIntro}</p>
            </Reveal>

            {/* era nav | divider | milestones */}
            <div className="grid grid-cols-1 lg:grid-cols-[160px_1fr] gap-8 lg:gap-0">
              {/* era nav — sticky for the whole section */}
              <aside className="order-1">
                <div className="sticky top-28 flex lg:flex-col gap-4 lg:gap-3 overflow-x-auto lg:overflow-visible">
                  {ERAS.map((e) => (
                    <button
                      key={e.label}
                      onClick={() => goToEra(e.label)}
                      dir="ltr"
                      className={`whitespace-nowrap transition-all text-start ${activeEra === e.label
                          ? "text-[#002C5F] font-bold text-lg"
                          : "text-gray-400 hover:text-gray-600 text-sm"
                        }`}
                    >
                      {e.label}
                    </button>
                  ))}
                </div>
              </aside>

              {/* milestones — vertical rule runs the full height alongside them */}
              <div className="order-2 lg:border-s-2 lg:border-[#002C5F]/20 lg:ps-12">
                {milestones.map((m) => (
                  <div
                    key={m.year}
                    data-year={m.year}
                    ref={(el) => { yearRefs.current[m.year] = el; }}
                    // grid so the year column spans image + bullets, giving `sticky`
                    // a tall enough track to pin against for the whole year block
                    className="scroll-mt-28 pb-24 grid grid-cols-1 md:grid-cols-[7rem_1fr] lg:grid-cols-[10rem_1fr] gap-6 md:gap-12 lg:gap-16 items-start"
                  >
                    {/* pinned year — stays put until the next year pushes it out */}
                    <div className="md:sticky md:top-28 self-start">
                      <span dir="ltr" className="block text-5xl lg:text-6xl font-bold text-[#111]">
                        {m.year}
                      </span>
                    </div>

                    {/* image + events stacked in the content column */}
                    <div>
                      <ParallaxImage label={`image ${m.year}`} className="w-full h-64 md:h-[360px] rounded-lg mb-8" src={m.image ?? ""}/>

                      <ul className="space-y-4 text-gray-700 leading-relaxed">
                        {m.events.map((e, i) => (
                          <li key={i} className="flex gap-3">
                            <span className="text-[#00AAD2] mt-2 text-xs shrink-0">■</span>
                            <span>{e}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
}