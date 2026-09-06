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
          overlaps the text above it. This is the user's updated redraw of
          the same atrium (wider/shallower aspect ratio than the original —
          2.76:1 vs 1.95:1), background-removed from their supplied JPEG via
          a local-blur difference matte (thin ink lines stay put, the
          slowly-vignetted paper background drops out regardless of its own
          gradient) and recoloured to the same taupe ink tone as the old
          asset. -v3 reworks the alpha curve from the first cut (-v2): that
          version mapped diff-matte strength ~linearly to alpha, so fainter
          strokes (thin hatching, distant roof lines) landed at low alpha
          and all but vanished once the section's own 0.24 opacity was
          stacked on top — reads as a "broken"/dashed sketch instead of
          solid linework. -v3 applies a gamma curve (0.45) to boost faint
          strokes much more than strong ones, plus a solid alpha floor for
          anything clearly above the jpeg-noise threshold, so every stroke
          the source actually drew renders as a continuous line at roughly
          even weight, the way real pen-on-paper line art looks. The edge
          feather lives in the PNG's own alpha channel (baked in), not a
          CSS mask on this div — a mask here fades relative to the div's
          own box, which rarely lines up with where bg-position/bg-size
          actually put the image, so it either missed the real edge or
          washed out the middle. Feathering the asset itself means the
          fade always tracks the image's true edges, on both layouts,
          regardless of position/size tweaks.

          Sizing differs deliberately by breakpoint rather than sharing one
          bg-size: mobile's background positioning area is only as wide as
          the phone screen, so any bg-size width over 100% pushes part of
          this 2.76:1-wide image past the section's overflow-hidden edge —
          at the old 163% width, roughly a third of the image (the right
          arch and chandelier) was being clipped off, which is what read as
          "cut off" rather than a sizing preference. 100% is the largest
          width mobile can show in full, so mobile is pinned there — bottom
          bg-position, horizontal position is now moot since the image
          exactly fills the section's width either way. Desktop has a much
          wider positioning area to work with, so 71% comfortably fits
          within it at bg-right-bottom with room to spare; it's kept larger
          than mobile's rendered size (163%/71% ×1.4165 factor vs. the old
          art's 115%/50%) so the rendered height matches what it was before
          despite the new art's shallower 2.76:1 aspect ratio (was 1.95:1),
          preserving the slight overlap with the event list the original
          was tuned for. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 bg-[url('/gallery/venue-atrium-watermark-v3.png')] bg-no-repeat bg-[position:10%_bottom] bg-[length:100%_auto] opacity-[0.24] sm:bg-right-bottom sm:bg-[length:71%_auto]"
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
            (59vw / 25.6vw at this bg-size — the bumped-up 163%/71% above
            was chosen specifically to land back on this same rendered
            height despite the new art's aspect ratio) rather than matching
            it exactly: since the image bottom-anchors to the section, a
            smaller reserve here lets its top portion rise up past this gap
            and overlap the bottom-right of the event list above, instead
            of sitting in its own fully separate blank band. Also just less
            empty space overall before "Where to Stay" starts. */}
        <div aria-hidden="true" className="h-[28vw] sm:h-[12vw]" />
      </div>
    </section>
  );
}
