"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  format,
  startOfToday,
  parseISO,
  addDays,
} from "date-fns";
import { DayPicker, DateRange } from "react-day-picker";
import "react-day-picker/style.css";
import {
  Calendar as CalendarIcon,
  ChevronRight,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowLeft,
  X,
  ShieldAlert,
  Info,
} from "lucide-react";
import { useDayNight } from "@/components/DayNightContext";
import DayNightToggle from "@/components/DayNightToggle";
import Footer from "@/components/Footer";

type AccommodationType =
  | "whole_villa"
  | "ground_floor_garden"
  | "second_floor_beach_view"
  | "terrace_suite";

interface FormState {
  checkIn: string | null;
  checkOut: string | null;
  guests: number;
  accommodationType: AccommodationType;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  notes: string;
  honeypot: string; // Spam protection honeypot
}

export default function ReservePage() {
  const { mode } = useDayNight();
  const isDay = mode === "day";

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [bookedRanges, setBookedRanges] = useState<{ from: Date; to: Date }[]>([]);
  const [range, setRange] = useState<DateRange | undefined>(undefined);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reservationId, setReservationId] = useState<string | null>(null);

  const [formData, setFormData] = useState<FormState>({
    checkIn: null,
    checkOut: null,
    guests: 2,
    accommodationType: "whole_villa",
    firstName: "",
    lastName: "",
    email: "anaya.sharma@example.com",
    phone: "98401 23456",
    notes: "",
    honeypot: "",
  });

  // Fetch live availability from API
  useEffect(() => {
    async function loadAvailability() {
      try {
        const res = await fetch("/api/availability");
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) {
            const formatted = data
              .filter((item: any) => item.check_in && item.check_out)
              .map((item: any) => ({
                from: parseISO(item.check_in),
                to: parseISO(item.check_out),
              }));
            setBookedRanges(formatted);
          }
        }
      } catch (err) {
        console.error("Could not fetch availability dates:", err);
      }
    }
    loadAvailability();
  }, []);

  const today = startOfToday();
  // Separate picker tracker: 'checkIn' | 'checkOut' | null
  const [activePicker, setActivePicker] = useState<"checkIn" | "checkOut" | null>(null);
  const [checkInMonth, setCheckInMonth] = useState<Date>(today);
  const [checkOutMonth, setCheckOutMonth] = useState<Date>(today);
  const pickerRef = useRef<HTMLDivElement>(null);

  // Close datepicker on outside click or Escape key
  useEffect(() => {
    function handleClickOutside(event: MouseEvent | TouchEvent) {
      if (
        pickerRef.current &&
        !pickerRef.current.contains(event.target as Node)
      ) {
        setActivePicker(null);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setActivePicker(null);
      }
    }

    if (activePicker) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [activePicker]);

  const checkInDate = formData.checkIn ? parseISO(formData.checkIn) : undefined;
  const checkOutDate = formData.checkOut ? parseISO(formData.checkOut) : undefined;

  // Handle selecting Check-In Date (auto-closes after selection)
  const handleSelectCheckIn = (date: Date | undefined) => {
    if (!date) return;
    const formatted = format(date, "yyyy-MM-dd");

    let newCheckOut = formData.checkOut;
    if (newCheckOut) {
      const parsedOut = parseISO(newCheckOut);
      if (parsedOut <= date) {
        newCheckOut = null;
      }
    }

    setFormData((prev) => ({
      ...prev,
      checkIn: formatted,
      checkOut: newCheckOut,
    }));

    if (newCheckOut) {
      setRange({ from: date, to: parseISO(newCheckOut) });
    } else {
      setRange({ from: date, to: undefined });
    }

    // Auto-close check-in picker on selection
    setTimeout(() => {
      setActivePicker(null);
    }, 200);
  };

  // Handle selecting Check-Out Date (auto-closes after selection)
  const handleSelectCheckOut = (date: Date | undefined) => {
    if (!date) return;
    const formatted = format(date, "yyyy-MM-dd");

    setFormData((prev) => ({
      ...prev,
      checkOut: formatted,
    }));

    if (formData.checkIn) {
      setRange({ from: parseISO(formData.checkIn), to: date });
    }

    // Auto-close check-out picker on selection
    setTimeout(() => {
      setActivePicker(null);
    }, 200);
  };

  // Calculate weekday and weekend nights count
  const { weekdayNights, weekendNights, totalNights, hasWeekend } = useMemo(() => {
    if (!formData.checkIn || !formData.checkOut) {
      return { weekdayNights: 0, weekendNights: 0, totalNights: 0, hasWeekend: false };
    }

    const start = parseISO(formData.checkIn);
    const end = parseISO(formData.checkOut);
    let weekdays = 0;
    let weekends = 0;
    let current = new Date(start);

    while (current < end) {
      const day = current.getDay(); // 0 = Sun, 5 = Fri, 6 = Sat
      if (day === 0 || day === 5 || day === 6) {
        weekends++;
      } else {
        weekdays++;
      }
      current = addDays(current, 1);
    }

    return {
      weekdayNights: weekdays,
      weekendNights: weekends,
      totalNights: weekdays + weekends,
      hasWeekend: weekends > 0,
    };
  }, [formData.checkIn, formData.checkOut]);

  // Auto-switch to Whole Villa if weekend is selected (weekend policy enforcement)
  useEffect(() => {
    if (hasWeekend && formData.accommodationType !== "whole_villa") {
      setFormData((prev) => ({ ...prev, accommodationType: "whole_villa" }));
    }
  }, [hasWeekend, formData.accommodationType]);

  // Pricing calculations
  const tariffDetails = useMemo(() => {
    const type = formData.accommodationType;
    let total = 0;
    let breakdown = "";

    if (type === "whole_villa") {
      const weekdayCost = weekdayNights * 50000;
      const weekendCost = weekendNights * 60000;
      total = weekdayCost + weekendCost;

      const parts = [];
      if (weekdayNights > 0) parts.push(`${weekdayNights} Weekday × ₹50,000`);
      if (weekendNights > 0) parts.push(`${weekendNights} Weekend × ₹60,000`);
      breakdown = parts.join(" + ") || "Select dates";
    } else if (type === "ground_floor_garden") {
      total = totalNights * 8000;
      breakdown = `${totalNights} Night${totalNights === 1 ? "" : "s"} × ₹8,000`;
    } else if (type === "second_floor_beach_view") {
      total = totalNights * 10000;
      breakdown = `${totalNights} Night${totalNights === 1 ? "" : "s"} × ₹10,000`;
    } else if (type === "terrace_suite") {
      total = totalNights * 13000;
      breakdown = `${totalNights} Night${totalNights === 1 ? "" : "s"} × ₹13,000`;
    }

    return { total, breakdown };
  }, [formData.accommodationType, weekdayNights, weekendNights, totalNights]);

  // Handle client-side submission to /api/reserve
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (
      !formData.firstName.trim() ||
      !formData.lastName.trim() ||
      !formData.email.trim() ||
      !formData.phone.trim()
    ) {
      setError("Please fill in your name, email, and contact phone number.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/reserve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          estimatedTotal: tariffDetails.total,
          breakdown: tariffDetails.breakdown,
        }),
      });

      const json = await res.json();

      if (res.ok && json.success) {
        setReservationId(json.id || `CM-${Date.now().toString().slice(-6)}`);
        setStep(4);
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        setError(json.error || "Something went wrong. Please try again.");
      }
    } catch (err) {
      console.error("Submission failed:", err);
      setError("Network error occurred. Please check your connection and retry.");
    } finally {
      setSubmitting(false);
    }
  };

  const checkInDisabledDates = [{ before: today }, ...bookedRanges];
  const checkOutMinDate = checkInDate ? addDays(checkInDate, 1) : addDays(today, 1);
  const checkOutDisabledDates = [{ before: checkOutMinDate }, ...bookedRanges];

  const accommodationOptions = [
    {
      id: "whole_villa" as AccommodationType,
      title: "Whole Villa Exclusive",
      subtitle: "Full estate privacy, infinity pool, manicured lawns, up to 12 guests",
      weekdayPrice: "₹50,000 / night (Weekdays)",
      weekendPrice: "₹60,000 / night (Weekends)",
      popular: true,
      disabled: false,
    },
    {
      id: "terrace_suite" as AccommodationType,
      title: "Terrace Suite (Beach View)",
      subtitle: "Top-floor penthouse suite with private oceanfront terrace",
      weekdayPrice: "₹13,000 / night",
      weekendPrice: "Unavailable on weekends",
      disabled: hasWeekend,
    },
    {
      id: "second_floor_beach_view" as AccommodationType,
      title: "Second Floor Beach View Suite",
      subtitle: "Elevated coastal vistas, private balcony & ensuite bath",
      weekdayPrice: "₹10,000 / night",
      weekendPrice: "Unavailable on weekends",
      disabled: hasWeekend,
    },
    {
      id: "ground_floor_garden" as AccommodationType,
      title: "Ground Floor Garden Suite",
      subtitle: "Direct garden patio access, serene greenery & king bed",
      weekdayPrice: "₹8,000 / night",
      weekendPrice: "Unavailable on weekends",
      disabled: hasWeekend,
    },
  ];

  return (
    <div
      className={`min-h-screen relative overflow-hidden font-sans transition-colors duration-700 ${isDay ? "bg-[#f5f2eb] text-slate-900" : "bg-[#08121a] text-[#f6f3ec]"
        }`}
    >
      {/* Background ambient lighting */}
      <div
        className={`absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[450px] pointer-events-none blur-3xl -z-10 transition-all duration-700 ${isDay
            ? "bg-radial from-[#b8935a]/15 via-amber-200/20 to-transparent"
            : "bg-radial from-[#b8935a]/15 via-transparent to-transparent"
          }`}
      />

      <main className="pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">

        {/* MAIN LUXURY CARD CONTAINER */}
        <div
          className={`rounded-3xl p-6 sm:p-10 relative transition-all duration-700 ${isDay
              ? "bg-[#fcfbfa] border border-[#ded7ca] text-slate-800 shadow-[0_20px_60px_rgba(20,15,10,0.06)]"
              : "bg-[#182b36] border border-[#28404e] text-white shadow-2xl"
            }`}
        >
          {/* Header Title */}
          <div className="text-center mb-8">
            <span
              className={`font-mono text-[11px] uppercase tracking-[0.3em] block mb-2 font-semibold ${isDay ? "text-[#996e2e]" : "text-[#b8935a]"
                }`}
            >
              CASA MERIDIAN
            </span>
            <h1
              className={`text-3xl sm:text-4xl md:text-5xl font-serif font-normal tracking-tight mb-2 transition-colors duration-500 ${isDay ? "text-slate-900" : "text-white"
                }`}
              style={{ fontFamily: "var(--font-fraunces), Georgia, serif" }}
            >
              {step === 4 ? "Reservation Requested" : "Reserve Your Stay"}
            </h1>
            <p
              className={`text-xs sm:text-sm max-w-md mx-auto font-light leading-relaxed transition-colors duration-500 ${isDay ? "text-slate-600" : "text-stone-300"
                }`}
            >
              {step === 4
                ? "Your booking inquiry has been recorded and submitted to our concierge team."
                : "Experience unparalleled privacy and oceanfront luxury along the East Coast Road."}
            </p>
          </div>

          {/* Stepper Navigation Bar */}
          <div className="mb-8">
            <div className="grid grid-cols-4 gap-2 sm:gap-4 relative">
              {[
                { num: 1, label: "Dates & Stay" },
                { num: 2, label: "Review" },
                { num: 3, label: "Your Details" },
                { num: 4, label: "Confirmation" },
              ].map((s) => {
                const isActive = step === s.num;
                const isPast = step > s.num;
                return (
                  <div
                    key={s.num}
                    className={`flex flex-col items-center text-center transition-all duration-300 ${isActive
                        ? "opacity-100"
                        : isPast
                          ? "opacity-85"
                          : "opacity-45"
                      }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-mono text-xs font-medium mb-1.5 border transition-all duration-300 ${isActive
                          ? "bg-[#b8935a] text-white border-[#b8935a] shadow-lg shadow-[#b8935a]/30 scale-105 font-bold"
                          : isPast
                            ? isDay
                              ? "bg-[#b8935a]/15 text-[#996e2e] border-[#b8935a]/40 font-bold"
                              : "bg-[#b8935a]/20 text-[#d4af37] border-[#b8935a]/40"
                            : isDay
                              ? "bg-slate-100 text-slate-400 border-slate-200"
                              : "bg-white/5 text-stone-400 border-white/10"
                        }`}
                    >
                      {isPast ? "✓" : `0${s.num}`}
                    </div>
                    <span
                      className={`font-mono text-[9px] sm:text-[10px] uppercase tracking-wider hidden sm:block transition-colors ${isActive
                          ? isDay
                            ? "text-slate-900 font-semibold"
                            : "text-white font-semibold"
                          : isPast
                            ? isDay
                              ? "text-slate-700 font-medium"
                              : "text-stone-300"
                            : isDay
                              ? "text-slate-400"
                              : "text-stone-500"
                        }`}
                    >
                      {s.label}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Progress Bar Line */}
            <div
              className={`w-full h-0.5 mt-3 rounded-full overflow-hidden transition-colors ${isDay ? "bg-slate-200/80" : "bg-white/10"
                }`}
            >
              <div
                className="bg-gradient-to-r from-[#b8935a] to-[#e4be77] h-full transition-all duration-500"
                style={{ width: `${((step - 1) / 3) * 100}%` }}
              />
            </div>
          </div>

          {/* ======================================================== */}
          {/* STEP 1: DATES, STAY TYPE & GUESTS */}
          {/* ======================================================== */}
          {step === 1 && (
            <div className="space-y-7 animate-fadeIn">
              {/* 1. Dates Section */}
              <div>
                <label
                  className={`font-mono text-[11px] uppercase tracking-[0.2em] block mb-2 font-semibold ${isDay ? "text-[#996e2e]" : "text-[#b8935a]"
                    }`}
                >
                  1. Select Dates of Stay
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 relative">
                  {/* Check-In Card Wrapper */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => {
                        if (checkInDate) setCheckInMonth(checkInDate);
                        setActivePicker((prev) => (prev === "checkIn" ? null : "checkIn"));
                      }}
                      className={`w-full text-left border rounded-xl p-3.5 transition-all duration-300 flex items-center justify-between group cursor-pointer ${activePicker === "checkIn"
                          ? isDay
                            ? "bg-amber-50/90 border-[#b8935a] shadow-md ring-1 ring-[#b8935a]/30"
                            : "bg-[#b8935a]/20 border-[#b8935a] shadow-lg"
                          : isDay
                            ? "bg-white border-[#ded7ca] hover:border-[#b8935a]/70 hover:shadow-xs"
                            : "bg-[#102028] border-[#243b47] hover:border-[#b8935a]/60"
                        }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${activePicker === "checkIn"
                              ? "bg-[#b8935a] text-white"
                              : isDay
                                ? "bg-[#f7f3eb] text-[#996e2e] group-hover:bg-[#efe6d6]"
                                : "bg-white/5 text-[#b8935a] group-hover:bg-[#b8935a]/20"
                            }`}
                        >
                          <CalendarIcon className="w-4 h-4" />
                        </div>
                        <div>
                          <span
                            className={`font-mono text-[9px] uppercase tracking-widest block font-medium ${isDay ? "text-[#996e2e]" : "text-[#b8935a]"
                              }`}
                          >
                            Check-In
                          </span>
                          <span
                            className={`text-sm font-medium block mt-0.5 transition-colors ${isDay
                                ? checkInDate
                                  ? "text-slate-900"
                                  : "text-slate-500"
                                : "text-white"
                              }`}
                          >
                            {checkInDate
                              ? format(checkInDate, "EEE, MMM dd, yyyy")
                              : "Touch to select check-in"}
                          </span>
                        </div>
                      </div>
                      <span
                        className={`font-mono text-[10px] underline underline-offset-4 hidden sm:block transition-colors ${isDay
                            ? "text-slate-500 group-hover:text-slate-900"
                            : "text-stone-400 group-hover:text-white"
                          }`}
                      >
                        {checkInDate ? "Change" : "Select"}
                      </span>
                    </button>

                    {/* Compact Popover for Check-In (Overlapping Selecting Area) */}
                    {activePicker === "checkIn" && (
                      <div
                        ref={pickerRef}
                        className={`absolute z-50 top-0 left-1/2 -translate-x-1/2 sm:translate-x-0 sm:left-0 w-[285px] max-w-[calc(100vw-2.5rem)] rounded-2xl p-2.5 shadow-2xl border transition-all duration-200 animate-fadeIn ${isDay
                            ? "bg-white border-slate-200/90 shadow-[0_20px_50px_rgba(0,0,0,0.14)] text-slate-900"
                            : "bg-[#0d1b22] border-[#294250] shadow-[0_20px_50px_rgba(0,0,0,0.7)] text-white"
                          }`}
                      >
                        <DayPicker
                          mode="single"
                          selected={checkInDate}
                          onSelect={handleSelectCheckIn}
                          disabled={checkInDisabledDates}
                          startMonth={today}
                          month={checkInMonth}
                          onMonthChange={setCheckInMonth}
                          navLayout="around"
                          showOutsideDays
                          numberOfMonths={1}
                          pagedNavigation
                          formatters={{
                            formatWeekdayName: (date) => format(date, "EEE").toUpperCase(),
                          }}
                        />
                      </div>
                    )}
                  </div>

                  {/* Check-Out Card Wrapper */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => {
                        if (checkOutDate) setCheckOutMonth(checkOutDate);
                        else if (checkInDate) setCheckOutMonth(checkInDate);
                        setActivePicker((prev) => (prev === "checkOut" ? null : "checkOut"))
                      }}
                      className={`w-full text-left border rounded-xl p-3.5 transition-all duration-300 flex items-center justify-between group cursor-pointer ${activePicker === "checkOut"
                          ? isDay
                            ? "bg-amber-50/90 border-[#b8935a] shadow-md ring-1 ring-[#b8935a]/30"
                            : "bg-[#b8935a]/20 border-[#b8935a] shadow-lg"
                          : isDay
                            ? "bg-white border-[#ded7ca] hover:border-[#b8935a]/70 hover:shadow-xs"
                            : "bg-[#102028] border-[#243b47] hover:border-[#b8935a]/60"
                        }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${activePicker === "checkOut"
                              ? "bg-[#b8935a] text-white"
                              : isDay
                                ? "bg-[#f7f3eb] text-[#996e2e] group-hover:bg-[#efe6d6]"
                                : "bg-white/5 text-[#b8935a] group-hover:bg-[#b8935a]/20"
                            }`}
                        >
                          <CalendarIcon className="w-4 h-4" />
                        </div>
                        <div>
                          <span
                            className={`font-mono text-[9px] uppercase tracking-widest block font-medium ${isDay ? "text-[#996e2e]" : "text-[#b8935a]"
                              }`}
                          >
                            Check-Out
                          </span>
                          <span
                            className={`text-sm font-medium block mt-0.5 transition-colors ${isDay
                                ? checkOutDate
                                  ? "text-slate-900"
                                  : "text-slate-500"
                                : "text-white"
                              }`}
                          >
                            {checkOutDate
                              ? format(checkOutDate, "EEE, MMM dd, yyyy")
                              : "Touch to select check-out"}
                          </span>
                        </div>
                      </div>
                      <span
                        className={`font-mono text-[10px] underline underline-offset-4 hidden sm:block transition-colors ${isDay
                            ? "text-slate-500 group-hover:text-slate-900"
                            : "text-stone-400 group-hover:text-white"
                          }`}
                      >
                        {checkOutDate ? "Change" : "Select"}
                      </span>
                    </button>

                    {/* Compact Popover for Check-Out (Overlapping Selecting Area) */}
                    {activePicker === "checkOut" && (
                      <div
                        ref={pickerRef}
                        className={`absolute z-50 top-0 left-1/2 -translate-x-1/2 sm:translate-x-0 sm:left-auto sm:right-0 w-[285px] max-w-[calc(100vw-2.5rem)] rounded-2xl p-2.5 shadow-2xl border transition-all duration-200 animate-fadeIn ${isDay
                            ? "bg-white border-slate-200/90 shadow-[0_20px_50px_rgba(0,0,0,0.14)] text-slate-900"
                            : "bg-[#0d1b22] border-[#294250] shadow-[0_20px_50px_rgba(0,0,0,0.7)] text-white"
                          }`}
                      >
                        <DayPicker
                          mode="single"
                          selected={checkOutDate}
                          onSelect={handleSelectCheckOut}
                          disabled={checkOutDisabledDates}
                          startMonth={today}
                          month={checkOutMonth}
                          onMonthChange={setCheckOutMonth}
                          navLayout="around"
                          showOutsideDays
                          numberOfMonths={1}
                          pagedNavigation
                          formatters={{
                            formatWeekdayName: (date) => format(date, "EEE").toUpperCase(),
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* DayPicker Compact Global Styling */}
                <style jsx global>{`
                  .rdp-root {
                    --rdp-accent-color: #b8935a;
                    --rdp-accent-background-color: ${isDay ? "rgba(184, 147, 90, 0.15)" : "rgba(184, 147, 90, 0.2)"};
                    --rdp-day-height: 32px;
                    --rdp-day-width: 34px;
                    --rdp-day_button-height: 30px;
                    --rdp-day_button-width: 30px;
                    --rdp-day_button-border-radius: 9999px;
                    --rdp-nav-height: 2rem;
                    --rdp-nav_button-height: 1.75rem;
                    --rdp-nav_button-width: 1.75rem;
                    margin: 0 auto;
                    color: ${isDay ? "#1e293b" : "#f1f5f9"};
                  }
                  .rdp-month {
                    display: flex;
                    flex-direction: column;
                    gap: 0.2rem;
                    position: relative;
                  }
                  .rdp-month_caption {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    position: relative;
                    height: 2rem;
                    margin-bottom: 0.25rem;
                    pointer-events: none;
                  }
                  .rdp-caption_label {
                    font-family: inherit;
                    font-size: 0.95rem;
                    font-weight: 700;
                    color: ${isDay ? "#0f172a" : "#f8fafc"};
                    letter-spacing: -0.01em;
                    pointer-events: auto;
                  }
                  .rdp-button_previous,
                  .rdp-button_next {
                    position: absolute;
                    top: 0;
                    width: 28px !important;
                    height: 28px !important;
                    display: inline-flex !important;
                    align-items: center;
                    justify-content: center;
                    border-radius: 9999px;
                    border: 1px solid ${isDay ? "#e2e8f0" : "rgba(255, 255, 255, 0.15)"};
                    background: ${isDay ? "#f8fafc" : "rgba(255, 255, 255, 0.08)"};
                    color: ${isDay ? "#334155" : "#e2e8f0"};
                    cursor: pointer !important;
                    z-index: 30 !important;
                    pointer-events: auto !important;
                    transition: all 0.15s ease;
                  }
                  .rdp-button_previous {
                    left: 4px !important;
                  }
                  .rdp-button_next {
                    right: 4px !important;
                  }
                  .rdp-button_previous:hover:not(:disabled),
                  .rdp-button_next:hover:not(:disabled) {
                    background: ${isDay ? "#e2e8f0" : "rgba(184, 147, 90, 0.3)"};
                    color: ${isDay ? "#0f172a" : "#ffffff"};
                    border-color: #b8935a;
                  }
                  .rdp-button_previous:disabled,
                  .rdp-button_next:disabled,
                  .rdp-button_previous[aria-disabled="true"],
                  .rdp-button_next[aria-disabled="true"] {
                    opacity: 0.25 !important;
                    cursor: not-allowed !important;
                    pointer-events: none !important;
                  }
                  .rdp-chevron {
                    fill: currentColor !important;
                    width: 14px;
                    height: 14px;
                    pointer-events: none !important;
                  }
                  .rdp-weekday {
                    font-family: var(--font-ibm-mono), monospace;
                    font-size: 0.65rem;
                    font-weight: 600;
                    color: ${isDay ? "#64748b" : "#94a3b8"};
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                    padding: 0.25rem 0;
                    text-align: center;
                  }
                  .rdp-day_button {
                    font-family: inherit;
                    font-size: 0.8rem;
                    font-weight: 500;
                    color: ${isDay ? "#1e293b" : "#f1f5f9"};
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 0 auto;
                    transition: all 0.15s ease;
                  }
                  .rdp-day_button:hover:not([disabled]) {
                    background-color: ${isDay ? "rgba(184, 147, 90, 0.18)" : "rgba(184, 147, 90, 0.25)"} !important;
                    color: ${isDay ? "#0f172a" : "#ffffff"} !important;
                  }
                  .rdp-selected .rdp-day_button {
                    background-color: #b8935a !important;
                    color: #ffffff !important;
                    font-weight: 700;
                    box-shadow: 0 2px 8px rgba(184, 147, 90, 0.4);
                  }
                  .rdp-today:not(.rdp-selected) .rdp-day_button {
                    border: 1.5px dashed #b8935a;
                    font-weight: 600;
                  }
                  .rdp-outside .rdp-day_button {
                    opacity: 0.35;
                    color: ${isDay ? "#94a3b8" : "#64748b"} !important;
                  }
                  .rdp-day[aria-disabled="true"] .rdp-day_button {
                    opacity: 0.25;
                    cursor: not-allowed;
                    text-decoration: line-through;
                    color: ${isDay ? "#cbd5e1" : "#475569"} !important;
                  }
                `}</style>
              </div>

              {/* 2. Accommodation Selection & Tariff Cards */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label
                    className={`font-mono text-[11px] uppercase tracking-[0.2em] block font-semibold ${isDay ? "text-[#996e2e]" : "text-[#b8935a]"
                      }`}
                  >
                    2. Choose Accommodation & Tariff
                  </label>
                  {hasWeekend && (
                    <span
                      className={`font-mono text-[10px] px-2.5 py-0.5 rounded-full flex items-center gap-1 ${isDay
                          ? "text-amber-800 bg-amber-50 border border-amber-300/80 font-medium"
                          : "text-amber-300 bg-amber-500/10 border border-amber-500/30"
                        }`}
                    >
                      <ShieldAlert className="w-3 h-3" /> Weekend: Whole Villa Only
                    </span>
                  )}
                </div>

                <div className="space-y-2.5">
                  {accommodationOptions.map((opt) => {
                    const isSelected = formData.accommodationType === opt.id;
                    return (
                      <div
                        key={opt.id}
                        onClick={() => {
                          if (!opt.disabled) {
                            setFormData((prev) => ({
                              ...prev,
                              accommodationType: opt.id,
                            }));
                          }
                        }}
                        className={`border rounded-2xl p-4 transition-all duration-300 cursor-pointer relative ${opt.disabled
                            ? isDay
                              ? "bg-slate-100/70 border-slate-200 opacity-50 cursor-not-allowed"
                              : "bg-[#102028]/40 border-white/5 opacity-50 cursor-not-allowed"
                            : isSelected
                              ? isDay
                                ? "bg-[#faf6ee] border-[#b8935a] shadow-md shadow-[#b8935a]/10 ring-1 ring-[#b8935a]/40"
                                : "bg-[#b8935a]/15 border-[#b8935a] shadow-lg shadow-[#b8935a]/10"
                              : isDay
                                ? "bg-white border-[#ded7ca] hover:border-[#b8935a]/60 hover:shadow-xs"
                                : "bg-[#102028] border-[#243b47] hover:border-[#b8935a]/50"
                          }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-2">
                              <span
                                className={`font-serif text-base font-medium transition-colors ${isDay ? "text-slate-900" : "text-white"
                                  }`}
                              >
                                {opt.title}
                              </span>
                              {opt.popular && (
                                <span className="bg-[#b8935a] text-white font-mono text-[9px] uppercase px-2 py-0.5 rounded-full font-bold">
                                  Recommended
                                </span>
                              )}
                            </div>
                            <p
                              className={`text-xs font-light transition-colors ${isDay ? "text-slate-500" : "text-stone-400"
                                }`}
                            >
                              {opt.subtitle}
                            </p>
                          </div>

                          <div className="text-left sm:text-right font-mono text-xs flex-shrink-0">
                            {opt.id === "whole_villa" ? (
                              <div>
                                <span
                                  className={`block ${isDay ? "text-slate-700" : "text-stone-300"
                                    }`}
                                >
                                  Weekdays:{" "}
                                  <strong className={isDay ? "text-slate-900" : "text-white"}>
                                    ₹50,000
                                  </strong>
                                  /nt
                                </span>
                                <span
                                  className={`block text-[11px] font-medium ${isDay ? "text-[#996e2e]" : "text-[#b8935a]"
                                    }`}
                                >
                                  Weekends:{" "}
                                  <strong className={isDay ? "text-[#85642a]" : "text-[#e4be77]"}>
                                    ₹60,000
                                  </strong>
                                  /nt
                                </span>
                              </div>
                            ) : (
                              <div>
                                <span
                                  className={`font-semibold block text-sm ${isDay ? "text-[#996e2e]" : "text-[#b8935a]"
                                    }`}
                                >
                                  {opt.weekdayPrice}
                                </span>
                                {opt.disabled && (
                                  <span
                                    className={`text-[10px] block ${isDay ? "text-slate-400" : "text-stone-500"
                                      }`}
                                  >
                                    Weekends Full Villa Only
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Selection Indicator */}
                        <div className="absolute top-4 right-4 hidden sm:block">
                          <div
                            className={`w-4 h-4 rounded-full border flex items-center justify-center ${isSelected
                                ? "border-[#b8935a] bg-[#b8935a]"
                                : isDay
                                  ? "border-slate-300 bg-white"
                                  : "border-white/20"
                              }`}
                          >
                            {isSelected && (
                              <div className="w-1.5 h-1.5 rounded-full bg-white" />
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Weekend Policy Info Note */}
                <div
                  className={`rounded-xl p-3 mt-3 flex items-start gap-2.5 text-xs transition-colors ${isDay
                      ? "bg-amber-50/80 border border-amber-200/80 text-amber-900"
                      : "bg-[#0f1f28] border border-[#243b47] text-stone-300"
                    }`}
                >
                  <Info
                    className={`w-4 h-4 flex-shrink-0 mt-0.5 ${isDay ? "text-[#996e2e]" : "text-[#b8935a]"
                      }`}
                  />
                  <span className="font-light leading-relaxed">
                    <strong>Note:</strong> On weekends (Friday to Sunday nights), Casa Meridian is exclusively available as a Whole Villa reservation to ensure complete estate privacy.
                  </span>
                </div>
              </div>

              {/* 3. Number of Guests */}
              <div
                className={`pt-5 flex items-center justify-between border-t transition-colors ${isDay ? "border-slate-200" : "border-white/10"
                  }`}
              >
                <div>
                  <span
                    className={`font-serif text-base block font-medium ${isDay ? "text-slate-900" : "text-white"
                      }`}
                  >
                    Number of Guests
                  </span>

                </div>

                <div
                  className={`flex items-center gap-3 rounded-full px-3 py-1 transition-colors ${isDay
                      ? "bg-white border border-[#ded7ca] shadow-xs"
                      : "bg-[#102028] border border-[#243b47]"
                    }`}
                >
                  <button
                    type="button"
                    onClick={() =>
                      setFormData((p) => ({
                        ...p,
                        guests: Math.max(1, p.guests - 1),
                      }))
                    }
                    disabled={formData.guests <= 1}
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-base font-mono transition-colors disabled:opacity-30 cursor-pointer ${isDay
                        ? "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                        : "text-stone-300 hover:text-white"
                      }`}
                  >
                    -
                  </button>

                  <span
                    className={`font-mono text-sm font-semibold w-5 text-center ${isDay ? "text-[#996e2e]" : "text-[#b8935a]"
                      }`}
                  >
                    {formData.guests}
                  </span>

                  <button
                    type="button"
                    onClick={() =>
                      setFormData((p) => ({
                        ...p,
                        guests: Math.min(12, p.guests + 1),
                      }))
                    }
                    disabled={formData.guests >= 12}
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-base font-mono transition-colors disabled:opacity-30 cursor-pointer ${isDay
                        ? "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                        : "text-stone-300 hover:text-white"
                      }`}
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Price Estimation Bar */}
              {totalNights > 0 && (
                <div
                  className={`rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors ${isDay
                      ? "bg-[#f8f5ef] border border-[#ded7ca] shadow-xs"
                      : "bg-[#102028] border border-[#b8935a]/40 shadow-inner"
                    }`}
                >
                  <div>
                    <span
                      className={`font-mono text-[10px] uppercase tracking-widest block font-medium ${isDay ? "text-[#996e2e]" : "text-[#b8935a]"
                        }`}
                    >
                      Estimated Tariff ({totalNights} {totalNights === 1 ? "Night" : "Nights"})
                    </span>
                    <span
                      className={`text-xs font-mono ${isDay ? "text-slate-600" : "text-stone-400"
                        }`}
                    >
                      {tariffDetails.breakdown}
                    </span>
                  </div>
                  <div className="text-left sm:text-right">
                    <span
                      className={`text-xl sm:text-2xl font-serif font-bold block ${isDay ? "text-slate-900" : "text-white"
                        }`}
                    >
                      ₹{tariffDetails.total.toLocaleString("en-IN")}
                    </span>
                    <span
                      className={`text-[10px] font-mono ${isDay ? "text-slate-500" : "text-stone-500"
                        }`}
                    >
                      Inclusive of stay & amenities
                    </span>
                  </div>
                </div>
              )}

              {/* Bottom Action Button */}
              <div
                className={`flex justify-between items-center pt-3 border-t transition-colors ${isDay ? "border-slate-200" : "border-white/10"
                  }`}
              >
                <div
                  className={`font-mono text-xs ${isDay ? "text-slate-500" : "text-stone-400"
                    }`}
                >
                  {totalNights > 0 ? (
                    <span>
                      Duration:{" "}
                      <strong className={isDay ? "text-[#996e2e]" : "text-[#b8935a]"}>
                        {totalNights} {totalNights === 1 ? "Night" : "Nights"}
                      </strong>
                    </span>
                  ) : (
                    <span>Please select your dates</span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => setStep(2)}
                  disabled={!formData.checkIn || !formData.checkOut}
                  className="font-mono text-xs uppercase tracking-[0.2em] bg-[#b8935a] hover:bg-[#a37e46] text-white px-6 py-3.5 rounded-full font-semibold transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2 hover:scale-105 active:scale-95 cursor-pointer"
                >
                  Continue to Review
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* STEP 2: REVIEW */}
          {/* ======================================================== */}
          {step === 2 && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <h2
                  className={`text-xl sm:text-2xl font-serif mb-1 transition-colors ${isDay ? "text-slate-900" : "text-white"
                    }`}
                  style={{ fontFamily: "var(--font-fraunces), Georgia, serif" }}
                >
                  2. Review Stay Summary
                </h2>
                <p
                  className={`text-xs font-mono ${isDay ? "text-slate-500" : "text-stone-400"
                    }`}
                >
                  Please verify your itinerary and tariff details before proceeding.
                </p>
              </div>

              {/* Overview Card */}
              <div
                className={`rounded-2xl p-5 space-y-4 border transition-colors ${isDay
                    ? "bg-white border-[#ded7ca] shadow-xs"
                    : "bg-[#102028] border-[#243b47]"
                  }`}
              >
                <div
                  className={`flex items-center justify-between border-b pb-3 ${isDay ? "border-slate-200" : "border-white/10"
                    }`}
                >
                  <div>
                    <span
                      className={`font-mono text-[10px] uppercase tracking-widest block font-medium ${isDay ? "text-[#996e2e]" : "text-[#b8935a]"
                        }`}
                    >
                      Selected Stay Option
                    </span>
                    <h3
                      className={`text-lg font-serif mt-0.5 font-medium ${isDay ? "text-slate-900" : "text-white"
                        }`}
                    >
                      {accommodationOptions.find((o) => o.id === formData.accommodationType)?.title}
                    </h3>
                  </div>
                  <div className="text-right">
                    <span
                      className={`text-xs font-mono block ${isDay ? "text-slate-500" : "text-stone-400"
                        }`}
                    >
                      Estimated Total
                    </span>
                    <span
                      className={`text-lg sm:text-xl font-serif font-bold ${isDay ? "text-[#996e2e]" : "text-[#b8935a]"
                        }`}
                    >
                      ₹{tariffDetails.total.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
                  <div>
                    <span
                      className={`uppercase tracking-widest text-[9px] block ${isDay ? "text-slate-500" : "text-stone-400"
                        }`}
                    >
                      Check-In
                    </span>
                    <span
                      className={`font-medium block mt-0.5 ${isDay ? "text-slate-900" : "text-white"
                        }`}
                    >
                      {formData.checkIn ? format(parseISO(formData.checkIn), "dd MMM yyyy") : "-"}
                    </span>
                    <span className={isDay ? "text-slate-500 text-[10px]" : "text-stone-500 text-[10px]"}>
                      From 2:00 PM
                    </span>
                  </div>

                  <div>
                    <span
                      className={`uppercase tracking-widest text-[9px] block ${isDay ? "text-slate-500" : "text-stone-400"
                        }`}
                    >
                      Check-Out
                    </span>
                    <span
                      className={`font-medium block mt-0.5 ${isDay ? "text-slate-900" : "text-white"
                        }`}
                    >
                      {formData.checkOut ? format(parseISO(formData.checkOut), "dd MMM yyyy") : "-"}
                    </span>
                    <span className={isDay ? "text-slate-500 text-[10px]" : "text-stone-500 text-[10px]"}>
                      Until 11:00 AM
                    </span>
                  </div>

                  <div>
                    <span
                      className={`uppercase tracking-widest text-[9px] block ${isDay ? "text-slate-500" : "text-stone-400"
                        }`}
                    >
                      Duration
                    </span>
                    <span
                      className={`font-medium block mt-0.5 ${isDay ? "text-[#996e2e]" : "text-[#b8935a]"
                        }`}
                    >
                      {totalNights} {totalNights === 1 ? "Night" : "Nights"}
                    </span>
                    <span className={isDay ? "text-slate-500 text-[10px]" : "text-stone-500 text-[10px]"}>
                      {weekdayNights}wkd / {weekendNights}wke
                    </span>
                  </div>

                  <div>
                    <span
                      className={`uppercase tracking-widest text-[9px] block ${isDay ? "text-slate-500" : "text-stone-400"
                        }`}
                    >
                      Guests
                    </span>
                    <span
                      className={`font-medium block mt-0.5 ${isDay ? "text-slate-900" : "text-white"
                        }`}
                    >
                      {formData.guests} {formData.guests === 1 ? "Guest" : "Guests"}
                    </span>
                  </div>
                </div>

                {/* Tariff calculation breakdown pill */}
                <div
                  className={`rounded-xl p-3 flex justify-between items-center text-xs font-mono border transition-colors ${isDay
                      ? "bg-[#f8f5ef] border-[#ded7ca] text-slate-700"
                      : "bg-[#0a1a22] border-white/5"
                    }`}
                >
                  <span className={isDay ? "text-slate-500" : "text-stone-400"}>Rate Breakdown</span>
                  <span className={isDay ? "text-[#996e2e] font-semibold" : "text-[#d4af37]"}>
                    {tariffDetails.breakdown}
                  </span>
                </div>
              </div>

              {/* Transparency Note */}
              <div
                className={`rounded-xl p-4 flex items-start gap-3 border transition-colors ${isDay
                    ? "bg-amber-50/80 border-amber-200/80"
                    : "bg-[#b8935a]/10 border-[#b8935a]/30"
                  }`}
              >
                <Sparkles
                  className={`w-4 h-4 flex-shrink-0 mt-0.5 ${isDay ? "text-[#996e2e]" : "text-[#b8935a]"
                    }`}
                />
                <div
                  className={`text-xs font-light leading-relaxed ${isDay ? "text-slate-700" : "text-stone-300"
                    }`}
                >
                  <strong
                    className={`font-serif block mb-0.5 ${isDay ? "text-slate-900" : "text-white"
                      }`}
                  >
                    Concierge Verification
                  </strong>
                  Our concierge team will contact you to confirm payment terms, check-in instructions, and any custom dining or setup preferences.
                </div>
              </div>

              {/* Navigation Controls */}
              <div
                className={`flex justify-between items-center pt-3 border-t transition-colors ${isDay ? "border-slate-200" : "border-white/10"
                  }`}
              >
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className={`font-mono text-xs uppercase tracking-[0.15em] px-4 py-2.5 rounded-full transition-colors flex items-center gap-1.5 cursor-pointer ${isDay
                      ? "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                      : "text-stone-400 hover:text-white"
                    }`}
                >
                  <ArrowLeft className="w-4 h-4" />
                  Edit Dates & Stay
                </button>

                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="font-mono text-xs uppercase tracking-[0.2em] bg-[#b8935a] hover:bg-[#a37e46] text-white px-6 py-3.5 rounded-full font-semibold transition-all duration-300 shadow-md hover:shadow-lg flex items-center gap-2 hover:scale-105 active:scale-95 cursor-pointer"
                >
                  Continue to Guest Details
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* STEP 3: YOUR DETAILS (Contact Information Form) */}
          {/* ======================================================== */}
          {step === 3 && (
            <form onSubmit={handleSubmit} className="space-y-5 animate-fadeIn">
              <div>
                <h2
                  className={`text-xl sm:text-2xl font-serif mb-1 transition-colors ${isDay ? "text-slate-900" : "text-white"
                    }`}
                  style={{ fontFamily: "var(--font-fraunces), Georgia, serif" }}
                >
                  3. Your Contact Details
                </h2>
                <p
                  className={`text-xs font-mono ${isDay ? "text-slate-500" : "text-stone-400"
                    }`}
                >
                  We will use these details to contact you regarding your reservation.
                </p>
              </div>

              {error && (
                <div
                  className={`text-xs px-4 py-3 rounded-xl border ${isDay
                      ? "bg-red-50 border-red-200 text-red-700"
                      : "bg-red-950/60 border-red-500/50 text-red-200"
                    }`}
                >
                  {error}
                </div>
              )}

              {/* Invisible Honeypot Spam Protection */}
              <div className="hidden" aria-hidden="true">
                <label htmlFor="website-hp">Do not fill this</label>
                <input
                  id="website-hp"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={formData.honeypot}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, honeypot: e.target.value }))
                  }
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* First Name */}
                <div className="space-y-1.5">
                  <label
                    className={`font-mono text-[11px] uppercase tracking-wider block font-semibold ${isDay ? "text-slate-700" : "text-stone-300"
                      }`}
                  >
                    FIRST NAME <span className={isDay ? "text-[#996e2e]" : "text-[#b8935a]"}>*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Anaya"
                    value={formData.firstName}
                    onChange={(e) =>
                      setFormData((p) => ({ ...p, firstName: e.target.value }))
                    }
                    className={`w-full rounded-xl px-4 py-3 text-sm outline-hidden transition-all shadow-2xs border ${isDay
                        ? "bg-white border-[#ded7ca] text-slate-900 placeholder-slate-400 focus:border-[#b8935a] focus:ring-2 focus:ring-[#b8935a]/20"
                        : "bg-[#102028] border-[#243b47] text-white placeholder-[#5a7380] focus:border-[#b8935a]"
                      }`}
                  />
                </div>

                {/* Last Name */}
                <div className="space-y-1.5">
                  <label
                    className={`font-mono text-[11px] uppercase tracking-wider block font-semibold ${isDay ? "text-slate-700" : "text-stone-300"
                      }`}
                  >
                    LAST NAME <span className={isDay ? "text-[#996e2e]" : "text-[#b8935a]"}>*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sharma"
                    value={formData.lastName}
                    onChange={(e) =>
                      setFormData((p) => ({ ...p, lastName: e.target.value }))
                    }
                    className={`w-full rounded-xl px-4 py-3 text-sm outline-hidden transition-all shadow-2xs border ${isDay
                        ? "bg-white border-[#ded7ca] text-slate-900 placeholder-slate-400 focus:border-[#b8935a] focus:ring-2 focus:ring-[#b8935a]/20"
                        : "bg-[#102028] border-[#243b47] text-white placeholder-[#5a7380] focus:border-[#b8935a]"
                      }`}
                  />
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                  <label
                    className={`font-mono text-[11px] uppercase tracking-wider block font-semibold ${isDay ? "text-slate-700" : "text-stone-300"
                      }`}
                  >
                    EMAIL ADDRESS <span className={isDay ? "text-[#996e2e]" : "text-[#b8935a]"}>*</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData((p) => ({ ...p, email: e.target.value }))
                    }
                    className={`w-full rounded-xl px-4 py-3 text-sm outline-hidden transition-all shadow-2xs border ${isDay
                        ? "bg-white border-[#ded7ca] text-slate-900 placeholder-slate-400 focus:border-[#b8935a] focus:ring-2 focus:ring-[#b8935a]/20"
                        : "bg-[#102028] border-[#243b47] text-white placeholder-[#5a7380] focus:border-[#b8935a]"
                      }`}
                  />
                </div>

                {/* Phone */}
                <div className="space-y-1.5">
                  <label
                    className={`font-mono text-[11px] uppercase tracking-wider block font-semibold ${isDay ? "text-slate-700" : "text-stone-300"
                      }`}
                  >
                    PHONE NUMBER <span className={isDay ? "text-[#996e2e]" : "text-[#b8935a]"}>*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData((p) => ({ ...p, phone: e.target.value }))
                    }
                    className={`w-full rounded-xl px-4 py-3 text-sm outline-hidden transition-all shadow-2xs border ${isDay
                        ? "bg-white border-[#ded7ca] text-slate-900 placeholder-slate-400 focus:border-[#b8935a] focus:ring-2 focus:ring-[#b8935a]/20"
                        : "bg-[#102028] border-[#243b47] text-white placeholder-[#5a7380] focus:border-[#b8935a]"
                      }`}
                  />
                </div>
              </div>

              {/* Special Notes */}
              <div className="space-y-1.5">
                <label
                  className={`font-mono text-[11px] uppercase tracking-wider block font-semibold ${isDay ? "text-slate-700" : "text-stone-300"
                    }`}
                >
                  SPECIAL REQUESTS OR OCCASION NOTES (OPTIONAL)
                </label>
                <textarea
                  rows={3}
                  placeholder="Let us know if you have specific dietary needs, early arrival, or celebrations..."
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, notes: e.target.value }))
                  }
                  className={`w-full rounded-xl px-4 py-3 text-sm outline-hidden transition-all shadow-2xs resize-none border ${isDay
                      ? "bg-white border-[#ded7ca] text-slate-900 placeholder-slate-400 focus:border-[#b8935a] focus:ring-2 focus:ring-[#b8935a]/20"
                      : "bg-[#102028] border-[#243b47] text-white placeholder-[#5a7380] focus:border-[#b8935a]"
                    }`}
                />
              </div>

              {/* Form Actions */}
              <div
                className={`flex justify-between items-center pt-3 border-t transition-colors ${isDay ? "border-slate-200" : "border-white/10"
                  }`}
              >
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  disabled={submitting}
                  className={`font-mono text-xs uppercase tracking-[0.15em] px-4 py-2.5 rounded-full transition-colors flex items-center gap-1.5 cursor-pointer ${isDay
                      ? "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                      : "text-stone-400 hover:text-white"
                    }`}
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Review
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  className="font-mono text-xs uppercase tracking-[0.2em] bg-[#b8935a] hover:bg-[#a37e46] text-white px-7 py-3.5 rounded-full font-semibold transition-all duration-300 shadow-md hover:shadow-lg flex items-center gap-2 hover:scale-105 active:scale-95 disabled:opacity-50 cursor-pointer"
                >
                  {submitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      Confirm Reservation Request
                      <CheckCircle2 className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* ======================================================== */}
          {/* STEP 4: CONFIRMATION */}
          {/* ======================================================== */}
          {step === 4 && (
            <div className="text-center space-y-6 animate-fadeIn py-4">
              <div
                className={`w-16 h-16 rounded-full mx-auto flex items-center justify-center shadow-md border ${isDay
                    ? "bg-amber-50 border-[#b8935a]/40 text-[#996e2e]"
                    : "bg-[#b8935a]/20 border-[#b8935a]/50 text-[#d4af37]"
                  }`}
              >
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div>
                <span
                  className={`font-mono text-xs uppercase tracking-[0.25em] block mb-1 font-semibold ${isDay ? "text-[#996e2e]" : "text-[#b8935a]"
                    }`}
                >
                  Booking Reference: {reservationId}
                </span>
                <h2
                  className={`text-2xl sm:text-3xl font-serif mb-2 transition-colors ${isDay ? "text-slate-900" : "text-white"
                    }`}
                  style={{ fontFamily: "var(--font-fraunces), Georgia, serif" }}
                >
                  Request Submitted Successfully
                </h2>
                <p
                  className={`text-xs sm:text-sm max-w-md mx-auto font-light leading-relaxed ${isDay ? "text-slate-600" : "text-stone-300"
                    }`}
                >
                  Thank you,{" "}
                  <strong className={isDay ? "text-slate-900" : "text-white"}>
                    {formData.firstName}
                  </strong>
                  . Our villa concierge will reach out to you within 24 hours to confirm your reservation and assist with your stay details.
                </p>
              </div>

              {/* Reservation Summary Recap */}
              <div
                className={`rounded-2xl p-5 max-w-md mx-auto text-left font-mono text-xs space-y-2.5 border transition-colors ${isDay
                    ? "bg-white border-[#ded7ca] shadow-xs text-slate-800"
                    : "bg-[#102028] border-[#243b47] text-white"
                  }`}
              >
                <div
                  className={`flex justify-between border-b pb-2 ${isDay ? "border-slate-200" : "border-white/10"
                    }`}
                >
                  <span className={isDay ? "text-slate-500" : "text-stone-400"}>Stay Type</span>
                  <span className={`font-medium ${isDay ? "text-slate-900" : "text-white"}`}>
                    {accommodationOptions.find((o) => o.id === formData.accommodationType)?.title}
                  </span>
                </div>
                <div
                  className={`flex justify-between border-b pb-2 ${isDay ? "border-slate-200" : "border-white/10"
                    }`}
                >
                  <span className={isDay ? "text-slate-500" : "text-stone-400"}>Dates</span>
                  <span className={`font-medium ${isDay ? "text-slate-900" : "text-white"}`}>
                    {formData.checkIn} → {formData.checkOut} ({totalNights} nights)
                  </span>
                </div>
                <div
                  className={`flex justify-between border-b pb-2 ${isDay ? "border-slate-200" : "border-white/10"
                    }`}
                >
                  <span className={isDay ? "text-slate-500" : "text-stone-400"}>Contact Info</span>
                  <span className={`font-medium text-right ${isDay ? "text-slate-900" : "text-white"}`}>
                    {formData.phone} · {formData.email}
                  </span>
                </div>
                <div
                  className={`flex justify-between border-b pb-2 ${isDay ? "border-slate-200" : "border-white/10"
                    }`}
                >
                  <span className={isDay ? "text-slate-500" : "text-stone-400"}>Estimated Total</span>
                  <span className={`font-bold ${isDay ? "text-[#996e2e]" : "text-[#b8935a]"}`}>
                    ₹{tariffDetails.total.toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className={isDay ? "text-slate-500" : "text-stone-400"}>Status</span>
                  <span
                    className={`font-medium flex items-center gap-1.5 ${isDay ? "text-[#996e2e]" : "text-[#b8935a]"
                      }`}
                  >
                    <Clock className="w-3.5 h-3.5" /> Pending Concierge Review
                  </span>
                </div>
              </div>

              {/* Quick Call */}
              <div
                className={`text-xs font-mono ${isDay ? "text-slate-600" : "text-stone-400"
                  }`}
              >
                Need immediate assistance? Call us directly at{" "}
                <a
                  href="tel:+919500003388"
                  className={`hover:underline font-semibold ${isDay ? "text-[#996e2e]" : "text-[#b8935a]"
                    }`}
                >
                  +91 95000 03388
                </a>
              </div>

              {/* Back to Home Button */}
              <div className="pt-2">
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] bg-[#b8935a] hover:bg-[#a37e46] text-white px-8 py-3.5 rounded-full font-semibold transition-all shadow-md hover:shadow-lg hover:scale-105 cursor-pointer"
                >
                  Return to Home
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
      <DayNightToggle />
    </div>
  );
}
