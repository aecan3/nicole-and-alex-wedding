import Image from "next/image";
import { Reveal } from "@/components/reveal";

// The section is a single photo: an ornate silver frame holding a
// deckle-edge card, background removed so it sits directly on the site's
// own cream page colour, its own soft drop shadow preserved from the
// original photo rather than a CSS shadow. -v2 through -v6 carried the copy
// as real HTML text laid over a blank card image instead (percentages
// hand-measured against each new source photo so it landed inside the
// card's edges rather than drifting onto the frame) — matching a live font
// against a photographed handwriting style, and keeping it centred on the
// card's own measured centre rather than the photo's, turned out to be more
// fiddly to keep right across every card-photo replacement than it was
// worth. -v7 folds the copy into the photo itself instead: you sent through
// a screenshot of the last (correctly centred, correct font) render of this
// section as the new source image, so there's no more live text to
// position — just the one flattened picture, cropped/lit/shadowed exactly
// as supplied. Getting there took two passes over that screenshot: a mild
// unsharp mask, since the screenshot capture read a bit soft next to the
// original card photo's own sharpness; and a background removal that keeps
// the frame's real soft shadow rather than cutting it off hard at some
// radius — a plain corner-sampled difference matte (as used for earlier
// versions) put the shadow's own gradient through the same threshold as
// everything else, which for a shadow that fades gradually into a
// naturally textured (not perfectly flat) wall produced a jagged, staircase
// edge right where the shadow faded out. Fix was to only force full opacity
// where it's actually needed — inside the card's own paper, whose pale
// colour otherwise sits close enough to the background model to get read as
// partly transparent (the same "paper hole" failure earlier versions hit,
// now solved with a convex hull over the paper's own colour instead of
// trying to threshold the whole frame+shadow silhouette at once) — and
// leave the shadow and every other pixel on the original soft, unforced
// alpha gradient, so the shadow keeps its natural photographic falloff.
export function RegistrySection() {
  return (
    <section id="registry" className="scroll-mt-24 px-4 py-20 sm:py-28">
      <Reveal>
        <div className="relative mx-auto aspect-[955/1120] w-full max-w-[420px] sm:max-w-xl">
          <Image
            src="/gallery/gifts-plate-card-v7.png"
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
