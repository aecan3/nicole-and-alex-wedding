import Image from "next/image";
import { PageHeader } from "@/components/page-header";
import { Reveal } from "@/components/reveal";

export default function VenuePage() {
  return (
    <main className="flex-1">
      <PageHeader kicker="4:00pm, Thursday 11 March 2027" title="Alora Macedon" />

      <Reveal className="mx-auto max-w-4xl px-6">
        <div className="relative aspect-[16/10] overflow-hidden rounded-sm">
          <Image
            src="/gallery/venue-photo.jpg"
            alt="The Glass Atrium at Alora Macedon, set against the Macedon Ranges"
            fill
            priority
            className="object-cover"
          />
        </div>
      </Reveal>

      <div className="mx-auto max-w-3xl px-6 py-16 text-center">
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
              <p className="text-xs uppercase tracking-[0.2em] text-olive-700">Address</p>
              <p className="mt-1">330 Barringo Road<br />New Gisborne, VIC</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-olive-700">Ceremony &amp; Reception</p>
              <p className="mt-1">Arrival from 3:30pm<br />Ceremony at 4:00pm, indoors</p>
            </div>
          </div>
        </Reveal>
      </div>

      {/* Atmospheric close — the venue's own line-art rendering, full bleed on black */}
      <Reveal>
        <div className="relative w-full aspect-[16/9] sm:aspect-[21/9] bg-black">
          <Image
            src="/gallery/venue-line-art.jpg"
            alt="Line-art rendering of the Alora Macedon glass atrium at night"
            fill
            className="object-cover"
          />
        </div>
      </Reveal>
    </main>
  );
}
