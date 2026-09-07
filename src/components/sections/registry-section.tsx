import Image from "next/image";
import { Reveal } from "@/components/reveal";

// The section is a single photo: an ornate silver tray/frame with a
// deckle-edge paper card on top of it, background removed so it sits
// directly on the site's own cream page colour, its own soft drop shadow
// preserved rather than a CSS shadow, and the copy baked into the image as
// real text rendered through a headless browser at high resolution rather
// than kept as live, positioned HTML (see -v7/-v8 history below for why).
//
// -v9 replaces the tray/frame photo itself with the sharper photo you sent
// (no paper on it this time, shot cleanly against plain grey rather than
// the earlier screenshot-sourced composite) - background removed the same
// way as every version before it (soft corner/shadow-aware alpha, full
// opacity forced only where the tray's own smooth reflective centre could
// otherwise read as partly transparent). The paper card itself is lifted
// back out of the old -v6 asset (its own colour-based cutout, deckle edges
// and all) and placed on the new tray at the same size/position/centring
// as the version this replaced, then the copy is rendered on top of that -
// same font, colours and relative position as -v8, just recalculated
// against the new composite's own pixel dimensions rather than reused as
// literal pixel values (the -v8 -> this version bug: baking -v8's text
// sizes as literal pixels into a 3x-larger canvas made the text 3x smaller
// relative to the image, since font size was never in question, only the
// canvas was). Sizes here are instead set as a percentage of the paper's
// own measured width, so they carry over correctly regardless of the
// canvas resolution.
export function RegistrySection() {
  return (
    <section id="registry" className="scroll-mt-24 px-4 py-20 sm:py-28">
      <Reveal>
        <div className="relative mx-auto aspect-[2944/4416] w-full max-w-[420px] sm:max-w-xl">
          <Image
            src="/gallery/gifts-plate-card-v9.png"
            alt="With love — a quick note on gifts. Your presence is the greatest gift of all. For those who'd still like to give, we will have a wishing well available for contributions towards our future together."
            fill
            sizes="(min-width: 640px) 576px, 420px"
            className="object-contain select-none pointer-events-none"
          />
        </div>
      </Reveal>
    </section>
  );
}
