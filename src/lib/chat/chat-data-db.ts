// lib/chat/chat-data-db.ts
import { unstable_cache } from "next/cache";
import type { ChatNode, ChatNodeRow, Locale } from "./types";
import { supabase } from "@/lib/supabase";

/** Falls back ku -> ar -> en so a missing Kurdish string never renders blank. */
function pick(
  row: ChatNodeRow,
  field: "label" | "message" | "link_label",
  locale: Locale
): string {
  const order: Locale[] = locale === "ku" ? ["ku", "ar", "en"] : [locale, "en", "ar"];
  for (const l of order) {
    const value = row[`${field}_${l}` as keyof ChatNodeRow];
    if (typeof value === "string" && value.trim()) return value;
  }
  return "";
}

function buildTree(rows: ChatNodeRow[], locale: Locale): ChatNode | null {
  const byParent = new Map<string | null, ChatNodeRow[]>();
  for (const row of rows) {
    const list = byParent.get(row.parent_id) ?? [];
    list.push(row);
    byParent.set(row.parent_id, list);
  }
  for (const list of byParent.values()) {
    list.sort((a, b) => a.sort_order - b.sort_order);
  }

  const rootRow = byParent.get(null)?.[0];
  if (!rootRow) return null;

  // Depth cap: a cycle can't happen through a FK tree, but a bad edit
  // shouldn't be able to hang the render either.
  const toNode = (row: ChatNodeRow, depth: number): ChatNode => ({
    id: row.id,
    label: pick(row, "label", locale),
    message: pick(row, "message", locale),
    phones: row.phones ?? [],
    link: row.link_href
      ? { href: row.link_href, label: pick(row, "link_label", locale) }
      : null,
    options:
      depth >= 8
        ? []
        : (byParent.get(row.id) ?? []).map((child) => toNode(child, depth + 1)),
  });

  return toNode(rootRow, 0);
}

async function fetchRows(): Promise<ChatNodeRow[]> {
  const { data, error } = await supabase
    .from("chat_nodes")
    .select(
      "id, parent_id, sort_order, label_ar, label_en, label_ku, " +
        "message_ar, message_en, message_ku, phones, link_href, " +
        "link_label_ar, link_label_en, link_label_ku"
    )
    .eq("is_active", true);

  if (error) {
    console.error("[chat] failed to load chat_nodes:", error.message);
    return [];
  }
  return (data ?? []) as unknown as ChatNodeRow[];
}

const getCachedRows = unstable_cache(fetchRows, ["chat-nodes"], {
  revalidate: 300,
  tags: ["chat-nodes"],
});

/**
 * Returns the whole tree, localised. Null means "no root row" — the widget
 * renders nothing rather than an empty bubble.
 *
 * Call revalidateTag("chat-nodes") from the dashboard after any edit.
 */
export async function getChatTree(locale: Locale): Promise<ChatNode | null> {
  return buildTree(await getCachedRows(), locale);
}