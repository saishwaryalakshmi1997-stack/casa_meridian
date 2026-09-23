"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useDayNight } from "./DayNightContext";
import SplitTextReveal from "./SplitTextReveal";

interface DistanceItem {
  title: string;
  time: string;
  detail: string;
  iconSvg: React.ReactNode;
}

const distances: DistanceItem[] = [
  {
    title: "Private Shoreline & Beach",
    time: "0 Mins",
    detail: "Direct private access steps from the villa terrace to the sand.",
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
        <path d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
        <path d="M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
      </svg>
    ),
  },
  {
    title: "Covelong Point & Surf Bay",
    time: "12 Mins",
    detail: "Premier surfing bay, coastal cafes, and ocean water sports.",
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
        <circle cx="12" cy="12" r="10" />
        <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
      </svg>
    ),
  },
  {
    title: "Mahabalipuram Heritage",
    time: "25 Mins",
    detail: "UNESCO World Heritage Shore Temple and coastal rock art.",
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
        <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
  {
    title: "Chennai Airport (MAA)",
    time: "45 Mins",
    detail: "Direct highway connectivity via ECR and OMR corridors.",
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
        <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" />
      </svg>
    ),
  },
];

const MAPS_URL =
  "https://www.google.com/maps/search/210+Gandhi+Road+VGP+2nd+Part+Uthandi+Chennai+600119/@12.8762685,80.2162557,14z/data=!3m1!4b1?entry=ttu&g_ep=EgoyMDI2MDgyNC4wIKXMDSoASAFQAw%3D%3D";

export default function LocationSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const { mode } = useDayNight();

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Map entrance
      if (mapRef.current) {
        gsap.fromTo(
          mapRef.current,
          { opacity: 0, x: -40 },
          {
            opacity: 1,
            x: 0,
            duration: 1.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: mapRef.current,
              start: "top 80%",
            },
          }
        );
      }

      // Content & distance cards entrance
      if (contentRef.current) {
        gsap.fromTo(
          contentRef.current.children,
          { opacity: 0, y: 35 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            stagger: 0.12,
            ease: "power3.out",
            scrollTrigger: {
              trigger: contentRef.current,
              start: "top 80%",
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
      id="location"
      className={`relative w-full py-24 sm:py-32 md:py-36 px-6 sm:px-10 md:px-16 lg:px-24 overflow-hidden border-t transition-colors duration-700 ${
        mode === "day"
          ? "bg-[#f5f2eb] text-slate-900 border-black/10"
          : "bg-[#0a1a22] text-[#f6f3ec] border-white/10"
      }`}
    >
      {/* Background ambient lighting accents */}
      <div
        className={`absolute top-1/3 left-1/4 w-96 h-96 rounded-full blur-3xl pointer-events-none transition-opacity duration-700 ${
          mode === "day" ? "bg-teal-500/10" : "bg-teal-800/10"
        }`}
      />
      <div
        className={`absolute bottom-10 right-10 w-96 h-96 rounded-full blur-3xl pointer-events-none transition-opacity duration-700 ${
          mode === "day" ? "bg-amber-400/10" : "bg-amber-600/5"
        }`}
      />

      {/* Main Grid: Left Map | Right Location Details */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        {/* Left Column: Interactive Styled Map Box */}
        <div ref={mapRef} className="lg:col-span-6 w-full">
          <div
            className={`relative rounded-2xl overflow-hidden border aspect-[4/3] sm:aspect-[16/12] w-full transition-all duration-700 ${
              mode === "day"
                ? "border-black/10 bg-white shadow-[0_16px_40px_rgba(0,0,0,0.12)]"
                : "border-white/15 bg-[#0e212b] shadow-[0_25px_60px_rgba(0,0,0,0.8)]"
            }`}
          >
            {/* Embedded Google Map Centered on Uthandi, ECR Chennai */}
            <iframe
              src="https://maps.google.com/maps?q=210+Gandhi+Road+VGP+2nd+Part+Uthandi+Chennai+600119&t=&z=15&ie=UTF8&iwloc=&output=embed"
              width="100%"
              height="100%"
              style={{
                border: 0,
                filter:
                  mode === "day"
                    ? "contrast(95%) brightness(98%)"
                    : "invert(92%) hue-rotate(180deg) brightness(90%) contrast(90%)",
              }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Casa Meridian Location at 210 Gandhi Road, Uthandi, Chennai"
              className="w-full h-full transition-all duration-700"
            />

            {/* Custom Glowing Location Pin Overlay */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none flex flex-col items-center">
              <div className="relative flex items-center justify-center">
                <div className="absolute w-12 h-12 rounded-full bg-[#b8935a]/30 animate-ping" />
                <div className="relative w-8 h-8 rounded-full bg-[#b8935a] border-2 border-white shadow-xl flex items-center justify-center text-white">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Top Coordinates Badge */}
            <div className="absolute top-4 left-4 z-20">
              <span className="font-mono text-[10px] sm:text-xs tracking-[0.2em] uppercase text-white bg-black/70 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/20">
                12.8763° N · 80.2163° E
              </span>
            </div>

            {/* Bottom Direct Maps Link */}
            <div className="absolute bottom-4 right-4 z-20">
              <a
                href={MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-[10px] sm:text-xs tracking-[0.15em] uppercase text-white bg-[#b8935a] hover:bg-[#a37f47] px-3.5 py-1.5 rounded-full font-semibold transition-all duration-300 shadow-lg flex items-center gap-1.5"
              >
                <span>Open in Maps</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Right Column: Location Narrative & Neighborhood Landmarks */}
        <div ref={contentRef} className="lg:col-span-6 flex flex-col space-y-6 sm:space-y-8">
          {/* Eyebrow & Title */}
          <div>
            <div className="flex items-center gap-2 text-[#b8935a] font-mono text-xs sm:text-sm tracking-[0.25em] uppercase mb-3">
              <span>☼</span>
              <SplitTextReveal text="UTHANDI · ECR, CHENNAI" delay={0.1} />
            </div>

            <h2
              className={`text-3xl sm:text-4xl md:text-5xl font-normal tracking-tight leading-tight mb-4 transition-colors duration-700 ${
                mode === "day" ? "text-slate-900" : "text-[#f6f3ec]"
              }`}
              style={{ fontFamily: "var(--font-fraunces), 'Playfair Display', Georgia, serif" }}
            >
              <SplitTextReveal
                text="Set along the scenic East Coast Road."
                stagger={0.06}
                delay={0.2}
                duration={0.8}
              />
            </h2>

            <p
              className={`text-sm sm:text-base leading-relaxed font-normal transition-colors duration-700 ${
                mode === "day" ? "text-slate-800" : "text-slate-300/85"
              }`}
            >
              <SplitTextReveal
                text="Perched in the tranquil enclave of Uthandi on the East Coast Road, Casa Meridian offers direct beach access and serene Bay of Bengal views with effortless city connectivity."
                stagger={0.02}
                delay={0.4}
                duration={0.65}
              />
            </p>
          </div>

          {/* Distances / Landmark Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 pt-2">
            {distances.map((item, idx) => (
              <div
                key={idx}
                className={`p-4 sm:p-5 rounded-xl border backdrop-blur-xs transition-all duration-300 ${
                  mode === "day"
                    ? "border-black/10 bg-white/95 hover:border-[#b8935a] shadow-xs"
                    : "border-white/10 bg-[#10242e]/60 hover:border-[#b8935a]/50"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="text-[#b8935a]">{item.iconSvg}</div>
                  <span className="font-mono text-xs text-[#996e2e] dark:text-[#b8935a] font-semibold tracking-wider">
                    <SplitTextReveal text={item.time} delay={0.3 + idx * 0.06} />
                  </span>
                </div>
                <h3
                  className={`text-base sm:text-lg font-normal mb-1 transition-colors duration-700 ${
                    mode === "day" ? "text-slate-900" : "text-[#f6f3ec]"
                  }`}
                  style={{ fontFamily: "var(--font-fraunces), 'Playfair Display', Georgia, serif" }}
                >
                  <SplitTextReveal text={item.title} delay={0.35 + idx * 0.06} />
                </h3>
                <p
                  className={`text-xs sm:text-[13px] leading-relaxed font-normal transition-colors duration-700 ${
                    mode === "day" ? "text-slate-700" : "text-slate-400"
                  }`}
                >
                  <SplitTextReveal text={item.detail} stagger={0.02} delay={0.4 + idx * 0.06} duration={0.55} />
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
