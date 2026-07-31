import { useEffect, useState } from "react";

const COOLDOWN_MS = 90 * 1000; // 90s, global for all forms
const PREFIX = "submit-lock:";

export function useSubmitCooldown(key: string) {
  const storeKey = PREFIX + key;

  const [lockedUntil, setLockedUntil] = useState(0); // epoch ms; 0 = unlocked
  const [now, setNow] = useState(() => Date.now()); // ticks so the label counts down

  // Load any existing cooldown when the key changes (e.g. form target switches).
  useEffect(() => {
    try {
      const until = Number(window.localStorage.getItem(storeKey));
      setLockedUntil(Number.isFinite(until) ? until : 0);
    } catch {
      setLockedUntil(0);
    }
  }, [storeKey]);

  // While locked, tick every second so the countdown updates and clears itself.
  useEffect(() => {
    if (lockedUntil <= Date.now()) return;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [lockedUntil]);

  const remainingMs = Math.max(0, lockedUntil - now);
  const isLocked = remainingMs > 0;

  // mm:ss for a button label
  const remainingLabel = (() => {
    const s = Math.ceil(remainingMs / 1000);
    return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
  })();

  // Arm the cooldown; call only after a real, successful submit.
  const startCooldown = () => {
    const until = Date.now() + COOLDOWN_MS;
    try {
      window.localStorage.setItem(storeKey, String(until));
    } catch {
      /* storage unavailable — throttle just won't persist across reloads */
    }
    setLockedUntil(until);
  };

  return { isLocked, remainingLabel, startCooldown };
}