"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
  const [scrolled, setScrolled] = useState<boolean>(false);
  const [menuOpen, setMenuOpen] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const navLinks = [
    { href: "#about", label: "About" },
    { href: "#residence", label: "The Residence" },
    { href: "#amenities", label: "Amenities" },
    { href: "#experience", label: "Day & Night" },
    { href: "#gallery", label: "Gallery" },
    { href: "#location", label: "Location" },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled || menuOpen
            ? "bg-[#0a1a22]/90 backdrop-blur-md py-3.5 sm:py-4 border-b border-white/10 shadow-xl"
            : "bg-transparent py-5 sm:py-7"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-8 md:px-12 lg:px-16 flex items-center justify-between">
          {/* Left Corner: Circular Logo & Brand */}
          <Link
            href="/"
            onClick={() => setMenuOpen(false)}
            className="flex items-center gap-2.5 sm:gap-3 group transition-transform duration-300 hover:scale-105 z-50"
            aria-label="Casa Meridian Home"
          >
            <div className="relative w-9 h-9 sm:w-11 sm:h-11 rounded-full overflow-hidden bg-white flex-shrink-0 shadow-md border border-white/40">
              <Image
                src="/logo.jpg"
                alt="Casa Meridian"
                fill
                priority
                className="object-cover"
                sizes="48px"
              />
            </div>

            <div className="flex flex-col">
              <span className="font-sans font-bold text-xs sm:text-base text-white tracking-[0.14em] uppercase leading-none">
                Casa Meridian
              </span>
              <span className="font-mono text-[8px] sm:text-[9px] tracking-[0.2em] text-[#b8935a] uppercase block mt-0.5 sm:mt-1">
                Private Beach Villa
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links & Reserve CTA */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8">
            <div className="flex items-center gap-5 lg:gap-7 text-xs font-mono tracking-[0.2em] uppercase text-white/80">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="hover:text-amber-300 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Reserve CTA */}
            <a
              href="mailto:hello@casameridian.com"
              className="font-mono text-[10px] sm:text-xs tracking-[0.2em] uppercase text-[#0a1a22] bg-[#b8935a] hover:bg-[#d4af37] px-4 py-2 sm:px-5 sm:py-2.5 rounded-full font-semibold transition-all duration-300 shadow-md hover:shadow-[#b8935a]/40 hover:scale-105"
            >
              Reserve
            </a>
          </nav>

          {/* Mobile Right Controls: Reserve Button & Hamburger Toggle */}
          <div className="flex md:hidden items-center gap-3 z-50">
            <a
              href="mailto:hello@casameridian.com"
              className="font-mono text-[9px] tracking-[0.18em] uppercase text-[#0a1a22] bg-[#b8935a] hover:bg-[#d4af37] px-3 py-1.5 rounded-full font-semibold transition-all shadow"
            >
              Reserve
            </a>

            {/* Hamburger Button */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="w-9 h-9 rounded-full bg-white/10 border border-white/20 flex flex-col items-center justify-center gap-1.5 focus:outline-hidden"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
            >
              <span
                className={`w-4 h-[1.5px] bg-white transition-all duration-300 ${
                  menuOpen ? "rotate-45 translate-y-[4.5px]" : ""
                }`}
              />
              <span
                className={`w-4 h-[1.5px] bg-white transition-all duration-300 ${
                  menuOpen ? "-rotate-45 -translate-y-[3px]" : ""
                }`}
              />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Collapse Navigation Drawer */}
      <div
        className={`fixed inset-0 z-40 bg-[#071017]/98 backdrop-blur-xl md:hidden transition-all duration-500 flex flex-col justify-between pt-24 pb-8 px-6 overflow-y-auto ${
          menuOpen
            ? "opacity-100 pointer-events-auto translate-y-0"
            : "opacity-0 pointer-events-none -translate-y-4"
        }`}
      >
        {/* Navigation Items */}
        <div className="flex flex-col space-y-6 pt-4">
          <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-[#b8935a]">
            Navigation
          </span>

          <div className="flex flex-col space-y-4">
            {navLinks.map((link, idx) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="font-serif text-2xl text-slate-100 hover:text-amber-300 font-normal tracking-wide transition-colors flex items-center justify-between border-b border-white/5 pb-3"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                <span>{link.label}</span>
                <span className="font-mono text-xs text-white/40">
                  0{idx + 1}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Bottom Contact Details in Mobile Drawer */}
        <div className="pt-8 border-t border-white/10 space-y-4 font-mono text-xs text-slate-300">
          <div>
            <span className="text-[10px] text-amber-300/80 uppercase tracking-widest block mb-1">
              Direct Contact
            </span>
            <a
              href="tel:+919500003388"
              className="text-white hover:text-amber-300 transition-colors block text-sm"
            >
              +91 95000 03388
            </a>
            <a
              href="mailto:casameridianecr@gmail.com"
              className="text-slate-400 hover:text-white transition-colors block text-xs mt-0.5"
            >
              casameridianecr@gmail.com
            </a>
          </div>

          <a
            href="mailto:hello@casameridian.com"
            onClick={() => setMenuOpen(false)}
            className="w-full font-mono text-xs tracking-[0.2em] uppercase text-[#0a1a22] bg-[#b8935a] hover:bg-[#d4af37] py-3 rounded-xl font-semibold transition-all text-center block shadow-lg mt-2"
          >
            Reserve Your Stay
          </a>
        </div>
      </div>
    </>
  );
}
