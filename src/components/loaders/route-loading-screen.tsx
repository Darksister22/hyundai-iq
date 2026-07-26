"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";

const SLOW_MS = 300;      // wait this long before deciding a navigation is "slow"
const SLIDE_MS = 600;     // slide duration (must match transitionDuration below)
const SAFETY_MS = 10_000; // force-reveal guard so the overlay can never get stuck

// vertical position of the panel
type Pos = "hidden" | "cover";

const OFFSET: Record<Pos, string> = {
    hidden: "translateY(-100%)", // off-screen, top (both entry point and exit)
    cover: "translateY(0)",      // covering the screen
};

export default function RouteLoadingScreen() {
    const pathname = usePathname();
    const [mounted, setMounted] = useState(false);
    const [pos, setPos] = useState<Pos>("hidden");

    const slowTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const safetyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    // ---- navigation START: arm the "slow" timer ----
    useEffect(() => {
        const clearSlow = () => {
            if (slowTimer.current) { clearTimeout(slowTimer.current); slowTimer.current = null; }
        };

        const startNav = () => {
            clearSlow();
            slowTimer.current = setTimeout(() => {
                setMounted(true);
                setPos("hidden"); // start above the screen
                // two frames so the transition runs cleanly from above -> cover (slide down)
                requestAnimationFrame(() => requestAnimationFrame(() => setPos("cover")));
                if (safetyTimer.current) clearTimeout(safetyTimer.current);
                safetyTimer.current = setTimeout(() => setPos("hidden"), SAFETY_MS);
            }, SLOW_MS);
        };

        // 1) internal link clicks — the reliable "start" signal
        const onClick = (e: MouseEvent) => {
            if (e.defaultPrevented || e.button !== 0) return;
            if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
            const a = (e.target as HTMLElement)?.closest("a");
            if (!a) return;
            const href = a.getAttribute("href");
            if (!href || href.startsWith("#")) return;
            if (a.target === "_blank" || a.hasAttribute("download")) return;
            const url = new URL(a.href, window.location.href);
            if (url.origin !== window.location.origin) return;
            if (url.pathname === window.location.pathname) return;
            startNav();
        };

        // 2) programmatic router.push (best-effort) + 3) back/forward
        const origPush = history.pushState;
        history.pushState = function (
            ...args: Parameters<typeof history.pushState>
        ) {
            const to = args[2];
            if (to) {
                const url = new URL(String(to), window.location.href);
                if (url.pathname !== window.location.pathname) startNav();
            }
            return origPush.apply(this, args);
        };
        const onPop = () => startNav();

        document.addEventListener("click", onClick, true);
        window.addEventListener("popstate", onPop);
        return () => {
            document.removeEventListener("click", onClick, true);
            window.removeEventListener("popstate", onPop);
            history.pushState = origPush;
            clearSlow();
            if (safetyTimer.current) clearTimeout(safetyTimer.current);
        };
    }, []);

    // ---- navigation END: pathname committed -> slide back up ----
    const first = useRef(true);
    useEffect(() => {
        if (first.current) { first.current = false; return; }
        if (slowTimer.current) { clearTimeout(slowTimer.current); slowTimer.current = null; }
        if (safetyTimer.current) { clearTimeout(safetyTimer.current); safetyTimer.current = null; }
        setPos("hidden"); // slide up (if covering) or no-op (if never shown)
    }, [pathname]);

    // lock scroll while the panel is on screen
    useEffect(() => {
        document.body.style.overflow = mounted ? "hidden" : "";
        return () => { document.body.style.overflow = ""; };
    }, [mounted]);

    if (!mounted) return null;

    return (
        <div
            onTransitionEnd={() => {
                // once the panel has slid back up off the screen, remove it
                if (pos === "hidden") setMounted(false);
            }}
            style={{ transform: OFFSET[pos], transitionDuration: `${SLIDE_MS}ms` }}
            className="fixed inset-0 z-[9998] flex items-center justify-center bg-white transition-transform ease-[cubic-bezier(0.65,0,0.35,1)] will-change-transform"
        >
            <div className="flex flex-col items-center gap-6">
                <Image
                    src="/svglogo/HyundaiLogoBlue.svg"
                    alt="Hyundai"
                    width={180}
                    height={30}
                />
                <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#002C5F] animate-pulse [animation-duration:1s]" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[#002C5F] animate-pulse [animation-duration:1s] [animation-delay:0.2s]" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[#002C5F] animate-pulse [animation-duration:1s] [animation-delay:0.4s]" />
                </div>
            </div>
        </div>
    );
}