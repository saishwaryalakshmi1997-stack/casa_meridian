import type { Metadata } from "next";
import { Playfair_Display, Cormorant_Garamond, Inter, Fraunces, IBM_Plex_Mono } from "next/font/google";
import SmoothScroll from "@/components/SmoothScroll";
import Navbar from "@/components/Navbar";
import { DayNightProvider } from "@/components/DayNightContext";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-fraunces",
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-ibm-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://casameridian.in"
  ),
  title: "Casa Meridian | Luxury Oceanfront Living",
  description: "Wake up to the waves. A private coastal escape at Casa Meridian.",
  icons: {
    icon: [
      { url: "/logo.jpg" },
      { url: "/logo.webp", type: "image/webp" },
    ],
    shortcut: "/logo.jpg",
    apple: "/logo.jpg",
  },
  openGraph: {
    title: "Casa Meridian | Luxury Oceanfront Living",
    description: "Wake up to the waves. A private coastal escape at Casa Meridian.",
    images: [{ url: "/logo.jpg", width: 800, height: 800, alt: "Casa Meridian Logo" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Casa Meridian | Luxury Oceanfront Living",
    description: "Wake up to the waves. A private coastal escape at Casa Meridian.",
    images: ["/logo.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${cormorant.variable} ${inter.variable} ${fraunces.variable} ${ibmPlexMono.variable}`}
    >
      <body className="antialiased font-sans transition-colors duration-700">
        <DayNightProvider>
          <SmoothScroll>
            <Navbar />
            {children}
          </SmoothScroll>
        </DayNightProvider>
      </body>
    </html>
  );
}



