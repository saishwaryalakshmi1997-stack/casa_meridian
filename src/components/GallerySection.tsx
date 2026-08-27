"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

interface GallerySlide {
  id: string;
  number: string;
  tag: string;
  title: string;
  caption: string;
  image: string;
}

const gallerySlides: GallerySlide[] = [
  {
    id: "exterior",
    number: "01",
    tag: "EXTERIOR & HORIZON",
    title: "Golden Hour on the Bay",
    caption: "Modern cantilevered architecture meeting the tranquil Bay of Bengal shoreline.",
    image: "/casa_exterior.png",
  },
  {
    id: "pool",
    number: "02",
    tag: "FIRST FLOOR",
    title: "The Infinity Edge",
    caption: "An uninterrupted water basin merging seamlessly with the coastal horizon.",
    image: "/infinity_pool.webp",
  },
  {
    id: "terrace-day",
    number: "03",
    tag: "SUNLIT TERRACE",
    title: "Endless Turquoise Waves",
    caption: "Panoramic glass balcony framed by sea breezes and bright blue skies.",
    image: "/terrace_day.png",
  },
  {
    id: "lounge",
    number: "04",
    tag: "LIVING & LOUNGE",
    title: "Sunken Ocean Lounge",
    caption: "Open-concept living space designed for long conversations overlooking the beach.",
    image: "/lounge.webp",
  },
  {
    id: "low-sit",
    number: "05",
    tag: "SUNSET LOUNGE",
    title: "Intimate Floor Seating",
    caption: "Floor-level cushion seating offering an unobstructed horizon viewpoint at dusk.",
    image: "/low_sit.webp",
  },
  {
    id: "terrace-night",
    number: "06",
    tag: "MOONLIT TERRACE",
    title: "Candlelight Under the Moon",
    caption: "An intimate romantic sanctuary illuminated by the full moon and starry sky.",
    image: "/terrace_night.png",
  },
  {
    id: "kitchen",
    number: "07",
    tag: "DINING & BAR",
    title: "Chef's Kitchen",
    caption: "Craft gourmet meals or enjoy coffee at the breakfast counter island.",
    image: "/kitchen.webp",
  },
  {
    id: "guest-lounge",
    number: "08",
    tag: "GUEST SUITE",
    title: "Panoramic Glass Living",
    caption: "Expansive glass doors opening to coastal sunlight and fresh sea breezes.",
    image: "/guest_lounge.webp",
  },
  {
    id: "bedroom",
    number: "09",
    tag: "SECOND FLOOR SUITE",
    title: "Surf-View Balcony Room",
    caption: "Wake up to gentle rolling waves and the sea breeze from bed.",
    image: "/bedroom.webp",
  },
  {
    id: "bench",
    number: "10",
    tag: "OUTDOOR SEATING",
    title: "Stone Terrace Bench",
    caption: "Granite seating with candlelight lantern for peaceful sunrise and twilight tea.",
    image: "/bench.webp",
  },
  {
    id: "entrance",
    number: "11",
    tag: "ARRIVAL & GARDEN",
    title: "Tropical Garden Path",
    caption: "Welcoming green flora and textured stone entrance for peaceful arrival.",
    image: "/casa_entrance.png",
  },
  {
    id: "rooftop",
    number: "12",
    tag: "ROOFTOP DECK",
    title: "360° Open-Air View",
    caption: "The highest vantage point on the villa for sunrise to sunset vistas.",
    image: "/rooftop_puppy.png",
  },
];

export default function GallerySection() {
  const triggerRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      if (!triggerRef.current || !trackRef.current || !containerRef.current) return;

      const track = trackRef.current;
      const getScrollWidth = () => track.scrollWidth - window.innerWidth + 80;

      // GSAP Horizontal Filmstrip Scroll Animation
      gsap.to(track, {
        x: () => -getScrollWidth(),
        ease: "none",
        scrollTrigger: {
          trigger: triggerRef.current,
          start: "top top",
          end: () => `+=${track.scrollWidth * 1.1}`,
          pin: containerRef.current,
          pinSpacing: true,
          scrub: 0.8,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            if (progressBarRef.current) {
              progressBarRef.current.style.width = `${self.progress * 100}%`;
            }
          },
        },
      });
    }, triggerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={triggerRef} id="gallery" className="relative w-full bg-[#071017]">
      {/* Pinned Viewport Container */}
      <div
        ref={containerRef}
        className="relative w-full h-[100svh] min-h-[580px] overflow-hidden flex flex-col justify-between pt-20 sm:pt-24 md:pt-28 pb-4 sm:pb-6 px-4 sm:px-8 md:px-12 lg:px-16 border-t border-white/10 select-none text-[#f6f3ec]"
      >
        {/* Header Row */}
        <div className="w-full max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <span className="font-mono text-xs sm:text-sm tracking-[0.25em] text-[#b8935a] uppercase block mb-1">
              Gallery · Visual Journal
            </span>
            <h2
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-normal text-[#f6f3ec] tracking-tight"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Moments Framed by the Shoreline
            </h2>
          </div>

          <span className="font-mono text-xs text-white/50 tracking-widest uppercase hidden sm:block">
            01 — 12 CINEMATIC FRAMES
          </span>
        </div>

        {/* Horizontal Sliding Filmstrip Track */}
        <div className="relative w-full my-auto overflow-visible">
          <div
            ref={trackRef}
            className="flex items-center gap-6 sm:gap-8 md:gap-10 will-change-transform pl-2"
            style={{ width: "max-content" }}
          >
            {gallerySlides.map((slide) => (
              <div
                key={slide.id}
                className="relative group w-[300px] sm:w-[420px] md:w-[500px] lg:w-[540px] flex-shrink-0 rounded-2xl overflow-hidden border border-white/15 bg-[#0e212b] shadow-[0_20px_50px_rgba(0,0,0,0.8)] transition-transform duration-500 hover:scale-[1.02]"
              >
                {/* Photo Frame */}
                <div className="relative aspect-[16/10] sm:aspect-[16/11] w-full overflow-hidden bg-black">
                  <Image
                    src={slide.image}
                    alt={slide.title}
                    fill
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                    sizes="(max-width: 768px) 300px, 540px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a1a22] via-transparent to-black/30 pointer-events-none" />

                  {/* Number & Tag Badge Overlay */}
                  <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
                    <span className="font-mono text-xs font-semibold text-[#0a1a22] bg-[#b8935a] px-2.5 py-1 rounded-full shadow">
                      {slide.number}
                    </span>
                    <span className="font-mono text-[10px] sm:text-xs tracking-[0.2em] uppercase text-white/90 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
                      {slide.tag}
                    </span>
                  </div>
                </div>

                {/* Caption Card Beneath Photo */}
                <div className="p-5 sm:p-6 bg-[#0c1f28]/95 backdrop-blur-md border-t border-white/10">
                  <h3
                    className="text-lg sm:text-xl md:text-2xl text-[#f6f3ec] font-normal mb-1.5 leading-snug"
                    style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                  >
                    {slide.title}
                  </h3>
                  <p className="text-slate-300/80 text-xs sm:text-sm font-light leading-relaxed">
                    {slide.caption}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Filmstrip Scroll Progress */}
        <div className="w-full max-w-7xl mx-auto flex items-center justify-between pt-4 border-t border-white/10 font-mono text-[10px] sm:text-xs text-white/50">
          <span>SCROLL VERTICALLY TO SLIDE HORIZONTALLY</span>

          <div className="flex items-center gap-3">
            <span>FILMSTRIP PROGRESS</span>
            <div className="w-32 sm:w-48 h-1 bg-white/15 rounded-full overflow-hidden">
              <div
                ref={progressBarRef}
                className="h-full bg-[#b8935a] transition-all duration-75 w-0"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
