"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import gsap from "gsap";

import { useDayNight } from "./DayNightContext";
import SplitTextReveal from "./SplitTextReveal";

const galleryImages = [
  { id: "exterior", image: "/casa_exterior.png", alt: "Casa Meridian Exterior at Golden Hour" },
  { id: "pool", image: "/infinity_pool.webp", alt: "First-floor Infinity Edge Pool" },
  { id: "bedroom", image: "/bedroom.webp", alt: "Oceanview Master Bedroom" },
  { id: "terrace-day", image: "/terrace_day.png", alt: "Sunlit Sea Terrace Deck" },
  { id: "lounge", image: "/lounge.webp", alt: "Sunken Ocean Lounge" },
  { id: "kitchen", image: "/kitchen.webp", alt: "Open Kitchen & Dining" },
  { id: "terrace-night", image: "/terrace_night.png", alt: "Moonlit Terrace by the Ocean" },
  { id: "guest-lounge", image: "/guest_lounge.webp", alt: "Airy Living Space" },
  { id: "low-sit", image: "/low_sit.webp", alt: "Cozy Low-Seating Corner" },
  { id: "bench", image: "/bench.webp", alt: "Quiet Garden Teak Bench" },
  { id: "entrance", image: "/casa_entrance.png", alt: "Tropical Garden Entrance" },
  { id: "rooftop", image: "/rooftop_puppy.png", alt: "Rooftop Ocean Observatory" },
];

// Initial frame matching user screenshot: centered on /terrace_day.png
const INITIAL_FRAME_INDEX = 3;

function clamp(val: number, min: number, max: number) {
  return Math.max(min, Math.min(max, val));
}

export default function GallerySection() {
  const { mode } = useDayNight();
  const isDay = mode === "day";

  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [activeIndex, setActiveIndex] = useState(INITIAL_FRAME_INDEX);
  const [mounted, setMounted] = useState(false);

  const sectionRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Start initial frame fixed on index 3 (/terrace_day.png)
  const dragProgressRef = useRef(INITIAL_FRAME_INDEX);
  const tweenRef = useRef<gsap.core.Tween | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const getCardStepPx = useCallback(() => {
    if (typeof window === "undefined") return 350;
    return window.innerWidth < 768 ? 250 : 350;
  }, []);

  const render = useCallback(() => {
    if (!cardRefs.current.length) return;
    const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
    const maxRot = isMobile ? 18 : 28;
    const rotFactor = isMobile ? -9 : -14;
    const cardStep = isMobile ? 250 : 350;

    const currentProgress = dragProgressRef.current;
    setActiveIndex(Math.round(clamp(currentProgress, 0, galleryImages.length - 1)));

    cardRefs.current.forEach((card, i) => {
      if (!card) return;
      const diff = i - currentProgress;
      const rotateY = clamp(diff * rotFactor, -maxRot, maxRot);
      const scale = 1 - Math.min(Math.abs(diff) * 0.08, 0.25);
      const opacity = 1 - Math.min(Math.abs(diff) * 0.15, 0.7);
      const x = diff * cardStep;
      const zIndex = 100 - Math.round(Math.abs(diff) * 10);

      gsap.set(card, {
        xPercent: -50,
        yPercent: -50,
        x,
        rotateY,
        transformPerspective: 1000,
        scale,
        opacity: Math.max(0.2, opacity),
        transformOrigin: "center center",
        zIndex,
      });
    });
  }, []);

  const snapToIndex = useCallback((index: number) => {
    if (tweenRef.current) tweenRef.current.kill();
    const maxIdx = galleryImages.length - 1;
    const target = clamp(index, 0, maxIdx);

    const proxy = { progress: dragProgressRef.current };
    tweenRef.current = gsap.to(proxy, {
      progress: target,
      duration: 0.5,
      ease: "power2.out",
      onUpdate: () => {
        dragProgressRef.current = proxy.progress;
        render();
      },
    });
  }, [render]);

  // 1. Horizontal scroll works ONLY on hovering and scrolling inside the gallery section
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const onWheel = (e: WheelEvent) => {
      const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      if (Math.abs(delta) < 2) return;

      const maxIdx = galleryImages.length - 1;
      const current = dragProgressRef.current;

      // Allow natural page scroll to resume if user reaches ends
      if ((delta < 0 && current <= 0.05) || (delta > 0 && current >= maxIdx - 0.05)) {
        return;
      }

      // Intercept wheel while hovering over gallery to scroll horizontally
      e.preventDefault();

      if (tweenRef.current) tweenRef.current.kill();

      const cardStep = getCardStepPx();
      const stepDelta = (delta / cardStep) * 0.45;
      dragProgressRef.current = clamp(dragProgressRef.current + stepDelta, 0, maxIdx);
      render();
    };

    stage.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      stage.removeEventListener("wheel", onWheel);
    };
  }, [getCardStepPx, render]);

  // Initial render on mount & resize
  useEffect(() => {
    dragProgressRef.current = INITIAL_FRAME_INDEX;
    render();
    const handleResize = () => render();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      if (tweenRef.current) tweenRef.current.kill();
    };
  }, [render]);

  // 2. Prevent background scroll while overlay is open
  useEffect(() => {
    if (selectedImageIndex !== null) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedImageIndex]);

  // 3. Keyboard navigation for image overlay (ArrowLeft, ArrowRight, Escape)
  useEffect(() => {
    if (selectedImageIndex === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedImageIndex(null);
      } else if (e.key === "ArrowLeft") {
        setSelectedImageIndex((prev) =>
          prev !== null ? (prev - 1 + galleryImages.length) % galleryImages.length : null
        );
      } else if (e.key === "ArrowRight") {
        setSelectedImageIndex((prev) =>
          prev !== null ? (prev + 1) % galleryImages.length : null
        );
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedImageIndex]);

  const openImage = (index: number) => {
    setSelectedImageIndex(index);
  };

  return (
    <section
      ref={sectionRef}
      id="gallery"
      className={`relative w-full py-16 sm:py-20 md:py-24 overflow-hidden select-none transition-colors duration-700 ${isDay ? "bg-[#f4efe6] text-slate-900" : "bg-[#060e14] text-[#f6f3ec]"
        }`}
    >
      {/* Ambient Glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] sm:w-[1000px] h-[450px] rounded-full blur-[140px] opacity-25 transition-colors duration-700 ${isDay ? "bg-[#d4b982]" : "bg-[#18394a]"
            }`}
        />
      </div>

      {/* Top Editorial Header Bar */}
      <div className="relative z-10 max-w-4xl mx-auto text-center px-6 mb-4 sm:mb-6">
        <h2
          className="text-2xl sm:text-4xl md:text-5xl font-light font-serif tracking-tight leading-[1.15]"
          style={{ fontFamily: "var(--font-fraunces), 'Playfair Display', Georgia, serif" }}
        >
          <SplitTextReveal text="Memories in motion," delay={0.1} />{" "}
          <span className="italic block sm:inline text-[#b8935a]">
            <SplitTextReveal text="framed with care" delay={0.25} />
          </span>
        </h2>
      </div>

      {/* Structure: .gallery-stage */}
      <div
        ref={stageRef}
        onClick={(e) => {
          const cardEl = (e.target as HTMLElement)?.closest(".gallery-card");
          if (cardEl) {
            const idx = cardRefs.current.indexOf(cardEl as HTMLDivElement);
            if (idx !== -1) {
              openImage(idx);
              return;
            }
          }
          if (!stageRef.current) return;
          const rect = stageRef.current.getBoundingClientRect();
          const clickX = e.clientX - rect.left - rect.width / 2;
          const cardStep = getCardStepPx();
          const estimatedIndex = Math.round(dragProgressRef.current + clickX / cardStep);
          const clampedIndex = clamp(estimatedIndex, 0, galleryImages.length - 1);
          openImage(clampedIndex);
        }}
        className="gallery-stage relative w-full h-[400px] sm:h-[480px] md:h-[520px] my-auto overflow-hidden flex items-center justify-center cursor-pointer"
      >
        {/* Soft edge gradient fades */}
        <div
          className={`absolute left-0 top-0 bottom-0 w-16 sm:w-28 z-20 pointer-events-none transition-colors duration-700 ${isDay
            ? "bg-gradient-to-r from-[#f4efe6] via-[#f4efe6]/80 to-transparent"
            : "bg-gradient-to-r from-[#060e14] via-[#060e14]/80 to-transparent"
            }`}
        />
        <div
          className={`absolute right-0 top-0 bottom-0 w-16 sm:w-28 z-20 pointer-events-none transition-colors duration-700 ${isDay
            ? "bg-gradient-to-l from-[#f4efe6] via-[#f4efe6]/80 to-transparent"
            : "bg-gradient-to-l from-[#060e14] via-[#060e14]/80 to-transparent"
            }`}
        />

        {/* Structure: .gallery-track (pointer-events-none so it doesn't swallow card clicks) */}
        <div
          className="gallery-track pointer-events-none relative w-full h-full flex items-center justify-center"
        >
          {galleryImages.map((item, i) => (
            <div
              key={item.id}
              ref={(el) => {
                cardRefs.current[i] = el;
              }}
              onClick={(e) => {
                e.stopPropagation();
                openImage(i);
              }}
              className={`gallery-card pointer-events-auto absolute top-1/2 left-1/2 w-[220px] sm:w-[280px] md:w-[320px] aspect-[3/4] rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border transition-colors duration-500 will-change-transform cursor-pointer group ${isDay
                ? "border-black/10 bg-white shadow-black/15 hover:border-[#b8935a]"
                : "border-white/15 bg-[#0a1720] shadow-black/80 hover:border-[#b8935a]"
                }`}
            >
              {/* Native interactive button over whole card surface */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  openImage(i);
                }}
                className="absolute inset-0 w-full h-full z-20 cursor-pointer bg-transparent border-0 p-0 m-0 focus:outline-none"
                aria-label={`Open picture: ${item.alt}`}
              />

              {/* Inner Image Container */}
              <div className="gallery-card-img relative w-full h-full overflow-hidden pointer-events-none">
                <Image
                  src={item.image}
                  alt={item.alt}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105 pointer-events-none"
                  sizes="(max-width: 768px) 240px, 340px"
                  draggable={false}
                  priority={i === 0 || i === 1 || i === INITIAL_FRAME_INDEX}
                />

                {/* Subtle Luxury Gradient Overlay & Inner Hairline */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-40 pointer-events-none" />
                <div className="absolute inset-0 rounded-2xl sm:rounded-3xl border border-white/20 pointer-events-none" />

                {/* Subtle Click-to-Expand Cue on Hover */}
                <div className="absolute bottom-3 inset-x-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                  <span className="font-mono text-[9px] uppercase tracking-widest text-white bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/20 shadow-md">
                    Click to Open Full
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Controls & Dot Indicators */}
      <div className="relative z-10 max-w-xl mx-auto w-full px-6 mt-4 sm:mt-6 flex items-center justify-between">
        <button
          onClick={() => snapToIndex(activeIndex - 1)}
          disabled={activeIndex <= 0}
          aria-label="Previous image"
          className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full border flex items-center justify-center font-mono text-sm transition-all duration-300 cursor-pointer ${activeIndex <= 0
            ? "opacity-30 cursor-not-allowed border-black/10 dark:border-white/10"
            : isDay
              ? "border-black/20 hover:border-[#b8935a] hover:text-[#b8935a] text-slate-800 hover:bg-white"
              : "border-white/20 hover:border-[#b8935a] hover:text-[#b8935a] text-white hover:bg-white/10"
            }`}
        >
          ←
        </button>

        {/* Dots */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {galleryImages.map((_, idx) => (
            <button
              key={idx}
              onClick={() => snapToIndex(idx)}
              aria-label={`Jump to slide ${idx + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${activeIndex === idx
                ? "w-6 bg-[#b8935a]"
                : isDay
                  ? "w-1.5 bg-black/20 hover:bg-black/40"
                  : "w-1.5 bg-white/20 hover:bg-white/40"
                }`}
            />
          ))}
        </div>

        <button
          onClick={() => snapToIndex(activeIndex + 1)}
          disabled={activeIndex >= galleryImages.length - 1}
          aria-label="Next image"
          className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full border flex items-center justify-center font-mono text-sm transition-all duration-300 cursor-pointer ${activeIndex >= galleryImages.length - 1
            ? "opacity-30 cursor-not-allowed border-black/10 dark:border-white/10"
            : isDay
              ? "border-black/20 hover:border-[#b8935a] hover:text-[#b8935a] text-slate-800 hover:bg-white"
              : "border-white/20 hover:border-[#b8935a] hover:text-[#b8935a] text-white hover:bg-white/10"
            }`}
        >
          →
        </button>
      </div>

      {/* Lightbox Modal Overlay (Directly mounted to document.body via Portal for 100% full view) */}
      {mounted && typeof document !== "undefined" && document.body && selectedImageIndex !== null && createPortal(
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[9999999] flex items-center justify-center bg-black/95 backdrop-blur-2xl p-4 sm:p-8"
          style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, width: "100vw", height: "100vh" }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setSelectedImageIndex(null);
            }
          }}
        >
          {/* Top Bar with Counter & Close Button */}
          <div className="absolute top-0 inset-x-0 p-4 sm:p-6 md:p-8 flex items-center justify-between z-30 pointer-events-none">
            <span className="font-mono text-xs sm:text-sm tracking-[0.25em] text-[#b8935a] uppercase font-semibold pointer-events-auto bg-black/60 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/20">
              ✦ {selectedImageIndex + 1 < 10 ? `0${selectedImageIndex + 1}` : selectedImageIndex + 1} / {galleryImages.length < 10 ? `0${galleryImages.length}` : galleryImages.length}
            </span>

            <button
              type="button"
              onClick={() => setSelectedImageIndex(null)}
              aria-label="Close image overlay"
              className="pointer-events-auto w-11 h-11 sm:w-13 sm:h-13 rounded-full border border-white/30 bg-black/70 hover:bg-white/20 hover:border-white/60 flex items-center justify-center text-white text-xl transition-all duration-200 cursor-pointer shadow-xl backdrop-blur-md"
            >
              ✕
            </button>
          </div>

          {/* Previous Arrow Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedImageIndex((prev) =>
                prev !== null ? (prev - 1 + galleryImages.length) % galleryImages.length : null
              );
            }}
            aria-label="Previous image"
            className="absolute left-3 sm:left-6 md:left-10 z-30 w-12 h-12 sm:w-16 sm:h-16 rounded-full border border-white/30 bg-black/70 hover:bg-[#b8935a] hover:border-[#b8935a] text-white flex items-center justify-center text-2xl sm:text-3xl transition-all duration-300 shadow-2xl cursor-pointer backdrop-blur-md group"
          >
            ‹
          </button>

          {/* Center Complete Picture Stage (True natural aspect ratio, 100% complete picture) */}
          <div
            className="relative max-w-[94vw] max-h-[88vh] flex flex-col items-center justify-center z-20"
            onClick={(e) => e.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              key={galleryImages[selectedImageIndex].image}
              src={galleryImages[selectedImageIndex].image}
              alt={galleryImages[selectedImageIndex].alt}
              className="max-w-[90vw] sm:max-w-[86vw] max-h-[78vh] sm:max-h-[82vh] w-auto h-auto object-contain rounded-xl sm:rounded-2xl shadow-2xl border border-white/20 select-none"
              style={{
                boxShadow: "0 30px 90px -10px rgba(0, 0, 0, 0.95), 0 0 40px rgba(184, 147, 90, 0.25)",
              }}
            />
            <p className="mt-3 text-white/90 text-sm sm:text-base font-serif italic text-center max-w-xl px-4 select-none">
              {galleryImages[selectedImageIndex].alt}
            </p>
          </div>

          {/* Next Arrow Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedImageIndex((prev) =>
                prev !== null ? (prev + 1) % galleryImages.length : null
              );
            }}
            aria-label="Next image"
            className="absolute right-3 sm:right-6 md:right-10 z-30 w-12 h-12 sm:w-16 sm:h-16 rounded-full border border-white/30 bg-black/70 hover:bg-[#b8935a] hover:border-[#b8935a] text-white flex items-center justify-center text-2xl sm:text-3xl transition-all duration-300 shadow-2xl cursor-pointer backdrop-blur-md group"
          >
            ›
          </button>
        </div>,
        document.body
      )}
    </section>
  );
}
