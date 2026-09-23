"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { Volume2, VolumeX } from "lucide-react";
import { useDayNight } from "./DayNightContext";

/**
 * HeroSectionWithClouds
 * Reference component integrating the atmospheric cloud layer (hero-clouds.png)
 * positioned between the ocean video and couple layers, featuring:
 * - Continuous linear horizontal drift (X: -15px -> +15px, 40s loop)
 * - Scroll progress parallax (Y: 0 -> -10px desktop, -6px mobile)
 * - Responsive viewport scaling and safe bleed margins
 */
export default function HeroSectionWithClouds() {
  const containerRef = useRef<HTMLElement>(null);
  const dayVideoRef = useRef<HTMLVideoElement>(null);
  const nightVideoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const { mode } = useDayNight();
  const shouldReduceMotion = useReducedMotion();

  // Detect mobile viewport for tailored subtle motion scaling
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile, { passive: true });
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Scroll parallax mapping based on hero section scroll progress
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // Background subtle scroll parallax: 0 -> -20px Y, scale 1 -> 1.04
  const rawBgY = useTransform(scrollYProgress, [0, 1], [0, -20]);
  const rawBgScale = useTransform(scrollYProgress, [0, 1], [1, 1.04]);

  // Cloud subtle scroll parallax: 0 -> -10px Y (desktop), 0 -> -6px Y (mobile)
  // Weaker than couple's parallax (-45px) and background video parallax (-20px)
  const cloudsY = useTransform(
    scrollYProgress,
    (progress) => (shouldReduceMotion ? 0 : progress * (isMobile ? -6 : -10))
  );

  // Couple slightly stronger scroll parallax: 0 -> -45px Y, scale 1 -> 1.03
  const rawCoupleY = useTransform(scrollYProgress, [0, 1], [0, -45]);
  const rawCoupleScale = useTransform(scrollYProgress, [0, 1], [1, 1.03]);

  // Hero text: fades out and floats upward as user scrolls away
  const rawTextY = useTransform(scrollYProgress, [0, 0.45], [0, -50]);
  const rawTextOpacity = useTransform(scrollYProgress, [0, 0.45], [1, 0]);

  // Accessibility: disable scroll parallax if user prefers reduced motion
  const bgY = shouldReduceMotion ? 0 : rawBgY;
  const bgScale = shouldReduceMotion ? 1 : rawBgScale;
  const coupleY = shouldReduceMotion ? 0 : rawCoupleY;
  const coupleScale = shouldReduceMotion ? 1 : rawCoupleScale;
  const textY = shouldReduceMotion ? 0 : rawTextY;
  const textOpacity = shouldReduceMotion ? 1 : rawTextOpacity;

  // Ensure videos play continuously on mount
  useEffect(() => {
    if (dayVideoRef.current) {
      dayVideoRef.current.play().catch(() => {});
    }
    if (nightVideoRef.current) {
      nightVideoRef.current.play().catch(() => {});
    }
  }, []);

  // Sync video audio mute states with active mode and user mute preference
  useEffect(() => {
    if (dayVideoRef.current) {
      dayVideoRef.current.muted = isMuted || mode !== "day";
    }
    if (nightVideoRef.current) {
      nightVideoRef.current.muted = isMuted || mode !== "night";
    }
  }, [mode, isMuted]);

  const toggleSound = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    const activeVideo = mode === "night" ? nightVideoRef.current : dayVideoRef.current;
    if (activeVideo) {
      activeVideo.muted = nextMuted;
      if (!nextMuted) {
        activeVideo.play().catch(() => {});
      }
    }
  };

  return (
    <section
      ref={containerRef}
      className="relative w-full max-w-full h-[100svh] min-h-[580px] overflow-hidden flex flex-col items-center justify-between text-white select-none bg-slate-950"
      aria-label="Casa Meridian Oceanfront Terrace Hero"
    >
      {/* =========================================================================
          LAYER 1: Background Moving-Ocean Video (Sky, Ocean, Terrace & Railing)
         ========================================================================= */}
      <motion.div
        style={{ y: bgY, scale: bgScale }}
        className="absolute inset-0 w-full h-full pointer-events-none will-change-transform origin-center"
      >
        {/* Day Mode Ocean Video */}
        <video
          ref={dayVideoRef}
          src="/waves.mp4"
          autoPlay
          muted={isMuted || mode !== "day"}
          loop
          playsInline
          className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-1000 ${
            mode === "day" ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
          }`}
        />

        {/* Night Mode Ocean Video */}
        <video
          ref={nightVideoRef}
          src="/waves_night.mp4"
          autoPlay
          muted={isMuted || mode !== "night"}
          loop
          playsInline
          className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-1000 ${
            mode === "night" ? "opacity-100 z-10 brightness-[0.85] contrast-[1.05]" : "opacity-0 z-0 pointer-events-none"
          }`}
        />

        {/* Subtle Luxury Gradient Overlays for contrast and seamless section blending */}
        <div
          className={`absolute inset-x-0 top-0 h-40 sm:h-52 pointer-events-none z-20 transition-opacity duration-700 ${
            mode === "night"
              ? "bg-gradient-to-b from-black/85 via-black/40 to-transparent"
              : "bg-gradient-to-b from-black/60 via-black/25 to-transparent"
          }`}
        />
        <div
          className={`absolute inset-x-0 bottom-0 h-36 sm:h-48 pointer-events-none z-20 transition-opacity duration-700 ${
            mode === "night"
              ? "bg-gradient-to-t from-black/90 via-black/40 to-transparent"
              : "bg-gradient-to-t from-black/50 via-black/15 to-transparent"
          }`}
        />
      </motion.div>

      {/* =========================================================================
          LAYER 2: Cloud Layer (Subtle Sky Parallax & Atmospheric Drift)
          - Layer order: Ocean video -> Clouds (z-10) -> Couple (z-20) -> Hero text (z-30)
          - Covers sky area naturally without obscuring couple or hero text
          - Extremely slow continuous horizontal drift (X: -15px -> +15px, 40s linear loop, reduced on mobile)
          - Subtle vertical scroll parallax (Y: 0 -> -10px, reduced on mobile)
          - pointer-events-none & overflow-hidden prevent interference or overflow
         ========================================================================= */}
      <motion.div
        style={{ y: cloudsY }}
        className="absolute inset-x-0 top-0 h-[48vh] sm:h-[54vh] md:h-[60vh] lg:h-[64vh] pointer-events-none z-10 overflow-hidden select-none"
        aria-hidden="true"
      >
        <motion.div
          animate={
            shouldReduceMotion
              ? undefined
              : {
                  x: isMobile ? [-8, 8] : [-15, 15],
                }
          }
          transition={
            shouldReduceMotion
              ? undefined
              : {
                  duration: 40,
                  repeat: Infinity,
                  repeatType: "reverse",
                  ease: "linear",
                }
          }
          className="relative w-[calc(100%+60px)] -left-[30px] h-full will-change-transform"
        >
          <Image
            src="/casa/hero-clouds.png"
            alt=""
            fill
            priority
            unoptimized
            className={`object-cover object-top pointer-events-none transition-all duration-1000 ${
              mode === "night" ? "opacity-35 brightness-75" : "opacity-85 brightness-100"
            }`}
          />
        </motion.div>
      </motion.div>

      {/* =========================================================================
          LAYER 3: Couple PNG (Aligned to Background Terrace)
          - Centered horizontally to align with terrace perspective vanishing lines
          - Height scaled so man's head sits just above the terrace railing
          - Positioned to prevent overlapping the headline on mobile viewports
         ========================================================================= */}
      <motion.div
        style={{ y: coupleY, scale: coupleScale }}
        className="absolute left-1/2 -translate-x-1/2 bottom-0 sm:bottom-[3%] md:bottom-[6%] lg:bottom-[8%] z-20 pointer-events-none flex flex-col items-center will-change-transform origin-bottom"
      >
        {/* Soft natural grounding shadow on terrace floor */}
        <div className="w-[60%] sm:w-[68%] h-3 sm:h-4 bg-black/40 rounded-full blur-md -mb-2 sm:-mb-3 z-0" />

        <div className="relative h-[32vh] sm:h-[40vh] md:h-[47vh] lg:h-[51vh] max-h-[560px] aspect-[1024/1536] z-10">
          <Image
            src="/hero-couple.png"
            alt="Couple admiring ocean view from Casa Meridian terrace"
            fill
            sizes="(max-width: 640px) 240px, (max-width: 1024px) 360px, 450px"
            priority
            className="object-contain object-bottom drop-shadow-[0_8px_20px_rgba(0,0,0,0.35)] select-none"
          />
        </div>
      </motion.div>

      {/* =========================================================================
          LAYER 4: Hero Text (Luxury Typography & Restrained Entrance)
         ========================================================================= */}
      <motion.div
        style={{ y: textY, opacity: textOpacity }}
        className="relative z-30 w-full max-w-5xl mx-auto px-4 sm:px-6 md:px-8 pt-24 sm:pt-28 md:pt-32 lg:pt-36 flex flex-col items-center text-center will-change-transform"
      >
        {/* Subtle Brand Tagline */}
        <motion.p
          initial={shouldReduceMotion ? false : { opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.0, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="font-mono text-[10px] sm:text-xs md:text-sm uppercase tracking-[0.3em] sm:tracking-[0.35em] text-[#d4af37] drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] mb-2.5 sm:mb-3.5 font-medium"
        >
          Casa Meridian
        </motion.p>

        {/* Main Headline with Rise-Up From Within Mask Effect */}
        <motion.h1
          initial={shouldReduceMotion ? false : "hidden"}
          animate="visible"
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.08,
                delayChildren: 0.3,
              },
            },
          }}
          className="font-serif text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl tracking-tight text-white font-normal leading-[1.12] drop-shadow-[0_4px_30px_rgba(0,0,0,0.8)] max-w-4xl flex flex-wrap justify-center gap-x-[0.28em] sm:gap-x-[0.3em]"
          style={{ fontFamily: "var(--font-fraunces), 'Playfair Display', Georgia, serif" }}
        >
          {["Wake", "up", "to", "the", "waves."].map((word, idx) => (
            <span
              key={idx}
              className="inline-block overflow-hidden pb-1.5 sm:pb-2.5 -mb-1.5 sm:-mb-2.5"
            >
              <motion.span
                variants={{
                  hidden: { y: "125%", opacity: 0 },
                  visible: {
                    y: "0%",
                    opacity: 1,
                    transition: {
                      duration: 1.1,
                      ease: [0.16, 1, 0.3, 1],
                    },
                  },
                }}
                className="inline-block"
              >
                {word}
              </motion.span>
            </span>
          ))}
        </motion.h1>

        {/* Supporting Line (Day / Night Adaptive) */}
        <motion.p
          key={mode}
          initial={shouldReduceMotion ? false : { opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="font-serif italic text-sm sm:text-lg md:text-xl lg:text-2xl text-white/90 font-light tracking-wide drop-shadow-[0_2px_14px_rgba(0,0,0,0.8)] max-w-xl sm:max-w-2xl mt-2 sm:mt-3"
          style={{ fontFamily: "var(--font-fraunces), 'Playfair Display', Georgia, serif" }}
        >
          {mode === "night"
            ? "A serene oceanfront sanctuary beneath the moonlit coast"
            : "A private oceanfront sanctuary on the sun-drenched coast"}
        </motion.p>
      </motion.div>

      {/* =========================================================================
          CONTROLS: Minimal Scroll Indicator & Ambient Ocean Sound Toggle
         ========================================================================= */}
      {/* Scroll to explore cue */}
      <motion.div
        initial={shouldReduceMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.0, delay: 0.8 }}
        style={{ opacity: textOpacity }}
        className="relative z-30 pb-4 sm:pb-6 flex flex-col items-center gap-1.5 pointer-events-none text-white/75"
      >
        <span className="font-mono text-[9px] sm:text-[10px] tracking-[0.28em] uppercase font-light drop-shadow-md">
          Scroll to explore
        </span>
        <div className="w-3.5 h-6 sm:w-4 sm:h-7 border border-white/30 rounded-full flex justify-center pt-1 backdrop-blur-xs bg-black/10">
          <div className="w-1 h-1.5 bg-white/90 rounded-full animate-bounce" />
        </div>
      </motion.div>

      {/* Audio Mute/Unmute Toggle */}
      <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 md:bottom-8 md:left-8 z-30">
        <button
          type="button"
          onClick={toggleSound}
          aria-label={isMuted ? "Unmute ocean waves" : "Mute ocean waves"}
          className="flex items-center gap-2 bg-black/40 hover:bg-black/60 backdrop-blur-md border border-white/20 hover:border-amber-300/60 text-white hover:text-amber-300 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-full transition-all duration-300 shadow-lg cursor-pointer group"
        >
          {isMuted ? (
            <VolumeX className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white/80 group-hover:scale-110 transition-transform" />
          ) : (
            <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#d4af37] animate-pulse group-hover:scale-110 transition-transform" />
          )}
          <span className="font-mono text-[9px] sm:text-[10px] tracking-wider uppercase">
            {isMuted ? "Sound Off" : mode === "night" ? "Night Waves" : "Ocean Sound"}
          </span>
        </button>
      </div>
    </section>
  );
}
