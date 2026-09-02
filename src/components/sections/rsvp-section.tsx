"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { PageHeader } from "@/components/page-header";
import { getSupabase } from "@/lib/supabase";

type Match = { id: string; party_id: string; full_name: string };
type PartyMember = {
  id: string;
  full_name: string;
  rsvp_status: string;
  dietary: string | null;
  email: string | null;
  bus_pickup: string | null;
  message: string | null;
};
type Response = {
  attending: "yes" | "no" | "";
  dietary: string;
};

const BUS_OPTIONS = [
  { value: "", label: "Select an option" },
  { value: "macedon_ranges_hotel_spa", label: "Yes — pick up from Macedon Ranges Hotel & Spa" },
  { value: "black_forest_motel", label: "Yes — pick up from Black Forest Motel" },
  { value: "gisborne_motel", label: "Yes — pick up from Gisborne Motel" },
  { value: "no", label: "No, we'll make our own way there" },
  { value: "not_booked_yet", label: "We'll need the bus, but haven't booked accommodation yet" },
];

function busLabelFor(value: string | null | undefined): string | null {
  if (!value) return null;
  return BUS_OPTIONS.find((o) => o.value === value)?.label ?? null;
}

// supabase-js doesn't throw on a failed RPC call (missing function, RLS
// denial, bad args, etc.) — it resolves with an `error` field instead, so
// every call site below has to check it explicitly or a real backend error
// silently looks identical to "no results found".
function errorMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  if (err && typeof err === "object" && "message" in err && typeof (err as { message: unknown }).message === "string") {
    return (err as { message: string }).message;
  }
  return "Something went wrong — please try again shortly.";
}

// The same warm duotone-wash-behind-text treatment used on the Venue and
// Timetable sections, reused here as the backdrop for the last section on
// the page. Desktop and mobile use separate photos — same reasoning as the
// two Venue photos: this section is portrait and tall on mobile (and its
// height swings a lot between RSVP stages, from the short search box up to
// the full multi-person form), so the wide desktop shot forced into that
// shape either turned into a thin, empty sliver (full-bleed cover) or
// only ever showed a small crop (zoomed in). A second, portrait-oriented
// photo of the same villa (supplied specifically for mobile) sidesteps
// both problems: it's zoomed in and anchored toward the bottom, trading
// the sky (and some of the lawn in the bottom-left, per the go-ahead to
// crop it) for keeping the house and balustrades — the actual point of
// the photo — in frame, the way the desktop crop keeps the arches and
// pool in frame. Desktop keeps the original full-bleed wash: its
// proportions are close enough to that photo's that cover crops
// comparatively little, and it's already reading well.
function RsvpBackground() {
  return (
    <>
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.32] pointer-events-none select-none sm:hidden"
        style={{
          backgroundImage: "url('/gallery/rsvp-villa-mobile-wash.jpg')",
          backgroundSize: "auto 118%",
          backgroundPosition: "78% 75%",
          backgroundRepeat: "no-repeat",
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)",
          maskImage:
            "linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)",
        }}
      />
      <div
        aria-hidden="true"
        className="hidden sm:block absolute inset-0 opacity-[0.28] pointer-events-none select-none"
        style={{
          backgroundImage: "url('/gallery/rsvp-villa-wash.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "60% 65%",
          backgroundRepeat: "no-repeat",
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)",
          maskImage:
            "linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)",
        }}
      />
    </>
  );
}

// A quiet, always-available way out if the search can't find someone or
// anything on this page misbehaves — shown at the bottom of every stage
// rather than only after an error, so it's never a dead end.
function HelpLink() {
  const [open, setOpen] = useState(false);
  return (
    <div className="mt-10 text-center">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="text-xs uppercase tracking-[0.15em] text-burgundy-600/60 underline hover:text-burgundy-600"
      >
        Need help?
      </button>
      {open && (
        <p className="mt-2 text-sm text-burgundy-600/80">
          Reach out to Alex on 0423 340 677 and we&rsquo;ll sort it out.
        </p>
      )}
    </div>
  );
}

export function RsvpSection() {
  const [query, setQuery] = useState("");
  const [matches, setMatches] = useState<Match[]>([]);
  const [searching, setSearching] = useState(false);
  const [searched, setSearched] = useState(false);

  // Set as soon as a match is picked, before the guest has confirmed it's
  // really their household — `party` (below) is only populated once they
  // do, which is what actually reveals the RSVP form.
  const [confirmingParty, setConfirmingParty] = useState<PartyMember[] | null>(null);

  // Set instead of `party` when the confirmed household has already
  // responded (rsvp_status isn't "pending" for at least one member) — shows
  // what's on file and asks whether to keep it or go through the form again,
  // rather than silently taking them through a blank form a second time.
  const [previousReview, setPreviousReview] = useState<PartyMember[] | null>(null);

  const [party, setParty] = useState<PartyMember[] | null>(null);
  const [responses, setResponses] = useState<Record<string, Response>>({});
  const [email, setEmail] = useState("");
  const [busPickup, setBusPickup] = useState("");
  const [message, setMessage] = useState("");
  const [submitStatus, setSubmitStatus] = useState<"idle" | "submitting" | "done" | "error">("idle");
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [configError, setConfigError] = useState<string | null>(null);

  // Guards against a slower, earlier request landing after a faster, later
  // one — otherwise fast typing can flash a stale result set right after
  // the guest has already typed past it.
  const latestQueryRef = useRef("");

  const runSearch = useCallback(async (q: string) => {
    latestQueryRef.current = q;
    setSearching(true);
    setConfigError(null);
    try {
      const { data, error } = await getSupabase().rpc("search_invitees", { query: q });
      if (error) throw error;
      if (latestQueryRef.current !== q) return;
      setMatches(data ?? []);
      setSearched(true);
    } catch (err) {
      if (latestQueryRef.current !== q) return;
      setConfigError(errorMessage(err));
    } finally {
      if (latestQueryRef.current === q) setSearching(false);
    }
  }, []);

  // Live results as the guest types — matches the search box's own minimum
  // (search_invitees ignores anything under 2 characters), debounced so
  // every keystroke doesn't fire a request. The Search button/Enter below
  // still runs the same search immediately, for anyone who'd rather type
  // the whole name and submit. Dropping back under 2 characters is handled
  // in handleQueryChange below, not here, so this effect never calls
  // setState synchronously in its own body.
  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < 2) return;
    const handle = setTimeout(() => runSearch(trimmed), 350);
    return () => clearTimeout(handle);
  }, [query, runSearch]);

  function handleQueryChange(value: string) {
    setQuery(value);
    if (value.trim().length < 2) {
      latestQueryRef.current = "";
      setMatches([]);
      setSearched(false);
      setConfigError(null);
    }
  }

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;
    await runSearch(trimmed);
  }

  async function selectSelf(id: string) {
    setConfigError(null);
    try {
      const { data, error } = await getSupabase().rpc("get_party", { invitee_id: id });
      if (error) throw error;
      setConfirmingParty(data ?? []);
    } catch (err) {
      setConfigError(errorMessage(err));
    }
  }

  // Populates the form (Stage 3) from a party's members — either blank, for
  // a first-time response, or pre-filled from what's already saved, when
  // the guest chooses to update an existing one.
  function startForm(members: PartyMember[]) {
    setParty(members);
    const initial: Record<string, Response> = {};
    members.forEach((m) => {
      initial[m.id] = {
        attending: m.rsvp_status === "attending" ? "yes" : m.rsvp_status === "declined" ? "no" : "",
        dietary: m.dietary ?? "",
      };
    });
    setResponses(initial);
    // Email/bus pickup/message are shared across the whole party and saved
    // identically on every member's row — take them from whichever member
    // has them set.
    const shared = members.find((m) => m.email || m.bus_pickup || m.message);
    setEmail(shared?.email ?? "");
    setBusPickup(shared?.bus_pickup ?? "");
    setMessage(shared?.message ?? "");
  }

  function confirmParty() {
    if (!confirmingParty) return;
    const alreadyResponded = confirmingParty.some((m) => m.rsvp_status !== "pending");
    if (alreadyResponded) {
      setPreviousReview(confirmingParty);
      setConfirmingParty(null);
      return;
    }
    startForm(confirmingParty);
    setConfirmingParty(null);
  }

  function rejectParty() {
    // Back to the match list — not back to a blank search, since the name
    // they typed was probably right and it's just the wrong match.
    setConfirmingParty(null);
  }

  function keepPreviousResponse() {
    // Nothing changed — nothing new to save, so this skips straight to the
    // same confirmation the guest saw the first time rather than re-running
    // submit_rsvp with the answers it already has.
    setPreviousReview(null);
    setSubmitStatus("done");
  }

  function updatePreviousResponse() {
    if (!previousReview) return;
    startForm(previousReview);
    setPreviousReview(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!party) return;
    setSubmitStatus("submitting");
    try {
      const sb = getSupabase();
      const results = await Promise.all(
        party.map((m) =>
          sb.rpc("submit_rsvp", {
            invitee_id: m.id,
            p_status: responses[m.id]?.attending === "yes" ? "attending" : "declined",
            p_dietary: responses[m.id]?.dietary || null,
            p_email: email,
            p_bus_pickup: busPickup,
            p_message: message || null,
          })
        )
      );
      const firstError = results.find((r) => r.error)?.error;
      if (firstError) throw firstError;
      setSubmitStatus("done");

      // Best-effort confirmation email. The RSVP is already saved above, so
      // this never affects what the guest sees — a slow inbox, an
      // unconfigured Resend key, or a failed send is silently swallowed.
      fetch("/api/send-confirmation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          party: party.map((m) => ({
            name: m.full_name,
            attending: responses[m.id]?.attending === "yes",
            dietary: responses[m.id]?.dietary || null,
          })),
          busPickup,
          message: message || null,
        }),
      }).catch(() => {});
    } catch (err) {
      setSubmitError(errorMessage(err));
      setSubmitStatus("error");
    }
  }

  if (submitStatus === "done") {
    return (
      // min-h-svh: this is the last section on the page, so without a floor
      // on its own height there isn't always enough page left below it for
      // the browser to scroll #rsvp's top flush with scroll-mt-24 when a
      // shorter stage (like this one) is showing — the scroll lands short
      // and the section sits partway down the viewport instead of at the
      // header. A full viewport of height here guarantees enough scroll
      // room regardless of which stage is rendered.
      <section id="rsvp" className="relative min-h-svh scroll-mt-24 overflow-hidden">
        <RsvpBackground />
        <div className="relative z-10">
          <PageHeader kicker="Thank you" title="RSVP Received" />
          <div className="mx-auto max-w-xl px-6 pb-24 text-center">
            <p className="leading-relaxed">
              Thanks so much for letting us know — we can&rsquo;t wait to celebrate
              with you on 11 March 2027.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    // See the min-h-svh comment on the "done" branch above — same reasoning
    // applies here, and matters even more for this branch since it's the
    // one guests actually land on when clicking RSVP in the nav.
    <section id="rsvp" className="relative min-h-svh scroll-mt-24 overflow-hidden">
      <RsvpBackground />
      {/* mx-auto max-w-6xl gives the section the same outer width as the
          rest of the site; the sm:max-w-md column inside it isn't itself
          centered, so from tablet up the RSVP content hugs the left side
          of the section instead of sitting dead-center over the image —
          per request, so the pool/arches on the image's right stay clear
          rather than being covered by the form. Mobile is unaffected
          (sm:max-w-md doesn't apply below 640px), staying centered as
          before since there's no room to spare for an off-center layout
          on a phone-width screen. */}
      {/* sm:pt-24 nudges the whole block down on tablet/desktop, on top of
          PageHeader's own pt-20 — enough to no longer sit flush against the
          nav, but nowhere near vertical-centering it in a min-h-svh
          section (that would put the "Find your invitation" input roughly
          in the middle of the screen). Mobile is unaffected. */}
      <div className="relative z-10 mx-auto max-w-6xl sm:px-10 sm:pt-24">
        <div className="sm:max-w-md">
          <PageHeader kicker="By 24 January 2027" title="RSVP" />
          <div className="mx-auto max-w-md px-6 pb-24 sm:mx-0 sm:px-0">
        {/* Stage 1: search */}
        {!confirmingParty && !previousReview && !party && (
          <>
            <form onSubmit={handleSearch} className="flex flex-col gap-3">
              <label className="flex flex-col gap-1 text-sm">
                Find your invitation
                <input
                  value={query}
                  onChange={(e) => handleQueryChange(e.target.value)}
                  placeholder="Type your full name"
                  className="border-b border-burgundy-800/30 bg-transparent py-2 focus:outline-none focus:border-burgundy-800"
                />
              </label>
              <button
                type="submit"
                disabled={searching}
                className="self-start rounded-full bg-taupe-600 text-cream-100 px-8 py-2.5 text-sm tracking-[0.2em] uppercase hover:bg-[#77604f] transition-colors disabled:opacity-50"
              >
                {searching ? "Searching..." : "Search"}
              </button>
            </form>

            {configError && (
              <p className="mt-6 text-sm text-red-700">{configError}</p>
            )}

            {/* The search itself falls back to a fuzzy name match server-side
                when nothing matches exactly, so this empty state should be
                rare — it's for names that are too different to guess, not
                ordinary typos. */}
            {!configError && searched && matches.length === 0 && (
              <p className="mt-6 text-sm text-burgundy-600/80">
                Couldn&rsquo;t find that name — try a different spelling, or get in
                touch with Alex on 0423 340 677.
              </p>
            )}

            {matches.length > 0 && (
              <div className="mt-6 flex flex-col gap-2">
                <p className="text-sm text-burgundy-600/80">Is this you?</p>
                {matches.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => selectSelf(m.id)}
                    className="text-left border border-gold-400/50 rounded-lg px-4 py-3 hover:bg-cream-200 transition-colors"
                  >
                    {m.full_name}
                  </button>
                ))}
              </div>
            )}

            <HelpLink />
          </>
        )}

        {/* Stage 2: confirm the household before showing the form */}
        {confirmingParty && (
          <div className="flex flex-col gap-4">
            <p className="text-sm text-burgundy-600/80">Here&rsquo;s who we have on file:</p>
            <div className="flex flex-col gap-2">
              {confirmingParty.map((m) => (
                <p
                  key={m.id}
                  className="border border-gold-400/50 rounded-lg px-4 py-3 font-display text-lg text-burgundy-600"
                >
                  {m.full_name}
                </p>
              ))}
            </div>
            <p className="text-sm text-burgundy-600/80">Is that your household?</p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={confirmParty}
                className="rounded-full bg-taupe-600 text-cream-100 px-8 py-2.5 text-sm tracking-[0.2em] uppercase hover:bg-[#77604f] transition-colors"
              >
                Yes, that&rsquo;s us
              </button>
              <button
                type="button"
                onClick={rejectParty}
                className="rounded-full border border-burgundy-800/40 px-8 py-2.5 text-sm tracking-[0.2em] uppercase hover:bg-cream-200 transition-colors"
              >
                Not quite
              </button>
            </div>
            <HelpLink />
          </div>
        )}

        {/* Stage 2.5: already responded — show what's on file instead of
            silently taking them through the form again */}
        {previousReview && (
          <div className="flex flex-col gap-4">
            <p className="text-sm text-burgundy-600/80">
              Looks like we&rsquo;ve already got your RSVP — here&rsquo;s what&rsquo;s on file:
            </p>
            <div className="flex flex-col gap-2">
              {previousReview.map((m) => (
                <div key={m.id} className="border border-gold-400/50 rounded-lg px-4 py-3">
                  <p className="font-display text-lg text-burgundy-600">{m.full_name}</p>
                  <p className="text-sm text-taupe-600 mt-1">
                    {m.rsvp_status === "attending" ? "Joyfully attending" : "Regretfully declines"}
                    {m.rsvp_status === "attending" && m.dietary ? ` · ${m.dietary}` : ""}
                  </p>
                </div>
              ))}
            </div>
            {busLabelFor(previousReview.find((m) => m.bus_pickup)?.bus_pickup) && (
              <p className="text-sm text-burgundy-600/80">
                Bus pickup:{" "}
                <span className="text-burgundy-600">
                  {busLabelFor(previousReview.find((m) => m.bus_pickup)?.bus_pickup)}
                </span>
              </p>
            )}
            {previousReview.find((m) => m.message)?.message && (
              <p className="text-sm text-burgundy-600/80">
                Your message: <span className="text-burgundy-600 italic">&ldquo;{previousReview.find((m) => m.message)?.message}&rdquo;</span>
              </p>
            )}
            <p className="text-sm text-burgundy-600/80">Still all correct, or would you like to update it?</p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={keepPreviousResponse}
                className="rounded-full bg-taupe-600 text-cream-100 px-8 py-2.5 text-sm tracking-[0.2em] uppercase hover:bg-[#77604f] transition-colors"
              >
                Still correct
              </button>
              <button
                type="button"
                onClick={updatePreviousResponse}
                className="rounded-full border border-burgundy-800/40 px-8 py-2.5 text-sm tracking-[0.2em] uppercase hover:bg-cream-200 transition-colors"
              >
                Update my RSVP
              </button>
            </div>
            <HelpLink />
          </div>
        )}

        {/* Stage 3: the actual RSVP form */}
        {party && (
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <p className="text-sm text-burgundy-600/80">
              Please respond for everyone in your party.
            </p>
            {party.map((m) => (
              <fieldset key={m.id} className="border-t border-gold-400/40 pt-4 flex flex-col gap-2">
                <legend className="font-display text-lg text-burgundy-600">{m.full_name}</legend>
                <div className="flex gap-6 text-sm">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name={`attending-${m.id}`}
                      required
                      checked={responses[m.id]?.attending === "yes"}
                      onChange={() =>
                        setResponses((r) => ({ ...r, [m.id]: { ...r[m.id], attending: "yes" } }))
                      }
                    />
                    Joyfully accepts
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name={`attending-${m.id}`}
                      checked={responses[m.id]?.attending === "no"}
                      onChange={() =>
                        setResponses((r) => ({ ...r, [m.id]: { ...r[m.id], attending: "no" } }))
                      }
                    />
                    Regretfully declines
                  </label>
                </div>
                {responses[m.id]?.attending === "yes" && (
                  <input
                    placeholder="Dietary requirements (optional)"
                    value={responses[m.id]?.dietary ?? ""}
                    onChange={(e) =>
                      setResponses((r) => ({ ...r, [m.id]: { ...r[m.id], dietary: e.target.value } }))
                    }
                    className="border-b border-burgundy-800/30 bg-transparent py-1.5 text-sm focus:outline-none focus:border-burgundy-800"
                  />
                )}
              </fieldset>
            ))}

            <label className="flex flex-col gap-1 text-sm border-t border-gold-400/40 pt-4">
              Email address
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="border-b border-burgundy-800/30 bg-transparent py-2 focus:outline-none focus:border-burgundy-800"
              />
            </label>

            <label className="flex flex-col gap-1 text-sm">
              Do you require the bus?
              <select
                required
                value={busPickup}
                onChange={(e) => setBusPickup(e.target.value)}
                className="border-b border-burgundy-800/30 bg-transparent py-2 focus:outline-none focus:border-burgundy-800"
              >
                {BUS_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value} disabled={o.value === ""}>
                    {o.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-1 text-sm">
              Message for us (optional)
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={3}
                className="border-b border-burgundy-800/30 bg-transparent py-2 focus:outline-none focus:border-burgundy-800"
              />
            </label>

            <button
              type="submit"
              disabled={submitStatus === "submitting"}
              className="rounded-full bg-taupe-600 text-cream-100 px-10 py-3 text-sm tracking-[0.2em] uppercase hover:bg-[#77604f] transition-colors disabled:opacity-50"
            >
              {submitStatus === "submitting" ? "Sending..." : "Send RSVP"}
            </button>
            {submitStatus === "error" && (
              <p className="text-sm text-red-700 text-center">
                {submitError ?? "Something went wrong sending that — mind trying again?"}
              </p>
            )}
            <HelpLink />
          </form>
        )}
          </div>
        </div>
      </div>
    </section>
  );
}
