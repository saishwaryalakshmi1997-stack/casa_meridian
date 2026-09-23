"use client";

import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import ResidenceSection from "@/components/ResidenceSection";
import KeyAspectsSection from "@/components/KeyAspectsSection";
import AmenitiesSection from "@/components/AmenitiesSection";
import GallerySection from "@/components/GallerySection";
import TestimonialsSection from "@/components/TestimonialsSection";
import LocationSection from "@/components/LocationSection";
import Footer from "@/components/Footer";
import { useDayNight } from "@/components/DayNightContext";
import DayNightToggle from "@/components/DayNightToggle";

export default function Home() {
  const { mode } = useDayNight();

  return (
    <main
      className={`relative min-h-screen transition-colors duration-700 ${mode === "day" ? "bg-[#f5f2eb] text-slate-900" : "bg-black text-white"
        }`}
    >
      <HeroSection />
      <AboutSection />
      <ResidenceSection />
      <KeyAspectsSection />
      <AmenitiesSection />
      {/* <DayToNightWipeSection /> */}
      <GallerySection />
      <TestimonialsSection />
      <LocationSection />
      <Footer />
      <DayNightToggle />
    </main>
  );
}










