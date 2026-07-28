import type { Locale } from "@/lib/i18n";
import { localized, type LocationRow } from "@/lib/locations";
import { MapPin, Compass, ArrowUpRight } from "lucide-react";

export default function LocationCard({
  loc,
  locale,
  viewOnMapLabel,
}: {
  loc: LocationRow;
  locale: Locale;
  viewOnMapLabel: string;
}) {
  const province = localized(loc, "province", locale) || loc.province || "";
  const city = localized(loc, "city", locale);
  const landmark = localized(loc, "landmark", locale);
  const description = localized(loc, "desc", locale);

  return (
    <div className="group flex h-full min-w-0 flex-col rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:border-[#00AAD2]/40 hover:shadow-md">
      {/* header: pin badge + province chip + city */}
      <div className="flex items-start gap-3">
        <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-[#00AAD2]/10 text-[#002C5F] transition-colors group-hover:bg-[#00AAD2]/20">
          <MapPin size={20} strokeWidth={1.8} aria-hidden />
        </span>
        <div className="min-w-0">
          {province && (
            <span className="inline-block rounded-full bg-gray-100 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-[#00AAD2] break-words">
              {province}
            </span>
          )}
          <h3 className="mt-1.5 text-lg font-bold capitalize leading-snug text-[#002C5F] break-words">
            {city}
          </h3>
        </div>
      </div>

      {(landmark || description) && (
        <div className="mt-5 border-t border-gray-100 pt-5">
          {landmark && (
            <div className="flex gap-2.5">
              <Compass
                size={16}
                strokeWidth={1.8}
                className="mt-[3px] shrink-0 text-[#00AAD2]"
                aria-hidden
              />
              <p className="min-w-0 text-sm font-medium capitalize leading-relaxed text-gray-700 break-words">
                {landmark}
              </p>
            </div>
          )}
          {description && (
            <p
              className={
                "text-sm leading-relaxed text-gray-500 break-words whitespace-pre-line" +
                (landmark ? " mt-3.5" : "")
              }
            >
              {description}
            </p>
          )}
        </div>
      )}

      {loc.map_url && (
        <a
          href={loc.map_url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-auto flex items-center gap-1.5 self-start pt-5 text-sm font-semibold text-[#002C5F] transition-colors hover:text-[#00AAD2]"
        >
          {viewOnMapLabel}
          <ArrowUpRight size={16} strokeWidth={2} aria-hidden />
        </a>
      )}
    </div>
  );
}
