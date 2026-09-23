"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useDayNight } from "./DayNightContext";
import SplitTextReveal from "./SplitTextReveal";

interface FloorData {
  id: number;
  mark: string;
  badge: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  specs: { value: string; label: string }[];
  planRooms: { label: string; style: React.CSSProperties }[];
}

const floors: FloorData[] = [
  {
    id: 0,
    mark: "GF · GROUND FLOOR",
    badge: "GF",
    title: "Two rooms, rooted in the garden",
    description:
      "The entry level opens onto a private garden rather than the road — two bedrooms set back from the shoreline breeze, built for arrival and stillness before the climb toward the water begins.",
    image: "/entrance.webp",
    imageAlt: "Casa Meridian Ground Floor Private Garden & Entrance",
    specs: [
      { value: "02", label: "Garden-view bedrooms" },
      { value: "GF", label: "Private entry level" },
    ],
    planRooms: [
      { label: "RM 01", style: { left: "0%", top: "0%", width: "44%", height: "48%" } },
      { label: "RM 02", style: { left: "0%", top: "54%", width: "44%", height: "46%" } },
      {
        label: "GARDEN",
        style: {
          left: "50%",
          top: "0%",
          width: "50%",
          height: "100%",
          borderColor: "rgba(212,175,55,0.7)",
          background: "rgba(212,175,55,0.08)",
        },
      },
    ],
  },
  {
    id: 1,
    mark: "01 · FIRST FLOOR",
    badge: "01",
    title: "Living, dining, and the infinity edge",
    description:
      "The heart of the villa — open living and dining space, a working kitchen, and an infinity pool that erases the line between the water in the basin and the water on the horizon.",
    image: "/infinity_pool.webp",
    imageAlt: "Casa Meridian First Floor Infinity Pool and Living Hall",
    specs: [
      { value: "1", label: "Living & dining hall" },
      { value: "∞", label: "Infinity-edge pool" },
    ],
    planRooms: [
      { label: "LIVING", style: { left: "0%", top: "0%", width: "60%", height: "58%" } },
      { label: "DINING", style: { left: "0%", top: "64%", width: "60%", height: "36%" } },
      {
        label: "POOL",
        style: {
          left: "66%",
          top: "0%",
          width: "34%",
          height: "100%",
          borderColor: "rgba(56,189,248,0.7)",
          background: "rgba(56,189,248,0.12)",
        },
      },
    ],
  },
  {
    id: 2,
    mark: "02 · SECOND FLOOR",
    badge: "02",
    title: "Two balconies, facing the beach",
    description:
      "Higher above the treeline, this level holds two bedrooms with private balconies angled directly at the beach — close enough to hear the surf from bed.",
    image: "/bedroom.webp",
    imageAlt: "Casa Meridian Second Floor Beach View Balcony Bedroom",
    specs: [
      { value: "02", label: "Beach-view balcony rooms" },
      { value: "02", label: "Second floor level" },
    ],
    planRooms: [
      { label: "RM 03", style: { left: "0%", top: "6%", width: "44%", height: "42%" } },
      { label: "RM 04", style: { left: "0%", top: "54%", width: "44%", height: "42%" } },
      {
        label: "BALCONY",
        style: {
          left: "50%",
          top: "0%",
          width: "50%",
          height: "100%",
          borderColor: "rgba(212,175,55,0.7)",
          background: "rgba(212,175,55,0.08)",
        },
      },
    ],
  },
  {
    id: 3,
    mark: "03 · ROOFTOP DECK",
    badge: "03",
    title: "Open to the sky, framed by the sea",
    description:
      "The highest point on the villa — an open-air deck and suite where the horizon stretches uninterrupted. Made for early mornings watching the sun rise out of the Bay of Bengal, and late evenings under the starlit sky.",
    image: "/rooftop_puppy.png",
    imageAlt: "Casa Meridian Rooftop Terrace and Open-Air Suite",
    specs: [
      { value: "360°", label: "Ocean & horizon views" },
      { value: "03", label: "Rooftop deck suite" },
    ],
    planRooms: [
      {
        label: "SUITE",
        style: { left: "0%", top: "10%", width: "48%", height: "80%" },
      },
      {
        label: "ROOFTOP DECK",
        style: {
          left: "52%",
          top: "0%",
          width: "48%",
          height: "100%",
          borderColor: "rgba(212,175,55,0.7)",
          background: "rgba(212,175,55,0.12)",
        },
      },
    ],
  },
];

export default function ResidenceSection() {
  const [activeFloor, setActiveFloor] = useState<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const leftCardRef = useRef<HTMLDivElement>(null);
  const rightCardRef = useRef<HTMLDivElement>(null);
  const scrollTriggerInstanceRef = useRef<ScrollTrigger | null>(null);
  const { mode } = useDayNight();

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      if (!triggerRef.current || !containerRef.current) return;

      const isMobile = window.innerWidth < 768;
      const cardOffset = isMobile ? 80 : 160;

      // Set initial positions: cards offscreen to the left and right, header tucked above
      if (headerRef.current) {
        gsap.set(headerRef.current, { y: isMobile ? -10 : -25, opacity: 0 });
      }
      if (leftCardRef.current) {
        gsap.set(leftCardRef.current, { x: -cardOffset, opacity: 0 });
      }
      if (rightCardRef.current) {
        gsap.set(rightCardRef.current, { x: cardOffset, opacity: 0 });
      }

      // Master scrub timeline for arrival animation + floor navigation
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: triggerRef.current,
          start: "top top",
          end: "+=3600",
          pin: containerRef.current,
          pinSpacing: true,
          scrub: 0.7,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const progress = self.progress;
            // Progress 0.0 -> 0.20: Section arrives & cards slide in (Floor 0 locked)
            // Progress 0.20 -> 1.0: User scrubs through all four floors
            if (progress < 0.20) {
              setActiveFloor(0);
            } else {
              const floorProgress = Math.min(1, Math.max(0, (progress - 0.20) / 0.80));
              let index = Math.floor(floorProgress * floors.length);
              if (index >= floors.length) index = floors.length - 1;
              setActiveFloor(index);
            }
          },
        },
      });

      // 1. ARRIVAL PHASE (0 -> 0.20): Cards animate from left and right only when section arrives
      if (headerRef.current) {
        tl.to(
          headerRef.current,
          {
            y: 0,
            opacity: 1,
            ease: "power2.out",
            duration: 0.16,
          },
          0
        );
      }

      if (leftCardRef.current) {
        tl.to(
          leftCardRef.current,
          {
            x: 0,
            opacity: 1,
            ease: "power2.out",
            duration: 0.20,
          },
          0
        );
      }

      if (rightCardRef.current) {
        tl.to(
          rightCardRef.current,
          {
            x: 0,
            opacity: 1,
            ease: "power2.out",
            duration: 0.20,
          },
          0
        );
      }

      // 2. FLOOR BROWSING HOLD PHASE (0.20 -> 1.0): Cards remain settled while floors cycle
      tl.to({}, { duration: 0.80 });

      scrollTriggerInstanceRef.current = tl.scrollTrigger ?? null;
    }, triggerRef);

    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 200);

    return () => {
      clearTimeout(timer);
      ctx.revert();
    };
  }, []);

  const currentFloor = floors[activeFloor] || floors[0];

  const handleTabClick = (floorIndex: number) => {
    if (!scrollTriggerInstanceRef.current) return;
    const st = scrollTriggerInstanceRef.current;
    // Map floor click into settled 0.20 -> 1.0 range
    const targetProgress = 0.20 + ((floorIndex + 0.5) / floors.length) * 0.80;
    const targetScroll = st.start + targetProgress * (st.end - st.start);
    window.scrollTo({
      top: targetScroll,
      behavior: "smooth",
    });
  };

  return (
    <div
      ref={triggerRef}
      id="residence"
      className={`relative z-20 w-full mt-6 sm:mt-10 md:mt-14 transition-colors duration-700 ${mode === "day" ? "bg-[#ece7de]" : "bg-[#0a1a22]"
        }`}
    >
      <div
        ref={containerRef}
        className={`w-full h-[100svh] min-h-[560px] flex flex-col justify-start md:justify-between pt-20 sm:pt-22 md:pt-24 pb-4 sm:pb-5 px-3 sm:px-6 md:px-10 lg:px-16 overflow-hidden border-t select-none transition-colors duration-700 ${mode === "day"
          ? "bg-[#ece7de] text-slate-900 border-black/10"
          : "bg-[#0a1a22] text-[#f6f3ec] border-white/10"
          }`}
      >
        <div
          ref={headerRef}
          className={`w-full max-w-7xl mx-auto flex flex-col items-center md:flex-row md:items-end md:justify-between gap-2.5 md:gap-4 border-b pb-2 sm:pb-3 flex-shrink-0 transition-colors duration-700 will-change-transform ${mode === "day" ? "border-black/10" : "border-white/10"
            }`}
        >
          <div className="w-full md:w-auto text-center md:text-left">
            <h2
              className={`text-xl sm:text-2xl md:text-3xl lg:text-4xl font-normal tracking-tight leading-tight text-center md:text-left transition-colors duration-700 ${mode === "day" ? "text-slate-900" : "text-[#f6f3ec]"
                }`}
              style={{ fontFamily: "var(--font-fraunces), 'Playfair Display', Georgia, serif" }}
            >
              <SplitTextReveal text="The Residence" stagger={0.06} delay={0.1} />
            </h2>
          </div>

          <div className="flex items-center justify-center gap-2 sm:gap-2.5 flex-wrap sm:flex-nowrap flex-shrink-0 no-scrollbar w-full md:w-auto">
            {floors.map((floor) => {
              const isSelected = activeFloor === floor.id;
              return (
                <button
                  key={floor.id}
                  onClick={() => handleTabClick(floor.id)}
                  aria-label={`View ${floor.badge} - ${floor.mark}`}
                  className={`font-mono text-xs px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full border transition-all duration-300 flex-shrink-0 cursor-pointer ${isSelected
                    ? "bg-[#b8935a] text-white border-[#b8935a] font-semibold shadow-md shadow-[#b8935a]/30 scale-105"
                    : mode === "day"
                      ? "bg-white/60 text-slate-700 border-black/10 hover:border-black/30 hover:bg-white"
                      : "bg-black/30 text-white/60 border-white/20 hover:border-white/40 hover:text-white"
                    }`}
                >
                  {floor.badge}
                </button>
              );
            })}
          </div>
        </div>

        <div className="w-full max-w-xl md:max-w-7xl mx-auto flex flex-col md:grid md:grid-cols-12 gap-4 md:gap-6 lg:gap-8 items-stretch mt-3 sm:mt-4 md:my-auto py-1 sm:py-2">
          {/* LEFT: Content, Specs & Architectural Plan (col-span-6 on md/lg) */}
          <div
            ref={leftCardRef}
            className="w-full md:col-span-6 flex flex-col will-change-transform"
          >
            <div
              className={`relative rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 lg:p-7 border backdrop-blur-md shadow-xl transition-all duration-500 flex flex-col justify-between h-full gap-3 sm:gap-4 ${mode === "day"
                ? "border-[#b8935a]/40 bg-white/95 shadow-stone-300/50"
                : "border-[#b8935a]/30 bg-[#132832]/85 shadow-2xl"
                }`}
            >
              <div key={currentFloor.id} className="text-center md:text-left">
                <span
                  className={`font-mono text-[9px] sm:text-xs tracking-[0.2em] uppercase block mb-1 font-semibold transition-colors duration-700 ${mode === "day" ? "text-[#996e2e]" : "text-[#b8935a]"
                    }`}
                >
                  <SplitTextReveal text={currentFloor.mark} delay={0.05} />
                </span>

                <h3
                  className={`text-base sm:text-xl md:text-2xl lg:text-[26px] xl:text-3xl font-normal tracking-tight mb-1.5 sm:mb-2 transition-colors duration-300 leading-snug ${mode === "day" ? "text-slate-900" : "text-[#f6f3ec]"
                    }`}
                  style={{ fontFamily: "var(--font-fraunces), 'Playfair Display', Georgia, serif" }}
                >
                  <SplitTextReveal
                    text={currentFloor.title}
                    stagger={0.06}
                    delay={0.1}
                    duration={0.7}
                  />
                </h3>

                <p
                  className={`text-xs sm:text-[13px] md:text-sm lg:text-[14px] xl:text-[15px] leading-relaxed font-light transition-colors duration-300 ${mode === "day" ? "text-slate-800" : "text-slate-300"
                    }`}
                >
                  <SplitTextReveal
                    text={currentFloor.description}
                    stagger={0.02}
                    delay={0.2}
                    duration={0.6}
                  />
                </p>

                {/* Key Floor Highlights / Specs */}
                <div className="grid grid-cols-2 gap-2 sm:gap-2.5 mt-3 sm:mt-4">
                  {currentFloor.specs.map((spec, idx) => (
                    <div
                      key={idx}
                      className={`px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-lg border backdrop-blur-sm transition-colors duration-500 flex items-center gap-2 text-left ${mode === "day"
                        ? "bg-black/[0.03] border-black/10 text-slate-800"
                        : "bg-white/[0.04] border-white/10 text-slate-200"
                        }`}
                    >
                      <span className="font-mono text-xs sm:text-sm font-semibold text-[#b8935a] flex-shrink-0">
                        {spec.value}
                      </span>
                      <span className="text-[10px] sm:text-[11px] leading-tight font-light truncate">
                        {spec.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Architectural Layout Blueprint */}
              <div
                className={`p-2.5 sm:p-3 rounded-lg sm:rounded-xl border backdrop-blur-md transition-colors duration-700 mt-2 sm:mt-3 ${mode === "day"
                  ? "border-black/10 bg-stone-100/90"
                  : "border-white/10 bg-[#0c1f28]/95"
                  }`}
              >
                <div className="flex items-center justify-between mb-1 sm:mb-1.5">
                  <span className="font-mono text-[8px] sm:text-[10px] text-[#b8935a] uppercase tracking-widest font-semibold">
                    Architectural Layout
                  </span>
                  <span
                    className={`text-[8px] sm:text-[10px] font-mono transition-colors duration-700 ${mode === "day" ? "text-slate-500" : "text-white/50"
                      }`}
                  >
                    PLAN 0{currentFloor.id}
                  </span>
                </div>

                <div
                  className={`relative w-full h-12 sm:h-14 md:h-16 lg:h-18 border rounded-lg p-1 overflow-hidden transition-colors duration-700 ${mode === "day"
                    ? "border-black/10 bg-white"
                    : "border-white/15 bg-[#07131a]"
                    }`}
                >
                  {currentFloor.planRooms.map((room, idx) => (
                    <div
                      key={`${currentFloor.id}-${idx}`}
                      className="absolute border border-[#b8935a]/70 bg-[#b8935a]/10 rounded flex items-center justify-center transition-all duration-500"
                      style={room.style}
                    >
                      <span
                        className={`font-mono text-[7.5px] sm:text-[8.5px] tracking-wider font-medium text-center px-1 leading-none transition-colors duration-700 ${mode === "day" ? "text-slate-800" : "text-[#f6f3ec]/90"
                          }`}
                      >
                        {room.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Floor Picture (col-span-6 on md/lg, matching exact height) */}
          <div
            ref={rightCardRef}
            className="w-full md:col-span-6 flex flex-col will-change-transform"
          >
            <div
              className={`relative rounded-xl sm:rounded-2xl overflow-hidden border transition-all duration-700 h-full flex flex-col shadow-xl ${mode === "day"
                ? "border-black/10 bg-stone-100 shadow-[0_16px_40px_rgba(0,0,0,0.1)]"
                : "border-white/15 bg-[#10242e] shadow-[0_20px_50px_rgba(0,0,0,0.8)]"
                }`}
            >
              <div className="relative w-full h-full min-h-[220px] sm:min-h-[280px] md:min-h-0 flex-1 overflow-hidden bg-black">
                {floors.map((floor) => (
                  <div
                    key={floor.id}
                    className={`absolute inset-0 transition-all duration-700 ease-out ${activeFloor === floor.id
                      ? "opacity-100 scale-100 z-10"
                      : "opacity-0 scale-105 z-0 pointer-events-none"
                      }`}
                  >
                    <Image
                      src={floor.image}
                      alt={floor.imageAlt}
                      fill
                      className="object-cover object-center"
                      sizes="(max-width: 768px) 100vw, 50vw"
                      priority
                    />
                    <div
                      className={`absolute inset-0 pointer-events-none transition-colors duration-700 ${mode === "day"
                        ? "bg-gradient-to-t from-stone-900/40 via-transparent to-black/20"
                        : "bg-gradient-to-t from-[#0a1a22] via-transparent to-black/30"
                        }`}
                    />
                  </div>
                ))}

                <div className="absolute top-2.5 left-2.5 sm:top-3.5 sm:left-3.5 z-20">
                  <span className="font-mono text-[9px] sm:text-[11px] tracking-[0.2em] uppercase text-white bg-black/65 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 shadow-md">
                    <SplitTextReveal text={currentFloor.mark} delay={0.05} />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
