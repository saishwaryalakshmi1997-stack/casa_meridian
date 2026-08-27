"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function HeroSection() {
  const containerRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);
  const [isMuted, setIsMuted] = useState<boolean>(true);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Intro entrance timeline
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      // Fade in & rise up animations
      tl.fromTo(
        titleRef.current,
        { opacity: 0, y: 50, filter: "blur(6px)" },
        { opacity: 1, y: 0, filter: "blur(0px)", duration: 1.3, delay: 0.3 }
      )
        .fromTo(
          subtitleRef.current,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 1.1 },
          "-=0.8"
        )
        .fromTo(
          scrollIndicatorRef.current,
          { opacity: 0, y: 15 },
          { opacity: 1, y: 0, duration: 0.9 },
          "-=0.5"
        );

      // ScrollTrigger Parallax effect on scroll
      if (containerRef.current) {
        gsap.to([titleRef.current, subtitleRef.current], {
          y: -60,
          opacity: 0,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: "60% top",
            scrub: true,
          },
        });

        if (videoRef.current) {
          gsap.to(videoRef.current, {
            scale: 1.05,
            ease: "none",
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top top",
              end: "bottom top",
              scrub: true,
            },
          });
        }
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const toggleSound = () => {
    if (!videoRef.current) return;
    const nextMuted = !isMuted;
    videoRef.current.muted = nextMuted;
    setIsMuted(nextMuted);

    if (!nextMuted) {
      videoRef.current.play().catch(() => {});
    }
  };

  return (
    <section
      ref={containerRef}
      className="relative w-full h-[100svh] min-h-[550px] overflow-hidden flex flex-col items-center justify-between text-white select-none bg-black"
    >
      {/* Background Video Layers */}
      <div className="absolute inset-0 w-full h-full overflow-hidden flex items-center justify-center">
        {/* Ambient Blur Layer for Mobile (fills background nicely without black bars) */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover blur-2xl opacity-50 md:hidden scale-110 pointer-events-none"
        >
          <source src="/walkthrough.mp4" type="video/mp4" />
        </video>

        {/* Complete Foreground Video */}
        <video
          ref={videoRef}
          autoPlay
          loop
          muted={isMuted}
          playsInline
          className="relative w-full h-full object-contain sm:object-cover object-center will-change-transform z-0"
        >
          <source src="/walkthrough.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Top and Bottom atmospheric gradient overlays for text readability */}
        <div className="absolute inset-x-0 top-0 h-44 sm:h-56 bg-gradient-to-b from-black/80 via-black/40 to-transparent pointer-events-none z-10" />
        <div className="absolute inset-x-0 bottom-0 h-36 sm:h-48 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none z-10" />
      </div>

      {/* Main Typography - Top Half */}
      <div className="relative z-20 text-center px-4 sm:px-6 md:px-8 max-w-5xl mx-auto flex flex-col items-center pt-24 sm:pt-28 md:pt-32 lg:pt-36">
        <h1
          ref={titleRef}
          className="opacity-0 font-serif text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl tracking-[0.06em] sm:tracking-[0.08em] md:tracking-[0.1em] font-normal uppercase text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.8)] leading-tight mb-2 sm:mb-3"
          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
        >
          Wake Up to the Waves
        </h1>

        <p
          ref={subtitleRef}
          className="opacity-0 font-serif italic text-base sm:text-xl md:text-2xl lg:text-3xl text-white/95 tracking-wide drop-shadow-[0_2px_12px_rgba(0,0,0,0.7)] font-light max-w-2xl"
          style={{
            fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif",
          }}
        >
          A private coastal escape
        </p>
      </div>

      {/* Bottom Center Scroll Indicator */}
      <div className="relative z-20 w-full max-w-7xl mx-auto px-6 sm:px-10 pb-6 sm:pb-8 flex items-center justify-center pointer-events-none">
        <div
          ref={scrollIndicatorRef}
          className="flex flex-col items-center gap-1.5 sm:gap-2 text-white/80 opacity-0"
        >
          <span className="text-[9px] sm:text-[11px] uppercase tracking-[0.25em] sm:tracking-[0.3em] font-light drop-shadow">
            Scroll to Explore
          </span>
          <div className="w-4 h-7 sm:w-5 sm:h-8 border border-white/40 rounded-full flex justify-center pt-1 sm:pt-1.5 backdrop-blur-xs bg-black/20 shadow-md">
            <div className="w-1 h-1.5 sm:h-2 bg-white rounded-full animate-bounce" />
          </div>
        </div>
      </div>

      {/* Bottom Right Mute/Sound Badge - Positioned Directly Over Bottom-Right Watermark */}
      <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 md:bottom-8 md:right-8 z-30">
        <button
          onClick={toggleSound}
          aria-label={isMuted ? "Unmute video sound" : "Mute video sound"}
          className="flex items-center gap-2.5 bg-[#08121a] hover:bg-[#0c1a24] backdrop-blur-xl border border-white/25 hover:border-amber-300/80 text-white hover:text-amber-300 px-4 py-2.5 rounded-full transition-all duration-300 shadow-[0_4px_25px_rgba(0,0,0,0.9)] group cursor-pointer"
        >
          {isMuted ? (
            /* Muted Speaker Icon */
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="group-hover:scale-110 transition-transform text-white/90"
            >
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              <line x1="23" y1="9" x2="17" y2="15" />
              <line x1="17" y1="9" x2="23" y2="15" />
            </svg>
          ) : (
            /* Unmuted Speaker Icon */
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-amber-300 group-hover:scale-110 transition-transform animate-pulse"
            >
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
            </svg>
          )}
          <span className="font-mono text-[10px] sm:text-xs tracking-wider uppercase font-medium">
            {isMuted ? "Unmute" : "Sound On"}
          </span>
        </button>
      </div>
    </section>
  );
}
