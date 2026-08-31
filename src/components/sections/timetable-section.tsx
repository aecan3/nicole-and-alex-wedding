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
    <section id="timetable" className="scroll-mt-24">
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
    </section>
  );
}
