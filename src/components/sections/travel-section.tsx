import { PageHeader } from "@/components/page-header";

const ITEMS = [
  {
    label: "Shuttle Bus",
    text: "A guest shuttle will run through Macedon and Gisborne. Please request a seat when you RSVP, and pickup details will be emailed to you closer to the date.",
  },
  {
    label: "Own Transport",
    text: "If arranging your own transport, taxis and rideshares are limited in the area, so please pre-book early. Free on-site parking is available, and cars can stay overnight until 10:00 am the next day.",
  },
];

export function TravelSection() {
  return (
    <section id="travel" className="scroll-mt-24">
      <PageHeader title="Getting Here" titleSize="text-[2.25rem] sm:text-[3.25rem]" padding="pt-0 pb-8" />
      <div className="px-6 pb-20">
        <div className="mx-auto max-w-2xl space-y-8 text-center">
          {ITEMS.map((i) => (
            <div key={i.label}>
              <p className="text-xs uppercase tracking-[0.2em] text-taupe-600">{i.label}</p>
              <p className="mt-3 text-base leading-relaxed text-burgundy-600">{i.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
