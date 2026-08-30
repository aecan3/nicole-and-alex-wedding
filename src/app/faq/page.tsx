import { PageHeader } from "@/components/page-header";

const faqs = [
  {
    q: "When's the RSVP deadline?",
    a: "Please RSVP by Sunday 24 January 2027 so we can get an accurate headcount.",
  },
  {
    q: "Do you have a registry?",
    a: "Have a look at our Gifts page.",
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

export default function FaqPage() {
  return (
    <main className="flex-1">
      <PageHeader kicker="Any questions?" title="Q&A" />
      <div className="mx-auto max-w-2xl px-6 pb-20 space-y-8">
        {faqs.map((f) => (
          <div key={f.q} className="border-t border-gold-400/40 pt-6">
            <h2 className="font-display text-lg text-burgundy-600">{f.q}</h2>
            <p className="mt-2 leading-relaxed">{f.a}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
