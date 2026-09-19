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
//
// Round 2: you flagged dead space above/below the plate on both
// breakpoints, plus wanted mobile another 20% bigger again. The vertical
// py-20/py-28 is cut roughly in half (py-10/py-14) on both. On mobile the
// image was already filling the page's normal side gutter, so there was
// no room left to grow within it - dropped the section's own left/right
// padding on mobile only (px-0, sm:px-4 restores it on desktop) so the
// card now bleeds edge-to-edge instead. That's a real but modest gain
// (~9% wider, screen-width-limited) - full 20% isn't physically possible
// on mobile without the image overflowing the viewport, so this is as
// large as it can go edge-to-edge; flag if you had something else in mind.
//
// Round 3: still too much space per your screenshot - cut py-10/py-14
// down further to py-4/py-8 (16px/32px), about a quarter of the original.
// Note: your screenshot's side margins still matched the *old* px-4/
// max-w-420 numbers almost exactly, which means that screenshot was very
// likely a cached view from before round 2 actually redeployed, not a
// bug in the round 2 fix.
//
// Round 4 (the real fix): you confirmed sides were fine after a hard
// refresh, but top/bottom still didn't budge even with py cut to almost
// nothing - because the section's own padding was never the (main) cause.
// The v12 canvas (2944x4416) had a lot of transparent margin baked in
// around the tray itself (14%/13%/7%/9% top/bottom/left/right of the
// canvas) left over from when it was composited at a fixed size - since
// the box's aspect-ratio matches the *whole canvas*, object-contain was
// faithfully rendering that baked-in margin as cream dead space no
// amount of section padding could touch. Fixed by cropping the PNG
// itself tight around the tray+shadow (down to 2579x3351, ~2% breathing
// room around the shadow's soft edge) and updating the aspect-ratio class
// to match, so the box now hugs the actual content instead of the old
// oversized canvas.
export function RegistrySection() {
  return (
    <section id="registry" className="scroll-mt-24 px-6 py-12 sm:py-16">
      {/* Sized to sit with the welcome-note card rather than dominate it.
          The note renders at min(100vw-48px, 704px); this caps at 500px on
          desktop so the two read as a pair instead of one being 1.8x the
          height of the other, and uses the same px-6 gutter on mobile so
          both are inset by the same amount instead of this one going
          full-bleed. 500px also keeps the source (743px wide) from being
          upscaled as hard as it was at 692px. */}
      <Reveal>
        <div className="relative mx-auto aspect-[743/1019] w-full max-w-[500px]">
          <Image
            src="/gallery/gifts-plate-card-v14.png"
            alt="With love — a quick note on gifts. Your presence is the greatest gift of all. For those who'd still like to give, we will have a wishing well available for contributions towards our future together."
            fill
            sizes="(min-width: 640px) 500px, calc(100vw - 48px)"
            className="object-contain select-none pointer-events-none"
          />
        </div>
      </Reveal>
    </section>
  );
}
