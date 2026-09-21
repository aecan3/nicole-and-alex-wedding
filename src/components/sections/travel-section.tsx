import { PageHeader } from "@/components/page-header";
import { Reveal } from "@/components/reveal";

export function TravelSection() {
  return (
    <section id="travel" className="scroll-mt-24">
      <PageHeader title="Travel" titleSize="text-[2.25rem] sm:text-[3.25rem]" padding="pt-0 pb-8" />
      <div className="px-6 pb-20">
        <Reveal>
          <div className="mx-auto max-w-2xl space-y-5 text-center text-lg leading-relaxed text-burgundy-600">
            <p>
              A guest shuttle will run through the Macedon and Gisborne areas to and from the venue,
              with pickup times and locations confirmed closer to the date. Please let us know if you
              need a seat when you RSVP.
            </p>
            <p>
              If you&apos;re arranging your own transport, taxis and rideshares are limited in the
              area, so please book well ahead.
            </p>
            <p>
              Free parking is available on site, and cars can stay overnight as long as
              they&apos;re collected by 10:00 am the next day.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
