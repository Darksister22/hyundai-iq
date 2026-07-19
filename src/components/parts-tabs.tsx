"use client";

import { useState } from "react";
import type { PartTab } from "@/lib/parts-data";
import ParallaxImage from "@/components/parallax-image";
import GenuinePartsScroll from "@/components/genuine-parts-scroll";

export default function PartsTabs({
  tabs,
  initialTab,
    guaranteePrefix,
}: {
  tabs: PartTab[];
  initialTab: string;
    guaranteePrefix: string;
}) {
  // start on the tab named in ?active_tab=, falling back to the first
  const [active, setActive] = useState(
    () => tabs.find((t) => t.id === initialTab)?.id ?? tabs[0].id
  );

  const tab = tabs.find((t) => t.id === active) ?? tabs[0];

  // Switch tabs instantly and keep the URL shareable. replaceState avoids a
  // server round-trip and doesn't add a history entry per tab press.
  const select = (id: string) => {
    setActive(id);
    const url = new URL(window.location.href);
    url.searchParams.set("active_tab", id);
    window.history.replaceState(null, "", url);
  };

  return (
    <>
      {/* pill strip — floats over the banner's lower edge, same as services */}
      <div className="flex justify-center -mt-7 relative z-10 px-4">
        <div className="inline-flex bg-white shadow-md rounded-full p-1 text-sm max-w-full overflow-x-auto scrollbar-hide">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => select(t.id)}
              className={`px-5 py-2 rounded-full whitespace-nowrap transition-colors ${
                active === t.id
                  ? "bg-[#002C5F] text-white"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* panel — keyed so React remounts and the fade replays on every switch */}
      <section key={tab.id} className="max-w-4xl mx-auto px-6 py-16 animate-[fadeIn_300ms_ease-out]">
        <p className="text-sm text-gray-400 mb-3">{tab.label}</p>
        <h2 className="text-2xl md:text-4xl font-bold text-[#111] leading-snug">
          {tab.heading}
        </h2>

        {tab.intro && (
          <p className="mt-6 text-gray-600 leading-relaxed">{tab.intro}</p>
        )}

        {tab.sections.length > 0 && (
          <div className="mt-10 flex flex-col gap-8">
            {tab.sections.map((s, i) => (
              <div key={i}>
                <p className="font-bold text-[#002C5F] mb-2">{s.label}</p>
                <p className="text-gray-600 leading-relaxed">{s.text}</p>
              </div>
            ))}
          </div>
        )}



 {tab.images.length > 0 && (
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {tab.images.map((src, i) => (
              // src intentionally empty — ParallaxImage shows a labelled
              // gradient until the real assets are added
              <ParallaxImage
                key={i}
                src={src}
                label={tab.label}
                className="aspect-[4/3] rounded-xl"
              />
            ))}
          </div>
        )}
      </section>

      {/* scroll-driven guarantees — genuine-parts tab only */}
            {tab.id === "genuine-parts" && tab.guarantees.length > 0 && (
        <GenuinePartsScroll
          prefix={guaranteePrefix}
          guarantees={tab.guarantees}
          images={tab.guaranteeImages}
        />
      )}
    </>
  );
}
