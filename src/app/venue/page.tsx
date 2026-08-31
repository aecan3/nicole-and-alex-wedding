import Image from "next/image";
import { PageHeader } from "@/components/page-header";
import { Reveal } from "@/components/reveal";

export default function VenuePage() {
  return (
    <main className="flex-1">
      <PageHeader title="Alora Macedon" />

      {/* No top banner photo — the page opens straight into the text, and
          the same line-art rendering reappears further down as a faded
          watermark instead (see below). */}
      <div className="relative w-full overflow-hidden">
        {/* Faded line-art watermark — the glass atrium interior, tucked
            into the bottom-right behind the address/details grid rather
            than under the intro paragraph. Decorative only (empty alt,
            not focusable), sized to bleed off the edge like a corner
            flourish rather than sit as a boxed-in image. */}
        <Image
          src="/gallery/venue-atrium-watermark.png"
          alt=""
          width={960}
          height={492}
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-14 -right-20 z-0 w-[640px] max-w-[85vw] opacity-[0.22] sm:w-[860px] lg:w-[1040px]"
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
      </div>
    </main>
  );
}
