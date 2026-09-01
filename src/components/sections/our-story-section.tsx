import { PageHeader } from "@/components/page-header";
import { Reveal } from "@/components/reveal";
import { Gallery } from "@/components/gallery";
import { InView } from "@/components/in-view";

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

// Trimmed back to three so it fills exactly one row on desktop's 3-column
// layout instead of leaving a short, unbalanced second row underneath.
const dogPhotos = [
  { type: "image" as const, src: "/gallery/dog-christmas.jpg", alt: "Their dog on Christmas Day", width: 1600, height: 2133 },
  { type: "image" as const, src: "/gallery/dog-portrait.jpg", alt: "Their dog in the garden", width: 1600, height: 2133 },
  { type: "image" as const, src: "/gallery/dog-beach.jpg", alt: "Their dog on the beach", width: 1600, height: 2133 },
];

export function OurStorySection() {
  return (
    <section id="our-story" className="scroll-mt-24">
      <PageHeader kicker="How it all began" title="Our Story" />
      <div className="mx-auto max-w-4xl px-6 pb-24">
        <Reveal className="text-center max-w-xl mx-auto">
          <p className="leading-relaxed text-burgundy-600/80">
            Our first date at a little antique bar on a Tuesday night was the
            beginning of our forever. A few years later, during a special
            trip to Fiji, Alex popped the question (with a couple of
            margaritas to settle his nerves). Between settling into our new
            home, taking care of our anxious boy Riley, and many memories
            created, we couldn&rsquo;t be happier with the life we&rsquo;re
            building together. We&rsquo;re so excited for our future
            adventures ahead, and many more mid-week cocktails.
          </p>
        </Reveal>
        <Reveal delay={0.15} className="mt-14">
          {/* The gallery's videos autoplay as soon as they mount — fine when
              this was the whole page and already in view, not fine when
              it's one of nine sections that would otherwise all mount at
              once. InView defers mounting until scrolled near, so it still
              autoplays "as soon as you land on it," just like before.
              (The dog gallery below is plain images with no autoplay
              concern, so it's rendered eagerly rather than going through
              InView — one less lazy-mount for a nav-click scroll to race
              past and shift layout under.) */}
          <InView>
            <Gallery items={photos} />
          </InView>
        </Reveal>

        <Reveal delay={0.1} className="mt-24 text-center">
          <p className="kicker text-base sm:text-lg text-taupe-600 mb-3">
            The third wheel
          </p>
          <h3 className="font-display text-2xl sm:text-3xl text-burgundy-600">
            Meet Riley
          </h3>
          <p className="mt-4 leading-relaxed text-burgundy-600/80 max-w-lg mx-auto">
            Our anxious boy has 4 legs, requires following with a vacuum
            and a wiggle bum that will melt your heart.
          </p>
        </Reveal>
        <Reveal delay={0.2} className="mt-10 max-w-lg mx-auto">
          <Gallery items={dogPhotos} />
        </Reveal>
      </div>
    </section>
  );
}
