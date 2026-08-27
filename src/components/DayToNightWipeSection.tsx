"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function DayToNightWipeSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const sliderLineRef = useRef<HTMLDivElement>(null);
  const [wipePercent, setWipePercent] = useState<number>(0);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      if (!triggerRef.current || !containerRef.current) return;

      // Pure scroll-driven pinned full wipe with GSAP ScrollTrigger
      ScrollTrigger.create({
        trigger: triggerRef.current,
        start: "top top",
        end: "+=2400", // 2400px scroll duration for seamless wipe
        pin: containerRef.current,
        pinSpacing: true,
        scrub: 0.5,
        onUpdate: (self) => {
          // Progress smoothly from 0% (Day) to 100% (Night)
          const pct = Math.round(self.progress * 100);
          setWipePercent(pct);
        },
      });
    }, triggerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={triggerRef} id="experience" className="relative w-full bg-[#071017]">
      {/* Pinned Viewport Container */}
      <div
        ref={containerRef}
        className="relative w-full h-[100svh] min-h-[600px] overflow-hidden select-none flex flex-col justify-between"
      >
        {/* ================= 1. NIGHT IMAGE (Underneath Layer) ================= */}
        <div className="absolute inset-0 w-full h-full">
          <Image
            src="/terrace_night.png"
            alt="Casa Meridian Terrace under the Full Moon and Candlelight"
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
          />
          {/* Subtle Night Atmosphere Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/40 pointer-events-none" />
        </div>

        {/* ================= 2. DAY IMAGE (Top Layer with Scroll Clip-Path Wipe) ================= */}
        <div
          className="absolute inset-0 w-full h-full will-change-[clip-path]"
          style={{
            clipPath: `polygon(0% 0%, ${wipePercent}% 0%, ${wipePercent}% 100%, 0% 100%)`,
          }}
        >
          <Image
            src="/terrace_day.png"
            alt="Casa Meridian Terrace in Bright Daylight overlooking the Sea"
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
          />
          {/* Subtle Day Atmosphere Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/30 pointer-events-none" />
        </div>

        {/* ================= 3. SLEEK WIPING DIVIDER LINE ================= */}
        <div
          ref={sliderLineRef}
          className="absolute top-0 bottom-0 z-30 pointer-events-none transition-transform duration-75"
          style={{ left: `${wipePercent}%`, transform: "translateX(-50%)" }}
        >
          {/* Glowing vertical line */}
          <div className="w-[2px] h-full bg-gradient-to-b from-amber-200 via-white to-amber-300 shadow-[0_0_16px_rgba(255,255,255,0.95)]" />
        </div>

        {/* ================= 4. TOP TYPOGRAPHY & HEADER ================= */}
        <header className="relative z-40 w-full px-6 sm:px-12 pt-8 sm:pt-10 flex flex-col items-center text-center pointer-events-none">
          {/* <div className="font-mono text-[10px] sm:text-xs tracking-[0.25em] uppercase text-amber-300/90 drop-shadow-md bg-black/40 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/20 mb-3">
            03 — THE SHIFT · FULL WIPE
          </div> */}

          <h2
            className="text-xl sm:text-md text-white font-normal uppercase tracking-[0.06em] drop-shadow-[0_4px_20px_rgba(0,0,0,0.8)]"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            From Sunlit Horizons to Moonlit Magic
          </h2>

          {/* <p
            className="text-sm sm:text-base md:text-lg italic text-slate-200 tracking-wide drop-shadow-[0_2px_10px_rgba(0,0,0,0.7)] mt-2 font-light max-w-2xl"
            style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
          >
            The same private terrace — transformed as day yields to the starlit Bay of Bengal.
          </p> */}
        </header>

        {/* ================= 5. CORNER DYNAMIC CAPTIONS ================= */}
        <div className="relative z-40 w-full px-6 sm:px-12 pb-8 sm:pb-10 flex items-end justify-between pointer-events-none">
          {/* Day Caption (Left) */}
          <div
            className={`max-w-xs sm:max-w-sm transition-opacity duration-300 ${
              wipePercent > 20 ? "opacity-100" : "opacity-20"
            }`}
          >
            <div className="bg-black/50 backdrop-blur-md border border-white/20 p-3.5 sm:p-4 rounded-xl shadow-xl">
              <div className="flex items-center gap-2 text-amber-300 font-mono text-[10px] sm:text-xs tracking-widest uppercase mb-1">
                <span>☼</span>
                <span>SUNLIT SERENITY</span>
              </div>
              <p className="text-white/90 text-xs sm:text-sm font-light">
                Bask in endless blue skies, panoramic horizon views, and the refreshing coastal sea breeze.
              </p>
            </div>
          </div>

          {/* Night Caption (Right) */}
          <div
            className={`max-w-xs sm:max-w-sm text-right transition-opacity duration-300 ${
              wipePercent < 80 ? "opacity-100" : "opacity-20"
            }`}
          >
            <div className="bg-black/50 backdrop-blur-md border border-white/20 p-3.5 sm:p-4 rounded-xl shadow-xl">
              <div className="flex items-center justify-end gap-2 text-sky-300 font-mono text-[10px] sm:text-xs tracking-widest uppercase mb-1">
                <span>☾</span>
                <span>MOONLIT ROMANCE</span>
              </div>
              <p className="text-white/90 text-xs sm:text-sm font-light">
                An intimate sanctuary under the glowing full moon, candlelight, and gentle ocean waves.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Scroll Indicator */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-40 pointer-events-none">
          <span className="font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.25em] text-white/70 bg-black/40 px-3 py-1 rounded-full backdrop-blur-xs">
            Scroll to Experience Day ↔ Night
          </span>
        </div>
      </div>
    </div>
  );
}
