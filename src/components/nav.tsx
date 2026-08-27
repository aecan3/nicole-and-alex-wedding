"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

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

export function SiteNav() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [scrolled, setScrolled] = useState(!isHome);

  useEffect(() => {
    if (!isHome) {
      setScrolled(true);
      return;
    }
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome]);

  const floating = isHome && !scrolled;

  return (
    <header
      className={`sticky top-0 z-50 transition-colors duration-500 ${
        floating ? "bg-transparent" : "bg-burgundy-900/95 backdrop-blur-md shadow-[0_1px_0_rgba(201,168,118,0.25)]"
      }`}
    >
      <div
        className={`mx-auto max-w-5xl px-6 flex flex-col items-center transition-all duration-500 ${
          floating ? "py-8" : "py-3"
        }`}
      >
        <Link
          href="/"
          className={`font-script text-cream-100 transition-all duration-500 ${
            floating ? "text-4xl sm:text-5xl mb-4" : "text-xl sm:text-2xl mb-1.5"
          }`}
        >
          Nicole &amp; Alex
        </Link>
        <nav className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1 text-[10px] sm:text-[11px] tracking-[0.2em] uppercase text-cream-100/90">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-gold-300 transition-colors">
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
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
