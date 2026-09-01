"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { AnchorLink } from "@/components/anchor-link";

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
    <section
      id="home"
      className="relative min-h-[100svh] flex flex-col items-center justify-center text-center overflow-hidden px-6"
    >
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
          className="mx-auto mb-8 h-24 w-24 sm:h-28 sm:w-28 brightness-0 invert"
          priority
        />
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.35, duration: 0.9 }}
        className="kicker text-base sm:text-lg text-cream-100"
      >
        We&rsquo;re getting married
      </motion.p>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="font-script text-6xl sm:text-8xl text-cream-100 leading-[1.25] mt-5 px-2"
      >
        Nicole &amp; Alex
      </motion.h1>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.75, duration: 0.9 }}
        className="mt-9 flex flex-col items-center gap-2"
      >
        <div className="flex items-center gap-3 text-cream-100">
          <span className="h-px w-8 bg-gold-300/50" />
          <p className="tracking-[0.25em] uppercase text-xs sm:text-sm">
            Thursday, 11 March 2027
          </p>
          <span className="h-px w-8 bg-gold-300/50" />
        </div>
        <p className="font-serif italic text-2xl sm:text-3xl text-cream-100">
          Alora Macedon
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.95, duration: 0.9 }}
      >
        <AnchorLink
          href="#rsvp"
          className="mt-11 inline-block rounded-full bg-taupe-600 text-cream-100 px-11 py-3.5 text-sm tracking-[0.25em] uppercase transition-all duration-300 hover:bg-[#77604f] hover:shadow-[0_0_30px_rgba(140,115,97,0.35)]"
        >
          RSVP
        </AnchorLink>
      </motion.div>

      <motion.div
        className="absolute bottom-8 flex flex-col items-center gap-2 text-cream-100/50"
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2.4, ease: "easeInOut" }}
      >
        <span className="text-[10px] tracking-[0.35em] uppercase">Scroll</span>
        <span className="h-6 w-px bg-cream-100/40" />
      </motion.div>
    </section>
  );
}
