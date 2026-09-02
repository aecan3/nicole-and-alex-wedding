import Image from "next/image";
import { PageHeader } from "@/components/page-header";
import { Reveal } from "@/components/reveal";

export function VenueSection() {
  return (
    <section id="venue" className="relative overflow-hidden scroll-mt-24">
      {/* The atrium line-art watermark that used to live here (sized off
          min-h-svh to give it room) has moved down to the Timetable
          section, in the blank gap before "Where to Stay" — see the note
          there. In its place: an aerial shot of the venue, pre-toned to a
          warm beige duotone (grayscale, then colorized dark-brown-to-cream
          rather than left in colour, using the site's own gold/taupe
          palette rather than its cream page background — colorizing to
          the exact page-background tone makes the wash invisible at low
          opacity, since alpha-compositing a foreground color identical
          to the background always resolves to that background color)
          and laid at low opacity as a full-bleed backdrop behind the
          text. Swapped to a wider, more zoomed-out shot of the venue and
          grounds; same processing and mask treatment carried over. The
          flower-vine borders that used to frame this section top and
          bottom have been removed per request — just the photo wash and
          its own top/bottom fade now. Fade band settled at 10% per edge
          — between the original 16% (too much, ate into the mountains
          near the top of the photo) and 4% (too sharp an edge). Opacity
          nudged up to 0.28, the ceiling before the burgundy body text
          sitting on top starts losing contrast.

          The photo itself is a wide 1024x442 panorama (~2.3:1). On
          desktop, where the section is much taller than that in
          proportion, `fill`+object-cover was stretching the crop box to
          the section's full height, which meant covering that height
          while keeping the image's own proportions intact required
          blowing it up and cropping away most of its width, leaving only
          a narrow vertical sliver of the panorama on screen — so desktop
          gets a wrapper sized to the photo's own aspect ratio instead
          (full width, height following from that), vertically centered
          in the section, rendering the whole wide shot uncropped. On
          mobile, though, a portrait-oriented section next to a 2.3:1
          panorama means an aspect-ratio-locked box would be a thin strip
          — not "appropriate for the size of the phone" — so mobile goes
          back to a full-bleed backdrop treatment, just carrying over the
          same fade/opacity tuning as desktop.

          Mobile got its own separate photo rather than reusing the
          desktop one — a second aerial shot the user supplied specifically
          for this, already close to portrait (3:4) rather than the
          desktop photo's wide 2.3:1 panorama, so a plain `background-size:
          cover` needs barely any crop to fill the section (mostly a
          little off the sides, none off the top/bottom) and shows
          mountain, fields and the estate all in one frame — no zoom trick
          needed here the way the old shared photo needed one. Kept as a
          separate file (venue-mobile-wash.jpg) rather than swapped in
          place of the desktop one — desktop's crop/composition was
          already approved and is explicitly not to be touched. */}
        <div
          aria-hidden="true"
          className="absolute inset-0 sm:hidden opacity-[0.28] pointer-events-none"
          style={{
            backgroundImage: "url('/gallery/venue-mobile-wash.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            WebkitMaskImage:
              "linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)",
            maskImage:
              "linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)",
          }}
        />
        <div className="hidden sm:block absolute inset-x-0 top-1/2 -translate-y-1/2 aspect-[1024/442] w-full">
          <Image
            src="/gallery/venue-aerial-wash.jpg"
            alt=""
            aria-hidden="true"
            fill
            priority={false}
            sizes="100vw"
            className="object-cover opacity-[0.28] pointer-events-none select-none"
            style={{
              WebkitMaskImage:
                "linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)",
              maskImage:
                "linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)",
            }}
          />
        </div>

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
  );
}
