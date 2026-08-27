import { PageHeader } from "@/components/page-header";

export default function VenuePage() {
  return (
    <main className="flex-1">
      <PageHeader kicker="4:00pm, Thursday 11 March 2027" title="Alora Macedon" />
      <div className="mx-auto max-w-3xl px-6 pb-20 text-center">
        <p className="text-lg leading-relaxed">
          Our ceremony and reception will be held in the Glass Atrium at Alora Macedon,
          a Tuscan-inspired estate set at the foothills of Mount Macedon &mdash; about
          45 minutes from Melbourne. Floor-to-ceiling glass, soaring ceilings and
          crystal chandeliers open onto rolling hills, so however the March weather
          behaves, we&rsquo;ll be celebrating in style.
        </p>
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
      </div>
    </main>
  );
}
