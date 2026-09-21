import Image from "next/image";
import { Reveal } from "@/components/reveal";

// This section used to run through the shared PageHeader (burgundy text on
// the plain cream page, like every other section). It's now a solid
// burgundy field of its own — the mockup that got approved for this — to
// give the dress code a bit of visual separation from the sections either
// side of it, so it isn't reusing PageHeader here: that component hardcodes
// burgundy-600 heading text and a taupe kicker, both meant for a cream
// background, and the whole point of this section is the color flip
// (cream/gold text on burgundy instead of burgundy text on cream). The
// radial gradient (burgundy-800 fading down to burgundy-950) gives the
// field a touch of depth rather than a single flat fill; no border/divider
// treatment between this and the cream sections above/below for now.
export function DressCodeSection() {
  return (
    <section id="dress-code" className="scroll-mt-24">
      <div className="relative overflow-hidden bg-[radial-gradient(ellipse_140%_100%_at_50%_0%,var(--color-burgundy-800)_0%,var(--color-burgundy-900)_55%,var(--color-burgundy-950)_100%)]">
        {/* Olive branches: your own supplied artwork (background-removed),
            not a redrawn version. Framing the whole text block from the
            "Dress Code" kicker down through the body copy, nudged in
            close per request. Right branch is the same asset mirrored
            with scaleX(-1) rather than a second file. Position values
            (calc(50% - 410px) etc.) are relative to this full-width
            section, not the max-w-xl text column, matching the approved
            mock-up exactly. sm and up only — the mobile pair below is a
            different, faded-background treatment instead. */}
        <Image
          src="/decor/olive-branch.png"
          alt=""
          aria-hidden="true"
          width={212}
          height={236}
          className="pointer-events-none absolute hidden w-[230px] h-auto opacity-95 sm:block"
          style={{ left: "calc(50% - 410px)", top: "calc(50% - 24px)", transform: "translateY(-50%)" }}
        />
        <Image
          src="/decor/olive-branch.png"
          alt=""
          aria-hidden="true"
          width={212}
          height={236}
          className="pointer-events-none absolute hidden w-[230px] h-auto opacity-95 sm:block"
          style={{ right: "calc(50% - 410px)", top: "calc(50% - 24px)", transform: "translateY(-50%) scaleX(-1)" }}
        />

        {/* Mobile treatment: there's no clear space beside the text at
            this width, so instead of flanking it these are faded well
            into the background (opacity-40, vs. 95% on desktop) and
            allowed to sit behind/under the text rather than beside it —
            approved from a mock-up of a few opacity/size options. */}
        <Image
          src="/decor/olive-branch.png"
          alt=""
          aria-hidden="true"
          width={212}
          height={236}
          className="pointer-events-none absolute block w-[170px] h-auto opacity-40 sm:hidden"
          style={{ left: "-10px", top: "50%", transform: "translateY(-50%)" }}
        />
        <Image
          src="/decor/olive-branch.png"
          alt=""
          aria-hidden="true"
          width={212}
          height={236}
          className="pointer-events-none absolute block w-[170px] h-auto opacity-40 sm:hidden"
          style={{ right: "-10px", top: "50%", transform: "translateY(-50%) scaleX(-1)" }}
        />

        <div className="relative z-10 mx-auto max-w-xl px-6 py-20 sm:py-28 text-center">
          <Reveal>
            <p className="kicker text-base sm:text-lg text-gold-400 mb-3">Dress Code</p>
            <h2 className="font-heading text-[2.625rem] sm:text-[4.125rem] text-cream-100 tracking-tight">
              Formal Attire
            </h2>
            <div className="mx-auto mt-6 h-px w-20 bg-gradient-to-r from-transparent via-gold-400 to-transparent" />
          </Reveal>

          <div className="mt-10">
            <p className="leading-relaxed text-cream-200">
              We ask that guests join us in formal attire.
              <br />
              Think floor-length dresses, elegant eveningwear,{" "}
              <br className="hidden sm:block" />
              or a tailored suit paired with a necktie or bowtie.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
