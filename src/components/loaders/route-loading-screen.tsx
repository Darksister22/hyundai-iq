"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";

const SLIDE_MS = 600;        // slide duration (must match transitionDuration below)
const MIN_VISIBLE_MS = 1000;  // once shown, stay at least this long
const SAFETY_MS = 10_000;    // force-reveal guard so the overlay can never get stuck

type Pos = "hidden" | "cover";

const OFFSET: Record<Pos, string> = {
    hidden: "translateY(-100%)",
    cover: "translateY(0)",
};

export default function RouteLoadingScreen() {
    const pathname = usePathname();
    const [mounted, setMounted] = useState(false);
    const [pos, setPos] = useState<Pos>("hidden");

    const safetyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const shownAt = useRef<number>(0);

    // ---- navigation START: show immediately ----
    useEffect(() => {
const startNav = () => {
            if (safetyTimer.current) clearTimeout(safetyTimer.current);
            requestAnimationFrame(() => {
                setMounted(true);
                setPos("hidden");
                requestAnimationFrame(() => {
                    setPos("cover");
                    shownAt.current = Date.now(); // visible NOW, start the clock here
                });
                safetyTimer.current = setTimeout(() => setPos("hidden"), SAFETY_MS);
            });
        };

        // 1) internal link clicks
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


        const onPop = () => startNav();

        document.addEventListener("click", onClick, true);
        window.addEventListener("popstate", onPop);
        return () => {
            document.removeEventListener("click", onClick, true);
            window.removeEventListener("popstate", onPop);
            if (safetyTimer.current) clearTimeout(safetyTimer.current);
        };
    }, []);

    // ---- navigation END: pathname committed -> hold for minimum, then slide up ----
    const first = useRef(true);
    useEffect(() => {
        if (first.current) { first.current = false; return; }
        if (safetyTimer.current) { clearTimeout(safetyTimer.current); safetyTimer.current = null; }

        let cancelled = false;

        const hideWhenReady = () => {
            if (cancelled) return;
            // panel hasn't become visible yet — wait for shownAt to be set
            if (shownAt.current === 0) {
                requestAnimationFrame(hideWhenReady);
                return;
            }
            const elapsed = Date.now() - shownAt.current;
            const wait = Math.max(0, MIN_VISIBLE_MS - elapsed);
            setTimeout(() => {
                if (cancelled) return;
                setPos("hidden");
                shownAt.current = 0;
            }, wait);
        };

        hideWhenReady();
        return () => { cancelled = true; };
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
                if (pos === "hidden") setMounted(false);
            }}
            style={{ transform: OFFSET[pos], transitionDuration: `${SLIDE_MS}ms` }}
            className="fixed inset-0 z-[9998] flex items-center justify-center bg-white transition-transform ease-[cubic-bezier(0.65,0,0.35,1)] will-change-transform"
        >
            <div className="flex flex-col items-center gap-6">
                <Image src="/svglogo/HyundaiLogoBlue.svg" alt="Hyundai" width={180} height={30} />
                <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#002C5F] animate-pulse [animation-duration:1s]" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[#002C5F] animate-pulse [animation-duration:1s] [animation-delay:0.2s]" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[#002C5F] animate-pulse [animation-duration:1s] [animation-delay:0.4s]" />
                </div>
            </div>
        </div>
    );
}