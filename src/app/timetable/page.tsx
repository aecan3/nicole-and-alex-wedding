import { PageHeader } from "@/components/page-header";

const events = [
  {
    time: "3:30pm",
    title: "Guest Arrival",
    detail: "Please arrive by 3:30pm and take your seats — the ceremony starts promptly at 4:00pm.",
  },
  {
    time: "4:00pm",
    title: "Ceremony",
    detail: "Our ceremony will be held indoors in the Glass Atrium at Alora Macedon.",
  },
  {
    time: "4:30pm – 6:00pm",
    title: "Canapés & Photos",
    detail: "Drinks and canapés while we sneak off for photos.",
  },
  {
    time: "6:00pm – 12:00am",
    title: "Reception",
    detail: "Dinner, drinks, speeches and dancing — indoors at Alora Macedon.",
  },
];

export default function TimetablePage() {
  return (
    <main className="flex-1">
      <PageHeader kicker="Thursday 11 March 2027" title="Timetable" />
      <div className="mx-auto max-w-2xl px-6 pb-20">
        <ol className="space-y-10">
          {events.map((e) => (
            <li key={e.title} className="border-l-2 border-gold-400 pl-6">
              <p className="text-xs uppercase tracking-[0.2em] text-olive-700">{e.time}</p>
              <h2 className="font-display text-2xl text-burgundy-600 mt-1">{e.title}</h2>
              <p className="mt-2 leading-relaxed" dangerouslySetInnerHTML={{ __html: e.detail }} />
            </li>
          ))}
        </ol>
        <p className="mt-12 text-sm text-burgundy-600/80 text-center">
          A shuttle will run from pick-up points around Gisborne, New Gisborne and
          Macedon &mdash; see the <a href="/travel" className="underline hover:text-burgundy-600">Travel</a> page for details.
        </p>
      </div>
    </main>
  );
}
