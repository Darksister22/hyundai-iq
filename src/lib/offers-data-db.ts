// lib/offers-data-db.ts
// DB-backed offers access layer. Reads sales_offers / sales_offer_cars /
// aftersales_offers from Supabase and adapts the trilingual rows into the
// bilingual Offer / OfferCar shapes the existing offer components expect
// (Approach A adapter — components stay untouched). Kurdish is dropped here
// at the page boundary, matching the rest of the bilingual public site.

import { supabase } from "@/lib/supabase";
import type { Bilingual, Offer, OfferCar } from "@/lib/offers-data";
import type { Locale } from "@/lib/i18n";

/* ---------- trilingual → bilingual helpers (EN fallback) ---------- */

type Tri = { ar: string | null; en: string | null; ku: string | null };

function bi(row: Tri): Bilingual {
  const en = row.en ?? "";
  return { en, ar: row.ar ?? en };
}

interface BulletJson {
  text_ar?: string | null;
  text_en?: string | null;
  text_ku?: string | null;
}

// bullets jsonb → Bilingual[]. Tolerant of the shapes the dashboard might
// store: an array of {text_ar,text_en,text_ku} objects, an array of plain
// strings, or (defensively) a stringified array. Anything else → [].
function bullets(json: unknown): Bilingual[] {
  let arr: unknown = json;
  if (typeof arr === "string") {
    try { arr = JSON.parse(arr); } catch { return []; }
  }
  if (!Array.isArray(arr)) return [];
  return arr
    .map((b): Bilingual | null => {
      if (typeof b === "string") {
        const t = b.trim();
        return t ? { en: t, ar: t } : null;
      }
      if (b && typeof b === "object") {
        const o = b as BulletJson;
        const v = bi({ ar: o.text_ar ?? null, en: o.text_en ?? null, ku: o.text_ku ?? null });
        return v.en || v.ar ? v : null;
      }
      return null;
    })
    .filter((v): v is Bilingual => v !== null);
}

/* ---------- row types (only the columns we select) ---------- */

interface SalesOfferRow {
  id: string;
  slug: string;
  banner: string | null;
  title_ar: string | null; title_en: string | null; title_ku: string | null;
  desc_ar: string | null;  desc_en: string | null;  desc_ku: string | null;
  bullets: unknown;
}

interface SalesOfferCarRow {
  id: string;
  image: string | null;
  title_ar: string | null; title_en: string | null; title_ku: string | null;
  desc_ar: string | null;  desc_en: string | null;  desc_ku: string | null;
  price_ar: string | null; price_en: string | null; price_ku: string | null;
  bullets: unknown;
  car_id: string | null;
  cars: { slug: string } | null; // joined
}

interface AftersalesOfferRow {
  id: string;
  slug: string;
  banner: string | null;
  title_ar: string | null;  title_en: string | null;  title_ku: string | null;
  desc_ar: string | null;   desc_en: string | null;   desc_ku: string | null;
  bullets: unknown;
  title2_ar: string | null; title2_en: string | null; title2_ku: string | null;
  desc2_ar: string | null;  desc2_en: string | null;  desc2_ku: string | null;
  phone: string | null;
}

/* An after-sales offer carries a reservation phone the sales shape has no
   field for; we tack it on as an optional extra without altering Offer. */
export type AftersalesOfferView = Offer & { phone: string | null };

/* ---------- SALES OFFERS ---------- */

const SALES_COLS =
  "id, slug, banner, title_ar, title_en, title_ku, desc_ar, desc_en, desc_ku, bullets, sort_order";

// list card shape (subtitle = the offer description)
export async function getSalesOffers(): Promise<Offer[]> {
  const { data, error } = await supabase
    .from("sales_offers")
    .select(SALES_COLS)
    .order("sort_order");
  if (error) { console.error("sales_offers list failed:", error.message); return []; }

  return (data as SalesOfferRow[]).map((o) => ({
    slug: o.slug,
    title: bi({ ar: o.title_ar, en: o.title_en, ku: o.title_ku }),
    subtitle: bi({ ar: o.desc_ar, en: o.desc_en, ku: o.desc_ku }),
    image: o.banner ?? "",
    details: bullets(o.bullets),
    ctaValue: { ar: "", en: "" },
    cars: [],
  }));
}

export async function getSalesOfferSlugs(): Promise<string[]> {
  const { data, error } = await supabase.from("sales_offers").select("slug");
  if (error) { console.error("sales_offers slugs failed:", error.message); return []; }
  return (data as { slug: string }[]).map((r) => r.slug);
}

export async function getSalesOfferBySlug(slug: string): Promise<Offer | null> {
  const { data: o, error } = await supabase
    .from("sales_offers")
    .select(SALES_COLS)
    .eq("slug", slug)
    .maybeSingle<SalesOfferRow>();
  if (error) { console.error("sales_offer fetch failed:", error.message); return null; }
  if (!o) return null;

  const { data: carsData, error: carsErr } = await supabase
    .from("sales_offer_cars")
    .select(
      "id, image, title_ar, title_en, title_ku, desc_ar, desc_en, desc_ku, price_ar, price_en, price_ku, bullets, car_id, cars(slug), sort_order"
    )
    .eq("offer_id", o.id)
    .order("sort_order");
  if (carsErr) console.error("sales_offer_cars failed:", carsErr.message);

  const cars: OfferCar[] = ((carsData ?? []) as unknown as SalesOfferCarRow[]).map((c) => ({
    // modelSlug drives /models/[slug]; empty when no car is linked
    modelSlug: c.cars?.slug ?? "",
    name: bi({ ar: c.title_ar, en: c.title_en, ku: c.title_ku }),
    image: c.image ?? "",
    details: bullets(c.bullets), // per-car bullets (0020)
    ctaValue: bi({ ar: c.price_ar, en: c.price_en, ku: c.price_ku }),
  }));

  return {
    slug: o.slug,
    title: bi({ ar: o.title_ar, en: o.title_en, ku: o.title_ku }),
    subtitle: bi({ ar: o.desc_ar, en: o.desc_en, ku: o.desc_ku }),
    image: o.banner ?? "",
    details: bullets(o.bullets), // offer-level bullets
    ctaValue: { ar: "", en: "" },
    cars,
  };
}

/* ---------- AFTER-SALES OFFERS ---------- */

const AFTERSALES_COLS =
  "id, slug, banner, title_ar, title_en, title_ku, desc_ar, desc_en, desc_ku, bullets, title2_ar, title2_en, title2_ku, desc2_ar, desc2_en, desc2_ku, phone, sort_order";

export async function getAftersalesOffers(): Promise<Offer[]> {
  const { data, error } = await supabase
    .from("aftersales_offers")
    .select(AFTERSALES_COLS)
    .order("sort_order");
  if (error) { console.error("aftersales_offers list failed:", error.message); return []; }

  return (data as AftersalesOfferRow[]).map((o) => ({
    slug: o.slug,
    title: bi({ ar: o.title_ar, en: o.title_en, ku: o.title_ku }),
    subtitle: bi({ ar: o.desc_ar, en: o.desc_en, ku: o.desc_ku }),
    image: o.banner ?? "",
    details: bullets(o.bullets),
    ctaValue: bi({ ar: o.title2_ar, en: o.title2_en, ku: o.title2_ku }),
    cars: [],
  }));
}

export async function getAftersalesOfferSlugs(): Promise<string[]> {
  const { data, error } = await supabase.from("aftersales_offers").select("slug");
  if (error) { console.error("aftersales_offers slugs failed:", error.message); return []; }
  return (data as { slug: string }[]).map((r) => r.slug);
}

export async function getAftersalesOfferBySlug(
  slug: string
): Promise<AftersalesOfferView | null> {
  const { data: o, error } = await supabase
    .from("aftersales_offers")
    .select(AFTERSALES_COLS)
    .eq("slug", slug)
    .maybeSingle<AftersalesOfferRow>();
  if (error) { console.error("aftersales_offer fetch failed:", error.message); return null; }
  if (!o) return null;

  return {
    slug: o.slug,
    title: bi({ ar: o.title_ar, en: o.title_en, ku: o.title_ku }),
    subtitle: bi({ ar: o.desc_ar, en: o.desc_en, ku: o.desc_ku }),
    image: o.banner ?? "",
    // white-list details = the offer's bullets; ctaValue = the navy headline
    // (title2), matching the OfferDetails two-panel layout.
    details: bullets(o.bullets),
    ctaValue: bi({ ar: o.title2_ar, en: o.title2_en, ku: o.title2_ku }),
    cars: [],
    phone: o.phone,
  };
}