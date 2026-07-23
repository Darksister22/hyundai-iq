// Fetchers for the dashboard-managed "Information" tables:
// call_center_info (0009 + 0012), open_hours_cards (0013),
// branch_contacts (0014). Same conventions as lib/locations.ts:
// shared anon client, console.error + safe fallback on failure.

import { supabase } from "./supabase";
import type { Locale } from "./i18n";

// ── call_center_info (single row, id = 1) ──

export interface CallCenterInfoRow {
  phone: string | null; // legacy single number (pre-0012)
  phones: string[]; // all numbers, display order
  email: string | null;
  sat_wed_hours_ar: string | null;
  sat_wed_hours_en: string | null;
  thu_hours_ar: string | null;
  thu_hours_en: string | null;
  fri_note_ar: string | null;
  fri_note_en: string | null;
}

export async function getCallCenterInfo(): Promise<CallCenterInfoRow | null> {
  const { data, error } = await supabase
    .from("call_center_info")
    .select("*")
    .eq("id", 1)
    .maybeSingle<CallCenterInfoRow>();

  if (error) {
    console.error("Failed to fetch call_center_info:", error.message);
    return null;
  }
  return data;
}

/**
 * All call-center numbers: the 0012 array when present, else the legacy
 * comma-separated `phone` column, deduped. Empty array = nothing to show.
 */
export function callCenterPhones(row: CallCenterInfoRow | null): string[] {
  if (!row) return [];
  if (row.phones && row.phones.length > 0) return [...new Set(row.phones)];
  return [
    ...new Set(
      (row.phone ?? "")
        .split(/[,،]/)
        .map((p) => p.trim())
        .filter(Boolean)
    ),
  ];
}

// ── open_hours_cards ──

export type OpenHoursSection =
  | "service_centers"
  | "express_service"
  | "genuine_parts"
  | "body_paint";

// Accordion order — matches the dashboard's fixed sections.
export const OPEN_HOURS_SECTIONS: OpenHoursSection[] = [
  "service_centers",
  "express_service",
  "genuine_parts",
  "body_paint",
];

/** One label/value line inside a card's day_rows jsonb. */
export interface OpenHoursDayRow {
  label_ar: string | null;
  label_en: string | null;
  value_ar: string | null;
  value_en: string | null;
}

export interface OpenHoursCardRow {
  id: number;
  section: OpenHoursSection;
  sort_order: number;
  title_ar: string | null;
  title_en: string;
  day_rows: OpenHoursDayRow[];
}

export async function getOpenHoursCards(): Promise<OpenHoursCardRow[]> {
  const { data, error } = await supabase
    .from("open_hours_cards")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Failed to fetch open_hours_cards:", error.message);
    return [];
  }
  return (data ?? []) as OpenHoursCardRow[];
}

// ── branch_contacts ──

export interface BranchContactRow {
  id: number;
  sort_order: number;
  city_ar: string | null;
  city_en: string;
  sales_phone: string | null;
  service_phone: string | null;
  parts_phone: string | null;
}

export async function getBranchContacts(): Promise<BranchContactRow[]> {
  const { data, error } = await supabase
    .from("branch_contacts")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Failed to fetch branch_contacts:", error.message);
    return [];
  }
  return (data ?? []) as BranchContactRow[];
}

// ── shared helper ──

/** Active-locale value with English fallback (site is ar/en; ku ignored). */
export function locText(
  locale: Locale,
  ar: string | null | undefined,
  en: string | null | undefined
): string {
  const active = locale === "ar" ? ar : en;
  return (active && active.trim()) || (en ?? "") || "";
}
