import { AnchorLink } from "@/components/anchor-link";
import { Hero } from "@/components/hero";
import { LaceFrame } from "@/components/lace-frame";
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

      <section className="bg-burgundy-900 px-6 py-28 sm:py-36 text-center">
        <Reveal>
          <LaceFrame>
            <p className="font-script text-lg sm:text-xl text-taupe-600">
              Together with our families,
            </p>
            <p className="mt-3 sm:mt-4 font-script text-[1.4rem] sm:text-[1.65rem] leading-[1.5] text-burgundy-600">
              We joyfully invite you to our wedding celebration. Thank you for
              being part of one of the most meaningful moments of our lives.
              We cannot wait to celebrate love, laughter and unforgettable
              memories with you.
            </p>
            <p className="mt-auto pt-4 font-script text-[1.4rem] sm:text-[1.65rem] leading-[1.3] text-burgundy-600">
              Forever grateful,
              <br />
              Nicole &amp; Alex
            </p>
          </LaceFrame>
        </Reveal>

        <Reveal delay={0.15}>
          <AnchorLink
            href="#rsvp"
            className="mt-14 inline-block rounded-full bg-olive-800 text-cream-100 px-10 py-3.5 text-sm tracking-[0.25em] uppercase transition-all duration-300 hover:bg-olive-900 hover:shadow-[0_8px_30px_rgba(63,66,31,0.3)]"
          >
            RSVP
          </AnchorLink>
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
