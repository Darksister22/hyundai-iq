// lib/chat/types.ts

// TODO: if you already export a Locale type, import that instead.
export type Locale = "ar" | "en" | "ku";

/** Raw shape as it comes back from Supabase. */
export interface ChatNodeRow {
  id: string;
  parent_id: string | null;
  sort_order: number;
  label_ar: string | null;
  label_en: string | null;
  label_ku: string | null;
  message_ar: string;
  message_en: string;
  message_ku: string | null;
  phones: string[];
  link_href: string | null;
  link_label_ar: string | null;
  link_label_en: string | null;
  link_label_ku: string | null;
}

/** Localised, nested node handed to the client component. */
export interface ChatNode {
  id: string;
  /** Button text used by the parent to reach this node. Empty on the root. */
  label: string;
  message: string;
  phones: string[];
  link: { href: string; label: string } | null;
  options: ChatNode[];
}
