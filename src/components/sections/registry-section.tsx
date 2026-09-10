import Image from "next/image";
import { Reveal } from "@/components/reveal";

// The section is a single photo: an ornate silver tray with a paper card
// centred on top of it, background removed so it sits directly on the
// site's own cream page colour, with its own soft drop shadow rather than
// a CSS shadow.
//
// -v10 replaces the card itself with the image you supplied directly (copy
// already set in it, rather than rendered here) - its plain white
// background/margin removed with a straightforward brightness cutout (a
// clean rectangular card on flat white doesn't need the corner-sampled
// vignette matte the tray photo needs), then centred dead-centre on the
// tray at the same relative size as every version before it. History of
// how the tray photo itself was prepared (background removal, shadow
// handling) carries over unchanged from -v9.
//
// -v10b: your source image's ink was a near-black brown, not the site's
// burgundy - recoloured by treating darkness-from-the-paper as an ink-
// strength mask and blending each pixel from the paper's own colour toward
// burgundy-700 by that strength (rather than a flat recolour), so the
// anti-aliased edges of the letters stay smooth instead of going hard/
// pixelated. Nothing else about the card or its position changed.
//
// -v10c (reverted): tried resampling the welcome-letter's ink colour and
// reblending to it, but it made the lettering look traced/outlined rather
// than clean printed text - reverted back to -v10b (burgundy-700) below.
//
// -v11: swapped the card for the new, cleaner photo you supplied directly
// (text already set in it, same as -v10) - background removed with a
// plain brightness cutout again, but this time with a more generous
// inward crop pad and a hard (not soft-ramped) alpha edge, because the
// -v10 soft-ramp approach left a faint white fringe on this photo's crisp
// edge. Placed at the exact same centred footprint the card has occupied
// since -v9/-v10 (measured directly off the live composite, not
// eyeballed), so position and relative size match every version before it.
//
// -v12: swapped in the correct photo of the card (same treatment as -v11 -
// brightness cutout, hard alpha edge, same centred footprint) - this one's
// ink is already burgundy, not the dark brown -v11 had.
//
// Sizing: you said it was hard to read - on desktop the box was capped at
// 576px (sm:max-w-xl), bumped 20% to 692px. On mobile it was capped at a
// flat 420px regardless of how much wider the screen actually was, which
// is what left the wide cream margins in your screenshot - that cap is
// dropped (max-w-none) so it now fills out to the section's own px-4 page
// gutter on every phone width, same as the rest of the page's content.
export function RegistrySection() {
  return (
    <section id="registry" className="scroll-mt-24 px-4 py-20 sm:py-28">
      <Reveal>
        <div className="relative mx-auto aspect-[2944/4416] w-full max-w-none sm:max-w-[692px]">
          <Image
            src="/gallery/gifts-plate-card-v12.png"
            alt="With love — a quick note on gifts. Your presence is the greatest gift of all. For those who'd still like to give, we will have a wishing well available for contributions towards our future together."
            fill
            sizes="(min-width: 640px) 692px, 100vw"
            className="object-contain select-none pointer-events-none"
          />
        </div>
      </Reveal>
    </section>
  );
}
