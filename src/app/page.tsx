import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import ResidenceSection from "@/components/ResidenceSection";
import AmenitiesSection from "@/components/AmenitiesSection";
import DayToNightWipeSection from "@/components/DayToNightWipeSection";
import GallerySection from "@/components/GallerySection";
import LocationSection from "@/components/LocationSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="relative min-h-screen bg-black">
      <HeroSection />
      <AboutSection />
      <ResidenceSection />
      <AmenitiesSection />
      <DayToNightWipeSection />
      <GallerySection />
      <LocationSection />
      <Footer />
    </main>
  );
}








