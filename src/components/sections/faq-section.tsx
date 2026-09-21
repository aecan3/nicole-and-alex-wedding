import { PageHeader } from "@/components/page-header";
import { FaqAccordion, type FaqItem } from "@/components/faq-accordion";

const faqs: FaqItem[] = [
  {
    q: "When should I RSVP by?",
    a: "We kindly request your response by Sunday, 17 January 2027 to help us confirm our final arrangements.",
  },
  {
    q: "Is there a shuttle bus?",
    a: "A guest shuttle will run through the Macedon and Gisborne areas to and from the venue. Exact pickup locations and times will be confirmed closer to the date. Please indicate if you need a seat when you RSVP so we can finalise numbers.",
  },
  {
    q: "Are children welcome?",
    a: "We adore your little ones, but our ceremony and reception are an adults-only affair. We hope you understand, and can't wait to celebrate with you.",
  },
  {
    q: "Where can I park?",
    a: "There is plenty of free parking available on site at Alora Macedon. Cars can be left overnight if needed and must be picked up by 10:00 am the next day.",
  },
  {
    q: "Is there help getting around the venue?",
    a: "Buggies will run continuously between the car park and ceremony site. Anyone needing assistance or preferring a lift is welcome to wait by the car park.",
  },
  {
    q: "Is the wedding indoors or outdoors?",
    a: "Our ceremony and reception will take place indoors, with cocktail hour held outdoors on the grounds. Please plan your attire accordingly.",
  },
  {
    q: "Can I take photos during the wedding?",
    a: "We would love for you to capture memories during the reception, but we kindly ask that you put devices away during the ceremony so everyone can be fully present with us.",
  },
  {
    q: "Can you accommodate dietary requirements?",
    a: "Absolutely. Please let us know of any dietary requirements or allergies when you RSVP so we can ensure you are catered for on the day.",
  },
  {
    q: "Who should I get in touch with if I have questions?",
    a: "Reach out to Alex (the groom) on 0423 340 677.",
  },
];

export function FaqSection() {
  return (
    <section id="faq" className="scroll-mt-24">
      <PageHeader kicker="Q&A" title="Any Questions?" />
      <div className="mx-auto max-w-2xl px-6 pb-20">
        <FaqAccordion items={faqs} />
      </div>
    </section>
  );
}
