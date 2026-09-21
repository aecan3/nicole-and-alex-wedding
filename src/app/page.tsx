import Image from "next/image";
import { Hero } from "@/components/hero";
import { Reveal } from "@/components/reveal";
import { OurStorySection } from "@/components/sections/our-story-section";
import { VenueSection } from "@/components/sections/venue-section";
import { TimetableSection } from "@/components/sections/timetable-section";
import { WhereToStaySection } from "@/components/sections/where-to-stay-section";
import { DressCodeSection } from "@/components/sections/dress-code-section";
import { RegistrySection } from "@/components/sections/registry-section";
import { FaqSection } from "@/components/sections/faq-section";
import { RsvpSection } from "@/components/sections/rsvp-section";
import { CountdownSection } from "@/components/sections/countdown-section";
import { SectionSeal } from "@/components/section-seal";

export default function Home() {
  return (
    <main className="flex-1">
      <Hero photoSrc="/gallery/couple-rooftop.jpg" />

      {/* No CTA below the card any more (removed per request) — the
          section's py is symmetric top/bottom so the card, as the only
          child now, sits vertically centered in the burgundy band on its
          own rather than needing extra balancing margin.

          -v2 swaps in a different card frame (a scalloped doily-style
          border instead of the previous card art) per request, text
          already baked into the supplied source image so no separate
          overlay text needed here. The source came in on a solid black
          backdrop; background-removed the same way as other cutouts on
          this site (corner-sampled reference colour, distance-based alpha).

          -v3 replaces -v2's flat opaque JPG (background re-composited onto
          burgundy-900) with the transparent PNG cutout directly, kept as
          real alpha rather than baked-in flat colour, specifically so the
          drop-shadow filter below can follow the card's own scalloped
          silhouette instead of casting a hard rectangle behind it — a
          plain box-shadow (or a filter on a fully-opaque image) can't do
          that. Approved from a mock-up after an initial stronger pass
          (0 6px 10px/0.6 + 0 42px 60px/0.75) read as too heavy; this is
          the original, subtler pairing. New width/height match the new
          card's own aspect ratio (1218x864 vs the old 1166x896) so
          next/image doesn't stretch it. */}
      <section className="bg-burgundy-900 px-6 pt-28 pb-[88px] sm:pt-36 sm:pb-28 text-center">
        <Reveal>
          <Image
            src="/decor/invitation-card-v3.png"
            alt="Together with our families, we joyfully invite you to our wedding celebration. Thank you for being part of one of the most meaningful moments of our lives. We cannot wait to celebrate love, laughter and unforgettable memories with you. Forever grateful, Nicole &amp; Alex"
            width={1218}
            height={864}
            /* Rendered width is min(100vw-48px, 704px) — 48px matches this
               section's own px-6 padding on both sides, so on mobile the
               card fills the full available width up to that padding
               (rather than the old fixed 75.2vw, which left it looking
               small) while staying capped at 704px on desktop like
               before. `sizes` mirrors that same formula so the browser
               requests an appropriately small file below the 752px
               crossover (100vw-48px = 704px at a 752px viewport) instead
               of assuming full-width and fetching the largest variant on
               every device, phones included — that mismatch was why the
               card was slow to load on mobile: it was pulling the same
               ~3840px-wide file meant for a 4K desktop monitor down to a
               ~300px-wide display. */
            sizes="(min-width: 752px) 704px, calc(100vw - 48px)"
            className="mx-auto h-auto w-[min(calc(100vw-48px),704px)]"
            /* Inline style rather than a Tailwind drop-shadow-[] utility —
               Tailwind's drop-shadow utilities don't stack (each one just
               replaces the filter's --tw-drop-shadow variable), and this
               look needs two drop-shadows layered: a tight one for
               contact/grounding plus a wider soft one for the lift. */
            style={{
              filter:
                "drop-shadow(0 3px 6px rgba(0,0,0,0.35)) drop-shadow(0 22px 38px rgba(0,0,0,0.4))",
            }}
          />
        </Reveal>
      </section>

      <SectionSeal />

      <OurStorySection />
      <VenueSection />
      <TimetableSection />
      <WhereToStaySection />
      <DressCodeSection />
      <RegistrySection />
      <FaqSection />
      <RsvpSection />
      <CountdownSection />
    </main>
  );
}
