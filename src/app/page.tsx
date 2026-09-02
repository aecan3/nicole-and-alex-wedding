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

export default function Home() {
  return (
    <main className="flex-1">
      <Hero photoSrc="/gallery/couple-rooftop.jpg" />

      {/* No CTA below the card any more (removed per request) — the
          section's py is symmetric top/bottom so the card, as the only
          child now, sits vertically centered in the burgundy band on its
          own rather than needing extra balancing margin. */}
      <section className="bg-burgundy-900 px-6 py-28 sm:py-36 text-center">
        <Reveal>
          <Image
            src="/decor/invitation-card.jpg"
            alt="Together with our families, we joyfully invite you to our wedding celebration. Thank you for being part of one of the most meaningful moments of our lives. We cannot wait to celebrate love, laughter and unforgettable memories with you. Forever grateful, Nicole &amp; Alex"
            width={1166}
            height={896}
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
          />
        </Reveal>
      </section>

      <OurStorySection />
      <VenueSection />
      <TimetableSection />
      <WhereToStaySection />
      <DressCodeSection />
      <RegistrySection />
      <FaqSection />
      <RsvpSection />
    </main>
  );
}
