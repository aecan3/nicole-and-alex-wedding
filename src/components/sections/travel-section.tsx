import { PageHeader } from "@/components/page-header";

export function TravelSection() {
  return (
    <section id="travel" className="scroll-mt-24">
      <PageHeader title="Travel" titleSize="text-[2.25rem] sm:text-[3.25rem]" padding="pt-0 pb-8" />
      <div className="px-6 pb-20">
        <div>
          <div className="mx-auto max-w-2xl space-y-5 text-center text-base leading-relaxed text-burgundy-600">
            <p>
            A guest shuttle will run through Macedon and Gisborne. Please request a seat when you
            RSVP, and pickup details will follow closer to the date. If arranging your own transport,
            taxis and rideshares are limited in the area, so please pre-book early. Free on-site
            parking is available, and cars can stay overnight until 10:00 am the next day.
          </p>
          </div>
        </div>
      </div>
    </section>
  );
}
