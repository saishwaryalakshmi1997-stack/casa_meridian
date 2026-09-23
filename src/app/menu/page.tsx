"use client";

import { Phone } from "lucide-react";
import { useDayNight } from "@/components/DayNightContext";
import Footer from "@/components/Footer";

function WhatsAppIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2zm.01 1.67c2.2 0 4.26.86 5.82 2.42a8.2 8.2 0 0 1 2.41 5.82c0 4.54-3.7 8.24-8.24 8.24-1.42 0-2.82-.37-4.06-1.08l-.29-.17-3.12.82.83-3.04-.19-.3a8.21 8.21 0 0 1-1.26-4.47c0-4.54 3.7-8.24 8.24-8.24zm4.52 11.66c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.07-.39-2.03-1.25-.75-.67-1.26-1.5-1.41-1.75-.14-.25-.02-.39.11-.51.11-.11.25-.29.37-.44.13-.14.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.35-.77-1.85-.2-.49-.41-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.13.17 1.77 2.7 4.29 3.79.6.26 1.07.41 1.44.53.6.19 1.15.16 1.58.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.14-1.18-.06-.11-.22-.18-.47-.3z" />
    </svg>
  );
}

interface MenuItem {
  name: string;
  price: string;
  isVeg: boolean;
  note?: string;
}

/* SECTION 1: SEAFOOD & MAINS */
const starters: MenuItem[] = [
  { name: "Vanjaram Fish Fry", price: "₹650", isVeg: false },
  { name: "Prawn Pepper Fry", price: "₹600", isVeg: false },
  { name: "Squid Milagu Roast", price: "₹550", isVeg: false },
  { name: "Country Chicken Pepper Fry", price: "₹450", isVeg: false },
  { name: "Chicken 65", price: "₹420", isVeg: false },
  { name: "Chicken Tikka", price: "₹450", isVeg: false },
  { name: "Tawa Fish", price: "₹650", isVeg: false, note: "If Available" },
];

const vegStartersSnacks: MenuItem[] = [
  { name: "Paneer Tikka", price: "₹515", isVeg: true },
  { name: "Potato Wedges", price: "₹325", isVeg: true },
  { name: "Avocado Toast", price: "₹515", isVeg: true },
  { name: "French Toast", price: "₹325", isVeg: true },
  { name: "Vegetable Salad", price: "₹325", isVeg: true },
];

const mains: MenuItem[] = [
  { name: "Meen Kuzhambu", price: "₹550", isVeg: false },
  { name: "Prawn Thokku", price: "₹600", isVeg: false },
  { name: "Chicken Chettinad", price: "₹480", isVeg: false },
  { name: "Egg Masala", price: "₹260", isVeg: false },
  { name: "Paneer Butter Masala", price: "₹485", isVeg: true },
];

/* SECTION 2: RICE, TIFFIN & SNACKS */
const riceAndBreads: MenuItem[] = [
  { name: "Jeera Rice", price: "₹195", isVeg: true },
  { name: "Steamed Rice", price: "₹145", isVeg: true },
  { name: "Curd Rice", price: "₹235", isVeg: true },
  { name: "Parotta", price: "₹80", isVeg: true },
  { name: "Chapati", price: "₹60", isVeg: true },
];

const riceAndNoodles: MenuItem[] = [
  { name: "Veg", price: "₹325", isVeg: true },
  { name: "Egg", price: "₹375", isVeg: false },
  { name: "Chicken", price: "₹400", isVeg: false },
  { name: "Seafood", price: "₹450", isVeg: false },
  { name: "Mixed", price: "₹500", isVeg: false },
];

const biryani: MenuItem[] = [
  { name: "Veg Biryani (Subzi)", price: "₹350", isVeg: true },
  { name: "Chicken Biryani", price: "₹400", isVeg: false },
  { name: "Mutton Biryani", price: "₹495", isVeg: false },
];

const southIndianTiffin: MenuItem[] = [
  { name: "Idly (2 pcs)", price: "₹120", isVeg: true },
  { name: "Dosa", price: "₹150", isVeg: true },
  { name: "Bajji / Bonda", price: "₹150", isVeg: true },
  { name: "Kuzhi Paniyaram", price: "₹180", isVeg: true },
];

const quickBites: MenuItem[] = [
  { name: "Tea", price: "₹50", isVeg: true },
  { name: "Coffee", price: "₹70", isVeg: true },
  { name: "Maggi", price: "₹120", isVeg: true },
  { name: "Bread Omelette / French Fries", price: "₹150", isVeg: false },
];

const addOns: MenuItem[] = [
  { name: "Sambar", price: "₹215", isVeg: true },
  { name: "Rasam", price: "₹215", isVeg: true },
  { name: "Milagu Rasam", price: "₹215", isVeg: true },
];

function MenuCard({
  title,
  items,
  isDay,
}: {
  title: string;
  items: MenuItem[];
  isDay: boolean;
}) {
  return (
    <div
      className={`rounded-2xl sm:rounded-3xl p-6 sm:p-7 border transition-all duration-300 ${
        isDay
          ? "bg-white border-black/10 shadow-sm hover:shadow-md"
          : "bg-[#0c1a22] border-white/10 shadow-lg"
      }`}
    >
      <div className="border-b border-black/10 dark:border-white/10 pb-3 mb-4">
        <h3 className="font-mono text-xs sm:text-sm uppercase tracking-[0.16em] text-[#b8935a] font-bold">
          {title}
        </h3>
      </div>

      <div className="divide-y divide-black/[0.04] dark:divide-white/[0.04]">
        {items.map((item) => (
          <div
            key={item.name}
            className="py-2.5 sm:py-3 flex items-start justify-between group transition-colors"
          >
            <div className="flex items-start gap-2.5 sm:gap-3">
              {/* Veg / Non-Veg indicator */}
              <span
                className={`w-2.5 h-2.5 rounded-full mt-1.5 flex-shrink-0 ${
                  item.isVeg
                    ? "bg-emerald-500 shadow-sm shadow-emerald-500/40"
                    : "bg-rose-500 shadow-sm shadow-rose-500/40"
                }`}
              />
              <div>
                <span
                  className={`font-sans text-sm sm:text-base font-medium transition-colors ${
                    isDay ? "text-slate-800" : "text-slate-200"
                  }`}
                >
                  {item.name}
                </span>
                {item.note && (
                  <span className="block font-mono text-[10px] text-slate-400 dark:text-slate-500 italic mt-0.5">
                    {item.note}
                  </span>
                )}
              </div>
            </div>

            {/* Price in high-contrast bold font (NOT golden) */}
            <span
              className={`font-mono text-sm sm:text-base font-semibold pl-4 whitespace-nowrap ${
                isDay ? "text-slate-900" : "text-white"
              }`}
            >
              {item.price}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function DiningMenuPage() {
  const { mode } = useDayNight();
  const isDay = mode === "day";

  return (
    <div
      className={`min-h-screen transition-colors duration-700 select-none flex flex-col justify-between ${
        isDay ? "bg-[#faf8f5] text-slate-900" : "bg-[#07131b] text-[#f6f3ec]"
      }`}
    >
      {/* Main Content Area */}
      <main className="max-w-6xl mx-auto w-full px-4 sm:px-8 md:px-12 pt-28 sm:pt-36 pb-36">
        {/* Page Title & Subtitle */}
        <div className="text-center mb-10 sm:mb-14">
          <h1
            className={`text-3xl sm:text-5xl md:text-6xl font-normal tracking-tight mb-3 transition-colors duration-500 ${
              isDay ? "text-slate-900" : "text-[#f6f3ec]"
            }`}
            style={{ fontFamily: "var(--font-fraunces), 'Playfair Display', Georgia, serif" }}
          >
            Dining Menu
          </h1>

          <p className="font-mono text-[11px] sm:text-xs tracking-[0.28em] text-[#b8935a] uppercase font-medium">
            Barefoot Luxury · Fresh Catch
          </p>

          {/* Section 1 Header: ~ Seafood & Mains ~ */}
          <div className="flex items-center justify-center gap-3 mt-6 sm:mt-8 mb-6">
            <span className="text-[#b8935a]/70 text-lg font-serif">~</span>
            <h2
              className={`text-xl sm:text-2xl font-serif italic tracking-wide transition-colors ${
                isDay ? "text-slate-800" : "text-amber-100/90"
              }`}
              style={{ fontFamily: "var(--font-fraunces), Georgia, serif" }}
            >
              Seafood &amp; Mains
            </h2>
            <span className="text-[#b8935a]/70 text-lg font-serif">~</span>
          </div>

          {/* Veg / Non-Veg Legend on top below the title (Static, non-clickable) */}
          <div className="flex items-center justify-center">
            <div
              className={`inline-flex items-center gap-5 sm:gap-6 px-5 py-2 rounded-full border shadow-sm select-none ${
                isDay ? "bg-white border-black/10" : "bg-[#0d1e29] border-white/10"
              }`}
            >
              <div className="flex items-center gap-2 font-mono text-xs">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-sm" />
                <span className={isDay ? "text-slate-700 font-medium" : "text-slate-200 font-medium"}>
                  Non-Veg
                </span>
              </div>

              <span className="w-px h-3.5 bg-black/10 dark:bg-white/10" />

              <div className="flex items-center gap-2 font-mono text-xs">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm" />
                <span className={isDay ? "text-slate-700 font-medium" : "text-slate-200 font-medium"}>
                  Veg
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 1: 2-COLUMN GRID (STARTERS, MAINS, VEG STARTERS) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {/* Left Column: Starters + Mains */}
          <div className="flex flex-col space-y-6 sm:space-y-8">
            <MenuCard title="Starters" items={starters} isDay={isDay} />
            <MenuCard title="Mains" items={mains} isDay={isDay} />
          </div>

          {/* Right Column: Veg Starters / Snacks */}
          <div className="flex flex-col space-y-6 sm:space-y-8">
            <MenuCard title="Veg Starters / Snacks" items={vegStartersSnacks} isDay={isDay} />
          </div>
        </div>

        {/* SECTION 2 HEADER: ― Rice, Tiffin & Snacks ― */}
        <div className="text-center mt-16 sm:mt-24 mb-8 sm:mb-12">
          <div className="flex items-center justify-center gap-3 sm:gap-4">
            <span className="w-8 sm:w-14 h-px bg-[#b8935a]/60" />
            <h2
              className={`text-xl sm:text-2xl font-serif italic tracking-wide transition-colors ${
                isDay ? "text-slate-800" : "text-amber-100/90"
              }`}
              style={{ fontFamily: "var(--font-fraunces), Georgia, serif" }}
            >
              Rice, Tiffin &amp; Snacks
            </h2>
            <span className="w-8 sm:w-14 h-px bg-[#b8935a]/60" />
          </div>
        </div>

        {/* SECTION 2: 2-COLUMN GRID (RICE & BREADS, NOODLES, BIRYANI, TIFFIN, QUICK BITES, ADD-ONS) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {/* Left Column */}
          <div className="flex flex-col space-y-6 sm:space-y-8">
            <MenuCard title="Rice & Breads" items={riceAndBreads} isDay={isDay} />
            <MenuCard title="Biryani" items={biryani} isDay={isDay} />
            <MenuCard title="Quick Bites" items={quickBites} isDay={isDay} />
          </div>

          {/* Right Column */}
          <div className="flex flex-col space-y-6 sm:space-y-8">
            <MenuCard title="Rice & Noodles (Classic / Schezwan)" items={riceAndNoodles} isDay={isDay} />
            <MenuCard title="South Indian Tiffin & Snacks" items={southIndianTiffin} isDay={isDay} />
            <MenuCard title="Add-Ons" items={addOns} isDay={isDay} />
          </div>
        </div>
      </main>

      {/* Floating Bottom Sticky Action Bar */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 sm:gap-4 px-4 max-w-full">
        {/* WhatsApp Button */}
        <a
          href="https://wa.me/919500003388?text=Hello%20Casa%20Meridian%20Kitchen,%20I%20would%20like%20to%20order%20from%20the%20dining%20menu."
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 bg-[#25D366] hover:bg-[#20ba59] text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-full font-sans text-xs sm:text-sm font-semibold shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 whitespace-nowrap cursor-pointer"
        >
          <WhatsAppIcon className="w-4 h-4 fill-white" />
          <span>WhatsApp</span>
        </a>

        {/* Call Kitchen Button */}
        <a
          href="tel:+919500003388"
          className="flex items-center gap-2 bg-[#e2b755] hover:bg-[#d4af37] text-slate-900 px-5 sm:px-6 py-2.5 sm:py-3 rounded-full font-sans text-xs sm:text-sm font-semibold shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 whitespace-nowrap cursor-pointer"
        >
          <Phone className="w-4 h-4 text-slate-900" />
          <span>Call Kitchen</span>
        </a>
      </div>

      {/* Identical Footer component as in Home Page */}
      <Footer />
    </div>
  );
}
