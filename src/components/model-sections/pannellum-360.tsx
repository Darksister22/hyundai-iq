"use client";

import { useEffect, useRef } from "react";

interface Props {
  src: string;
  id: string;
}

// Pannellum viewer methods we actually call
interface PannellumViewer {
  destroy: () => void;
  setHfov: (hfov: number, animated?: boolean | number) => void;
}

declare global {
  interface Window {
    pannellum?: {
      viewer: (el: string | HTMLElement, config: Record<string, unknown>) => PannellumViewer;
    };
  }
}

// Vertical FOV we want to hold constant. Pannellum only accepts a HORIZONTAL
// fov and derives vertical from the container aspect — so a fixed hfov on a
// tall/narrow phone stage blows the vertical fov out into a fisheye.
// We invert that: pick the vfov we want, solve for the hfov that produces it.
const TARGET_VFOV = 68;

function hfovForAspect(w: number, h: number): number {
  const aspect = w / Math.max(h, 1);
  const vRad = (TARGET_VFOV * Math.PI) / 180;
  const hDeg = 2 * Math.atan(Math.tan(vRad / 2) * aspect) * (180 / Math.PI);
  return Math.max(50, Math.min(120, hDeg)); // clamp to sane bounds
}

export default function Pannellum360({ src, id }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<PannellumViewer | null>(null);

  useEffect(() => {
    let cancelled = false;

    const ensureAssets = () =>
      new Promise<void>((resolve) => {
        if (!document.getElementById("pannellum-css")) {
          const link = document.createElement("link");
          link.id = "pannellum-css";
          link.rel = "stylesheet";
          link.href = "/pannellum/pannellum.css";
          document.head.appendChild(link);
        }
        if (window.pannellum) return resolve();
        const existing = document.getElementById("pannellum-js") as HTMLScriptElement | null;
        if (existing) {
          existing.addEventListener("load", () => resolve());
          return;
        }
        const script = document.createElement("script");
        script.id = "pannellum-js";
        script.src = "/pannellum/pannellum.js";
        script.onload = () => resolve();
        document.body.appendChild(script);
      });

    let ro: ResizeObserver | null = null;

    ensureAssets().then(() => {
      const el = containerRef.current;
      if (cancelled || !el || !window.pannellum) return;

      viewerRef.current?.destroy();

      const initialHfov = hfovForAspect(el.clientWidth, el.clientHeight);

      viewerRef.current = window.pannellum.viewer(el, {
        type: "equirectangular",
        panorama: src,
        autoLoad: true,
        showZoomCtrl: false,
        keyboardZoom: false,
        mouseZoom: false,
        showFullscreenCtrl: true,
        compass: false,
        autoRotate: -2,
        hfov: initialHfov,
        minHfov: 50,   // widened from the old locked 110 so setHfov can actually move
        maxHfov: 120,
      });

      // Recompute on rotate / resize / URL-bar show-hide so the vertical FOV
      // stays put instead of ballooning when the stage changes shape.
      ro = new ResizeObserver(([entry]) => {
        const { width, height } = entry.contentRect;
        if (width && height) viewerRef.current?.setHfov(hfovForAspect(width, height), false);
      });
      ro.observe(el);
    });

    return () => {
      cancelled = true;
      ro?.disconnect();
      viewerRef.current?.destroy();
      viewerRef.current = null;
    };
  }, [src, id]);

  return (
    <div ref={containerRef} id={id} className="h-full w-full" style={{ background: "#1a1a1a" }} />
  );
}