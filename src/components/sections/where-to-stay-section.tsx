import { PageHeader } from "@/components/page-header";

const stays = [
  {
    name: "Macedon Ranges Hotel & Spa",
    address: "652 Black Forest Drive, Macedon VIC",
    phone: "03 5426 1240",
    website: "https://www.macedonrangeshotelspa.com.au/",
    note: "We're arranging a guest rate — details and a booking code to follow.",
    position: [-37.413, 144.5605] as [number, number],
  },
  {
    name: "Black Forest Motel",
    address: "426 Black Forest Drive, Macedon VIC",
    phone: "03 5426 1600",
    website: "https://www.facebook.com/blackforestmotel",
    note: "Breakfast included with direct bookings. We're arranging a guest rate — details to follow.",
    position: [-37.415, 144.559] as [number, number],
  },
  {
    name: "Lawson Lodge Country Estate",
    address: "227 Lawson Road, Macedon VIC",
    phone: "03 5426 1551",
    website: "https://www.lawsonlodge.com.au/",
    note: "A larger country property with group-stay rooms — a good option if a few of you want to stay together.",
    position: [-37.428, 144.56] as [number, number],
  },
  {
    name: "Braeside Mt Macedon Country Retreat",
    address: "47 Taylors Road, Mount Macedon VIC",
    phone: "03 5426 1762",
    website: "https://www.braesidemtmacedon.com.au/",
    note: "Three private self-contained cottages set in garden grounds, a little further up the mountain.",
    position: [-37.3695, 144.5875] as [number, number],
  },
];

export function WhereToStaySection() {
  return (
    <section id="where-to-stay" className="scroll-mt-24">
      <PageHeader kicker="A few recommendations" title="Where to Stay" />
      <div className="mx-auto max-w-2xl px-6 pb-20">
        <p className="text-center leading-relaxed">
          The Macedon Ranges fill up quickly, so we&rsquo;d suggest booking early.
          Accommodation is mostly clustered around Macedon, Gisborne and New
          Gisborne, all a short drive from the venue.
        </p>
        <p className="mt-4 text-center leading-relaxed text-burgundy-600/80">
          Beyond the hotels below, it&rsquo;s also worth checking{" "}
          <a href="https://www.airbnb.com.au/macedon-ranges-shire-australia/stays" target="_blank" rel="noopener noreferrer" className="underline hover:text-burgundy-600">
            Airbnb
          </a>{" "}
          and{" "}
          <a href="https://relaxholidayrentals.com.au/" target="_blank" rel="noopener noreferrer" className="underline hover:text-burgundy-600">
            Relax Holiday Rentals
          </a>
          , which both list houses and cottages across the area.
        </p>

        <div className="mt-12 space-y-8">
          {stays.map((s) => (
            <div key={s.name} className="border-t border-gold-400/40 pt-6">
              <h3 className="font-display text-xl text-burgundy-600">{s.name}</h3>
              <p className="text-sm mt-1">{s.address} &middot; {s.phone}</p>
              <p className="text-sm mt-1">
                <a href={s.website} target="_blank" rel="noopener noreferrer" className="underline hover:text-burgundy-600">
                  {s.website.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "")}
                </a>
              </p>
              <p className="text-sm mt-2 text-burgundy-600/80">{s.note}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
