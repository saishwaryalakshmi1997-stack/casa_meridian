"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const imageColRef = useRef<HTMLDivElement>(null);
  const textColRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Animate left image card on scroll
      if (imageColRef.current) {
        gsap.fromTo(
          imageColRef.current,
          { opacity: 0, scale: 0.95, y: 40 },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 1.2,
            ease: "power3.out",
            scrollTrigger: {
              trigger: imageColRef.current,
              start: "top 80%",
              toggleActions: "play none none none",
            },
          }
        );
      }

      // Animate right content elements smoothly on scroll
      if (textColRef.current) {
        gsap.fromTo(
          textColRef.current.children,
          { opacity: 0, y: 35 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            stagger: 0.14,
            ease: "power3.out",
            scrollTrigger: {
              trigger: textColRef.current,
              start: "top 80%",
              toggleActions: "play none none none",
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
      id="about"
      className="relative w-full bg-[#0b131b] text-[#e2e8f0] py-20 sm:py-28 md:py-36 px-6 sm:px-10 md:px-16 lg:px-24 overflow-hidden border-t border-white/5"
    >
      {/* Background ambient lighting accents */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-600/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-10 w-96 h-96 bg-sky-900/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        {/* Left Column: Architectural Sunset Exterior Image Showcase */}
        <div
          ref={imageColRef}
          className="lg:col-span-6 xl:col-span-6 w-full"
        >
          <div className="relative group overflow-hidden rounded-2xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.8)] bg-slate-900 aspect-[16/11] sm:aspect-[16/10] md:aspect-[4/3] lg:aspect-[16/12]">
            <Image
              src="/casa_exterior.png"
              alt="Casa Meridian - Villa Exterior at Sunset on the Bay of Bengal"
              fill
              priority
              className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
            />
            {/* Subtle Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />
          </div>
        </div>

        {/* Right Column: Typography & Details */}
        <div
          ref={textColRef}
          className="lg:col-span-6 xl:col-span-6 flex flex-col space-y-6 sm:space-y-8"
        >
          {/* Location Badge */}
          <div className="flex items-center gap-2 text-amber-300/80 text-xs sm:text-sm font-mono tracking-[0.25em] uppercase">
            <span>☼</span>
            <span>ECR, CHENNAI</span>
          </div>

          {/* Heading */}
          <h2
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-normal text-white tracking-[0.02em] leading-[1.15]"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            A Private Villa on the Bay of Bengal
          </h2>

          {/* Description Paragraphs */}
          <div className="space-y-4 text-slate-300/90 text-sm sm:text-base md:text-[17px] leading-relaxed font-light">
            <p>
              Casa Meridian was built around a simple idea — that a villa should
              never compete with its view, only frame it. Four floors, each with
              its own relationship to the horizon — from garden-level rooms to a
              rooftop terrace suite.
            </p>
            <p>
              The whole house, just yours. One booking at a time, never shared,
              never rushed — from sunrise on the terrace to the last light over
              dinner.
            </p>
          </div>

          {/* Divider */}
          <div className="w-full h-px bg-slate-800/80 my-2" />

          {/* Stats / Features Row */}
          <div className="grid grid-cols-3 gap-4 sm:gap-6 pt-2">
            <div>
              <div
                className="text-2xl sm:text-3xl md:text-4xl font-serif text-[#d4af37] font-normal"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                5<span className="text-xl sm:text-2xl ml-0.5">BHK</span>
              </div>
              <div className="text-[10px] sm:text-xs font-mono tracking-[0.2em] text-slate-400 uppercase mt-1">
                Whole Villa
              </div>
            </div>

            <div>
              <div
                className="text-2xl sm:text-3xl md:text-4xl font-serif text-[#d4af37] font-normal"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                4
              </div>
              <div className="text-[10px] sm:text-xs font-mono tracking-[0.2em] text-slate-400 uppercase mt-1">
                Floors
              </div>
            </div>

            <div>
              <div
                className="text-2xl sm:text-3xl md:text-4xl font-serif text-[#d4af37] font-normal"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                1
              </div>
              <div className="text-[10px] sm:text-xs font-mono tracking-[0.2em] text-slate-400 uppercase mt-1">
                Infinity Pool
              </div>
            </div>
          </div>

          {/* Contact / Enquire & Reserve */}
          {/* <div className="pt-4 sm:pt-6 flex items-center gap-4">
            <a
              href="mailto:hello@casameridian.com"
              className="w-12 h-12 rounded-full border border-white/20 hover:border-amber-400/60 transition-colors flex items-center justify-center text-white/80 hover:text-amber-300 flex-shrink-0 group"
              aria-label="Contact Casa Meridian"
            >
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
                className="group-hover:scale-110 transition-transform"
              >
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
            </a>

            <div>
              <div className="text-[10px] sm:text-xs font-mono tracking-[0.25em] text-slate-400 uppercase">
                Enquire & Reserve
              </div>
              <a
                href="mailto:hello@casameridian.com"
                className="text-base sm:text-lg italic text-white/95 hover:text-amber-300 transition-colors tracking-wide"
                style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
              >
                hello@casameridian.com
              </a>
            </div>
          </div> */}
        </div>
      </div>
    </section>
  );
}
