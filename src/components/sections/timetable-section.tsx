"use client";

import { motion } from "framer-motion";
import { PageHeader } from "@/components/page-header";

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
          overlaps the text above it. -v2 is the user's updated redraw of
          the same atrium (wider/shallower aspect ratio than the original —
          2.76:1 vs 1.95:1), background-removed from their supplied JPEG via
          a local-blur difference matte (thin ink lines stay put, the
          slowly-vignetted paper background drops out regardless of its own
          gradient) and recoloured to the same taupe ink tone as the old
          asset. The edge feather lives in the PNG's own alpha channel
          (baked in), not a CSS mask on this div — a mask here fades
          relative to the div's own box, which rarely lines up with where
          bg-position/bg-size actually put the image, so it either missed
          the real edge or washed out the middle. Feathering the asset
          itself means the fade always tracks the image's true edges, on
          both layouts, regardless of position/size tweaks. Mobile position
          reverted back to the original 10%/bottom, 115% size — mobile-
          specific repositioning attempts (pushing it further right)
          didn't land right and weren't worth the added complexity. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 bg-[url('/gallery/venue-atrium-watermark-v2.png')] bg-no-repeat bg-[position:10%_bottom] bg-[length:115%_auto] opacity-[0.24] sm:bg-right-bottom sm:bg-[length:50%_auto]"
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
        </div>
        {/* Deliberately shorter than the watermark's own rendered height
            (41.6vw / 18.1vw at this bg-size with the v2 art's 2.76:1
            aspect — was 59vw/25.6vw with the old 1.95:1 art, scaled down
            here by the same ~47% ratio) rather than matching it exactly:
            since the image bottom-anchors to the section, a smaller
            reserve here lets its top portion rise up past this gap and
            overlap the bottom-right of the event list above, instead of
            sitting in its own fully separate blank band. Also just less
            empty space overall before "Where to Stay" starts. */}
        <div aria-hidden="true" className="h-[20vw] sm:h-[8.5vw]" />
      </div>
    </section>
  );
}
