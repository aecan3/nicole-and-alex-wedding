import { PageHeader } from "@/components/page-header";

export default function TravelPage() {
  return (
    <main className="flex-1">
      <PageHeader kicker="Getting to Alora Macedon" title="Travel" />
      <div className="mx-auto max-w-2xl px-6 pb-20 space-y-10">
        <div>
          <h2 className="font-display text-2xl text-burgundy-800">Getting Here</h2>
          <p className="mt-3 leading-relaxed">
            Alora Macedon sits at the foothills of Mount Macedon, about 45 minutes&rsquo;
            drive from Melbourne. If you&rsquo;re flying in, Melbourne Airport (Tullamarine)
            is the closest, around 40 minutes from the venue.
          </p>
        </div>
        <div>
          <h2 className="font-display text-2xl text-burgundy-800">Shuttle Bus</h2>
          <p className="mt-3 leading-relaxed">
            We&rsquo;ll be running a shuttle bus from common pick-up points around
            Gisborne, New Gisborne and Macedon, straight to the venue and back again
            at the end of the night. Exact pick-up points and times will be confirmed
            closer to the day &mdash; we&rsquo;ll update this page and let you know.
          </p>
        </div>
        <div>
          <h2 className="font-display text-2xl text-burgundy-800">Parking</h2>
          <p className="mt-3 leading-relaxed">
            If you&rsquo;d rather drive, there&rsquo;s plenty of free parking on site at
            Alora Macedon.
          </p>
        </div>
      </div>
    </main>
  );
}
