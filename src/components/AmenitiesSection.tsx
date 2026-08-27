"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

interface Amenity {
  title: string;
  description: string;
  iconSvg: React.ReactNode;
}

const amenities: Amenity[] = [
  {
    title: "Private Infinity Pool",
    description:
      "A private infinity pool on the first floor, framed by the ocean — open any time of day.",
    iconSvg: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
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
    title: "In-House Chef & Restaurant",
    description:
      "Personalised meals from a dedicated chef, with an in-house restaurant available on request.",
    iconSvg: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
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
    title: "Beach & Ocean Views",
    description:
      "Beach-view balcony rooms above — close enough to hear the surf from bed and watch the sunrise over the waves.",
    iconSvg: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
      </svg>
    ),
  },
  {
    title: "Premium Speakers",
    description:
      "High-quality speakers throughout the villa, ready for a night in with good music.",
    iconSvg: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect width="16" height="20" x="4" y="2" rx="2" />
        <circle cx="12" cy="14" r="4" />
        <line x1="12" x2="12.01" y1="6" y2="6" />
      </svg>
    ),
  },
  {
    title: "Board Games",
    description:
      "A curated collection on hand for evenings that run long with family and friends.",
    iconSvg: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect width="18" height="18" x="3" y="3" rx="2" />
        <path d="M16 8h.01" />
        <path d="M8 8h.01" />
        <path d="M8 16h.01" />
        <path d="M16 16h.01" />
        <path d="M12 12h.01" />
      </svg>
    ),
  },
  // {
  //   title: "Spacious 5BHK Villa",
  //   description:
  //     "Four floors, thoughtfully laid out for comfort, privacy, and a stay you won't forget.",
  //   iconSvg: (
  //     <svg
  //       xmlns="http://www.w3.org/2000/svg"
  //       width="20"
  //       height="20"
  //       viewBox="0 0 24 24"
  //       fill="none"
  //       stroke="currentColor"
  //       strokeWidth="1.5"
  //       strokeLinecap="round"
  //       strokeLinejoin="round"
  //     >
  //       <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
  //       <polyline points="9 22 9 12 15 12 15 22" />
  //     </svg>
  //   ),
  // },
];

export default function AmenitiesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerLeftRef = useRef<HTMLDivElement>(null);
  const headerRightRef = useRef<HTMLParagraphElement>(null);
  const poolImgRef = useRef<HTMLDivElement>(null);
  const kitchenImgRef = useRef<HTMLDivElement>(null);
  const loungeImgRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          toggleActions: "play none none none",
        },
        defaults: { ease: "power3.out" },
      });

      // 1. Header (Eyebrow, Title & Subtitle)
      if (headerLeftRef.current && headerRightRef.current) {
        tl.fromTo(
          [headerLeftRef.current.children, headerRightRef.current],
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.9, stagger: 0.12 }
        );
      }

      // 2. Top Pool Image reveal
      if (poolImgRef.current) {
        tl.fromTo(
          poolImgRef.current,
          { opacity: 0, y: 40, scale: 0.97 },
          { opacity: 1, y: 0, scale: 1, duration: 0.9 },
          "-=0.5"
        );
      }

      // 3. Bottom Kitchen & Lounge Images
      if (kitchenImgRef.current && loungeImgRef.current) {
        tl.fromTo(
          [kitchenImgRef.current, loungeImgRef.current],
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.8, stagger: 0.15 },
          "-=0.5"
        );
      }

      // 4. Amenities list items reveal one by one
      if (listRef.current) {
        tl.fromTo(
          listRef.current.children,
          { opacity: 0, x: 35 },
          {
            opacity: 1,
            x: 0,
            duration: 0.7,
            stagger: 0.12,
          },
          "-=0.6"
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="amenities"
      className="relative w-full bg-[#0a1a22] text-[#f6f3ec] py-24 sm:py-32 md:py-36 px-6 sm:px-10 md:px-16 lg:px-24 overflow-hidden border-t border-white/10"
    >
      {/* Background ambient lighting accents */}
      <div className="absolute top-1/4 left-10 w-96 h-96 bg-amber-600/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-teal-900/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Row */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 sm:mb-20">
        <div ref={headerLeftRef} className="max-w-xl">
          <span className="font-mono text-xs sm:text-sm tracking-[0.25em] text-[#b8935a] uppercase block mb-3">
            Amenities
          </span>
          <h2
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-normal text-[#f6f3ec] tracking-tight leading-tight"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Everything you need, already here.
          </h2>
        </div>

        <p
          ref={headerRightRef}
          className="text-slate-300/80 text-sm sm:text-base md:text-lg font-light max-w-md md:text-right leading-relaxed"
        >
          Thoughtfully designed amenities and experiences that make your stay
          effortless, relaxing and memorable.
        </p>
      </div>

      {/* Main Grid: Left Photos (Infinity Pool on Top, Kitchen & Lounge Below) | Right Amenities List */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        {/* Left Column: Photo Grid */}
        <div className="lg:col-span-6 flex flex-col gap-5 w-full">
          {/* Top Full-Width Image: Complete Infinity Pool */}
          <div
            ref={poolImgRef}
            className="relative aspect-[16/10] sm:aspect-[16/9] w-full rounded-2xl overflow-hidden border border-white/15 shadow-2xl bg-[#0c1f28] group"
          >
            <Image
              src="/infinity_pool.webp"
              alt="Casa Meridian Infinity Pool with couple looking over the ocean"
              fill
              className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />
            <div className="absolute bottom-4 left-4 sm:bottom-5 sm:left-5 z-10">
              <span className="font-mono text-[10px] sm:text-xs tracking-[0.2em] uppercase text-white/90 bg-black/60 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/20">
                Infinity Pool — 1st Floor
              </span>
            </div>
          </div>

          {/* Bottom 2 Images Side-by-Side (Kitchen & Living Lounge) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 w-full">
            {/* Kitchen & Breakfast Bar */}
            <div
              ref={kitchenImgRef}
              className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-white/10 shadow-xl bg-[#0c1f28] group"
            >
              <Image
                src="/kitchen.webp"
                alt="Casa Meridian Kitchen and Coffee Bar"
                fill
                className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                sizes="(max-width: 768px) 100vw, 25vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />
              <div className="absolute bottom-3 left-3 z-10">
                <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-white/90 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
                  Kitchen &amp; Dining
                </span>
              </div>
            </div>

            {/* Sunken Oceanview Lounge */}
            <div
              ref={loungeImgRef}
              className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-white/10 shadow-xl bg-[#0c1f28] group"
            >
              <Image
                src="/lounge.webp"
                alt="Casa Meridian Sunken Lounge facing the Beach"
                fill
                className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                sizes="(max-width: 768px) 100vw, 25vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />
              <div className="absolute bottom-3 left-3 z-10">
                <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-white/90 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
                  Oceanview Lounge
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Amenities List (Staggered One by One) */}
        <div
          ref={listRef}
          className="lg:col-span-6 flex flex-col divide-y divide-white/10"
        >
          {amenities.map((item, idx) => (
            <div
              key={idx}
              className="py-6 sm:py-7 flex items-start gap-4 sm:gap-6 group hover:bg-white/[0.02] px-2 sm:px-4 rounded-xl transition-colors"
            >
              {/* Circular Gold Icon Container */}
              <div className="w-12 h-12 rounded-full border border-[#b8935a]/40 bg-[#b8935a]/10 flex items-center justify-center text-[#d4af37] flex-shrink-0 group-hover:border-[#b8935a] group-hover:scale-110 transition-all duration-300 shadow-md">
                {item.iconSvg}
              </div>

              {/* Title & Description */}
              <div className="flex-1">
                <h3
                  className="text-lg sm:text-xl font-normal text-[#f6f3ec] group-hover:text-amber-200 transition-colors mb-1.5"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                  {item.title}
                </h3>
                <p className="text-slate-300/80 text-sm sm:text-[15px] leading-relaxed font-light">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
