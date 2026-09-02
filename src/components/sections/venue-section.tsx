import Image from "next/image";
import { PageHeader } from "@/components/page-header";
import { Reveal } from "@/components/reveal";

export function VenueSection() {
  return (
    <>
      {/* Floral vine border, recolored to taupe-600 from the user's
          reference art and tiled edge-to-edge. Deliberately a sibling of
          the section below rather than living inside it, so it sits on
          the plain page background outside the aerial wash's own bounds
          — a frame around the photo, not a strip laid over it. Because
          the tile width rarely divides the viewport evenly, the pattern
          gets cut mid-flower right at the screen edge; a soft mask
          feathers it to nothing well before that cut, so the ends read
          as a fade rather than a crop. */}
      <div
        aria-hidden="true"
        className="h-9 sm:h-11 bg-[url('/gallery/border-top.png')] bg-repeat-x bg-center bg-[length:auto_100%]"
        style={{
          WebkitMaskImage:
            "linear-gradient(to right, transparent, black 14%, black 86%, transparent)",
          maskImage:
            "linear-gradient(to right, transparent, black 14%, black 86%, transparent)",
        }}
      />

      <section id="venue" className="relative overflow-hidden scroll-mt-24">
        {/* The atrium line-art watermark that used to live here (sized off
          min-h-svh to give it room) has moved down to the Timetable
          section, in the blank gap before "Where to Stay" — see the note
          there. In its place: an aerial shot of the venue, pre-toned to a
          warm beige duotone (grayscale, then colorized dark-brown-to-cream
          rather than left in colour) and laid at low opacity as a full-
          bleed backdrop behind the text, rather than a small corner accent
          like the atrium sketch — a photo this size reads as a wash at low
          opacity, not a watermark-scale detail. */}
        <Image
          src="/gallery/venue-aerial-wash.jpg"
          alt=""
          aria-hidden="true"
          fill
          priority={false}
          sizes="100vw"
          className="object-cover opacity-[0.18] pointer-events-none select-none"
          style={{
            WebkitMaskImage:
              "linear-gradient(to bottom, transparent, black 16%, black 84%, transparent)",
            maskImage:
              "linear-gradient(to bottom, transparent, black 16%, black 84%, transparent)",
          }}
        />

        <div className="relative z-10">
          <PageHeader title="Alora Macedon" />

        <div className="mx-auto max-w-3xl px-6 pt-10 pb-20 text-center">
          <Reveal>
            <p className="text-lg leading-relaxed">
              Our ceremony and reception will be held at Alora Macedon, a
              Tuscan-inspired estate set among rolling hills at the base of
              Mount Macedon, about 60 minutes from Melbourne. Filled with
              romantic light, the private grounds offer a beautiful, intimate
              backdrop for our day.
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <div className="mt-10 text-center">
              <p className="text-xs uppercase tracking-[0.2em] text-taupe-600">Address</p>
              <p className="mt-1">330 Barringo Road<br />New Gisborne, VIC</p>
            </div>
          </Reveal>
        </div>
        </div>
      </section>

      <div
        aria-hidden="true"
        className="h-9 sm:h-11 bg-[url('/gallery/border-bottom.png')] bg-repeat-x bg-center bg-[length:auto_100%]"
        style={{
          WebkitMaskImage:
            "linear-gradient(to right, transparent, black 14%, black 86%, transparent)",
          maskImage:
            "linear-gradient(to right, transparent, black 14%, black 86%, transparent)",
        }}
      />
    </>
  );
}
