"use client";

import { useEffect, useState } from "react";
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
  { href: "/travel", label: "Travel" },
  { href: "/dress-code", label: "Dress Code" },
  { href: "/registry", label: "Registry" },
  { href: "/faq", label: "Q&A" },
];

const EASE = [0.16, 1, 0.3, 1] as const;

export function SiteNav() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [manualScrolled, setManualScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Reset synchronously (during render, not in an effect) whenever the route
  // changes, so landing back on the homepage always starts large — no flash
  // of the old scrolled-in state left over from before you navigated away.
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    if (isHome) setManualScrolled(false);
  }

  useEffect(() => {
    if (!isHome) return;
    const onScroll = () => setManualScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome]);

  useEffect(() => {
    document.documentElement.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [menuOpen]);

  const scrolled = isHome ? manualScrolled : true;
  const floating = isHome && !scrolled;
  const closeMenu = () => setMenuOpen(false);

  return (
    <header
      className="sticky top-0 z-50 bg-burgundy-900/95 backdrop-blur-lg border-b border-gold-400/15 transition-all duration-700"
      style={{ transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)" }}
    >
      <div
        className={`mx-auto max-w-6xl px-6 sm:px-10 flex items-center justify-between transition-all duration-700 ${
          floating ? "py-8" : "py-4"
        }`}
        style={{ transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)" }}
      >
        <Link href="/" onClick={closeMenu} className="group flex items-center gap-3 text-cream-100">
          <Monogram
            className={`shrink-0 brightness-0 invert transition-all duration-700 ${
              floating ? "h-11 w-11 sm:h-12 sm:w-12" : "h-8 w-8"
            }`}
          />
          <span
            className={`font-serif italic tracking-wide transition-all duration-700 ${
              floating ? "text-xl sm:text-2xl" : "text-base sm:text-lg"
            }`}
          >
            Nicole &amp; Alex
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-x-7 font-serif text-[13px] tracking-[0.08em] text-cream-100/90">
          {links.map((link) => (
            <NavLink key={link.href} href={link.href} label={link.label} />
          ))}
        </nav>

        <Link
          href="/rsvp"
          className="hidden lg:inline-block rounded-full border border-gold-300/50 px-6 py-2 text-[11px] tracking-[0.2em] uppercase text-cream-100 hover:bg-gold-300 hover:text-burgundy-950 hover:border-gold-300 transition-colors duration-300"
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
                className="inline-block rounded-full border border-gold-300/60 px-10 py-3 text-xs tracking-[0.25em] uppercase text-cream-100 hover:bg-gold-300 hover:text-burgundy-950 transition-colors duration-300"
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
