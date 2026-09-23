"use client";

import { useState } from "react";
import Link from "next/link";
import { Phone, ArrowLeft, CheckCircle2, Key, Calendar, MapPin, Sparkles } from "lucide-react";
import { useDayNight } from "@/components/DayNightContext";
import Footer from "@/components/Footer";

function RecaptchaBadge() {
  return (
    <div className="absolute -right-2 sm:-right-4 bottom-5 flex items-center shadow-lg rounded-sm overflow-hidden select-none border border-black/10 z-10 transition-transform hover:scale-105">
      {/* Icon portion */}
      <div className="bg-[#f9f9f9] dark:bg-[#1a2530] p-1.5 flex items-center justify-center border-r border-slate-200 dark:border-white/10">
        <svg className="w-6 h-6 animate-spin" style={{ animationDuration: "12s" }} viewBox="0 0 48 48">
          <path
            fill="#1A73E8"
            d="M24 4c11.05 0 20 8.95 20 20 0 3.32-.82 6.46-2.28 9.21l-3.23-1.87A16.27 16.27 0 0 0 40 24c0-8.84-7.16-16-16-16-4.52 0-8.62 1.88-11.55 4.9L16 16H4V4l4.89 4.89A19.92 19.92 0 0 1 24 4z"
          />
          <path
            fill="#4285F4"
            d="M4 24c0-3.32.82-6.46 2.28-9.21l3.23 1.87A16.27 16.27 0 0 0 8 24c0 8.84 7.16 16 16 16 4.52 0 8.62-1.88 11.55-4.9L32 32h12v12l-4.89-4.89A19.92 19.92 0 0 1 24 44C12.95 44 4 35.05 4 24z"
          />
        </svg>
      </div>

      {/* Blue text portion */}
      <div className="bg-[#1a73e8] text-white px-3 py-1.5 flex flex-col justify-center">
        <span className="text-[10px] leading-tight font-sans">
          protected by <strong className="font-bold">reCAPTCHA</strong>
        </span>
        <div className="text-[8px] text-blue-100 flex items-center gap-1 opacity-90">
          <span>Privacy</span>
          <span>·</span>
          <span>Terms</span>
        </div>
      </div>
    </div>
  );
}

export default function MyStayPage() {
  const { mode } = useDayNight();
  const isDay = mode === "day";

  const [phone, setPhone] = useState("");
  const [step, setStep] = useState<"phone" | "otp" | "authenticated">("phone");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);

  const handleSendCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim()) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep("otp");
    }, 600);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    // Auto advance
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep("authenticated");
    }, 700);
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-700 flex flex-col justify-between select-none ${
        isDay ? "bg-[#faf8f5] text-slate-900" : "bg-[#07131b] text-[#f6f3ec]"
      }`}
    >
      {/* Center Container */}
      <main className="flex-1 flex items-center justify-center px-4 pt-28 sm:pt-32 pb-20">
        <div className="w-full max-w-[430px] relative">
          {/* Card */}
          <div
            className={`relative rounded-[26px] p-7 sm:p-9 border transition-all duration-300 shadow-2xl ${
              isDay
                ? "bg-white border-amber-200/60 shadow-black/[0.04]"
                : "bg-[#0c1a22] border-white/10 shadow-black/40"
            }`}
          >
            {/* STEP 1: Phone input matching user screenshot */}
            {step === "phone" && (
              <form onSubmit={handleSendCode} className="text-center">
                <h1
                  className={`text-2xl sm:text-[28px] font-normal tracking-tight mb-1.5 ${
                    isDay ? "text-slate-800" : "text-white"
                  }`}
                  style={{ fontFamily: "var(--font-fraunces), 'Playfair Display', Georgia, serif" }}
                >
                  Welcome Home
                </h1>

                <p className="text-slate-400 dark:text-slate-400 text-sm font-normal mb-7">
                  Sign in to access your stay
                </p>

                <style>{`
                  #phone-input::placeholder {
                    color: ${isDay ? "#475569" : "#cbd5e1"} !important;
                    opacity: 1 !important;
                    -webkit-text-fill-color: ${isDay ? "#475569" : "#cbd5e1"} !important;
                    font-weight: 500;
                  }
                `}</style>

                <div className="text-left mb-6">
                  <label
                    htmlFor="phone-input"
                    className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-2"
                  >
                    Phone Number
                  </label>

                  <div
                    className={`flex items-center border rounded-xl px-4 py-3.5 transition-colors ${
                      isDay
                        ? "bg-white border-slate-300 focus-within:border-slate-600 focus-within:ring-2 focus-within:ring-slate-200"
                        : "bg-black/30 border-white/20 focus-within:border-white/40 focus-within:ring-2 focus-within:ring-white/10"
                    }`}
                  >
                    <Phone className="w-4 h-4 text-[#c29845] mr-3 flex-shrink-0" />
                    <input
                      id="phone-input"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      style={{
                        color: isDay ? "#0f172a" : "#f8fafc",
                      }}
                      className="flex-1 min-w-0 bg-transparent font-mono text-sm sm:text-[15px] tracking-wider font-medium focus:outline-none"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-3.5 px-6 rounded-xl font-medium text-sm text-white transition-all duration-200 shadow-sm cursor-pointer ${
                    loading
                      ? "bg-[#8b98a6] cursor-wait"
                      : "bg-[#707e8c] hover:bg-[#5f6c7a] active:scale-[0.99]"
                  }`}
                >
                  {loading ? "Sending Code..." : "Send Verification Code"}
                </button>

                <p className="text-center text-xs text-slate-400 mt-5">
                  Need help accessing your stay? Call{" "}
                  <a
                    href="tel:+919500003388"
                    className="text-[#b8935a] font-semibold hover:underline"
                  >
                    +91 95000 03388
                  </a>
                </p>
              </form>
            )}

            {/* STEP 2: OTP verification */}
            {step === "otp" && (
              <form onSubmit={handleVerifyOtp} className="text-center">
                <button
                  type="button"
                  onClick={() => setStep("phone")}
                  className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-white mb-3 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Change phone number</span>
                </button>

                <h1
                  className={`text-2xl font-normal tracking-tight mb-1.5 ${
                    isDay ? "text-slate-800" : "text-white"
                  }`}
                  style={{ fontFamily: "var(--font-fraunces), Georgia, serif" }}
                >
                  Enter Verification Code
                </h1>

                <p className="text-slate-400 text-xs sm:text-sm font-normal mb-4">
                  We sent a 6-digit code to{" "}
                  <strong className="text-slate-700 dark:text-slate-200 font-mono">
                    {phone || "+91 98765 43210"}
                  </strong>
                </p>

                {/* Development demo notice */}
                <div className="bg-amber-500/10 border border-amber-500/25 rounded-xl p-3 mb-5 text-xs text-amber-900 dark:text-amber-200 text-center">
                  <span className="font-semibold block mb-1">
                    Demo Mode · Enter test code: <code className="bg-amber-500/20 px-1.5 py-0.5 rounded font-mono font-bold">123456</code>
                  </span>
                  <button
                    type="button"
                    onClick={() => setOtp(["1", "2", "3", "4", "5", "6"])}
                    className="mt-1.5 text-[11px] text-amber-700 dark:text-amber-300 underline font-medium hover:opacity-80 cursor-pointer"
                  >
                    Click to auto-fill code (123456)
                  </button>
                </div>

                {/* 6 Digit Inputs */}
                <div className="flex justify-center gap-2 mb-6">
                  {otp.map((digit, i) => (
                    <input
                      key={i}
                      id={`otp-${i}`}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(i, e.target.value)}
                      className={`w-10 h-12 text-center font-mono text-lg font-bold rounded-lg border transition-colors focus:outline-none ${
                        isDay
                          ? "bg-white border-slate-300 focus:border-[#b8935a]"
                          : "bg-black/30 border-white/20 focus:border-amber-400 text-white"
                      }`}
                    />
                  ))}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-6 rounded-xl font-medium text-sm text-white bg-[#b8935a] hover:bg-[#a6824c] transition-all shadow-md cursor-pointer"
                >
                  {loading ? "Verifying..." : "Verify & Access Stay"}
                </button>

                <p className="text-xs text-slate-400 mt-4">
                  Didn’t receive the code?{" "}
                  <button
                    type="button"
                    onClick={() => alert("Verification code resent!")}
                    className="text-[#b8935a] font-medium hover:underline cursor-pointer"
                  >
                    Resend
                  </button>
                </p>
              </form>
            )}

            {/* STEP 3: Authenticated Guest Portal */}
            {step === "authenticated" && (
              <div className="text-left">
                <div className="flex items-center gap-2.5 text-teal-600 dark:text-teal-400 mb-2">
                  <CheckCircle2 className="w-5 h-5" />
                  <span className="font-mono text-xs uppercase tracking-widest font-semibold">
                    Guest Verified
                  </span>
                </div>

                <h1
                  className={`text-2xl font-normal mb-1 ${
                    isDay ? "text-slate-900" : "text-white"
                  }`}
                  style={{ fontFamily: "var(--font-fraunces), Georgia, serif" }}
                >
                  Welcome to Casa Meridian
                </h1>
                <p className="text-xs text-slate-400 mb-5">
                  Your private beachside getaway is ready.
                </p>

                {/* Stay Card preview */}
                <div
                  className={`rounded-2xl p-4 border mb-5 space-y-3 ${
                    isDay ? "bg-[#faf8f5] border-black/5" : "bg-black/20 border-white/10"
                  }`}
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono uppercase text-[#b8935a] font-semibold tracking-wider">
                      Confirmed Reservation
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-teal-500/15 text-teal-700 dark:text-teal-300 font-mono text-[10px]">
                      Active
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-[#b8935a]" />
                      <span>Oceanfront Private Villa, ECR Chennai</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-[#b8935a]" />
                      <span>Check-In: 2:00 PM · Check-Out: 11:00 AM</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Key className="w-3.5 h-3.5 text-[#b8935a]" />
                      <span>Villa WiFi: <strong>CasaMeridian_Guest</strong></span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Link
                    href="/menu"
                    className="flex-1 py-2.5 px-4 text-center rounded-xl bg-[#b8935a] text-slate-950 font-medium text-xs hover:bg-[#a6824c] transition-all"
                  >
                    Order Dining
                  </Link>

                  <a
                    href="tel:+919500003388"
                    className={`py-2.5 px-4 rounded-xl border text-xs font-medium text-center transition-colors ${
                      isDay
                        ? "border-slate-300 hover:bg-slate-100 text-slate-800"
                        : "border-white/20 hover:bg-white/10 text-white"
                    }`}
                  >
                    Call Concierge
                  </a>
                </div>
              </div>
            )}

            {/* Floating reCAPTCHA badge matching screenshot */}
            <RecaptchaBadge />
          </div>
        </div>
      </main>

      {/* Identical Footer component as in Home Page */}
      <Footer />
    </div>
  );
}
