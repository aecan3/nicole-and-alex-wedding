"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";

const links = [
  { href: "/", label: "Welcome" },
  { href: "/our-story", label: "Our Story" },
  { href: "/venue", label: "Venue" },
  { href: "/timetable", label: "Timetable" },
  { href: "/where-to-stay", label: "Where to Stay" },
  { href: "/dress-code", label: "Dress Code" },
  { href: "/registry", label: "Gifts" },
  { href: "/faq", label: "Q&A" },
];

const EASE = [0.16, 1, 0.3, 1] as const;

export function SiteNav() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);

  // One rAF-throttled scroll listener drives two cheap, compositor-only
  // outputs: a boolean for the shadow (a single CSS transition, not
  // re-triggered per frame) and a 0–1 progress value painted via
  // transform: scaleX on a fixed-height bar. Nothing here ever touches
  // padding, font-size, or width/height, so there's no layout reflow on
  // scroll — the header itself never resizes, which is what made the
  // previous grow/shrink version feel janky no matter how it was tuned.
  const tickingRef = useRef(false);
  useEffect(() => {
    const evaluate = () => {
      tickingRef.current = false;
      const y = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setScrolled(y > 8);
      setProgress(max > 0 ? Math.min(1, Math.max(0, y / max)) : 0);
    };
    const onScroll = () => {
      if (tickingRef.current) return;
      tickingRef.current = true;
      requestAnimationFrame(evaluate);
    };
    evaluate();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [pathname]);

  useEffect(() => {
    document.documentElement.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    // Fixed size, always — no scroll-linked grow/shrink. The "dynamic" feel
    // instead comes from the gold progress line at the base of the header
    // (below) and a soft shadow that fades in once you've scrolled, both of
    // which only ever animate transform/opacity — never layout — so they
    // stay smooth regardless of scroll speed or device.
    <header
      className={`sticky top-0 z-50 bg-burgundy-900 border-b border-gold-400/15 transition-shadow duration-300 ${
        scrolled ? "shadow-[0_8px_24px_rgba(58,15,24,0.18)]" : "shadow-none"
      }`}
    >
      <div className="mx-auto max-w-6xl px-6 sm:px-10 py-5 flex items-center justify-between">
        <Link href="/" onClick={closeMenu} className="group flex items-center gap-3 text-cream-100">
          <Monogram className="h-8 w-8 shrink-0 brightness-0 invert" />
          <span className="font-serif italic text-lg tracking-wide">Nicole &amp; Alex</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-x-7 font-serif text-[13px] tracking-[0.08em] text-cream-100/90">
          {links.map((link) => (
            <NavLink key={link.href} href={link.href} label={link.label} />
          ))}
        </nav>

        <Link
          href="/rsvp"
          className="hidden lg:inline-block rounded-full bg-olive-800 px-6 py-2 text-[11px] tracking-[0.2em] uppercase text-cream-100 hover:bg-olive-900 transition-colors duration-300"
        >
          RSVP
        </Link>

        {/* Mobile trigger */}
        <button
          type="button"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          onClick={() => setMenuOpen((v) => !v)}
          className="lg:hidden relative z-[70] flex h-8 w-8 flex-col items-center justify-center gap-[6px]"
        >
          <motion.span
            animate={menuOpen ? { rotate: 45, y: 4 } : { rotate: 0, y: 0 }}
            transition={{ duration: 0.35, ease: EASE }}
            className="block h-px w-6 bg-cream-100"
          />
          <motion.span
            animate={menuOpen ? { opacity: 0 } : { opacity: 1 }}
            transition={{ duration: 0.2 }}
            className="block h-px w-6 bg-cream-100"
          />
          <motion.span
            animate={menuOpen ? { rotate: -45, y: -4 } : { rotate: 0, y: 0 }}
            transition={{ duration: 0.35, ease: EASE }}
            className="block h-px w-6 bg-cream-100"
          />
        </button>
      </div>

      {/* Reading-progress hairline: the one continuously-updating element in
          the header. transform: scaleX is compositor-only — the browser
          never re-lays-out or repaints the surrounding bar to draw it, so it
          stays smooth at any scroll speed. This is the "dynamic" motion the
          header now relies on, in place of resizing itself. */}
      <div className="h-[2px] w-full bg-gold-400/10 overflow-hidden">
        <div
          style={{ transform: `scaleX(${progress})` }}
          className="h-full w-full origin-left bg-gold-300"
        />
      </div>

      {/* Mobile full-screen menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: EASE }}
            className="fixed inset-0 z-[60] lg:hidden bg-burgundy-950/98 backdrop-blur-md flex flex-col items-center justify-center gap-6 px-6"
          >
            {links.map((link, i) => (
              <motion.div
                key={link.href}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ delay: 0.06 + i * 0.045, duration: 0.5, ease: EASE }}
              >
                <Link
                  href={link.href}
                  onClick={closeMenu}
                  className="font-serif italic text-3xl text-cream-100 hover:text-gold-300 transition-colors"
                >
                  {link.label}
                </Link>
              </motion.div>
            ))}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ delay: 0.06 + links.length * 0.045, duration: 0.5, ease: EASE }}
              className="mt-4"
            >
              <Link
                href="/rsvp"
                onClick={closeMenu}
                className="inline-block rounded-full bg-olive-800 px-10 py-3 text-xs tracking-[0.25em] uppercase text-cream-100 hover:bg-olive-900 transition-colors duration-300"
              >
                RSVP
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

function NavLink({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} className="group relative py-1">
      <span className="transition-colors duration-300 group-hover:text-gold-300">
        {label}
      </span>
      <span className="pointer-events-none absolute left-1/2 -bottom-0.5 h-px w-0 -translate-x-1/2 bg-gold-300 transition-all duration-300 group-hover:w-full" />
    </Link>
  );
}

export function Monogram({ className = "h-40 w-40" }: { className?: string }) {
  return (
    <Image
      src="/brand/monogram.svg"
      alt="N & A monogram"
      width={220}
      height={220}
      className={className}
      priority
    />
  );
}
