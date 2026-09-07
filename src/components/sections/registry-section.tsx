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
// overlay elements below were all w-[42%] of this container at the time,
// centered) —
// the original hand-drawn text boxes ran slightly wider than the card at
// some rows, and the more sensitive -v4 mask was catching the ornate
// silver frame's carving as "ink" there too.
//
// -v5 replaces -v4: the -v4 background removal compared the (BGR) source
// image against a reference colour written in RGB order, so the R and B
// channels were swapped when measuring "distance from background" - a
// meaningful chunk of the real background fell under the mis-scaled
// threshold and stayed partly opaque, showing up as a faint but visibly
// darker rectangular ghost of the source screenshot's own background
// behind the frame. -v5 fixes the channel order and measures the
// reference colour from this image's own corner pixels instead of a
// hardcoded constant, so it's self-calibrating.
//
// Text sizes bumped a step up at both breakpoints (kicker/body/title) and
// the overlay column widened from 42% to 46% of the card to give the
// larger title room before wrapping - the previous sizes read as too
// small to comfortably read on a phone.
//
// Contrast/vintage pass (approved from a mock-up): the card image got a
// mild filter (contrast/sepia/vignette) plus a darker body-copy colour so
// the paper read a little aged rather than freshly printed.
//
// -v6 replaces -v5 with a photo you supplied directly, already carrying
// its own warmer, more contrasty vintage tone (from your own edit), so
// the CSS filter/vignette from the mock-up pass above is removed here —
// applying both would have double-processed it. Like -v3, the source
// came in as a screenshot with this component's own text baked into the
// pixels, so it needed the same "erase the baked-in copy, then let the
// real text sit back on top" treatment: an ink mask from local
// background subtraction (restricted to a hand-measured safe box well
// inside the card so the frame's carving is never mistaken for ink),
// filled via a large-radius (81px) per-channel median blur feathered
// back in — a smaller radius or a boundary-diffusion fill both still
// left a faint readable "ghost" of the letters (the diffusion result is
// mathematically pulled toward the letter-shaped mask boundary, so it
// echoes the letterforms no matter how many iterations it runs; a wide
// enough median instead pulls a robust value from a broad neighbourhood
// dominated by plain paper, which doesn't). Background alpha is the same
// corner-sampled difference matte as -v5, except forced to full opacity
// across the paper's own convex hull — computing it straight from the
// diffed pixels re-introduced a faint version of the same ghost, because
// the removed ink pixels differ from the background-colour model by a
// lot more than the surrounding blank paper does, so the two areas were
// getting slightly different alpha and the mismatch alone silhouetted
// the old text once composited over the page's cream. Photo is a
// different aspect ratio again (955×1120), so the container's aspect-[]
// and the hand-measured overlay percentages below are updated to match —
// including the overlay width, stepped down from 42% to 36%: the paper
// itself is proportionally narrower in this photo (~44% of the frame vs
// ~49% before), so 42% was overhanging onto the frame on the paragraph's
// wider lines. The title also drops a step on mobile (text-2xl to
// text-xl — sm+ keeps text-3xl) since at the narrower 36% column and the
// phone-width card, text-2xl script wrapped to two lines and ran into
// the body copy below it.
export function RegistrySection() {
  return (
    <section id="registry" className="scroll-mt-24 px-4 py-20 sm:py-28">
      <Reveal>
        <div className="relative mx-auto aspect-[955/1120] w-full max-w-[420px] sm:max-w-xl">
          <Image
            src="/gallery/gifts-plate-card-v6.png"
            alt=""
            aria-hidden="true"
            fill
            sizes="(min-width: 640px) 576px, 420px"
            className="object-contain select-none pointer-events-none"
          />

          {/* Everything below is sized to the card's own width (~44% of
              this box — x 246–665 of the 955px source photo), not the full
              framed-photo width, so none of it drifts onto the silver frame
              at either breakpoint. */}

          <p className="absolute left-1/2 top-[37.7%] w-[36%] -translate-x-1/2 -translate-y-1/2 text-center kicker text-xs sm:text-sm text-burgundy-700">
            With love
          </p>

          <h2 className="absolute left-1/2 top-[46.9%] w-[36%] -translate-x-1/2 -translate-y-1/2 text-center font-script italic text-xl sm:text-3xl leading-[1.15] text-burgundy-600">
            A quick note on gifts
          </h2>

          <p className="absolute left-1/2 top-[62.9%] w-[36%] -translate-x-1/2 -translate-y-1/2 text-center font-serif text-xs sm:text-base leading-[1.4] text-burgundy-800">
            Your presence is the greatest gift of all.{" "}
            {/* Line break only on sm+ (desktop/tablet) — on mobile the card
                is already tight for vertical space, so the text keeps
                flowing/wrapping naturally there instead of forcing a break.
                The {" "} above keeps a space between the sentences when the
                br is hidden — JSX would otherwise collapse it to nothing. */}
            <br className="hidden sm:block" />
            For those who&rsquo;d still like to give, we will have a wishing
            well available for contributions towards our future together.
          </p>
        </div>
      </Reveal>
    </section>
  );
}
