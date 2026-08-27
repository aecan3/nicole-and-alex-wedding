import { PageHeader } from "@/components/page-header";

const stays = [
  {
    name: "Macedon Ranges Hotel & Spa",
    address: "652 Black Forest Drive, Macedon VIC",
    phone: "03 5426 1240",
    note: "We're arranging a guest rate — details and a booking code to follow.",
  },
  {
    name: "Black Forest Motel",
    address: "426 Black Forest Drive, Macedon VIC",
    phone: "03 5426 1600",
    note: "Breakfast included with direct bookings. We're arranging a guest rate — details to follow.",
  },
];

export default function WhereToStayPage() {
  return (
    <main className="flex-1">
      <PageHeader kicker="A few of our favourites" title="Where to Stay" />
      <div className="mx-auto max-w-2xl px-6 pb-20">
        <p className="text-center leading-relaxed">
          The Macedon Ranges fill up quickly, so we&rsquo;d suggest booking early.
          Here are a few places close to the venue.
        </p>
        <div className="mt-10 space-y-8">
          {stays.map((s) => (
            <div key={s.name} className="border-t border-gold-400/40 pt-6">
              <h2 className="font-display text-xl text-burgundy-600">{s.name}</h2>
              <p className="text-sm mt-1">{s.address} &middot; {s.phone}</p>
              <p className="text-sm mt-2 text-burgundy-600/80">{s.note}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
