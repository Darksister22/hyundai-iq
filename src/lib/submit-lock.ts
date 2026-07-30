// Client-side submit throttle shared across forms. Only discourages casual
// spam — real rate limiting must live server-side. Each caller passes its
// own `key`, so timers never collide between forms.
const DEFAULT_COOLDOWN_MS = 5 * 60 * 1000; // 5 min

// True while `key` is still cooling down. Stale/malformed entries are
// treated as unlocked (and cleared).
export function isLocked(key: string): boolean {
  if (typeof window === "undefined") return false;
  const raw = window.localStorage.getItem(key);
  const until = Number(raw);
  if (!raw || !Number.isFinite(until) || Date.now() >= until) {
    if (raw) window.localStorage.removeItem(key);
    return false;
  }
  return true;
}

// Start the cooldown for `key`; call only after a successful submit.
export function setLock(key: string, cooldownMs = DEFAULT_COOLDOWN_MS): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, String(Date.now() + cooldownMs));
}