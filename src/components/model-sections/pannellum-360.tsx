"use client";

import { useEffect, useRef } from "react";

interface Props {
  /** equirectangular panorama image URL */
  src: string;
  /** unique id so multiple viewers don't collide */
  id: string;
}

// minimal typing for the global pannellum object
declare global {
  interface Window {
    pannellum?: {
      viewer: (
        el: string | HTMLElement,
        config: Record<string, unknown>
      ) => { destroy: () => void };
    };
  }
}

export default function Pannellum360({ src, id }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<{ destroy: () => void } | null>(null);

  useEffect(() => {
    let cancelled = false;

    const ensureAssets = () =>
      new Promise<void>((resolve) => {
        // CSS
        if (!document.getElementById("pannellum-css")) {
          const link = document.createElement("link");
          link.id = "pannellum-css";
          link.rel = "stylesheet";
          link.href = "/pannellum/pannellum.css";
          document.head.appendChild(link);
        }
        // JS
        if (window.pannellum) {
          resolve();
          return;
        }
        const existing = document.getElementById(
          "pannellum-js"
        ) as HTMLScriptElement | null;
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

    ensureAssets().then(() => {
      if (cancelled || !containerRef.current || !window.pannellum) return;
      // clear any previous instance
      viewerRef.current?.destroy();
      viewerRef.current = window.pannellum.viewer(containerRef.current, {
        type: "equirectangular",
        panorama: src,
        autoLoad: true,
        showZoomCtrl: false,
        keyboardZoom: false,
        mouseZoom: false,
        showFullscreenCtrl: true,
        compass: false,
        autoRotate: -2, // gentle drift; user drag overrides
        hfov: 110,
        minHfov: 110,
        maxHfov: 110,
      });
    });

    return () => {
      cancelled = true;
      viewerRef.current?.destroy();
      viewerRef.current = null;
    };
  }, [src, id]);

  return (
    <div
      ref={containerRef}
      id={id}
      className="h-full w-full"
      style={{ background: "#1a1a1a" }}
    />
  );
}
