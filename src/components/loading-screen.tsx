"use client";
import { useEffect, useState } from "react";

export default function LoadingScreen() {
  const [hidden, setHidden] = useState(false);   // fade-out started
  const [removed, setRemoved] = useState(false); // unmounted after fade

  useEffect(() => {
    // wait for EVERYTHING (images, fonts, etc.) via window 'load'
    const done = () => setHidden(true);
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
      onTransitionEnd={() => hidden && setRemoved(true)}   // unmount after fade
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-[#002C5F] transition-opacity duration-700 ${
        hidden ? "opacity-0" : "opacity-100"
      }`}
    >
      {/* brand + spinner — swap for your logo/animation */}
      <div className="flex flex-col items-center gap-6">
        <span className="text-3xl font-bold tracking-widest text-white">HYUNDAI</span>
        <div className="w-10 h-10 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      </div>
    </div>
  );
}