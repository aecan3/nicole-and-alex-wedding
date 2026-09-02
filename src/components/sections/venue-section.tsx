import { PageHeader } from "@/components/page-header";
import { Reveal } from "@/components/reveal";

export function VenueSection() {
  return (
    <section id="venue" className="scroll-mt-24">
      {/* The atrium line-art watermark that used to live here (sized off
          min-h-svh to give it room) has moved down to the Timetable
          section, in the blank gap before "Where to Stay" — see the note
          there. Nothing here depends on that positioning anymore, so this
          section is back to plain content flow. */}
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
    </section>
  );
}
