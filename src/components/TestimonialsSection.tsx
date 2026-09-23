"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Star,
  MapPin,
  Music,
  Heart,
  CheckCircle2,
  Volume2,
} from "lucide-react";
import { useDayNight } from "./DayNightContext";

function InstagramIcon({ className = "w-3 h-3" }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

interface TestimonialItem {
  id: string;
  type: "review" | "story";
  title: string;
  rating?: number;
  quote: string;
  author: string;
  role: string;
  handle?: string;
  location?: string;
  bgImage: string;
  audioTrack?: string;
  badge?: string;
  highlights?: string[];
}

const testimonialsData: TestimonialItem[] = [
  {
    id: "adnan",
    type: "review",
    title: "Guest Testimonial",
    rating: 5,
    quote:
      "Our stay at Casa Meridian Villa, ECR was wonderful. The property is beautiful, well-maintained and has a warm, welcoming vibe. The highlight for us was the sea view from the room’s balcony — truly mesmerising. Clean, comfortable rooms, attentive staff, and a peaceful atmosphere made it a very pleasant getaway. Highly recommended for anyone looking for a relaxing beachside break on ECR!",
    author: "Adnan Hyderabadwala",
    role: "Guest",
    bgImage: "/bench.webp",
    badge: "Featured Guest Stay",
    highlights: ["Balcony Sea View", "Attentive Staff", "Peaceful Atmosphere"],
  },
  {
    id: "ig-story",
    type: "story",
    title: "Instagram Story Moment",
    quote: "my fav spot… listening to wild waves",
    author: "Guest Story",
    handle: "@casa_meridian_ecr",
    role: "Instagram Feedback",
    location: "Casa Meridian, ECR",
    audioTrack: "Wild Waves · Ocean Ambience",
    bgImage: "/rooftop_puppy.png",
    badge: "Social Love",
    highlights: ["Rooftop Sunset", "Wild Waves Sound", "Oceanfront Magic"],
  },
  {
    id: "family-review",
    type: "review",
    title: "Family & Friends Getaway",
    rating: 5,
    quote:
      "The property was amazing. Well maintained. The view was so good. I was very comfortable with the entire booking process as well. Definitely gonna visit again and recommend my friends and family.. 🥰",
    author: "Verified Guest",
    role: "Family Stay",
    bgImage: "/low_sit.webp",
    badge: "Booking & Stay Experience",
    highlights: ["Seamless Booking", "Well Maintained", "Spectacular Views"],
  },
];

export default function TestimonialsSection() {
  const { mode } = useDayNight();
  const isDay = mode === "day";

  const [isLiked, setIsLiked] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // GSAP animation references
  const sectionRef = useRef<HTMLElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const card1Ref = useRef<HTMLDivElement>(null);
  const card2Ref = useRef<HTMLDivElement>(null);
  const card3Ref = useRef<HTMLDivElement>(null);
  const stars1Ref = useRef<HTMLDivElement>(null);
  const stars2Ref = useRef<HTMLDivElement>(null);
  const storyImageRef = useRef<HTMLDivElement>(null);
  const locationBadgeRef = useRef<HTMLDivElement>(null);
  const musicPillRef = useRef<HTMLDivElement>(null);
  const heartBtnRef = useRef<HTMLButtonElement>(null);
  const badgesRef = useRef<HTMLDivElement>(null);
  const eyebrowRef = useRef<HTMLSpanElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const captionRef = useRef<HTMLParagraphElement>(null);

  const headlineText = "Memories Made by the Waves";
  const captionText =
    "Heartfelt impressions, sea-breeze afternoons, and quiet sunset conversations along Chennai's scenic East Coast Road.";

  // Interactive 3D tilt hover effects with GSAP
  const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>, card: HTMLDivElement | null) => {
    if (!card || window.innerWidth < 1024) return;
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    gsap.to(card, {
      rotationY: x * 8,
      rotationX: -y * 8,
      y: -6,
      scale: 1.015,
      duration: 0.35,
      ease: "power2.out",
      transformPerspective: 1000,
    });
  };

  const handleCardMouseLeave = (card: HTMLDivElement | null) => {
    if (!card || window.innerWidth < 1024) return;
    gsap.to(card, {
      rotationY: 0,
      rotationX: 0,
      y: 0,
      scale: 1,
      duration: 0.6,
      ease: "power2.out",
    });
  };

  const handleLikeClick = () => {
    const nextLiked = !isLiked;
    setIsLiked(nextLiked);
    if (heartBtnRef.current) {
      gsap.fromTo(
        heartBtnRef.current,
        { scale: 0.8 },
        { scale: 1.35, duration: 0.25, ease: "back.out(3)", yoyo: true, repeat: 1 }
      );
    }
  };

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isMobile = window.innerWidth < 768;

    let observer: IntersectionObserver | null = null;
    let headerTl: gsap.core.Timeline | null = null;

    const ctx = gsap.context(() => {
      // 1. Ambient Glow breathing animation
      if (glowRef.current && !prefersReducedMotion) {
        gsap.to(glowRef.current, {
          scale: 1.22,
          opacity: 0.85,
          duration: 5.5,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      }

      // 2. Story stickers gentle float animation
      if (locationBadgeRef.current && !prefersReducedMotion) {
        gsap.to(locationBadgeRef.current, {
          y: -4,
          duration: 2.8,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      }
      if (musicPillRef.current && !prefersReducedMotion) {
        gsap.to(musicPillRef.current, {
          y: 4,
          duration: 3.2,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: 0.4,
        });
      }

      // GSAP Text Reveal for Eyebrow, Headline, and Caption on mobile devices & desktop
      if (headerRef.current) {
        const headlineWords = headerRef.current.querySelectorAll(".headline-reveal-word");
        const captionWords = headerRef.current.querySelectorAll(".caption-reveal-word");

        headerTl = gsap.timeline({
          paused: true,
          scrollTrigger: {
            trigger: headerRef.current,
            start: isMobile ? "top 92%" : "top 85%",
            toggleActions: "play none none none",
            invalidateOnRefresh: true,
            onEnter: () => headerTl?.play(),
          },
        });

        if (eyebrowRef.current) {
          headerTl.fromTo(
            eyebrowRef.current,
            { opacity: 0, y: isMobile ? 12 : 16 },
            { opacity: 1, y: 0, duration: isMobile ? 0.5 : 0.55, ease: "power2.out" }
          );
        }

        if (headlineWords.length > 0) {
          headerTl.fromTo(
            headlineWords,
            {
              y: isMobile ? "115%" : "125%",
              opacity: 0,
              rotate: isMobile ? 1.2 : 1.5,
            },
            {
              y: "0%",
              opacity: 1,
              rotate: 0,
              duration: isMobile ? 0.75 : 0.8,
              stagger: isMobile ? 0.055 : 0.05,
              ease: "power3.out",
            },
            "-=0.35"
          );
        }

        if (captionWords.length > 0) {
          headerTl.fromTo(
            captionWords,
            { y: isMobile ? "105%" : "115%", opacity: 0 },
            {
              y: "0%",
              opacity: 1,
              duration: isMobile ? 0.5 : 0.55,
              stagger: 0.015,
              ease: "power2.out",
            },
            "-=0.5"
          );
        }

        // Guaranteed intersection trigger for mobile devices
        if (typeof window !== "undefined" && "IntersectionObserver" in window && headerRef.current) {
          observer = new IntersectionObserver(
            (entries) => {
              entries.forEach((entry) => {
                if (entry.isIntersecting && headerTl) {
                  headerTl.play();
                  observer?.disconnect();
                }
              });
            },
            { threshold: isMobile ? 0.1 : 0.15 }
          );
          observer.observe(headerRef.current);
        }
      }

      // 3. Main Entrance Timeline for Cards
      if (sectionRef.current) {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 72%",
          },
        });

        // Cards 3D Staggered Entrance
        if (prefersReducedMotion) {
          const cards = [card1Ref.current, card2Ref.current, card3Ref.current].filter(Boolean);
          tl.fromTo(
            cards,
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: "power2.out" },
            "-=0.5"
          );
        } else {
          // Card 1: glides from left with slight 3D rotation
          if (card1Ref.current) {
            tl.fromTo(
              card1Ref.current,
              { opacity: 0, y: 55, x: -35, rotateY: -6, scale: 0.94 },
              { opacity: 1, y: 0, x: 0, rotateY: 0, scale: 1, duration: 1.05, ease: "power3.out" },
              "-=0.6"
            );
          }
          // Card 2: Centerpiece rises with elevated prominence
          if (card2Ref.current) {
            tl.fromTo(
              card2Ref.current,
              { opacity: 0, y: 75, scale: 0.9 },
              { opacity: 1, y: 0, scale: 1, duration: 1.15, ease: "back.out(1.15)" },
              "-=0.8"
            );
          }
          // Card 3: glides from right with slight 3D rotation
          if (card3Ref.current) {
            tl.fromTo(
              card3Ref.current,
              { opacity: 0, y: 55, x: 35, rotateY: 6, scale: 0.94 },
              { opacity: 1, y: 0, x: 0, rotateY: 0, scale: 1, duration: 1.05, ease: "power3.out" },
              "-=0.8"
            );
          }
        }

        // Star rating pop stagger
        const starGroups = [stars1Ref.current, stars2Ref.current];
        starGroups.forEach((starsContainer) => {
          if (starsContainer && !prefersReducedMotion) {
            const starIcons = starsContainer.children;
            tl.fromTo(
              starIcons,
              { scale: 0, opacity: 0, rotation: -20 },
              {
                scale: 1,
                opacity: 1,
                rotation: 0,
                duration: 0.45,
                stagger: 0.06,
                ease: "back.out(2.2)",
              },
              "-=0.5"
            );
          }
        });

        // Highlight badges stagger pop in Card 3
        if (badgesRef.current && !prefersReducedMotion) {
          tl.fromTo(
            badgesRef.current.children,
            { scale: 0.7, opacity: 0, y: 10 },
            {
              scale: 1,
              opacity: 1,
              y: 0,
              duration: 0.45,
              stagger: 0.08,
              ease: "back.out(2)",
            },
            "-=0.35"
          );
        }
      }

      // 4. Parallax effect on Story Image
      if (storyImageRef.current && sectionRef.current && !prefersReducedMotion) {
        gsap.fromTo(
          storyImageRef.current,
          { y: -20, scale: 1.08 },
          {
            y: 20,
            scale: 1.02,
            ease: "none",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top bottom",
              end: "bottom top",
              scrub: 1,
            },
          }
        );
      }
    }, sectionRef);

    const refreshTimer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 350);

    return () => {
      clearTimeout(refreshTimer);
      observer?.disconnect();
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="testimonials"
      className={`relative z-10 w-full py-14 sm:py-20 md:py-28 px-4 sm:px-8 md:px-12 lg:px-16 overflow-hidden border-t transition-colors duration-700 select-none ${isDay
        ? "bg-[#f5f2eb] text-slate-900 border-black/10"
        : "bg-[#07131b] text-[#f6f3ec] border-white/10"
        }`}
    >
      {/* Ambient background glow accents */}
      <div
        ref={glowRef}
        className={`absolute top-1/3 left-1/2 -translate-x-1/2 w-[650px] h-[650px] rounded-full blur-[150px] pointer-events-none transition-opacity duration-700 will-change-transform ${isDay ? "bg-amber-200/20" : "bg-[#b8935a]/10"
          }`}
      />

      <div className="max-w-7xl mx-auto">
        {/* Section Header with GSAP Text Reveal */}
        <div ref={headerRef} className="max-w-3xl mx-auto text-center flex flex-col items-center mb-8 sm:mb-12 md:mb-16">
          <span
            ref={eyebrowRef}
            className="font-mono text-[11px] sm:text-xs tracking-[0.25em] text-[#b8935a] uppercase block mb-2 will-change-transform"
          >
            [ Guest Stories & Reviews ]
          </span>
          <h2
            ref={headlineRef}
            className={`text-2xl sm:text-4xl md:text-5xl lg:text-[46px] font-normal tracking-tight leading-[1.15] mb-2.5 sm:mb-3 transition-colors duration-700 flex flex-wrap justify-center ${isDay ? "text-slate-900" : "text-[#f6f3ec]"
              }`}
            style={{ fontFamily: "var(--font-fraunces), 'Playfair Display', Georgia, serif" }}
          >
            {headlineText.split(" ").map((word, i) => (
              <span key={i} className="inline-block overflow-hidden pb-1 -mb-1 mr-[0.28em] last:mr-0">
                <span className="headline-reveal-word inline-block will-change-transform">
                  {word}
                </span>
              </span>
            ))}
          </h2>
          <p
            ref={captionRef}
            className={`text-xs sm:text-base md:text-lg max-w-xl leading-relaxed font-normal transition-colors duration-700 flex flex-wrap justify-center ${isDay ? "text-slate-700" : "text-slate-300/80"
              }`}
          >
            {captionText.split(" ").map((word, i) => (
              <span key={i} className="inline-block overflow-hidden mr-[0.24em] last:mr-0">
                <span className="caption-reveal-word inline-block will-change-transform">
                  {word}
                </span>
              </span>
            ))}
          </p>
        </div>

        {/* ======================================================== */}
        {/* 3-COLUMN CURATED STORIES GRID WITH 3D PERSPECTIVE */}
        {/* ======================================================== */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8" style={{ perspective: "1200px" }}>
          {/* CARD 1: Adnan Hyderabadwala Review */}
          <div
            ref={card1Ref}
            onMouseMove={(e) => handleCardMouseMove(e, card1Ref.current)}
            onMouseLeave={() => handleCardMouseLeave(card1Ref.current)}
            className={`rounded-3xl p-6 sm:p-8 flex flex-col justify-between border transition-shadow duration-300 will-change-transform ${isDay
              ? "bg-white border-[#e0d8cc] shadow-sm hover:shadow-2xl text-slate-900"
              : "bg-[#0f1d24] border-white/10 shadow-lg hover:shadow-2xl text-white"
              }`}
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div ref={stars1Ref} className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-[#b8935a] text-[#b8935a]"
                    />
                  ))}
                </div>
                <span className="font-mono text-[9px] tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-[#b8935a]/15 text-[#996e2e] dark:text-amber-300 border border-[#b8935a]/30">
                  Featured Stay
                </span>
              </div>

              <h4
                className={`text-xl font-serif font-normal mb-3 leading-snug ${isDay ? "text-slate-900" : "text-white"
                  }`}
                style={{ fontFamily: "var(--font-fraunces), Georgia, serif" }}
              >
                “Truly mesmerising sea view from the balcony…”
              </h4>

              <p
                className={`text-sm sm:text-base leading-relaxed font-normal mb-6 ${isDay ? "text-slate-700" : "text-slate-300/80"
                  }`}
              >
                “Our stay at Casa Meridian Villa, ECR was wonderful. The property is beautiful, well-maintained and has a warm, welcoming vibe. The highlight for us was the sea view from the room’s balcony — truly mesmerising. Clean, comfortable rooms, attentive staff, and a peaceful atmosphere made it a very pleasant getaway.”
              </p>
            </div>

            <div className="border-t border-black/5 dark:border-white/10 pt-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#b8935a]/20 text-[#996e2e] dark:text-[#d4af37] border border-[#b8935a]/30 flex items-center justify-center font-serif text-sm font-bold">
                  AH
                </div>
                <div>
                  <span className="font-sans text-sm font-semibold block">
                    Adnan Hyderabadwala
                  </span>
                  <span className="font-mono text-[10px] text-[#b8935a] uppercase tracking-wider block">
                    Verified Guest
                  </span>
                </div>
              </div>
              <CheckCircle2 className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            </div>
          </div>

          {/* CARD 2: Aesthetic Instagram Story Card */}
          <div
            ref={card2Ref}
            onMouseMove={(e) => handleCardMouseMove(e, card2Ref.current)}
            onMouseLeave={() => handleCardMouseLeave(card2Ref.current)}
            className="relative rounded-3xl overflow-hidden border border-black/10 dark:border-white/15 shadow-xl min-h-[420px] flex flex-col justify-between p-6 group transition-shadow duration-300 will-change-transform hover:shadow-2xl"
          >
            {/* Story Background */}
            <div ref={storyImageRef} className="absolute inset-0 z-0 will-change-transform">
              <Image
                src="/rooftop_puppy.png"
                alt="Instagram story feedback at Casa Meridian"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
                sizes="(max-width: 768px) 100vw, 400px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/50" />
            </div>

            {/* Instagram Story Top Bar */}
            <div className="relative z-10">
              <div className="w-full bg-white/30 h-1 rounded-full overflow-hidden mb-3">
                <div className="bg-white h-full w-4/5 animate-pulse" />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full p-0.5 bg-gradient-to-tr from-amber-400 via-rose-500 to-purple-600">
                    <div className="w-full h-full rounded-full bg-white overflow-hidden relative">
                      <Image
                        src="/logo.jpg"
                        alt="Casa Meridian Profile"
                        fill
                        className="object-cover"
                        sizes="36px"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-1">
                      <span className="font-sans text-xs font-bold text-white">
                        casa_meridian_ecr
                      </span>
                      <span className="w-1 h-1 rounded-full bg-white/60" />
                      <span className="font-sans text-[10px] text-white/70">2h</span>
                    </div>
                    <span className="font-mono text-[9px] text-[#e5b866] block">
                      Mentioned in Guest Story
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                  className="w-7 h-7 rounded-full bg-black/40 backdrop-blur-md text-white/90 hover:text-white flex items-center justify-center border border-white/20 transition-colors cursor-pointer"
                  title="Toggle Sound"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Story Location Sticker */}
              <div ref={locationBadgeRef} className="mt-4">
                <div className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-md border border-white/30 px-3 py-1 rounded-full text-white text-xs font-medium shadow-md">
                  <MapPin className="w-3.5 h-3.5 text-rose-400" />
                  <span>Casa Meridian, ECR</span>
                </div>
              </div>
            </div>

            {/* Story Text Overlay (The User's Feedback Quote) */}
            <div className="relative z-10 my-auto text-center py-6">
              <div className="inline-block bg-black/40 backdrop-blur-md border border-white/20 px-5 py-3.5 rounded-2xl shadow-xl">
                <p
                  className="text-xl sm:text-2xl font-serif italic text-white leading-relaxed drop-shadow-md"
                  style={{ fontFamily: "var(--font-fraunces), Georgia, serif" }}
                >
                  “my fav spot… listening to wild waves”
                </p>
                <div className="flex items-center justify-center gap-1.5 text-amber-200 mt-2 font-mono text-[11px]">
                  <span>🌊</span>
                  <span>Sunset Rooftop Bliss</span>
                  <span>✨</span>
                </div>
              </div>

              {/* Music sticker */}
              <div ref={musicPillRef} className="mt-4 inline-flex items-center gap-2 bg-black/50 backdrop-blur-md border border-white/20 px-3 py-1 rounded-full text-[11px] text-white/90">
                <Music className="w-3 h-3 text-[#b8935a] animate-spin" style={{ animationDuration: "4s" }} />
                <span className="font-mono text-[10px]">Wild Waves · Ocean Sounds</span>
                <div className="flex items-end gap-0.5 h-2.5 ml-0.5">
                  <span className="w-0.5 h-1.5 bg-[#e5b866] rounded-full animate-pulse" />
                  <span className="w-0.5 h-2.5 bg-[#e5b866] rounded-full animate-pulse" style={{ animationDelay: "150ms" }} />
                  <span className="w-0.5 h-2 bg-[#e5b866] rounded-full animate-pulse" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </div>

            {/* Instagram Bottom Reply / Like Bar */}
            <div className="relative z-10 flex items-center gap-3 pt-2">
              <div className="flex-1 bg-white/15 backdrop-blur-md rounded-full border border-white/20 px-4 py-2 text-xs text-white/80 font-sans">
                Reply to story...
              </div>

              <button
                ref={heartBtnRef}
                type="button"
                onClick={handleLikeClick}
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors backdrop-blur-md border cursor-pointer ${isLiked
                  ? "bg-rose-500 text-white border-rose-400"
                  : "bg-white/15 text-white border-white/20 hover:bg-white/25"
                  }`}
                aria-label="Like story"
              >
                <Heart className={`w-4 h-4 ${isLiked ? "fill-white" : ""}`} />
              </button>
            </div>
          </div>

          {/* CARD 3: Booking Process & Family Recommendation Review */}
          <div
            ref={card3Ref}
            onMouseMove={(e) => handleCardMouseMove(e, card3Ref.current)}
            onMouseLeave={() => handleCardMouseLeave(card3Ref.current)}
            className={`rounded-3xl p-6 sm:p-8 flex flex-col justify-between border transition-shadow duration-300 will-change-transform ${isDay
              ? "bg-white border-[#e0d8cc] shadow-sm hover:shadow-2xl text-slate-900"
              : "bg-[#0f1d24] border-white/10 shadow-lg hover:shadow-2xl text-white"
              }`}
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div ref={stars2Ref} className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-[#b8935a] text-[#b8935a]"
                    />
                  ))}
                </div>
                <span className="font-mono text-[9px] tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-teal-500/15 text-teal-700 dark:text-teal-300 border border-teal-500/30">
                  Verified Booking
                </span>
              </div>

              <h4
                className={`text-xl font-serif font-normal mb-3 leading-snug ${isDay ? "text-slate-900" : "text-white"
                  }`}
                style={{ fontFamily: "var(--font-fraunces), Georgia, serif" }}
              >
                “The property was amazing. Well maintained. The view was so good…”
              </h4>

              <p
                className={`text-sm sm:text-base leading-relaxed font-normal mb-6 ${isDay ? "text-slate-700" : "text-slate-300/80"
                  }`}
              >
                “I was very comfortable with the entire booking process as well. Definitely gonna visit again and recommend my friends and family.. 🥰”
              </p>

              {/* Highlight Badges */}
              <div ref={badgesRef} className="flex flex-wrap gap-2 mb-4">
                {["Effortless Booking", "Sparkling Clean", "Stunning Ocean View"].map((highlight) => (
                  <span
                    key={highlight}
                    className={`font-mono text-[9px] uppercase tracking-wider px-2.5 py-1 rounded-md border ${isDay
                      ? "bg-[#f5f0e6] border-[#dcd3c4] text-slate-700"
                      : "bg-white/5 border-white/10 text-stone-300"
                      }`}
                  >
                    ✓ {highlight}
                  </span>
                ))}
              </div>
            </div>

            <div className="border-t border-black/5 dark:border-white/10 pt-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#b8935a]/20 text-[#996e2e] dark:text-[#d4af37] border border-[#b8935a]/30 flex items-center justify-center font-serif text-sm font-bold">
                  VG
                </div>
                <div>
                  <span className="font-sans text-sm font-semibold block">
                    Verified Guest
                  </span>
                  <span className="font-mono text-[10px] text-[#b8935a] uppercase tracking-wider block">
                    Private Villa Stay
                  </span>
                </div>
              </div>
              <CheckCircle2 className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
