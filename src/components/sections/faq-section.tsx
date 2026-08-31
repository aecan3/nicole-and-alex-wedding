import { PageHeader } from "@/components/page-header";
import { FaqAccordion, type FaqItem } from "@/components/faq-accordion";
import { SiteMap } from "@/components/site-map-loader";
import type { MapMarker } from "@/components/site-map";
import { AnchorLink } from "@/components/anchor-link";

const travelMarkers: MapMarker[] = [
  { position: [-37.478, 144.612], label: "Alora Macedon", type: "venue" },
  { position: [-37.4173, 144.5661], label: "Macedon", type: "label" },
  { position: [-37.4883, 144.5936], label: "Gisborne", type: "label" },
  { position: [-37.8136, 144.9631], label: "Melbourne", type: "label" },
];

const faqs: FaqItem[] = [
  {
    q: "When's the RSVP deadline?",
    a: "Please RSVP by Sunday 24 January 2027 so we can get an accurate headcount.",
  },
  {
    q: "How do I get there?",
    a: (
      <div className="space-y-4">
        <p>
          Alora Macedon sits at the foothills of Mount Macedon, about 45 minutes&rsquo;
          drive from Melbourne. If you&rsquo;re flying in, Melbourne Airport (Tullamarine)
          is the closest, around 40 minutes from the venue.
        </p>
        <SiteMap center={[-37.62, 144.79]} zoom={9} markers={travelMarkers} heightClassName="h-[320px]" />
      </div>
    ),
  },
  {
    q: "Is there a shuttle bus?",
    a: "We'll be running a shuttle bus from common pick-up points around Gisborne, New Gisborne and Macedon, straight to the venue and back again at the end of the night. Exact pick-up points and times will be confirmed closer to the day — we'll update this page and let you know.",
  },
  {
    q: "Do you have a registry?",
    a: (
      <>
        Have a look at our{" "}
        <AnchorLink href="#registry" className="underline hover:text-burgundy-600">
          Gifts
        </AnchorLink>{" "}
        section.
      </>
    ),
  },
  {
    q: "Are children welcome?",
    a: "We adore your little ones, but our ceremony and reception are an adults-only affair. We hope you understand, and can't wait to celebrate with you.",
  },
  {
    q: "Where can I park?",
    a: "There's plenty of free parking on site at the venue.",
  },
  {
    q: "Is there help getting around the venue?",
    a: "Yes — a limited number of buggies will be on hand for anyone who needs a lift around the property. Just let us know ahead of time if this would help you.",
  },
  {
    q: "Is the wedding indoors or outdoors?",
    a: "Both our ceremony and reception will be held indoors, in the Glass Atrium at Alora Macedon.",
  },
  {
    q: "What's the weather going to be like?",
    a: "March is the driest month in the Macedon Ranges, with days typically around 21–22°C and cooler evenings closer to 11–12°C — worth bringing a light layer for later in the night.",
  },
  {
    q: "Can we take photos on our phones and cameras during the wedding?",
    a: "We'd love you to capture the reception — but we'd ask that you hold off during the ceremony itself so everyone can be present.",
  },
  {
    q: "Who should I get in touch with if I have questions?",
    a: "Reach out to Alex (the groom) on 0423 340 677.",
  },
];

export function FaqSection() {
  return (
    <section id="faq" className="scroll-mt-24">
      <PageHeader kicker="Any questions?" title="Q&A" />
      <div className="mx-auto max-w-2xl px-6 pb-20">
        <FaqAccordion items={faqs} />
      </div>
    </section>
  );
}
