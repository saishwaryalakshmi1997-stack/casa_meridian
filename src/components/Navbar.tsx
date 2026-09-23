"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, UtensilsCrossed, User, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { useDayNight } from "./DayNightContext";

export default function Navbar() {
  const [scrolled, setScrolled] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const pathname = usePathname();
  const { mode } = useDayNight();
  const isDay = mode === "day";

  const navRef = useRef<HTMLElement>(null);
  const reserveBtnRef = useRef<HTMLAnchorElement>(null);
  const logoRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Close mobile menu on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileMenuOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Close mobile menu if window is resized to desktop breakpoint
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Prevent background scrolling while mobile menu is expanded
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  const isHome = pathname === "/";
  const isFood = pathname === "/menu" || pathname === "/food";
  const isStay = pathname === "/my-stay" || pathname === "/stay";

  const isScrolledOrInner = scrolled || !isHome;

  // Staggered entrance animation for desktop nav items on mount
  useEffect(() => {
    if (navRef.current) {
      gsap.fromTo(
        navRef.current.querySelectorAll(".nav-link-item"),
        { y: -10, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.08, ease: "power2.out" }
      );
    }
  }, []);

  // GSAP animation when the Reserve CTA triggers on scroll
  useEffect(() => {
    if (reserveBtnRef.current && (scrolled || !isHome)) {
      gsap.fromTo(
        reserveBtnRef.current,
        { scale: 0.75, opacity: 0, x: 12 },
        { scale: 1, opacity: 1, x: 0, duration: 0.45, ease: "back.out(1.8)" }
      );
    }
  }, [scrolled, isHome]);

  const navItems = [
    {
      label: "Home",
      subtitle: "Oceanfront Sanctuary",
      href: "/",
      icon: Home,
      isActive: isHome,
    },
    {
      label: "Food",
      subtitle: "Coastal Dining & Fresh Catch",
      href: "/menu",
      icon: UtensilsCrossed,
      isActive: isFood,
    },
    {
      label: "My Stay",
      subtitle: "Guest Portal & Verification",
      href: "/my-stay",
      icon: User,
      isActive: isStay,
    },
  ];

  // GSAP micro-animations on link hover
  const handleLinkMouseEnter = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const icon = e.currentTarget.querySelector(".nav-icon");
    const indicator = e.currentTarget.querySelector(".active-indicator");
    if (icon) {
      gsap.to(icon, {
        scale: 1.25,
        y: -1.5,
        rotation: 4,
        duration: 0.25,
        ease: "back.out(2.2)",
      });
    }
    if (indicator) {
      gsap.to(indicator, {
        scaleX: 1.15,
        duration: 0.25,
        ease: "power2.out",
      });
    }
  };

  const handleLinkMouseLeave = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const icon = e.currentTarget.querySelector(".nav-icon");
    const indicator = e.currentTarget.querySelector(".active-indicator");
    if (icon) {
      gsap.to(icon, {
        scale: 1,
        y: 0,
        rotation: 0,
        duration: 0.3,
        ease: "power2.out",
      });
    }
    if (indicator) {
      gsap.to(indicator, {
        scaleX: 1,
        duration: 0.3,
        ease: "power2.out",
      });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${
        isScrolledOrInner
          ? isDay
            ? "bg-[#faf8f5]/92 backdrop-blur-md py-3 sm:py-3.5 border-b border-black/10 shadow-sm text-slate-900"
            : "bg-[#07131b]/92 backdrop-blur-md py-3 sm:py-3.5 border-b border-white/10 shadow-lg text-white"
          : "bg-transparent py-4 sm:py-6 text-white"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-8 md:px-12 lg:px-16 flex items-center justify-between">
        {/* Left: Circular Logo & Brand */}
        <Link
          ref={logoRef}
          href="/"
          className="flex items-center gap-2.5 sm:gap-3 group transition-transform duration-300 hover:scale-105"
          aria-label="Casa Meridian Home"
          onMouseEnter={() => {
            if (logoRef.current) {
              gsap.to(logoRef.current.querySelector(".logo-circle"), {
                scale: 1.08,
                duration: 0.3,
                ease: "back.out(2)",
              });
            }
          }}
          onMouseLeave={() => {
            if (logoRef.current) {
              gsap.to(logoRef.current.querySelector(".logo-circle"), {
                scale: 1,
                duration: 0.3,
                ease: "power2.out",
              });
            }
          }}
        >
          <div className="logo-circle relative w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden bg-white flex-shrink-0 shadow-md border border-white/40 transition-transform">
            <Image
              src="/logo.jpg"
              alt="Casa Meridian"
              fill
              priority
              className="object-cover"
              sizes="40px"
            />
          </div>

          <div className="flex flex-col">
            <span
              className={`font-sans font-bold text-xs sm:text-base tracking-[0.12em] uppercase leading-none transition-colors duration-500 ${
                isScrolledOrInner && isDay ? "text-slate-900" : "text-white"
              }`}
            >
              Casa Meridian
            </span>
            <span className="font-mono text-[8px] sm:text-[9px] tracking-[0.2em] text-[#b8935a] uppercase block mt-0.5 sm:mt-1">
              Private Beach Villa
            </span>
          </div>
        </Link>

        {/* Desktop Navigation: Sleek Horizontal Capsule with GSAP Hover Micro-Interactions */}
        <nav ref={navRef} className="hidden md:flex items-center gap-2 sm:gap-4 md:gap-5">
          {/* Navigation Pill Container */}
          <div
            className={`flex items-center gap-1 sm:gap-2 px-2 py-1 rounded-full transition-all duration-300 ${
              !isScrolledOrInner
                ? "bg-black/30 backdrop-blur-md border border-white/15 shadow-md"
                : isDay
                ? "bg-black/[0.03] border border-black/5"
                : "bg-white/[0.04] border border-white/5"
            }`}
          >
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = item.isActive;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onMouseEnter={handleLinkMouseEnter}
                  onMouseLeave={handleLinkMouseLeave}
                  className={`nav-link-item relative flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-medium px-3 py-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                    active
                      ? isDay
                        ? "text-[#0284c7] font-semibold bg-white/90 shadow-xs border border-[#0284c7]/20"
                        : "text-[#38bdf8] font-semibold bg-white/10 shadow-xs border border-[#38bdf8]/30"
                      : isScrolledOrInner && isDay
                      ? "text-slate-600 hover:text-slate-900 hover:bg-black/5"
                      : "text-white/80 hover:text-white hover:bg-white/10"
                  }`}
                >
                  <Icon
                    className={`nav-icon w-3.5 h-3.5 sm:w-4 sm:h-4 transition-colors will-change-transform ${
                      active
                        ? isDay
                          ? "text-[#0284c7]"
                          : "text-[#38bdf8]"
                        : "text-current"
                    }`}
                  />
                  <span className="nav-text font-sans tracking-wide transition-all">
                    {item.label}
                  </span>

                  {/* Active bottom accent glow */}
                  {active && (
                    <span className="active-indicator absolute bottom-0.5 left-3 right-3 h-[2px] rounded-full bg-gradient-to-r from-transparent via-[#0284c7] to-transparent dark:via-[#38bdf8] origin-center" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Reserve CTA: seamlessly appears on scroll so guests can reserve from any section */}
          {(scrolled || !isHome) && (
            <Link
              ref={reserveBtnRef}
              href="/reserve"
              className={`inline-flex items-center justify-center font-mono text-[10px] sm:text-xs tracking-[0.16em] uppercase px-4 sm:px-5 py-2 sm:py-2 rounded-full font-semibold transition-all duration-300 backdrop-blur-md hover:scale-105 active:scale-95 cursor-pointer border border-white hover:border-white ml-1 ${
                isDay
                  ? "text-slate-900 bg-white hover:bg-stone-50 shadow-[0_4px_16px_rgba(0,0,0,0.12),inset_0_1px_2px_rgba(255,255,255,1)]"
                  : "text-white bg-gradient-to-b from-white/25 via-white/10 to-black/40 hover:from-white/35 shadow-[0_6px_24px_rgba(0,0,0,0.6),inset_0_1px_2px_rgba(255,255,255,0.6)]"
              }`}
            >
              <span>Reserve</span>
            </Link>
          )}
        </nav>

        {/* Mobile Navigation Controls: Quick Reserve Pill + Collapsible Menu Toggle */}
        <div className="flex md:hidden items-center gap-2">
          {/* Quick Reserve CTA for Mobile (appears when scrolled or on inner pages) */}
          {(scrolled || !isHome) && (
            <Link
              href="/reserve"
              className={`inline-flex items-center justify-center font-mono text-[10px] tracking-[0.14em] uppercase active:scale-95 px-3 py-1.5 rounded-full font-semibold backdrop-blur-md transition-all border border-white hover:border-white ${
                isDay
                  ? "text-slate-900 bg-white hover:bg-stone-50 shadow-[0_3px_12px_rgba(0,0,0,0.1),inset_0_1px_1px_rgba(255,255,255,1)]"
                  : "text-white bg-gradient-to-b from-white/25 via-white/10 to-black/40 shadow-[0_4px_16px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.6)]"
              }`}
            >
              Reserve
            </Link>
          )}

          {/* Collapsible Hamburger Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer ${
              mobileMenuOpen
                ? isDay
                  ? "bg-black/10 text-slate-900 border border-black/15 shadow-sm"
                  : "bg-white/20 text-white border border-white/25 shadow-sm"
                : !isScrolledOrInner
                ? "bg-black/35 backdrop-blur-md border border-white/20 text-white active:scale-95"
                : isDay
                ? "bg-black/5 active:bg-black/10 border border-black/10 text-slate-800"
                : "bg-white/10 active:bg-white/15 border border-white/15 text-white"
            }`}
          >
            {mobileMenuOpen ? (
              <X className="w-4 h-4 transition-transform duration-300 rotate-90" />
            ) : (
              <Menu className="w-4 h-4 transition-transform duration-300" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Collapsible Menu Dropdown with Backdrop Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop Dimmer */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 top-0 bg-black/55 backdrop-blur-xs z-40 md:hidden"
            />

            {/* Floating Collapsible Menu Card */}
            <motion.div
              initial={{ opacity: 0, y: -12, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.97 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className={`absolute top-full left-3 right-3 mt-2 p-3 sm:p-4 rounded-2xl z-50 md:hidden shadow-2xl border transition-colors duration-300 ${
                isDay
                  ? "bg-[#faf8f5]/98 text-slate-900 border-black/10 shadow-[0_20px_45px_rgba(0,0,0,0.18)]"
                  : "bg-[#07131b]/98 text-white border-white/15 shadow-[0_25px_60px_rgba(0,0,0,0.85)]"
              } backdrop-blur-2xl`}
            >
              {/* Menu Links */}
              <div className="flex flex-col gap-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const active = item.isActive;
                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all duration-200 cursor-pointer ${
                        active
                          ? isDay
                            ? "bg-[#0284c7]/10 text-[#0284c7] font-semibold border border-[#0284c7]/25"
                            : "bg-[#38bdf8]/15 text-[#38bdf8] font-semibold border border-[#38bdf8]/30"
                          : isDay
                          ? "hover:bg-black/5 active:bg-black/10 text-slate-700"
                          : "hover:bg-white/5 active:bg-white/10 text-slate-200"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                            active
                              ? isDay
                                ? "bg-[#0284c7]/15 text-[#0284c7]"
                                : "bg-[#38bdf8]/20 text-[#38bdf8]"
                              : isDay
                              ? "bg-black/5 text-slate-600"
                              : "bg-white/10 text-slate-300"
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="flex flex-col text-left">
                          <span className="font-sans text-sm font-medium tracking-wide">
                            {item.label}
                          </span>
                          <span className="text-[10px] font-mono tracking-wider opacity-60">
                            {item.subtitle}
                          </span>
                        </div>
                      </div>

                      {active && (
                        <span className="w-2 h-2 rounded-full bg-[#0284c7] dark:bg-[#38bdf8] animate-pulse" />
                      )}
                    </Link>
                  );
                })}
              </div>

              {/* Elegant Hairline Divider */}
              <div
                className={`my-3 border-t ${
                  isDay ? "border-black/10" : "border-white/10"
                }`}
              />

              {/* Reserve Villa Action Button */}
              <Link
                href="/reserve"
                onClick={() => setMobileMenuOpen(false)}
                className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-mono text-xs uppercase tracking-[0.16em] font-semibold shadow-lg active:scale-[0.98] transition-all cursor-pointer backdrop-blur-md border border-white ${
                  isDay
                    ? "text-slate-900 bg-white hover:bg-stone-50 shadow-[0_6px_20px_rgba(0,0,0,0.1),inset_0_1px_2px_rgba(255,255,255,1)]"
                    : "text-white bg-gradient-to-b from-white/25 via-white/10 to-black/50 hover:from-white/35 shadow-[0_8px_25px_rgba(0,0,0,0.6),inset_0_1px_2px_rgba(255,255,255,0.6)]"
                }`}
              >
                <span>Reserve Your Stay</span>
                <span className="text-sm">→</span>
              </Link>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
