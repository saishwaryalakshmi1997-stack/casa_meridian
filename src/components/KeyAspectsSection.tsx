"use client";

import { useRef } from "react";
import Image from "next/image";
import {
  motion,
  useScroll,
  useTransform,
  MotionValue,
} from "framer-motion";
import { useDayNight } from "./DayNightContext";
import SplitTextReveal from "./SplitTextReveal";
import { Sun, Sunset, Waves, Coffee } from "lucide-react";

interface MomentItem {
  id: string;
  number: string;
  momentName: string;
  spaceName: string;
  tag: string;
  titleTop: string;
  titleMain: string;
  description: string;
  image: string;
  imageAlt: string;
  specs: { label: string; value: string }[];
  bgDay: string;
  bgNight: string;
  icon: any;
}

const momentsData: MomentItem[] = [
  {
    id: "sunrise-terrace",
    number: "01",
    momentName: "Sunrise",
    spaceName: "Sunlit Terrace",
    tag: "FIRST LIGHT · BAY OF BENGAL",
    titleTop: "SUNRISE AT",
    titleMain: "SUNLIT TERRACE",
    description:
      "First light breaks across the Bay of Bengal, casting a warm golden radiance across the open-air deck. Wake up to fresh sea breeze, morning espresso, and the peaceful hush of the early morning surf.",
    image: "/sunrise.png",
    imageAlt: "Casa Meridian Golden Sunrise on the Sunlit Ocean Terrace",
    specs: [
      { label: "Atmosphere", value: "Dawn Glow & Solitude" },
      { label: "Setting", value: "Alfresco Sea-facing Deck" },
      { label: "Light", value: "Warm Golden Beam" },
      { label: "Acoustics", value: "Gentle Morning Tide" },
    ],
    bgDay: "#f5eee4",
    bgNight: "#18242c",
    icon: Sun,
  },
  {
    id: "midday-pool",
    number: "02",
    momentName: "Midday Calm",
    spaceName: "Infinity Pool",
    tag: "HIGH NOON · HORIZON DRIFT",
    titleTop: "DRIFTING BY THE",
    titleMain: "INFINITY POOL",
    description:
      "Suspended between sky and sea — the private first-floor infinity pool dissolves directly into the azure shoreline. Fresh cool water blends seamlessly with the bright coastal breeze under the high noon sun.",
    image: "/infinity_pool.webp",
    imageAlt: "Casa Meridian Infinity Edge Pool overlooking the sea",
    specs: [
      { label: "Water Surface", value: "Endless Rim Pool" },
      { label: "Vantage", value: "Level 01 Horizon Edge" },
      { label: "Experience", value: "Weightless Azure Float" },
      { label: "Light", value: "Crystalline Ocean Shimmer" },
    ],
    bgDay: "#ebf2f7",
    bgNight: "#0e222e",
    icon: Waves,
  },
  {
    id: "afternoon-lounge",
    number: "03",
    momentName: "Afternoon Retreat",
    spaceName: "Sunken Lounge",
    tag: "SHADED ENCLAVE · SOUND OF SURF",
    titleTop: "RELAXING AT THE",
    titleMain: "SUNKEN LOUNGE",
    description:
      "An architecturally recessed living enclave crafted for unhurried conversations and relaxed reading. Deep linen daybeds immerse you directly in the shaded coastal breeze and rhythmic acoustic resonance of crashing waves.",
    image: "/lounge.webp",
    imageAlt: "Casa Meridian Sunken Ocean View Lounge",
    specs: [
      { label: "Architecture", value: "Recessed Step-Down" },
      { label: "Seating", value: "Deep Linen Daybeds" },
      { label: "Acoustics", value: "Shoreline Resonance" },
      { label: "Atmosphere", value: "Cool Shaded Haven" },
    ],
    bgDay: "#ece5d8",
    bgNight: "#122027",
    icon: Coffee,
  },
  {
    id: "golden-sunset",
    number: "04",
    momentName: "Golden Sunset",
    spaceName: "Rooftop Observatory",
    tag: "HIGHEST SUMMIT · AMBER SKIES",
    titleTop: "GOLDEN HOUR ON",
    titleMain: "ROOFTOP TERRACE",
    description:
      "An intimate vantage perched high above the coastline. Anchored by the handcrafted teakwood bench, this open-air observatory captures 360-degree ocean panoramas as the sky shifts gracefully from amber to violet.",
    image: "/bench.webp",
    imageAlt: "Casa Meridian Rooftop Terrace Bench overlooking the ocean",
    specs: [
      { label: "Vantage", value: "360° Open Ocean" },
      { label: "Seating", value: "Teakwood Bench" },
      { label: "Peak Mood", value: "Amber Twilight & Coastal Flora" },
      { label: "Elevation", value: "Level 03 Summit" },
    ],
    bgDay: "#eee2d5",
    bgNight: "#241618",
    icon: Sunset,
  },
];

interface MomentCardProps {
  item: MomentItem;
  index: number;
  totalCards: number;
  progress: MotionValue<number>;
  range: [number, number];
  targetScale: number;
  mode: "day" | "night";
}

function MomentCard({
  item,
  index,
  totalCards,
  progress,
  range,
  targetScale,
  mode,
}: MomentCardProps) {
  const cardContainerRef = useRef<HTMLDivElement>(null);

  // Scale down earlier cards as subsequent cards stack over them
  const scale = useTransform(progress, range, [1, targetScale]);

  // Card top stacking offset
  const topOffset = `calc(68px + ${index * 14}px)`;

  const isDay = mode === "day";

  return (
    <div
      ref={cardContainerRef}
      className={`${
        index === totalCards - 1 ? "h-auto pb-4 sm:h-[86vh]" : "h-[72vh] sm:h-[86vh]"
      } w-full flex items-start justify-center sticky top-0 px-3 sm:px-8 md:px-12 pt-2 sm:pt-3`}
    >
      <motion.div
        style={{
          scale,
          top: topOffset,
          backgroundColor: isDay ? item.bgDay : item.bgNight,
        }}
        className={`relative w-full max-w-6xl h-auto min-h-[460px] lg:min-h-[480px] max-h-[600px] rounded-[26px] sm:rounded-[34px] p-6 sm:p-8 md:p-10 lg:p-12 flex flex-col justify-center origin-top shadow-2xl transition-colors duration-700 border ${isDay
          ? "border-black/10 text-slate-900 shadow-black/10"
          : "border-white/15 text-[#f6f3ec] shadow-black/60"
          }`}
      >
        {/* Top Space Name Eyebrow */}
        <div className="w-full mb-3 sm:mb-4 lg:mb-5">
          <span className="font-mono text-xs tracking-[0.25em] uppercase font-medium text-[#b8935a]">
            {item.spaceName}
          </span>
        </div>

        {/* Card Body Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 xl:gap-10 items-center w-full">
          {/* Left Column: Refined Typography matching Location section */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            {/* Single line heading */}
            <h3
              className="text-lg sm:text-xl lg:text-[22px] xl:text-[25px] font-normal tracking-tight leading-snug"
              style={{ fontFamily: "var(--font-fraunces), 'Playfair Display', Georgia, serif" }}
            >
              <span className={isDay ? "text-slate-900" : "text-[#f6f3ec]"}>
                <SplitTextReveal text={item.titleTop} delay={0.08} />
              </span>{" "}
              <span className="text-[#b8935a]">
                <SplitTextReveal text={item.titleMain} delay={0.16} />
              </span>
            </h3>

            {/* Content text in clean Inter sans-serif matching Location */}
            <p
              className={`mt-4 sm:mt-5 lg:mt-6 text-sm sm:text-base lg:text-[16px] xl:text-[17px] leading-relaxed font-normal ${isDay ? "text-slate-700" : "text-white/85"
                }`}
            >
              <SplitTextReveal text={item.description} stagger={0.012} delay={0.24} duration={0.55} />
            </p>
          </div>

          {/* Right Column: Photographic Frame */}
          <div className="lg:col-span-6 h-full flex items-center justify-center relative">
            <div
              className={`relative w-full h-[240px] sm:h-[280px] md:h-[330px] lg:h-[350px] xl:h-[370px] rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border transition-all duration-500 group ${isDay ? "border-black/10 bg-white/40" : "border-white/15 bg-black/40"
                }`}
            >
              <div className="relative w-full h-full transition-transform duration-700 group-hover:scale-105">
                <Image
                  src={item.image}
                  alt={item.imageAlt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 55vw"
                  priority={index === 0}
                />
              </div>

              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function KeyAspectsSection() {
  const { mode } = useDayNight();
  const containerRef = useRef<HTMLDivElement>(null);

  // Overall scroll progress of the entire cards container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  return (
    <section
      ref={containerRef}
      id="key-aspects"
      className={`relative w-full transition-colors duration-700 select-none ${mode === "day" ? "bg-[#f5f2eb]" : "bg-[#07131b]"
        }`}
    >
      {/* Section Header with Managed Whitespace (No "Journey at Casa Meridian") */}
      <div className="relative z-10 max-w-4xl mx-auto text-center px-4 sm:px-6 pt-4 sm:pt-8 md:pt-10 pb-1">
        <h2
          className={`text-3xl sm:text-4xl md:text-5xl font-light font-serif tracking-tight leading-[1.15] ${mode === "day" ? "text-slate-900" : "text-[#f6f3ec]"
            }`}
          style={{ fontFamily: "var(--font-fraunces), 'Playfair Display', Georgia, serif" }}
        >
          <SplitTextReveal text="Moments by" delay={0.1} />{" "}
          <span className="italic inline-block text-[#b8935a]">
            <SplitTextReveal text="the Open Sea" delay={0.22} />
          </span>
        </h2>

        <p
          className={`mt-2 text-xs sm:text-sm md:text-base max-w-xl mx-auto font-normal leading-relaxed ${mode === "day" ? "text-slate-700" : "text-white/70"
            }`}
        >
          <SplitTextReveal
            text="From first sunrise on the open terrace to tranquil amber sunsets overlooking the Bay of Bengal — experience the unhurried rhythm of barefoot luxury."
            stagger={0.015}
            delay={0.3}
            duration={0.6}
          />
        </p>
      </div>

      {/* STACKED PARALLAX MOMENT CARDS CONTAINER */}
      <div className="relative w-full pt-1 pb-8 sm:pb-12 md:pb-14">
        {momentsData.map((moment, index) => {
          // targetScale calculation: earlier cards shrink subtly as later cards stack over
          const targetScale = 1 - (momentsData.length - index) * 0.035;
          return (
            <MomentCard
              key={moment.id}
              item={moment}
              index={index}
              totalCards={momentsData.length}
              progress={scrollYProgress}
              range={[index * (1 / momentsData.length), 1]}
              targetScale={targetScale}
              mode={mode}
            />
          );
        })}
      </div>
    </section>
  );
}
