"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useDayNight } from "./DayNightContext";

export default function AboutSection() {
  const triggerRef = useRef<HTMLElement>(null);
  const pinContainerRef = useRef<HTMLDivElement>(null);
  const bgOceanRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const imageInnerRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const textContentRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const { mode } = useDayNight();

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      if (!triggerRef.current || !pinContainerRef.current || !cardRef.current) return;

      const card = cardRef.current;
      const isMobile = window.innerWidth < 768;

      const startW = isMobile ? "88vw" : "34vw";
      const startH = isMobile ? "52vh" : "44vh";
      const startRadius = isMobile ? "20px" : "24px";
      const startScale = isMobile ? 1.02 : 1.12;
      const startY = isMobile ? -48 : 0;

      // Initialize starting geometry
      gsap.set(card, {
        width: startW,
        height: startH,
        borderRadius: startRadius,
        y: startY,
      });

      if (bgOceanRef.current) {
        gsap.set(bgOceanRef.current, { scale: 1.0, opacity: 1 });
      }

      if (imageInnerRef.current) {
        gsap.set(imageInnerRef.current, { scale: startScale });
      }

      // Hide all overlay & text content completely while zooming
      if (overlayRef.current) {
        gsap.set(overlayRef.current, { opacity: 0, autoAlpha: 0 });
      }

      if (textContentRef.current) {
        gsap.set(textContentRef.current, { opacity: 0, y: 40, autoAlpha: 0 });
      }

      if (statsRef.current) {
        gsap.set(statsRef.current, { opacity: 0, y: 25, autoAlpha: 0 });
      }

      // Master cinematic scrub timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: triggerRef.current,
          start: "top top",
          end: "+=2600",
          pin: pinContainerRef.current,
          pinSpacing: true,
          scrub: 0.8,
          invalidateOnRefresh: true,
        },
      });

      // 1. ZOOM PHASE (0 -> 0.48): Villa exterior card expands to fill entire screen
      tl.to(
        card,
        {
          width: "100vw",
          height: "100vh",
          borderRadius: "0px",
          y: 0,
          ease: "power2.inOut",
          duration: 0.48,
        },
        0
      );

      if (imageInnerRef.current) {
        tl.to(
          imageInnerRef.current,
          { scale: 1.0, ease: "power1.out", duration: 0.48 },
          0
        );
      }

      if (bgOceanRef.current) {
        tl.to(
          bgOceanRef.current,
          { scale: 1.08, opacity: 0, ease: "none", duration: 0.48 },
          0
        );
      }

      // 2. REVEAL PHASE (0.48 -> 0.70): ONLY when villa exterior fits the screen, about content appears!
      if (overlayRef.current) {
        tl.to(
          overlayRef.current,
          { opacity: 1, autoAlpha: 1, ease: "power2.out", duration: 0.20 },
          0.48
        );
      }

      if (textContentRef.current) {
        tl.to(
          textContentRef.current,
          { opacity: 1, y: 0, autoAlpha: 1, ease: "power3.out", duration: 0.22 },
          0.50
        );
      }

      if (statsRef.current) {
        tl.to(
          statsRef.current,
          { opacity: 1, y: 0, autoAlpha: 1, ease: "power3.out", duration: 0.20 },
          0.58
        );
      }

      // 3. HOLD PHASE (0.70 -> 1.0): Holds full screen with content readable for remaining scroll
      tl.to({}, { duration: 0.35 });
    }, triggerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={triggerRef}
      id="about"
      className={`relative w-full transition-colors duration-700 select-none ${mode === "day" ? "bg-[#f5f2eb]" : "bg-[#07131b]"
        }`}
    >
      {/* Pinned full-viewport stage */}
      <div
        ref={pinContainerRef}
        className="relative w-full h-[100svh] min-h-[600px] flex items-center justify-center overflow-hidden"
      >
        {/* Background Ocean Horizon (shown before zooming in) */}
        <div
          ref={bgOceanRef}
          className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden will-change-transform"
        >
          <Image
            src="/about_bg_ocean.jpg"
            alt="Bay of Bengal Ocean Horizon Background"
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
          />
          {/* Ambient overlay for tone matching & day/night support */}
          <div
            className={`absolute inset-0 transition-colors duration-700 ${mode === "day"
              ? "bg-gradient-to-b from-white/25 via-transparent to-black/15"
              : "bg-gradient-to-b from-black/70 via-black/50 to-black/80"
              }`}
          />
        </div>



        {/* The Cinematic Zooming Card */}
        <div
          ref={cardRef}
          style={{ willChange: "width, height, border-radius" }}
          className={`relative z-10 overflow-hidden shadow-2xl transition-shadow duration-700 flex items-center justify-center rounded-2xl sm:rounded-3xl ${mode === "day"
            ? "shadow-[0_24px_70px_rgba(0,0,0,0.22)] border border-white/50"
            : "shadow-[0_30px_90px_rgba(0,0,0,0.95)] border border-white/20"
            }`}
        >
          {/* Inner Image Container (Day / Night with Parallax Scale) */}
          <div
            ref={imageInnerRef}
            className="absolute inset-0 w-full h-full will-change-transform"
          >
            {/* Day Exterior Image */}
            <div
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${mode === "day"
                ? "opacity-100 z-10 scale-100"
                : "opacity-0 z-0 scale-105 pointer-events-none"
                }`}
            >
              <Image
                src="/casa_exterior.png"
                alt="Casa Meridian - Villa Exterior in Sunlit Daylight"
                fill
                priority
                className="object-cover object-[8%_center] sm:object-center"
                sizes="(max-width: 640px) 92vw, (max-width: 1024px) 50vw, 100vw"
                quality={90}
              />
            </div>

            {/* Night Exterior Image */}
            <div
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${mode === "night"
                ? "opacity-100 z-10 scale-100"
                : "opacity-0 z-0 scale-105 pointer-events-none"
                }`}
            >
              <Image
                src="/casa_exterior_night.png"
                alt="Casa Meridian - Villa Exterior Illuminated at Night"
                fill
                priority
                className="object-cover object-[8%_center] sm:object-center"
                sizes="(max-width: 640px) 92vw, (max-width: 1024px) 50vw, 100vw"
                quality={90}
              />
            </div>
          </div>

          {/* Cinematic Dark Gradient Overlay (Adaptive: balanced dark wash on mobile, left-to-right on desktop) */}
          <div
            ref={overlayRef}
            className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/80 to-black/85 md:bg-gradient-to-r md:from-black/20 md:via-black/60 md:to-black/92 pointer-events-none z-10"
          />

          {/* About Content: Centered on small devices, right-aligned on desktop */}
          <div className="absolute inset-0 z-20 flex items-center justify-center md:justify-end px-6 sm:px-12 md:px-16 lg:px-24 py-12 sm:py-16 pointer-events-none">
            <div className="w-full max-w-xl text-white pointer-events-auto flex flex-col items-center md:items-start text-center md:text-left space-y-4 sm:space-y-6">
              {/* Text content block */}
              <div ref={textContentRef} className="flex flex-col items-center md:items-start space-y-3 sm:space-y-4 w-full">
                {/* Location Badge */}
                <div className="flex items-center justify-center md:justify-start gap-2 text-[#b8935a] text-[11px] sm:text-sm font-mono tracking-[0.25em] uppercase">
                  <span>☼</span>
                  <span>ECR, CHENNAI</span>
                </div>

                {/* Heading */}
                <h2
                  className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-normal tracking-tight leading-[1.15] text-white text-center md:text-left"
                  style={{ fontFamily: "var(--font-fraunces), 'Playfair Display', Georgia, serif" }}
                >
                  A Private Villa on the Bay of Bengal
                </h2>

                {/* Description Paragraphs */}
                <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm md:text-[16px] leading-relaxed font-light text-white/90 text-center md:text-left max-w-lg">
                  <p>
                    Casa Meridian was built around a simple idea — that a villa should never compete with its view, only frame it. Four floors, each with its own relationship to the horizon — from garden-level rooms to a rooftop terrace suite.
                  </p>
                </div>

                {/* Divider */}
                <div className="w-24 md:w-full h-px bg-white/20 my-1 mx-auto md:mx-0" />
              </div>

              {/* Stats / Features Row */}
              <div ref={statsRef} className="grid grid-cols-3 gap-4 sm:gap-6 pt-1 w-full max-w-md md:max-w-none text-center md:text-left">
                <div className="flex flex-col items-center md:items-start">
                  <div
                    className="text-2xl sm:text-3xl md:text-4xl font-serif font-normal text-[#b8935a]"
                    style={{ fontFamily: "var(--font-fraunces), 'Playfair Display', Georgia, serif" }}
                  >
                    5<span className="text-base sm:text-2xl ml-0.5">BHK</span>
                  </div>
                  <div className="text-[9px] sm:text-xs font-mono tracking-[0.18em] uppercase mt-0.5 font-medium text-white/70">
                    Whole Villa
                  </div>
                </div>

                <div className="flex flex-col items-center md:items-start">
                  <div
                    className="text-2xl sm:text-3xl md:text-4xl font-serif font-normal text-[#b8935a]"
                    style={{ fontFamily: "var(--font-fraunces), 'Playfair Display', Georgia, serif" }}
                  >
                    4
                  </div>
                  <div className="text-[9px] sm:text-xs font-mono tracking-[0.18em] uppercase mt-0.5 font-medium text-white/70">
                    Floors
                  </div>
                </div>

                <div className="flex flex-col items-center md:items-start">
                  <div
                    className="text-2xl sm:text-3xl md:text-4xl font-serif font-normal text-[#b8935a]"
                    style={{ fontFamily: "var(--font-fraunces), 'Playfair Display', Georgia, serif" }}
                  >
                    1
                  </div>
                  <div className="text-[9px] sm:text-xs font-mono tracking-[0.18em] uppercase mt-0.5 font-medium text-white/70">
                    Infinity Pool
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
