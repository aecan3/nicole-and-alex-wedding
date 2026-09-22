import Image from "next/image";
import { PageHeader } from "@/components/page-header";
import { Reveal } from "@/components/reveal";
import { Gallery } from "@/components/gallery";
import { InView } from "@/components/in-view";

// Order matters: Gallery lays these out round-robin into columns (index i
// goes to column i % columnCount), so this list IS the grid, top to bottom,
// left to right. Rules this order satisfies at once, on both the 2-column
// mobile and 3-column desktop layouts: no two videos stacked together, no
// two black-and-white pieces stacked together, and — because each column's
// height is just the sum of its items' aspect ratios — column heights come
// out close to even on both layouts (desktop spread 0.134, same as before;
// mobile spread 0.985, down from 1.874, which was leaving a large empty
// gap under the shorter mobile column). Found by brute-force search over
// all orderings that satisfy the two adjacency rules on both layouts at
// once, picking the one with the smallest desktop imbalance and, among
// ties, the smallest mobile imbalance — the pure best-mobile ordering
// exists but roughly 10x's the desktop imbalance, which isn't worth it
// for a gap that was never reported as a problem on desktop.
const photos = [
  { type: "image" as const, src: "/gallery/couple-speech-bw.jpg", alt: "Alex's speech at their engagement party, black and white", width: 2600, height: 1730 },
  { type: "video" as const, src: "/gallery/couple-toast.mp4", alt: "The moment we got engaged", width: 720, height: 1280 },
  { type: "image" as const, src: "/gallery/couple-beach.jpg", alt: "Nicole and Alex at the beach", width: 684, height: 1004 },
  { type: "image" as const, src: "/gallery/couple-house.jpg", alt: "Nicole and Alex outside their new home", width: 2400, height: 1690 },
  { type: "image" as const, src: "/gallery/couple-gallery-bw.jpg", alt: "Nicole and Alex, black and white", width: 2000, height: 2667 },
  // Graded down from the original clip, which was shot on an overcast day
  // and came out noticeably brighter/flatter than every other photo and
  // video in this grid (mean luma ~157/255 with almost nothing near true
  // black, vs. ~112 with real shadow detail on the sunny couple-house.jpg
  // shot next to it). ffmpeg eq filter — contrast 1.22, brightness -0.07,
  // gamma 0.94 — re-encoded via libx264, same resolution/duration/no-audio
  // as the original. -v3: -v2 also bumped saturation to 1.15, which looked
  // fine in isolated stills but introduced a real green cast on the
  // (genuinely neutral-grey) concrete path once seen against the rest of
  // the gallery — ffmpeg's eq saturation param turns out to shift color
  // the moment it goes above 1.0 on this footage (confirmed by measuring
  // R/G/B on a neutral patch: saturation 1.0 stayed within ~1 unit of the
  // untouched original, while 1.05 already jumped to a 3-4 unit green
  // skew, then barely moved further at 1.15 — not a gradual amplification,
  // a filter quirk). -v3 drops the saturation param entirely; contrast/
  // brightness/gamma alone still gives the same corrected punch.
  { type: "video" as const, src: "/gallery/couple-sold-sign-v4.mp4", alt: "Sold sign on their new home", width: 720, height: 1280 },
  { type: "video" as const, src: "/gallery/proposal.mp4", alt: "The proposal", width: 720, height: 1280 },
];


export function OurStorySection() {
  return (
    <section id="our-story" className="scroll-mt-24">
      <PageHeader kicker="How it all began" title="Our Story" />
      <div className="mx-auto max-w-4xl px-6 pb-24">
        <div className="text-center max-w-xl mx-auto">
          <p className="leading-relaxed text-burgundy-600">
            Our first date at a little antique bar on a Tuesday night was the
            beginning of our forever. A few years later, during a special
            trip to Fiji, Alex popped the question (with a couple of
            margaritas to settle his nerves). Between settling into our new
            home, taking care of our anxious boy Riley, and many memories
            created, we couldn&rsquo;t be happier with the life we&rsquo;re
            building together. We&rsquo;re so excited for our future
            adventures ahead, and many more mid-week cocktails.
          </p>
        </div>
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

        <div className="mt-24 text-center">
          <Reveal>
          <p className="kicker text-base sm:text-lg text-taupe-600 mb-3">
            Every Love Story has a
          </p>
          <h3 className="font-heading text-[2.625rem] sm:text-[4.125rem] text-burgundy-600 tracking-tight [word-spacing:-0.04em]">
            Third Wheel
          </h3>
          </Reveal>
          <p className="mt-4 leading-relaxed text-burgundy-600 max-w-lg mx-auto">
            Ours just happens to have four legs, a lot of opinions and
            unconditional love.
          </p>
        </div>
        <Reveal delay={0.2} className="mt-10">
          {/* riley-framed-v2.png adds a synthesised drop shadow (the
              original cutout had none) behind the frame, matching the
              Gifts section's plate photo — so the source canvas has an
              80px transparent margin all round for the shadow to blur
              into. The display size below is scaled up from the old
              220px/48vw by that same margin ratio (928/768) so the frame
              itself reads at the same on-page size as before, with the
              shadow now filling the extra space around it. */}
          <Image
            src="/gallery/riley-framed-v2.png"
            alt="Riley in an ornate gold frame"
            width={928}
            height={1184}
            sizes="(max-width: 640px) 58vw, 266px"
            className="mx-auto h-auto w-[min(58vw,266px)]"
          />
        </Reveal>
      </div>
    </section>
  );
}
