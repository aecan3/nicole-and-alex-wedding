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
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};

const days = [
  {
    label: "Thursday 11 March",
    events: [
      {
        time: "3:30pm",
        title: "Guest Arrival",
        detail: "Please arrive by 3:30pm to settle in before our ceremony commences at 4:00pm.",
      },
      {
        time: "4:00pm",
        title: "The Ceremony",
        detail: "We exchange vows at The Vista, framed by views of Mount Macedon.",
      },
      {
        time: "5:00pm",
        title: "Aperitivo Hour",
        detail: "Sip and savour as the sun sets over the grounds.",
      },
      {
        time: "6:30pm – Midnight",
        title: "The Reception",
        detail: "An evening of dinner, toasts, and dancing under the stars in the Glass Atrium.",
      },
    ],
  },
  {
    label: "Friday 12 March",
    events: [
      {
        time: "From 11:30am",
        title: "Post-Wedding Debrief",
        detail: "If you&rsquo;re still in the area, we&rsquo;d love to see you at the local pub, Baringo Food &amp; Wine Co. in New Gisborne, for a drink and a debrief.",
      },
    ],
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
          this 2.76:1-wide image past the section's overflow-hidden edge.
          The old 163%/left-anchored version clipped the wrong side — the
          right arch and chandelier were being cut off. Mobile is anchored
          bg-right-bottom like desktop, growing past 100% only into the
          source art's empty left-hand sky/lawn margin (the glasshouse
          structure itself doesn't start until about a third of the way
          across, per a column-alpha scan of the asset) rather than into
          the chandelier/arches on the right. 140% (tried first) read as
          too tightly cropped on an actual phone — lost the asymmetric,
          off-centre feel of the original art and most of the bottom-left
          foliage — so it's dialled back ~10% to 126%, which keeps
          noticeably more of that left margin and foliage in frame while
          still growing enough to overlap the text (spacer below reduced to
          match, since a smaller image is also a shorter one and would
          otherwise drop back out of overlap range). Desktop has a much
          wider positioning area to work with, so 71% comfortably fits
          within it at bg-right-bottom with room to spare; it's kept larger
          than the old art's 115%/50% (×1.4165 factor) so the rendered
          height matches what it was before despite the new art's shallower
          2.76:1 aspect ratio (was 1.95:1), preserving the slight overlap
          with the event list the original was tuned for. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 bg-[url('/gallery/venue-atrium-watermark-v3.png')] bg-no-repeat bg-right-bottom bg-[length:126%_auto] opacity-[0.24] sm:bg-right-bottom sm:bg-[length:71%_auto]"
      />

      <div className="relative z-10">
        <PageHeader kicker="11 &amp; 12 March 2027" title="Timetable" />
        <div className="mx-auto max-w-2xl px-6 pb-20">
          {days.map((day, di) => (
            <div key={day.label} className={di === 0 ? "" : "mt-14"}>
              <p className="kicker mb-7 text-center text-lg text-taupe-600">{day.label}</p>
              <motion.ol
                className="space-y-10"
                initial="hidden"
                whileInView="show"
                viewport={{ once: false, margin: "-80px" }}
                variants={listVariants}
              >
                {day.events.map((e) => (
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
          ))}
        </div>
        {/* Deliberately shorter than the watermark's own rendered height at
            this bg-size, rather than matching it exactly: since the image
            bottom-anchors to the section, a smaller reserve here lets its
            top portion rise up past this gap and overlap the bottom of the
            event list above, instead of sitting in its own fully separate
            blank band. Mobile's 16vw (down from 28vw) matches the 126%
            bg-size above — both were dialled down together after the first
            140%/28vw cut read as too small a gap on an actual phone (no
            visible overlap despite one showing up in desktop-browser mobile
            emulation) — so this is tuned smaller than the minimum a same-
            device screenshot required, to leave margin for that gap
            between emulated and real mobile Safari/Chrome rendering. */}
        <div aria-hidden="true" className="h-[22vw] sm:h-[15vw]" />
      </div>
    </section>
  );
}
