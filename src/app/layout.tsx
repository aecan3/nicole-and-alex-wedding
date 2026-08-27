import type { Metadata } from "next";
import { Playfair_Display, Parisienne, Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";
import { SiteNav } from "@/components/nav";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  style: ["normal", "italic"],
  subsets: ["latin"],
});

const parisienne = Parisienne({
  variable: "--font-parisienne",
  weight: "400",
  subsets: ["latin"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Nicole & Alex | 11 March 2027",
  description: "Join us as we celebrate our wedding at Alora Macedon, New Gisborne.",
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${parisienne.variable} ${cormorant.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-cream-100 text-burgundy-900">
        {/* Soft warm vignette, framing every screen like light falling across
            the invitation cardstock rather than a flat colour fill. */}
        <div
          aria-hidden
          className="pointer-events-none fixed inset-0 z-[58] mix-blend-multiply"
          style={{
            background:
              "radial-gradient(ellipse 120% 85% at 50% 30%, transparent 45%, rgba(58,15,24,0.07) 100%)",
          }}
        />
        <SiteNav />
        {children}
        <footer className="mt-auto bg-burgundy-900 text-cream-200/80 text-xs text-center py-8 px-6">
          Nicole &amp; Alex &middot; 11 March 2027 &middot; Alora Macedon, New Gisborne
        </footer>
      </body>
    </html>
  );
}
