import Image from "next/image";
import { PageHeader } from "@/components/page-header";
import { Reveal } from "@/components/reveal";

export default function VenuePage() {
  return (
    <main className="relative flex-1 overflow-hidden">
      <PageHeader title="Alora Macedon" />

      {/* No top banner photo — the page opens straight into the text, and
          the same line-art rendering reappears further down as a faded
          watermark instead (see below). */}

      {/* Large line-art watermark, tablet/desktop only — flush to the
          right edge of the page and reaching all the way down to the
          bottom of the cream section (the true bottom of <main>, not
          just the text block), starting roughly level with the last
          line of the intro paragraph. object-contain so the whole
          illustration is always visible, never cropped; it naturally
          fills the available height and hugs the right/bottom corner. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-[348px] right-0 bottom-0 left-[37%] z-0 hidden opacity-[0.22] sm:block"
      >
        <Image
          src="/gallery/venue-atrium-watermark.png"
          alt=""
          fill
          className="object-contain object-right-bottom"
        />
      </div>

      {/* Smaller corner accent on mobile — a full-bleed fill reads as
          clutter behind full-width text on a narrow screen, so this
          stays a modest, fully-contained illustration tucked into the
          whitespace above the address block instead. */}
      <Image
        src="/gallery/venue-atrium-watermark.png"
        alt=""
        width={960}
        height={492}
        aria-hidden="true"
        className="pointer-events-none absolute right-[24px] top-64 z-0 block w-[220px] max-w-[55vw] opacity-[0.22] sm:hidden"
      />

      <div className="relative z-10 mx-auto max-w-3xl px-6 pt-10 pb-20 text-center">
        <Reveal>
          <p className="text-lg leading-relaxed">
            Our ceremony and reception will be held in the Glass Atrium at Alora Macedon,
            a Tuscan-inspired estate set at the foothills of Mount Macedon &mdash; about
            45 minutes from Melbourne. Floor-to-ceiling glass, soaring ceilings and
            crystal chandeliers open onto rolling hills, so however the March weather
            behaves, we&rsquo;ll be celebrating in style.
          </p>
        </Reveal>
        <Reveal delay={0.15}>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 text-left max-w-xl mx-auto">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-taupe-600">Address</p>
              <p className="mt-1">330 Barringo Road<br />New Gisborne, VIC</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-taupe-600">Ceremony &amp; Reception</p>
              <p className="mt-1">Arrival from 3:30pm<br />Ceremony at 4:00pm, indoors</p>
            </div>
          </div>
        </Reveal>
      </div>
    </main>
  );
}
