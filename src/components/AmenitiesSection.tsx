"use client";

import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useDayNight } from "./DayNightContext";
import AmenitiesCarousel from "./AmenitiesCarousel";
import SplitTextReveal from "./SplitTextReveal";

export default function AmenitiesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const { mode } = useDayNight();

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      if (headerRef.current) {
        gsap.fromTo(
          headerRef.current.children,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            stagger: 0.12,
            ease: "power3.out",
            scrollTrigger: {
              trigger: headerRef.current,
              start: "top 85%",
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="amenities"
      className={`relative z-10 w-full min-h-screen flex flex-col justify-center py-16 sm:py-20 md:py-28 px-4 sm:px-8 md:px-12 lg:px-16 overflow-hidden border-t transition-colors duration-700 select-none ${
        mode === "day"
          ? "bg-[#f5f2eb] text-slate-900 border-black/10"
          : "bg-[#07131b] text-[#f6f3ec] border-white/10"
      }`}
    >
      {/* Background ambient lighting accents */}
      <div
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-[140px] pointer-events-none transition-opacity duration-700 ${
          mode === "day" ? "bg-amber-300/15" : "bg-[#b8935a]/10"
        }`}
      />

      {/* Header - Compact Editorial in One View */}
      <div
        ref={headerRef}
        className="max-w-3xl mx-auto text-center flex flex-col items-center mb-6 sm:mb-8 md:mb-10"
      >
        <span className="font-mono text-[11px] sm:text-xs tracking-[0.25em] text-[#b8935a] uppercase block mb-1 sm:mb-1.5">
          <SplitTextReveal text="[ Amenities ]" delay={0.1} />
        </span>
        <h2
          className={`text-2xl sm:text-3xl md:text-4xl lg:text-[40px] font-normal tracking-tight leading-tight mb-1.5 sm:mb-2 transition-colors duration-700 ${
            mode === "day" ? "text-slate-900" : "text-[#f6f3ec]"
          }`}
          style={{ fontFamily: "var(--font-fraunces), 'Playfair Display', Georgia, serif" }}
        >
          <SplitTextReveal
            text="The Casa Meridian Privileges"
            stagger={0.05}
            delay={0.15}
            duration={0.7}
          />
        </h2>
        <p
          className={`text-xs sm:text-sm md:text-base max-w-lg leading-relaxed font-normal transition-colors duration-700 ${
            mode === "day" ? "text-slate-700" : "text-slate-300/80"
          }`}
        >
          <SplitTextReveal
            text="Thoughtfully curated amenities and experiences that make your stay effortless, relaxing and memorable."
            stagger={0.015}
            delay={0.25}
            duration={0.6}
          />
        </p>
      </div>

      {/* Amenities Carousel Component */}
      <div className="relative w-full max-w-5xl mx-auto">
        <AmenitiesCarousel />
      </div>
    </section>
  );
}
