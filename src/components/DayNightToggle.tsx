"use client";

import { useDayNight } from "./DayNightContext";

export default function DayNightToggle() {
  const { mode, setMode } = useDayNight();

  return (
    <aside
      aria-label="Day and Night Ambiance Switcher"
      className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-[100] select-none animate-fade-in"
    >
      <div className="relative p-1 rounded-full bg-[#071118]/85 backdrop-blur-xl border border-white/20 shadow-[0_8px_30px_rgba(0,0,0,0.85)] flex items-center gap-0.5 sm:gap-1 transition-all duration-300 hover:border-white/35">
        {/* Sliding Active Indicator Pill */}
        <div
          className={`absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-full transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] ${
            mode === "day"
              ? "left-1 bg-gradient-to-r from-[#b8935a] to-[#d4af37] shadow-[0_0_16px_rgba(212,175,55,0.45)]"
              : "left-[calc(50%+2px)] bg-gradient-to-r from-slate-700 to-sky-900 shadow-[0_0_16px_rgba(56,189,248,0.35)]"
          }`}
        />

        {/* BY DAY BUTTON */}
        <button
          onClick={() => setMode("day")}
          aria-label="Switch to Day View"
          className={`relative z-10 flex items-center gap-1 sm:gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full font-mono text-[10px] sm:text-xs tracking-[0.14em] uppercase transition-colors duration-300 cursor-pointer ${
            mode === "day"
              ? "text-slate-950 font-bold"
              : "text-white/70 hover:text-white font-medium"
          }`}
        >
          <span className="text-xs sm:text-sm">☼</span>
          <span className="hidden xs:inline sm:inline">Day</span>
        </button>

        {/* BY NIGHT BUTTON */}
        <button
          onClick={() => setMode("night")}
          aria-label="Switch to Night View"
          className={`relative z-10 flex items-center gap-1 sm:gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full font-mono text-[10px] sm:text-xs tracking-[0.14em] uppercase transition-colors duration-300 cursor-pointer ${
            mode === "night"
              ? "text-white font-bold"
              : "text-white/70 hover:text-white font-medium"
          }`}
        >
          <span className="text-xs sm:text-sm">☾</span>
          <span className="hidden xs:inline sm:inline">Night</span>
        </button>
      </div>
    </aside>
  );
}
