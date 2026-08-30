import { PageHeader } from "@/components/page-header";
import { Reveal } from "@/components/reveal";
import { SiteMap } from "@/components/site-map-loader";
import type { MapMarker } from "@/components/site-map";

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

const venuePosition: [number, number] = [-37.478, 144.612];

const mapMarkers: MapMarker[] = [
  { position: venuePosition, label: "Alora Macedon", type: "venue" },
  ...stays.map((s) => ({ position: s.position, label: s.name, type: "star" as const })),
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

        <Reveal delay={0.1} className="mt-10">
          <SiteMap center={[-37.421, 144.585]} zoom={12} markers={mapMarkers} />
          <p className="mt-3 text-center text-xs text-burgundy-600/60">
            Approximate locations — the atrium marks Alora Macedon, the stars mark each stay below.
          </p>
        </Reveal>

        <div className="mt-12 space-y-8">
          {stays.map((s) => (
            <div key={s.name} className="border-t border-gold-400/40 pt-6">
              <h2 className="font-display text-xl text-burgundy-600">{s.name}</h2>
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
    </main>
  );
}
