import type { Metadata, Viewport } from "next";
import { Playfair_Display, Beau_Rivage, Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";
import { SiteNav, Monogram } from "@/components/nav";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  style: ["normal", "italic"],
  subsets: ["latin"],
});

// Matches the calligraphy on the printed invitations.
const beauRivage = Beau_Rivage({
  variable: "--font-beau-rivage",
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

// minimumScale pins pinch-zoom-OUT to the page's natural fit — without it
// mobile browsers let you pinch out past that point, which shrinks the
// layout viewport oddly (the bug report: "screws with the perspective and
// then it's hard to get back"). maximumScale is left at the browser
// default (well above 1) so zooming IN to read fine print still works.
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  minimumScale: 1,
  userScalable: true,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${beauRivage.variable} ${cormorant.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-cream-100 text-burgundy-600">
        {/* Soft warm vignette, framing every screen like light falling across
            the invitation cardstock rather than a flat colour fill. Plain
            alpha, no blend mode: a `mix-blend-mode` on a viewport-`fixed`
            element has to be recomposited against whatever's scrolling
            underneath it on every single frame, since the blend result
            depends on the backdrop — that was the main cause of the
            stutter/"bouncing" while scrolling (measured ~24% of frames
            over 20ms, worst frame ~50ms; a plain semi-transparent overlay
            needs no backdrop sampling and dropped that to ~2%, worst frame
            ~33ms). The colour already carries its own low alpha, so a
            normal composite reads almost identically to the multiply
            version — just without re-deriving it every frame. */}
        <div
          aria-hidden
          className="pointer-events-none fixed inset-0 z-[58]"
          style={{
            background:
              "radial-gradient(ellipse 120% 85% at 50% 30%, transparent 38%, rgba(122,53,64,0.16) 100%)",
          }}
        />
        <SiteNav />
        <div className="relative flex-1 flex flex-col">{children}</div>
        {/* The "Nicole & Alex · 11 March 2027 · Alora Macedon, New Gisborne"
            line this used to carry has moved off — the footer is just the
            monogram now, centered, same on mobile and desktop. */}
        <footer className="mt-auto bg-burgundy-900 py-4 px-6 flex items-center justify-center">
          <Monogram className="h-8 w-8 brightness-0 invert" />
        </footer>
      </body>
    </html>
  );
}
