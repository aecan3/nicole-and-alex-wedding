import { PageHeader } from "@/components/page-header";
import { Reveal } from "@/components/reveal";
import { Gallery } from "@/components/gallery";

// Order matters: Gallery lays these out round-robin into columns (index i
// goes to column i % columnCount), so this list IS the grid, top to bottom,
// left to right — and because each column's total height is just the sum
// of its items' aspect ratios, the ORDER also determines how evenly the
// columns balance out. After the Christmas photo was removed, 10 items
// split unevenly across 3 columns (4/3/3), and the previous order happened
// to put mostly short, wide items in the middle column — it finished a
// full column's height short of the others, leaving a big empty gap below
// it. This order was chosen (out of ~5,800 arrangements that keep every
// video and every black-and-white piece clear of its neighbours on both
// the 2-column and 3-column layouts) to minimise that height difference.
const photos = [
  { type: "video" as const, src: "/gallery/couple-toast.mp4", alt: "The moment we got engaged", width: 720, height: 1280 },
  { type: "image" as const, src: "/gallery/couple-gallery-bw.jpg", alt: "Nicole and Alex, black and white", width: 2000, height: 2667 },
  { type: "image" as const, src: "/gallery/couple-speech-bw.jpg", alt: "Alex's speech at their engagement party, black and white", width: 2600, height: 1730 },
  { type: "image" as const, src: "/gallery/couple-house.jpg", alt: "Nicole and Alex outside their new home", width: 2400, height: 1690 },
  { type: "video" as const, src: "/gallery/couple-sold-sign.mp4", alt: "Sold sign on their new home", width: 720, height: 1280 },
  { type: "video" as const, src: "/gallery/proposal.mp4", alt: "The proposal", width: 720, height: 1280 },
  { type: "image" as const, src: "/gallery/couple-sunset.jpg", alt: "Nicole and Alex embracing at sunset", width: 2304, height: 1537 },
  { type: "image" as const, src: "/gallery/couple-garden.jpg", alt: "Nicole and Alex in the garden", width: 2000, height: 2692 },
  { type: "image" as const, src: "/gallery/couple-beach.jpg", alt: "Nicole and Alex at the beach", width: 684, height: 1004 },
  { type: "video" as const, src: "/gallery/couple-toast-bw.mp4", alt: "Just engaged, black and white", width: 1080, height: 810 },
];

// Order matters here too (see note on `photos` above). On desktop's 3
// columns, 5 items split 2/2/1 — putting the lone extra-square "bed" photo
// last means it lands alongside a portrait shot instead of doubling up with
// another one, which keeps the columns close in height instead of leaving
// a gap under the shorter ones. It also happens to balance the mobile
// 2-column layout the same way.
const dogPhotos = [
  { type: "image" as const, src: "/gallery/dog-christmas.jpg", alt: "Their dog on Christmas Day", width: 1600, height: 2133 },
  { type: "image" as const, src: "/gallery/dog-portrait.jpg", alt: "Their dog in the garden", width: 1600, height: 2133 },
  { type: "image" as const, src: "/gallery/dog-beach.jpg", alt: "Their dog on the beach", width: 1600, height: 2133 },
  { type: "image" as const, src: "/gallery/dog-santa.jpg", alt: "Nicole, Alex and their dog visiting Santa", width: 1800, height: 2400 },
  { type: "image" as const, src: "/gallery/dog-bed.jpg", alt: "Their dog curled up on the bed", width: 2400, height: 2000 },
];

export default function OurStoryPage() {
  return (
    <main className="flex-1">
      <PageHeader kicker="Coming soon" title="Our Story" />
      <div className="mx-auto max-w-4xl px-6 pb-24">
        <Reveal className="text-center max-w-xl mx-auto">
          <p className="leading-relaxed text-burgundy-600/80">
            We&rsquo;re writing this one ourselves — check back soon. Tap the first
            tile below for how it actually happened.
          </p>
        </Reveal>
        <Reveal delay={0.15} className="mt-14">
          <Gallery items={photos} />
        </Reveal>

        <Reveal delay={0.1} className="mt-24 text-center">
          <p className="kicker text-base sm:text-lg text-olive-700 mb-3">
            Every love story
          </p>
          <h2 className="font-display text-2xl sm:text-3xl text-burgundy-600">
            Has a third wheel
          </h2>
          <p className="mt-4 leading-relaxed text-burgundy-600/80 max-w-lg mx-auto">
            Ours happens to have four legs and a very good sense for when
            someone needs cheering up.
          </p>
        </Reveal>
        <Reveal delay={0.2} className="mt-10 max-w-lg mx-auto">
          <Gallery items={dogPhotos} />
        </Reveal>
      </div>
    </main>
  );
}
