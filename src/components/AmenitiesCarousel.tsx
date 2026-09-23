"use client";

import React, { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import { useDayNight } from "./DayNightContext";

interface Amenity {
  id: string;
  category: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  rotation: number; // fixed tilt in degrees (like photos dropped on a table)
  yJitter: number;  // fixed vertical jitter in px
  isFeatured?: boolean;
  featuredBadge?: string;
}

const COLORS = {
  ink: "#141e25",
  sand: "#ece7de",
  brass: "#b8935a",
  foam: "#f5f2eb",
};

const AMENITIES: Amenity[] = [
  {
    id: "pool",
    title: "Infinity Pool",
    category: "Water & Ocean",
    description:
      "A private infinity pool on the first floor, framed by the ocean — open any time of day.",
    rotation: -2.4,
    yJitter: 32,
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
        <path d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
        <path d="M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
      </svg>
    ),
  },
  {
    id: "views",
    title: "Beach & Garden Views",
    category: "Coastal Perspectives",
    description:
      "Garden-view rooms on the ground floor, beach-view balcony rooms above — take your pick.",
    rotation: -1.2,
    yJitter: 38,
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2" />
        <path d="M12 20v2" />
        <path d="m4.93 4.93 1.41 1.41" />
        <path d="m17.66 17.66 1.41 1.41" />
        <path d="M2 12h2" />
        <path d="M20 12h2" />
        <path d="m6.34 17.66-1.41 1.41" />
        <path d="m19.07 4.93-1.41 1.41" />
      </svg>
    ),
  },
  {
    id: "chef",
    title: "In-House Chef & Restaurant",
    category: "✦ Culinary Sanctuary",
    description:
      "Personalised meals from a dedicated chef, with an in-house restaurant available on request.",
    rotation: 1.8,
    yJitter: 26,
    isFeatured: true,
    featuredBadge: "★ SIGNATURE PRIVILEGE",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M6 13.87A4 4 0 0 1 7.41 6a5.11 5.11 0 0 1 1.05-1.54 5 5 0 0 1 7.08 0A5.11 5.11 0 0 1 16.59 6 4 4 0 0 1 18 13.87V21H6Z" />
        <line x1="6" y1="17" x2="18" y2="17" />
      </svg>
    ),
  },
  {
    id: "speakers",
    title: "Premium Speakers",
    category: "Acoustic Atmosphere",
    description:
      "High-quality speakers throughout the villa, ready for a night in with good music.",
    rotation: 2.6,
    yJitter: 42,
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect width="16" height="20" x="4" y="2" rx="2" />
        <circle cx="12" cy="14" r="4" />
        <line x1="12" y1="6" x2="12.01" y2="6" />
      </svg>
    ),
  },
  {
    id: "games",
    title: "Board Games",
    category: "Leisure & Gatherings",
    description:
      "A curated collection on hand for evenings that run long with family and friends.",
    rotation: -2.8,
    yJitter: 30,
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect width="18" height="18" x="3" y="3" rx="2" />
        <path d="M3 9h18" />
        <path d="M9 21V9" />
      </svg>
    ),
  },
  {
    id: "villa",
    title: "Spacious 5BHK Villa",
    category: "Private Residence",
    description:
      "Four floors, thoughtfully laid out for comfort, privacy, and a stay you won't forget.",
    rotation: 1.5,
    yJitter: 36,
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
];

// Card dimensions: compact ~340px square cards to fit comfortably in one screen view
const CARD_WIDTH = 340;
const CHEF_INDEX = 2; // "In-House Chef & Restaurant" (★ SIGNATURE PRIVILEGE)
const AUTO_PLAY_INTERVAL = 3800; // 3.8 seconds per privilege

export default function AmenitiesCarousel() {
  const [activeIndex, setActiveIndex] = useState<number>(CHEF_INDEX);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const hasMounted = useRef<boolean>(false);
  const { mode } = useDayNight();

  const goPrev = () => {
    setActiveIndex((prev) => (prev - 1 + AMENITIES.length) % AMENITIES.length);
  };

  const goNext = () => {
    setActiveIndex((prev) => (prev + 1) % AMENITIES.length);
  };

  // 1. When scrolling to the amenities section, fix the view on the In-House Chef card
  useEffect(() => {
    const section = document.getElementById("amenities");
    if (!section) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveIndex(CHEF_INDEX);
          }
        });
      },
      { threshold: 0.3 }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  // 2. Automatically move in a time frame (pauses on hover so user can read)
  useEffect(() => {
    if (isHovered) return;

    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % AMENITIES.length);
    }, AUTO_PLAY_INTERVAL);

    return () => clearInterval(timer);
  }, [isHovered, activeIndex]);

  useEffect(() => {
    AMENITIES.forEach((amenity, i) => {
      const el = cardRefs.current[i];
      if (!el) return;

      const diff = i - activeIndex;
      const absDiff = Math.abs(diff);

      let target: gsap.TweenVars = {};

      if (diff === 0) {
        // Active card: x: 0, y: 0, rotation: 0°, scale: 1.0, zIndex: 5, bg: ink, color: foam
        target = {
          x: 0,
          y: 0,
          rotation: 0,
          scale: 1.0,
          zIndex: 5,
          backgroundColor: COLORS.ink,
          color: COLORS.foam,
          opacity: 1,
          pointerEvents: "auto",
        };
      } else if (absDiff === 1) {
        // ±1 neighbor: x: ±65% of card width, scaled jitter (+15 to +25px), rotation: fixed tilt, scale: 0.96
        target = {
          x: diff * (CARD_WIDTH * 0.65),
          y: amenity.yJitter * 0.6,
          rotation: amenity.rotation,
          scale: 0.96,
          zIndex: 3,
          backgroundColor: COLORS.foam,
          color: COLORS.ink,
          opacity: 1,
          pointerEvents: "auto",
        };
      } else if (absDiff === 2) {
        // ±2 neighbor: scaled jitter, rotation: fixed tilt * 1.25, scale: 0.92
        const xStep1 = CARD_WIDTH * 0.65;
        const xStep2 = CARD_WIDTH * 0.58;
        target = {
          x: Math.sign(diff) * (xStep1 + xStep2),
          y: (amenity.yJitter + 18) * 0.6,
          rotation: amenity.rotation * 1.25,
          scale: 0.92,
          zIndex: 2,
          backgroundColor: COLORS.foam,
          color: COLORS.ink,
          opacity: 0.8,
          pointerEvents: "auto",
        };
      } else {
        // Hidden
        target = {
          x: Math.sign(diff) * (CARD_WIDTH * 1.8),
          y: 40,
          rotation: amenity.rotation * 1.4,
          scale: 0.88,
          zIndex: 1,
          opacity: 0,
          pointerEvents: "none",
        };
      }

      if (!hasMounted.current) {
        gsap.set(el, target);
      } else {
        gsap.to(el, {
          ...target,
          duration: 0.65,
          ease: "power3.out",
          overwrite: "auto",
        });
      }
    });

    if (!hasMounted.current) {
      hasMounted.current = true;
    }
  }, [activeIndex]);

  return (
    <div className="w-full flex flex-col items-center select-none overflow-visible">
      {/* Stage Container: Holds ~340px square cards (pauses auto-play on hover) */}
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="relative w-full h-[340px] sm:h-[360px] md:h-[375px] overflow-visible flex items-center justify-center"
      >
        {AMENITIES.map((amenity, index) => {
          const isActive = index === activeIndex;

          return (
            <div
              key={index}
              ref={(el) => {
                cardRefs.current[index] = el;
              }}
              onClick={() => setActiveIndex(index)}
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                width: "min(340px, 84vw)",
                height: "min(340px, 84vw)",
                marginLeft: "calc(-1 * min(340px, 84vw) / 2)",
                marginTop: "calc(-1 * min(340px, 84vw) / 2)",
                cursor: "pointer",
                borderRadius: "18px",
                border: isActive
                  ? "1.5px solid rgba(184, 147, 90, 0.75)"
                  : "1px solid rgba(0, 0, 0, 0.08)",
                boxShadow: isActive
                  ? "0 22px 55px -12px rgba(0, 0, 0, 0.45)"
                  : "0 8px 24px -6px rgba(0, 0, 0, 0.08)",
                willChange: "transform, opacity",
                fontFamily: "var(--font-inter), sans-serif",
              }}
              className="p-6 sm:p-7 md:p-8 flex flex-col justify-between"
            >
              {/* Top: Icon in a circular badge */}
              <div className="flex items-center">
                <div
                  className="w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-colors duration-300 border"
                  style={{
                    backgroundColor: isActive
                      ? "rgba(184, 147, 90, 0.2)"
                      : "rgba(0, 0, 0, 0.04)",
                    borderColor: isActive
                      ? "rgba(184, 147, 90, 0.45)"
                      : "rgba(0, 0, 0, 0.08)",
                    color: isActive ? COLORS.brass : COLORS.ink,
                  }}
                >
                  {amenity.icon}
                </div>
              </div>

              {/* Middle: Title & Description text */}
              <div className="my-auto py-2">
                <h3
                  className="text-xl sm:text-2xl font-normal tracking-tight mb-2.5"
                  style={{
                    fontFamily:
                      "var(--font-fraunces), 'Playfair Display', Georgia, serif",
                  }}
                >
                  {amenity.title}
                </h3>
                <p
                  className="text-xs sm:text-[13px] md:text-sm leading-relaxed"
                  style={{
                    opacity: isActive ? 0.9 : 0.75,
                  }}
                >
                  {amenity.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Arrow Buttons & Dot Pagination: Smooth transition through time frame */}
      <div className="flex items-center justify-center gap-3 sm:gap-4 mt-2 sm:mt-3">
        <button
          onClick={goPrev}
          aria-label="Previous amenity"
          className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full border flex items-center justify-center transition-all duration-200 cursor-pointer active:scale-95 ${mode === "day"
            ? "border-black/25 text-slate-700 hover:border-[#b8935a] hover:text-[#b8935a] hover:bg-white"
            : "border-white/30 text-white/80 hover:border-[#b8935a] hover:text-[#b8935a] hover:bg-white/10"
            }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>

        {/* Dynamic Dot Indicators */}
        <div className="flex items-center gap-1.5 sm:gap-2 px-1">
          {AMENITIES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIndex(idx)}
              aria-label={`Go to amenity ${idx + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${activeIndex === idx
                ? "w-6 bg-[#b8935a]"
                : mode === "day"
                  ? "w-1.5 bg-black/20 hover:bg-black/40"
                  : "w-1.5 bg-white/20 hover:bg-white/40"
                }`}
            />
          ))}
        </div>

        <button
          onClick={goNext}
          aria-label="Next amenity"
          className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full border flex items-center justify-center transition-all duration-200 cursor-pointer active:scale-95 ${mode === "day"
            ? "border-black/25 text-slate-700 hover:border-[#b8935a] hover:text-[#b8935a] hover:bg-white"
            : "border-white/30 text-white/80 hover:border-[#b8935a] hover:text-[#b8935a] hover:bg-white/10"
            }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>
    </div>
  );
}
