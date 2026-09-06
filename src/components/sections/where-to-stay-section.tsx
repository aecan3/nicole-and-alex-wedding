import { PageHeader } from "@/components/page-header";

// address/addressLines and phone/phoneHref are both optional so a card can
// opt into the richer treatment (multi-line address linked out to a map,
// phone linked as tel:) independently of the others — Macedon Ranges is the
// first to get it below; the rest still use the plain single-line address.
type Stay = {
  name: string;
  address?: string;
  addressLines?: string[];
  mapsUrl?: string;
  phone: string;
  phoneHref?: string;
  website: string;
  note: string;
  position: [number, number];
};

const stays: Stay[] = [
  {
    name: "Macedon Ranges Hotel & Spa",
    // Two-line address (street / suburb+postcode) instead of the single
    // comma-joined line the other cards still use, each wrapped in one link
    // out to Apple Maps (not the Google Maps links this was sourced from) —
    // ll= is the venue's actual coordinates so the pin lands on the hotel
    // itself rather than a text-only address guess.
    addressLines: ["652 Black Forest Drive", "Macedon VIC 3440"],
    mapsUrl: "https://maps.apple.com/?ll=-37.411854,144.542473&q=Macedon%20Ranges%20Hotel%20%26%20Spa",
    phone: "03 5426 4044",
    phoneHref: "tel:0354264044",
    website: "https://macedonrangeshotelspa.mydirectstay.com/",
    note: "Use code ‘WEDDING’ to apply a 5% discount code when booking directly.",
    position: [-37.411854, 144.542473] as [number, number],
  },
  {
    name: "Black Forest Motel",
    // No coordinates were supplied for this one (unlike Macedon Ranges, which
    // came from a Google Maps link) — mapsUrl omits ll= and just geocodes the
    // address text itself, which Apple Maps handles fine for a real address.
    addressLines: ["426 Black Forest Drive", "Macedon VIC 3440"],
    mapsUrl: "https://maps.apple.com/?q=426%20Black%20Forest%20Drive%2C%20Macedon%20VIC%203440",
    phone: "03 5426 1600",
    phoneHref: "tel:0354261600",
    website: "https://www.blackforestmotel.com.au/",
    note: "Use discount code ‘GetNicoles10%’ for direct bookings only over the phone.",
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

// Small inline icons for the address/phone rows below — kept as plain
// currentColor line icons (no icon package pulled in for just two glyphs).
function PinIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold-400">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold-400">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

function ArrowUpRightIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3">
      <path d="M7 17 17 7M8 7h9v9" />
    </svg>
  );
}

export function WhereToStaySection() {
  return (
    <section id="where-to-stay" className="scroll-mt-24">
      <PageHeader kicker="A few recommendations" title="Where to Stay" />
      <div className="px-6 pb-20">
        <div className="mx-auto max-w-2xl">
          <p className="text-center leading-relaxed">
            The Macedon Ranges fill up quickly, so we&rsquo;d suggest booking early.
            Accommodation is mostly clustered around Macedon, Gisborne and New
            Gisborne, all a short drive from the venue.
          </p>
          {/* taupe-600 is the site's secondary/label colour (kickers, timestamps,
              small headings elsewhere) — used here to set the shuttle/rental
              logistics apart from the recommendation above. */}
          <p className="mt-4 text-sm text-center leading-relaxed text-taupe-600">
            A shuttle bus will be provided for guests staying at the locations
            below. For house or cottage rentals, explore{" "}
            <a href="https://www.airbnb.com.au/macedon-ranges-shire-australia/stays" target="_blank" rel="noopener noreferrer" className="underline hover:text-burgundy-600">
              Airbnb
            </a>{" "}
            or{" "}
            <a href="https://relaxholidayrentals.com.au/" target="_blank" rel="noopener noreferrer" className="underline hover:text-burgundy-600">
              Relax Holiday Rentals
            </a>
            .
          </p>
        </div>

        {/* Each hotel used to be a plain stacked text block separated by a
            top-border hairline. This reads more like a little place card
            from the same stationery suite as the rest of the site: the
            gold rule under the name is the exact divider motif used under
            every page heading (just shortened and left-aligned instead of
            centred), the note below borrows the kicker's italic serif so
            it reads as a handwritten aside next to the plainer sans-serif
            address/phone, and the diagonal cream gradient fill catches
            light unevenly the way the Gifts section's paper card photo
            does, instead of one flat tone. The "Visit website" pill reuses
            the exact taupe button used for RSVP/nav CTAs, so it still
            reads as a real, familiar button rather than a new style. */}
        <div className="mx-auto mt-12 grid max-w-4xl gap-6 sm:grid-cols-2">
          {stays.map((s) => {
            const lines = s.addressLines;
            return (
              <div
                key={s.name}
                className="group relative flex flex-col rounded-sm border border-gold-400/40 bg-[linear-gradient(155deg,var(--color-cream-100),var(--color-cream-300))] p-7 pb-6 shadow-[0_1px_3px_rgba(58,15,24,0.08)] transition-all duration-300 hover:-translate-y-1 hover:border-gold-400/75 hover:shadow-[0_10px_24px_-8px_rgba(58,15,24,0.18)]"
              >
                <h3 className="font-display text-xl text-burgundy-600">{s.name}</h3>
                <div className="mb-4 mt-3 h-px w-11 bg-gradient-to-r from-gold-400 to-transparent" />

                <div className="mb-4 flex flex-col gap-1.5">
                  <div className="flex items-start gap-2 text-sm text-burgundy-600">
                    <PinIcon />
                    {lines ? (
                      <a
                        href={s.mapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline underline-offset-2 decoration-gold-400/60 hover:decoration-gold-400"
                      >
                        {lines.map((line, i) => (
                          <span key={line}>
                            {line}
                            {i < lines.length - 1 && <br />}
                          </span>
                        ))}
                      </a>
                    ) : (
                      <span>{s.address}</span>
                    )}
                  </div>
                  <div className="flex items-start gap-2 text-sm text-burgundy-600">
                    <PhoneIcon />
                    {s.phoneHref ? (
                      <a
                        href={s.phoneHref}
                        className="underline-offset-2 decoration-gold-400/60 hover:underline"
                      >
                        {s.phone}
                      </a>
                    ) : (
                      <span>{s.phone}</span>
                    )}
                  </div>
                </div>

                <p className="mb-5 font-serif text-base italic leading-[1.5] text-taupe-600">
                  {s.note}
                </p>

                <a
                  href={s.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-auto inline-flex w-fit items-center gap-1.5 rounded-full bg-taupe-600 px-5 py-2.5 text-[11px] font-medium uppercase tracking-[0.2em] text-cream-100 transition-all duration-200 hover:gap-2.5 hover:bg-[#77604f]"
                >
                  Visit website
                  <ArrowUpRightIcon />
                </a>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
