import Image from "next/image";
import { Reveal } from "@/components/reveal";

// The section used to be a plain PageHeader + two paragraphs of body copy.
// It's now built entirely around a single photo (an ornate silver frame
// holding a blank deckle-edge card, background removed so it sits directly
// on the site's own cream page colour) with all of the copy — including
// what used to be the "With Love / Gifts" PageHeader — laid over the card
// face as real text, the same way the invitation-card image up in the
// Hero carries its own message. Percentages below are hand-measured against
// the source photo (928×1152) so each line lands inside the card's deckle
// edges rather than drifting onto the silver frame as the box reflows. No
// monogram here any more — with just three lines of copy, adding a fourth
// element only pushed everything down and left a gap at the top of the
// card, so the text block now starts right under the deckle edge instead.
//
// -v3 replaces -v2: the frame/tray in -v2 had a soft blurry patch on the
// lower-left tray surface (a leftover artifact from the dish-flattening
// pass used to tame a distracting highlight there) that never fully
// resolved — the source photo behind -v3 doesn't have that highlight to
// begin with, so the whole tray reads sharp and consistent. The supplied
// -v3 source came through as a screenshot of this very page (with this
// component's own text already baked into the pixels at render time,
// down to the exact font/kerning), so it needed the same "erase the
// baked-in copy" treatment as the original -v2 source before it could go
// back to being a blank card for this component's real text to sit on
// again — otherwise the two copies would have rendered doubled up.
// Background removal is a difference matte against the sampled page-cream
// corner colour (928×1152 image, so a different aspect ratio from -v2 —
// the container's aspect-[] below is updated to match, otherwise
// object-contain would letterbox it).
//
// -v4 replaces -v3: the text-removal pass behind -v3 used a small-radius
// cv2.inpaint restricted to a flat "gray < 210" ink threshold, which left
// visible blotchy discoloration in the paper where the letters used to be
// (the threshold also caught only part of the anti-aliased letter edges,
// and a plain inpaint of that size has no way to reproduce the paper's own
// fine grain, so the filled patches read as smudges rather than paper).
// -v4 rebuilds that removal step end to end: an ink mask from LOCAL
// background subtraction (a pixel is "ink" if it's meaningfully darker, in
// grayscale or in color, than a large-median-blur estimate of its own
// surrounding paper — catches faint anti-aliased edges that a flat cutoff
// missed, without being fooled by the paper's own slow shading); a smooth
// low-frequency fill via plain iterative blur-diffusion run at full
// resolution on a small crop around the text (a downscale/inpaint/upscale
// version of this tried first, but left both a repeatable ringing artifact
// and a visible "staircase" from the resize grid); and separately
// synthesized paper grain (random noise matched to the paper's own
// measured amplitude, lightly blurred) laid back on top, rather than
// copying a real patch of texture — copying-and-tiling a real patch was
// tried first too, and whatever one-off feature sat in the sampled patch
// (a faint highlight near its edge) became a repeating seam once tiled.
// The ink mask is also clamped to the text's own known-safe width (the
// overlay elements below are all w-[42%] of this container, centered) —
// the original hand-drawn text boxes ran slightly wider than the card at
// some rows, and the more sensitive -v4 mask was catching the ornate
// silver frame's carving as "ink" there too.
export function RegistrySection() {
  return (
    <section id="registry" className="scroll-mt-24 px-4 py-20 sm:py-28">
      <Reveal>
        <div className="relative mx-auto aspect-[928/1152] w-full max-w-[420px] sm:max-w-xl">
          <Image
            src="/gallery/gifts-plate-card-v4.png"
            alt=""
            aria-hidden="true"
            fill
            sizes="(min-width: 640px) 576px, 420px"
            className="object-contain select-none pointer-events-none"
          />

          {/* Everything below is sized to the card's own width (~48.7% of
              this box — x 238–690 of the 928px source photo), not the full
              framed-photo width, so none of it drifts onto the silver frame
              at either breakpoint. */}

          <p className="absolute left-1/2 top-[34%] w-[42%] -translate-x-1/2 -translate-y-1/2 text-center kicker text-[10px] sm:text-xs text-taupe-600">
            With love
          </p>

          <h2 className="absolute left-1/2 top-[44%] w-[42%] -translate-x-1/2 -translate-y-1/2 text-center font-script italic text-xl sm:text-2xl leading-[1.15] text-burgundy-600">
            A quick note on gifts
          </h2>

          <p className="absolute left-1/2 top-[59.5%] w-[42%] -translate-x-1/2 -translate-y-1/2 text-center font-serif text-[10px] sm:text-sm leading-[1.4] text-burgundy-600/90">
            Your presence is the greatest gift of all. For those who&rsquo;d
            still like to give, we have a wishing well for contributions
            towards our future together.
          </p>
        </div>
      </Reveal>
    </section>
  );
}
