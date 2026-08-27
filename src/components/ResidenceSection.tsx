"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

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
    mark: "03 · THIRD FLOOR",
    badge: "03",
    title: "Terrace suite & 360° open air",
    description:
      "The crown of the villa holds the fifth bedroom — a private rooftop terrace suite with 360° panoramic vistas facing sunrise over the Bay of Bengal, sunset over the backwaters, and an endless horizon all day.",
    image: "/rooftop_puppy.png",
    imageAlt: "Casa Meridian Third Floor Terrace Suite and Rooftop Deck",
    specs: [
      { value: "01", label: "Private terrace suite" },
      { value: "360°", label: "Open ocean panorama" },
    ],
    planRooms: [
      {
        label: "RM 05 · SUITE",
        style: {
          left: "0%",
          top: "0%",
          width: "46%",
          height: "100%",
          borderColor: "rgba(212,175,55,0.8)",
          background: "rgba(212,175,55,0.1)",
        },
      },
      {
        label: "ROOFTOP DECK",
        style: {
          left: "52%",
          top: "0%",
          width: "48%",
          height: "100%",
          borderColor: "rgba(56,189,248,0.7)",
          background: "rgba(56,189,248,0.12)",
        },
      },
    ],
  },
];

export default function ResidenceSection() {
  const [activeFloor, setActiveFloor] = useState<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const scrollTriggerInstanceRef = useRef<ScrollTrigger | null>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      if (!triggerRef.current || !containerRef.current) return;

      const st = ScrollTrigger.create({
        trigger: triggerRef.current,
        start: "top top",
        end: "+=3200", // Smooth scroll distance across the 4 floors
        pin: containerRef.current,
        pinSpacing: true,
        scrub: 0.6,
        onUpdate: (self) => {
          const progress = self.progress;
          let index = Math.floor(progress * floors.length);
          if (index >= floors.length) index = floors.length - 1;
          setActiveFloor(index);
        },
      });

      scrollTriggerInstanceRef.current = st;
    }, triggerRef);

    return () => ctx.revert();
  }, []);

  const currentFloor = floors[activeFloor] || floors[0];

  const handleTabClick = (floorIndex: number) => {
    if (!scrollTriggerInstanceRef.current) return;
    const st = scrollTriggerInstanceRef.current;
    const targetProgress = (floorIndex + 0.1) / floors.length;
    const targetScroll = st.start + targetProgress * (st.end - st.start);
    window.scrollTo({
      top: targetScroll,
      behavior: "smooth",
    });
  };

  return (
    <div ref={triggerRef} id="residence" className="relative w-full bg-[#0a1a22]">
      {/* Pinned Sticky Viewport Container with safe navbar top padding and bottom margin */}
      <div
        ref={containerRef}
        className="w-full h-[100svh] min-h-[600px] flex flex-col justify-between pt-20 sm:pt-24 md:pt-28 pb-4 sm:pb-6 px-4 sm:px-8 md:px-12 lg:px-20 overflow-hidden border-t border-white/10 select-none text-[#f6f3ec]"
      >
        {/* Top Header & Floor Switcher Navigation */}
        <div className="w-full max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-end justify-between gap-2.5 sm:gap-4 border-b border-white/10 pb-2.5 sm:pb-3 flex-shrink-0">
          <div>
            <span className="font-mono text-xs tracking-[0.25em] text-[#b8935a] uppercase block mb-0.5">
              The Residence
            </span>
            <h2
              className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-normal text-[#f6f3ec] tracking-tight leading-tight"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Four floors, top to bottom.
            </h2>
          </div>

          {/* Interactive Clickable Floor Tabs */}
          <div className="flex items-center gap-2 sm:gap-2.5 flex-shrink-0 no-scrollbar">
            {floors.map((floor) => {
              const isSelected = activeFloor === floor.id;
              return (
                <button
                  key={floor.id}
                  onClick={() => handleTabClick(floor.id)}
                  className={`font-mono text-xs px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full border transition-all duration-300 flex-shrink-0 cursor-pointer ${
                    isSelected
                      ? "bg-[#b8935a] text-[#0a1a22] border-[#b8935a] font-semibold shadow-md shadow-[#b8935a]/30 scale-105"
                      : "bg-black/30 text-white/60 border-white/20 hover:border-white/40 hover:text-white"
                  }`}
                >
                  {floor.badge}
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Content Area: Left Sticky Showcase (Photo + Blueprint) | Right Narrative */}
        <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 lg:gap-10 items-center my-auto flex-1 py-2 sm:py-3">
          {/* Left Column: Floor Photo & Architectural Blueprint */}
          <div className="lg:col-span-6 w-full flex flex-col">
            <div className="relative rounded-xl sm:rounded-2xl overflow-hidden border border-white/15 bg-[#10242e] shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
              {/* Floor Image with Crossfade */}
              <div className="relative aspect-[16/9] w-full overflow-hidden bg-black max-h-[200px] sm:max-h-[260px] lg:max-h-[290px]">
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
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a1a22] via-transparent to-black/30 pointer-events-none" />
                  </div>
                ))}

                {/* Badge Overlay */}
                <div className="absolute top-2.5 left-2.5 sm:top-3.5 sm:left-3.5 z-20">
                  <span className="font-mono text-[9px] sm:text-[11px] tracking-[0.2em] uppercase text-white bg-black/65 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 shadow-md">
                    {currentFloor.mark}
                  </span>
                </div>
              </div>

              {/* Architectural Blueprint Layout Box */}
              <div className="p-2.5 sm:p-3.5 border-t border-white/10 bg-[#0c1f28]/95 backdrop-blur-md hidden sm:block">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-mono text-[9px] sm:text-[11px] text-[#b8935a] uppercase tracking-widest">
                    Architectural Layout
                  </span>
                  <span className="text-[9px] sm:text-[11px] font-mono text-white/50">
                    PLAN 0{currentFloor.id}
                  </span>
                </div>

                <div className="relative w-full h-16 sm:h-20 border border-white/15 rounded-lg bg-[#07131a] p-1.5 overflow-hidden">
                  {currentFloor.planRooms.map((room, idx) => (
                    <div
                      key={idx}
                      className="absolute border border-[#b8935a]/70 bg-[#b8935a]/10 rounded flex items-center justify-center transition-all duration-500"
                      style={room.style}
                    >
                      <span className="font-mono text-[8px] sm:text-[9px] text-[#f6f3ec]/90 tracking-wider font-medium text-center px-1">
                        {room.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Dynamic Narrative & Specs for Active Floor */}
          <div className="lg:col-span-6 w-full flex flex-col justify-center">
            <div className="relative rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-7 border border-[#b8935a]/30 bg-[#132832]/85 backdrop-blur-md shadow-2xl transition-all duration-500">
              <span className="font-mono text-[10px] sm:text-xs text-[#b8935a] tracking-[0.2em] uppercase block mb-1">
                {currentFloor.mark}
              </span>

              <h3
                className="text-lg sm:text-2xl md:text-3xl text-[#f6f3ec] font-normal tracking-tight mb-2 transition-all duration-300 leading-snug"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                {currentFloor.title}
              </h3>

              <p className="text-slate-300 text-xs sm:text-sm md:text-[15px] leading-relaxed font-light mb-4 transition-all duration-300 line-clamp-3 sm:line-clamp-4">
                {currentFloor.description}
              </p>

              {/* Floor Specs */}
              <div className="flex flex-wrap gap-5 sm:gap-8 pt-3 border-t border-white/10">
                {currentFloor.specs.map((spec, sIdx) => (
                  <div key={sIdx}>
                    <span
                      className="text-xl sm:text-2xl md:text-3xl font-serif text-[#ede3d0] font-normal block mb-0.5 leading-none"
                      style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                    >
                      {spec.value}
                    </span>
                    <span className="font-mono text-[9px] sm:text-[11px] text-white/50 tracking-wider uppercase">
                      {spec.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Progress Bar & Scroll Indicator
        <div className="w-full max-w-7xl mx-auto flex items-center justify-between pt-2 sm:pt-2.5 border-t border-white/10 text-white/50 font-mono text-[9px] sm:text-xs flex-shrink-0">
          <span>SCROLL TO EXPLORE FLOORS</span>
          <div className="flex items-center gap-2">
            <span>LEVEL 0{currentFloor.id + 1} / 04</span>
            <div className="w-16 sm:w-24 h-1 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#b8935a] transition-all duration-300"
                style={{ width: `${((activeFloor + 1) / floors.length) * 100}%` }}
              />
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
}
