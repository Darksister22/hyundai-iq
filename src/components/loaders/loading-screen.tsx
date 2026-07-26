"use client";
import { useEffect, useState } from "react";
import Image from "next/image";

const SLIDE_MS = 700; // must match transitionDuration below

export default function LoadingScreen() {
  const [leaving, setLeaving] = useState(false); // slide-up started
  const [removed, setRemoved] = useState(false); // unmounted after slide

  useEffect(() => {
    // wait for EVERYTHING (images, fonts, etc.) via window 'load'
    const done = () => setLeaving(true);
    if (document.readyState === "complete") {
      done();
    } else {
      window.addEventListener("load", done);
    }
    return () => window.removeEventListener("load", done);
  }, []);

  // lock body scroll while visible
  useEffect(() => {
    document.body.style.overflow = removed ? "" : "hidden";
    return () => { document.body.style.overflow = ""; };
  }, [removed]);

  if (removed) return null;

  return (
    <div
      onTransitionEnd={() => leaving && setRemoved(true)} // unmount after slide-up
      style={{
        transform: leaving ? "translateY(-100%)" : "translateY(0)",
        transitionDuration: `${SLIDE_MS}ms`,
      }}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-white transition-transform ease-[cubic-bezier(0.65,0,0.35,1)] will-change-transform"
    >
      <div className="flex flex-col items-center gap-8">
        <Image
          src="/svglogo/HyundaiLogoBlue.svg"
          alt="Hyundai"
          width={180}
          height={30}
          priority
        />

        {/* three pulsing navy dots */}
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#002C5F] animate-pulse [animation-duration:1s]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#002C5F] animate-pulse [animation-duration:1s] [animation-delay:0.2s]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#002C5F] animate-pulse [animation-duration:1s] [animation-delay:0.4s]" />
        </div>
      </div>
    </div>
  );
}