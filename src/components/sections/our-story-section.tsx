import Image from "next/image";
import { PageHeader } from "@/components/page-header";
import { Reveal } from "@/components/reveal";
import { Gallery } from "@/components/gallery";
import { InView } from "@/components/in-view";

// Order matters: Gallery lays these out round-robin into columns (index i
// goes to column i % columnCount), so this list IS the grid, top to bottom,
// left to right — and because each column's total height is just the sum
// of its items' aspect ratios, the ORDER also determines how evenly the
// columns balance out. After the sunset-hug and red-dress-garden photos
// were dropped, this order was picked (searched out of every arrangement
// that keeps every video and every black-and-white piece clear of its
// neighbours, on both the 2-column mobile and 3-column desktop layouts) to
// minimise the worst-case column height difference on desktop — the videos'
// tall 9:16 aspect ratio makes a perfectly even split impossible with only
// 4 of them to spread across 3 columns, but this keeps the gap small.
const photos = [
  { type: "video" as const, src: "/gallery/couple-toast.mp4", alt: "The moment we got engaged", width: 720, height: 1280 },
  { type: "video" as const, src: "/gallery/couple-sold-sign.mp4", alt: "Sold sign on their new home", width: 720, height: 1280 },
  { type: "image" as const, src: "/gallery/couple-gallery-bw.jpg", alt: "Nicole and Alex, black and white", width: 2000, height: 2667 },
  { type: "image" as const, src: "/gallery/couple-house.jpg", alt: "Nicole and Alex outside their new home", width: 2400, height: 1690 },
  { type: "image" as const, src: "/gallery/couple-beach.jpg", alt: "Nicole and Alex at the beach", width: 684, height: 1004 },
  { type: "video" as const, src: "/gallery/proposal.mp4", alt: "The proposal", width: 720, height: 1280 },
  { type: "video" as const, src: "/gallery/couple-toast-bw.mp4", alt: "Just engaged, black and white", width: 1080, height: 810 },
  { type: "image" as const, src: "/gallery/couple-speech-bw.jpg", alt: "Alex's speech at their engagement party, black and white", width: 2600, height: 1730 },
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
            Every love story
          </p>
          <h3 className="font-display text-2xl sm:text-3xl text-burgundy-600">
            Has a third wheel
          </h3>
          <p className="mt-4 leading-relaxed text-burgundy-600/80 max-w-lg mx-auto">
            Our anxious boy has 4 legs, requires following with a vacuum
            and a wiggle bum that will melt your heart.
          </p>
        </Reveal>
        <Reveal delay={0.2} className="mt-10">
          <Image
            src="/gallery/riley-framed.png"
            alt="Riley in an ornate gold frame"
            width={768}
            height={1024}
            sizes="(max-width: 640px) 48vw, 220px"
            className="mx-auto h-auto w-[min(48vw,220px)]"
          />
        </Reveal>
      </div>
    </section>
  );
}
