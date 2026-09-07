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
export function RegistrySection() {
  return (
    <section id="registry" className="scroll-mt-24 px-4 py-20 sm:py-28">
      <Reveal>
        <div className="relative mx-auto aspect-[2944/4416] w-full max-w-[420px] sm:max-w-xl">
          <Image
            src="/gallery/gifts-plate-card-v10b.png"
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
