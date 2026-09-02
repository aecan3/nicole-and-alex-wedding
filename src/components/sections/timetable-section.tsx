"use client";

import { motion } from "framer-motion";
import { PageHeader } from "@/components/page-header";
import { AnchorLink } from "@/components/anchor-link";

const EASE = [0.16, 1, 0.3, 1] as const;

const listVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.18, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: 80 },
  show: { opacity: 1, x: 0, transition: { duration: 0.7, ease: EASE } },
};

const events = [
  {
    time: "3:30pm",
    title: "Guest Arrival",
    detail: "Please arrive by 3:30pm to settle in and find your seat. The ceremony will commence promptly at 4:00pm, so we kindly ask guests to arrive on time.",
  },
  {
    time: "4:00pm",
    title: "The Ceremony",
    detail: "We say &ldquo;I do&rdquo; in The Vista, set against views of Mount Macedon.",
  },
  {
    time: "5:00pm",
    title: "Canapés, Drinks & Photos",
    detail: "Enjoy drinks and bites outdoors as the sun sets over the grounds.",
  },
  {
    time: "6:30pm – Midnight",
    title: "The Reception",
    detail: "Dinner, speeches, and plenty of dancing inside the Glass Atrium.",
  },
];

export function TimetableSection() {
  return (
    <section id="timetable" className="relative overflow-hidden scroll-mt-24">
      {/* The atrium line-art watermark this section inherited from Venue,
          resized down a bit ("slightly smaller" than the 135%/62% it used
          there) and re-tuned for a much shorter section. It reuses the same
          technique — a plain CSS background-image with bg-size/bg-position
          doing the sizing and bottom-right anchoring, no absolute-offset
          arithmetic — but this section's own content (the timetable list)
          is nowhere near tall enough to give it room the way Venue's
          min-h-svh did, so the trailing spacer below reserves exactly the
          height the image needs at its own bg-size percentage (vw-based,
          matching how bg-size scales with viewport width) so it always
          sits fully below the shuttle line and never gets clipped or
          overlaps the text above it. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 bg-[url('/gallery/venue-atrium-watermark.png')] bg-no-repeat bg-[position:10%_bottom] bg-[length:115%_auto] opacity-[0.2] sm:bg-right-bottom sm:bg-[length:50%_auto]"
      />

      <div className="relative z-10">
        <PageHeader kicker="Thursday 11 March 2027" title="Timetable" />
        <div className="mx-auto max-w-2xl px-6 pb-20">
          <motion.ol
            className="space-y-10"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            variants={listVariants}
          >
            {events.map((e) => (
              <motion.li
                key={e.title}
                variants={itemVariants}
                className="border-l-2 border-gold-400 pl-6"
              >
                <p className="text-xs uppercase tracking-[0.2em] text-taupe-600">{e.time}</p>
                <h3 className="font-display text-2xl text-burgundy-600 mt-1">{e.title}</h3>
                <p className="mt-2 leading-relaxed" dangerouslySetInnerHTML={{ __html: e.detail }} />
              </motion.li>
            ))}
          </motion.ol>
          <p className="mt-12 text-sm text-burgundy-600/80 text-center">
            A shuttle will run from pick-up points around Gisborne, New Gisborne and
            Macedon &mdash; see the <AnchorLink href="#faq" className="underline hover:text-burgundy-600">Q&amp;A</AnchorLink> section for details.
          </p>
        </div>
        {/* Reserved for the watermark above: height = bg-size width % x the
            image's own aspect ratio (492/960 ≈ 0.5125), in vw so it tracks
            the same viewport-relative scaling bg-size uses — 115%*0.5125
            ≈ 59vw on mobile, 50%*0.5125 ≈ 25.6vw from sm: up. */}
        <div aria-hidden="true" className="h-[59vw] sm:h-[25.6vw]" />
      </div>
    </section>
  );
}
