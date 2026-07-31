import { supabase } from "./supabase";
import type { SocialPlatform } from "@/components/footer-sections/social-icons";

export interface SocialLink {
  platform: SocialPlatform;
  url: string;
  sort_order: number;
}

/**
 * Active social links that actually have a URL, in display order.
 * Fixed platform set (icons ship in code); the dashboard controls each
 * platform's URL + active flag. Fails soft to [] like the other fetchers.
 */
export async function getSocialLinks(): Promise<SocialLink[]> {
  const { data, error } = await supabase
    .from("social_links")
    .select("platform, url, sort_order")
    .eq("is_active", true)
    .not("url", "is", null)
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Failed to fetch social_links:", error.message);
    return [];
  }
  return (data ?? [])
    .filter((r) => ((r.url as string | null) ?? "").trim() !== "")
    .map((r) => ({
      platform: r.platform as SocialPlatform,
      url: (r.url as string).trim(),
      sort_order: r.sort_order as number,
    }));
}
