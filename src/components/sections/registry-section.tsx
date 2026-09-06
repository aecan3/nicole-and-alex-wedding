import Image from "next/image";
import { Reveal } from "@/components/reveal";
import { Monogram } from "@/components/nav";

// The section used to be a plain PageHeader + two paragraphs of body copy.
// It's now built entirely around a single photo (an ornate silver frame
// holding a blank deckle-edge card, background removed so it sits directly
// on the site's own cream page colour) with all of the copy — including
// what used to be the "With Love / Gifts" PageHeader — laid over the card
// face as real text, the same way the invitation-card image up in the
// Hero carries its own message. Percentages below are hand-measured against
// the source photo (736×1104) so each line lands inside the card's deckle
// edges rather than drifting onto the silver frame as the box reflows.
export function RegistrySection() {
  return (
    <section id="registry" className="scroll-mt-24 px-6 py-20 sm:py-28">
      <Reveal>
        <div className="relative mx-auto aspect-[736/1104] w-full max-w-[340px] sm:max-w-md">
          <Image
            src="/gallery/gifts-plate-card.png"
            alt=""
            aria-hidden="true"
            fill
            sizes="(min-width: 640px) 448px, 340px"
            className="object-contain select-none pointer-events-none"
          />

          {/* Everything below is sized to the card's own width (43.5% of
              this box — x 205–525 of the 736px source photo), not the full
              framed-photo width, so none of it drifts onto the silver frame
              at either breakpoint. */}

          <Monogram
            className="absolute left-1/2 top-[31%] h-6 w-6 sm:h-7 sm:w-7 -translate-x-1/2 -translate-y-1/2"
          />

          <p className="absolute left-1/2 top-[37.5%] w-[38%] -translate-x-1/2 -translate-y-1/2 text-center kicker text-[8px] sm:text-[10px] text-taupe-600">
            With love
          </p>

          <h2 className="absolute left-1/2 top-[45%] w-[38%] -translate-x-1/2 -translate-y-1/2 text-center font-script italic text-base sm:text-xl leading-[1.15] text-burgundy-600">
            A quick note on gifts
          </h2>

          <p className="absolute left-1/2 top-[59%] w-[38%] -translate-x-1/2 -translate-y-1/2 text-center font-serif text-[8.5px] sm:text-[11px] leading-[1.4] text-burgundy-600/90">
            Your presence is the greatest gift of all. For those who&rsquo;d
            still like to give, we have a wishing well for contributions
            towards our future together.
          </p>
        </div>
      </Reveal>
    </section>
  );
}
