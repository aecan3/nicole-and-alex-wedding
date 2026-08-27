"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

export function Hero({
  photoSrc,
  videoSrc,
}: {
  /** Path to a full-bleed hero photo, e.g. "/gallery/hero.jpg". Optional — falls back to a textured colour field. */
  photoSrc?: string;
  /** Path to a looping hero video (takes priority over photoSrc if both given). */
  videoSrc?: string;
}) {
  return (
    <section className="relative min-h-[100svh] flex flex-col items-center justify-center text-center overflow-hidden px-6">
      {/* Background */}
      <div className="absolute inset-0 -z-20 bg-gradient-to-b from-burgundy-950 via-burgundy-800 to-burgundy-900" />

      {videoSrc ? (
        <video
          src={videoSrc}
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 -z-10 h-full w-full object-cover opacity-60"
        />
      ) : photoSrc ? (
        <Image
          src={photoSrc}
          alt=""
          fill
          priority
          className="-z-10 object-cover opacity-50"
        />
      ) : null}

      {/* Vignette for text legibility */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_35%,transparent_20%,rgba(20,6,10,0.55)_100%)]" />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        <Image
          src="/brand/monogram.svg"
          alt="N & A monogram"
          width={112}
          height={112}
          className="mx-auto mb-8 h-24 w-24 sm:h-28 sm:w-28"
          priority
        />
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.35, duration: 0.9 }}
        className="text-[11px] sm:text-xs tracking-[0.45em] uppercase text-gold-300"
      >
        We&rsquo;re getting married
      </motion.p>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 1 }}
        className="font-script text-6xl sm:text-8xl text-cream-100 leading-none mt-4"
      >
        Nicole &amp; Alex
      </motion.h1>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.75, duration: 0.9 }}
        className="mt-8"
      >
        <p className="text-cream-100 tracking-[0.3em] uppercase text-sm">
          Thursday, 11 March 2027
        </p>
        <p className="text-cream-200/70 mt-1">Alora Macedon, New Gisborne</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.95, duration: 0.9 }}
      >
        <Link
          href="/rsvp"
          className="mt-10 inline-block rounded-full border border-gold-300/60 text-cream-100 px-10 py-3 text-sm tracking-[0.25em] uppercase hover:bg-cream-100 hover:text-burgundy-900 transition-colors duration-300"
        >
          RSVP
        </Link>
      </motion.div>

      <motion.div
        className="absolute bottom-8 text-cream-100/60 text-xs tracking-[0.3em] uppercase"
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2.4, ease: "easeInOut" }}
      >
        Scroll
      </motion.div>
    </section>
  );
}
