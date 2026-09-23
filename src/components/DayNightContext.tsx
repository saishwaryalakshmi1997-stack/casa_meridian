"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type DayNightMode = "day" | "night";

interface DayNightContextType {
  mode: DayNightMode;
  setMode: (mode: DayNightMode) => void;
  toggleMode: () => void;
}

const DayNightContext = createContext<DayNightContextType>({
  mode: "day",
  setMode: () => {},
  toggleMode: () => {},
});

export function DayNightProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<DayNightMode>("day");

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("data-theme", mode);
      if (mode === "day") {
        document.documentElement.classList.remove("dark");
        document.documentElement.classList.add("light");
        document.body.style.colorScheme = "light";
      } else {
        document.documentElement.classList.remove("light");
        document.documentElement.classList.add("dark");
        document.body.style.colorScheme = "dark";
      }
    }
  }, [mode]);

  const toggleMode = () => {
    setMode((prev) => (prev === "day" ? "night" : "day"));
  };

  return (
    <DayNightContext.Provider value={{ mode, setMode, toggleMode }}>
      {children}
    </DayNightContext.Provider>
  );
}

export function useDayNight() {
  return useContext(DayNightContext);
}

