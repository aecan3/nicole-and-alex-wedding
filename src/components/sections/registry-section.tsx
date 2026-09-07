import Image from "next/image";
import { Reveal } from "@/components/reveal";

// The section is a single photo: an ornate silver frame holding a
// deckle-edge card, background removed so it sits directly on the site's
// own cream page colour, its own soft drop shadow preserved from the
// original photo rather than a CSS shadow. -v2 through -v6 carried the copy
// as real HTML text laid over a blank card image instead (percentages
// hand-measured against each new source photo so it landed inside the
// card's edges rather than drifting onto the frame) - matching a live font
// against a photographed handwriting style, and keeping it centred on the
// card's own measured centre rather than the photo's, turned out to be more
// fiddly to keep right across every card-photo replacement than it was
// worth.
//
// -v7 folded the copy into the photo itself instead of keeping it as live
// HTML text: you sent through a screenshot of the last (correctly centred,
// correct font) render of this section as the new source image. That source
// was a screen capture though - JPEG-compressed and screen-resolution, not
// the original photo's own quality - so its baked-in text came out soft and
// close to black rather than sharp and burgundy, which -v7 could only
// partially fix (a sharpen filter on top of already-lossy text has a low
// ceiling).
//
// -v8 fixes that properly by not working from the screenshot at all: the
// blank card image from before -v6/-v7 baked any text in (still on disk as
// -v6) is the background, and the three lines of copy are real text again -
// same font, colours and measured positions as the live version this
// replaced - but rendered once through a headless browser at 3x resolution
// and flattened into the image at that size, instead of left live on the
// page. So it's still a single static picture with nothing to position, the
// way you asked for, just built from a crisp vector text render instead of
// a lossy screenshot: properly sharp, the right burgundy
// (--color-burgundy-700/600/800, matching the kicker/title/body colours
// used everywhere else on the site) rather than screenshot-flattened
// near-black, and several times the pixel resolution of the old asset.
// Background removal is unchanged from -v7 - soft corner-sampled alpha for
// the shadow's natural falloff, full opacity forced only inside the paper's
// own convex hull so its pale colour can't read as partly transparent.
export function RegistrySection() {
  return (
    <section id="registry" className="scroll-mt-24 px-4 py-20 sm:py-28">
      <Reveal>
        <div className="relative mx-auto aspect-[955/1120] w-full max-w-[420px] sm:max-w-xl">
          <Image
            src="/gallery/gifts-plate-card-v8.png"
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
