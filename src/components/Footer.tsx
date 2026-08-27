"use client";

import Image from "next/image";

const MAPS_URL =
  "https://www.google.com/maps/search/210+Gandhi+Road+VGP+2nd+Part+Uthandi+Chennai+600119/@12.8762685,80.2162557,14z/data=!3m1!4b1?entry=ttu&g_ep=EgoyMDI2MDgyNC4wIKXMDSoASAFQAw%3D%3D";

export default function Footer() {
  return (
    <footer className="relative w-full bg-[#08121a] text-[#f6f3ec] pt-20 sm:pt-24 pb-10 sm:pb-12 px-6 sm:px-10 md:px-16 lg:px-24 border-t border-white/10 overflow-hidden">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-16 pb-16 border-b border-white/10">
        {/* Column 1: Brand & Tagline */}
        <div className="md:col-span-5 flex flex-col space-y-4">
          <div className="flex items-center gap-3.5">
            {/* White Circular Logo Badge */}
            <div className="relative w-12 h-12 rounded-full overflow-hidden bg-white flex-shrink-0 shadow-lg border border-white/30">
              <Image
                src="/logo.jpg"
                alt="Casa Meridian"
                fill
                priority
                className="object-cover"
                sizes="50px"
              />
            </div>

            <div>
              <h3 className="font-sans font-bold text-lg sm:text-xl text-white tracking-[0.14em] uppercase leading-none">
                Casa Meridian
              </h3>
              <span className="font-mono text-[10px] sm:text-[11px] tracking-[0.25em] text-[#b8935a] uppercase block mt-1">
                Private Beach Villa
              </span>
            </div>
          </div>

          <p className="text-slate-300/80 text-sm sm:text-[15px] font-light leading-relaxed max-w-sm pt-2">
            Barefoot luxury on Chennai&apos;s East Coast Road.
            <br />
            Wake up to the sound of waves every morning.
          </p>
        </div>

        {/* Column 2: Contact */}
        <div className="md:col-span-4 flex flex-col space-y-3.5">
          <h4 className="font-mono text-xs sm:text-sm tracking-[0.2em] uppercase text-white font-semibold mb-1">
            Contact
          </h4>

          {/* Phone */}
          <a
            href="tel:+919500003388"
            className="flex items-center gap-3 text-slate-300/85 hover:text-amber-300 text-sm sm:text-[15px] font-light transition-colors group"
          >
            <div className="text-amber-400 group-hover:scale-110 transition-transform">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
            </div>
            <span>+91 95000 03388</span>
          </a>

          {/* Email */}
          <a
            href="mailto:casameridianecr@gmail.com"
            className="flex items-center gap-3 text-slate-300/85 hover:text-amber-300 text-sm sm:text-[15px] font-light transition-colors group"
          >
            <div className="text-amber-400 group-hover:scale-110 transition-transform">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect width="20" height="16" x="2" y="4" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
            </div>
            <span>casameridianecr@gmail.com</span>
          </a>

          {/* Instagram */}
          <a
            href="https://instagram.com/casa_meridian_ecr"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 text-slate-300/85 hover:text-amber-300 text-sm sm:text-[15px] font-light transition-colors group"
          >
            <div className="text-amber-400 group-hover:scale-110 transition-transform">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
              </svg>
            </div>
            <span>@casa_meridian_ecr</span>
          </a>
        </div>

        {/* Column 3: Location */}
        <div className="md:col-span-3 flex flex-col space-y-2.5">
          <h4 className="font-mono text-xs sm:text-sm tracking-[0.2em] uppercase text-white font-semibold mb-1">
            Location
          </h4>

          <div className="flex items-start gap-3 text-slate-300/85 text-sm sm:text-[15px] font-light">
            <div className="text-amber-400 mt-1 flex-shrink-0">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
            </div>
            <div className="space-y-0.5">
              <p>210, Gandhi Road,</p>
              <p>VGP 2nd Part, Uthandi,</p>
              <p>Chennai – 600 119</p>
            </div>
          </div>

          <a
            href={MAPS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-mono tracking-wider text-amber-300 hover:text-amber-200 transition-colors pt-2 inline-flex items-center gap-1.5 group"
          >
            <span>Get directions</span>
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </a>
        </div>
      </div>

      {/* Bottom Sub-Footer Row */}
      <div className="max-w-7xl mx-auto pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-light text-slate-400">
        <p>© 2026 Casa Meridian. All rights reserved.</p>
        <p className="font-serif italic text-sm text-slate-300/90">
          Wake Up to the Waves.
        </p>
      </div>
    </footer>
  );
}
