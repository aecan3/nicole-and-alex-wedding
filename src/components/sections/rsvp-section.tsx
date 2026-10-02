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
  { value: "macedon_ranges_hotel_spa", label: "Yes, pick up from Macedon Ranges Hotel & Spa" },
  { value: "black_forest_motel", label: "Yes, pick up from Black Forest Motel" },
  { value: "gisborne_motel", label: "Yes, pick up from Gisborne Motel" },
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
  // The photo is a fixed-size block at the top of the section. When the card
  // grows past it, the card hangs off the bottom onto the cream, and the photo
  // itself never resizes. A short fade softens the photo's bottom edge.
  return (
    <>
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-[115svh] pointer-events-none select-none sm:hidden"
        style={{
          backgroundImage: "url('/gallery/rsvp-villa.jpg')",
          backgroundSize: "auto 52%",
          backgroundPosition: "66% 100%",
          backgroundRepeat: "no-repeat",
          WebkitMaskImage: "linear-gradient(to bottom, transparent 52%, black 62%, black 90%, transparent)",
          maskImage: "linear-gradient(to bottom, transparent 52%, black 62%, black 90%, transparent)",
        }}
      />
      <div
        aria-hidden="true"
        className="hidden sm:block absolute inset-x-0 top-0 h-[max(85vh,780px)] opacity-[0.62] pointer-events-none select-none"
        style={{
          backgroundImage: "url('/gallery/rsvp-villa-hd.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "60% 65%",
          backgroundRepeat: "no-repeat",
          WebkitMaskImage: "linear-gradient(to bottom, black 88%, transparent)",
          maskImage: "linear-gradient(to bottom, black 88%, transparent)",
        }}
      />
    </>
  );
}

// Best matches first: names starting with what was typed, then names with a
// word starting with it, then anything else containing it.
function rankMatches(list: Match[], q: string): Match[] {
  const t = q.trim().toLowerCase();
  const score = (name: string) => {
    const n = name.toLowerCase();
    if (n.startsWith(t)) return 0;
    if (n.split(/\s+/).some((w) => w.startsWith(t))) return 1;
    return 2;
  };
  return [...list].sort((a, b) => score(a.full_name) - score(b.full_name) || a.full_name.localeCompare(b.full_name));
}

// A quiet, always-available way out if the search can't find someone or
// anything on this page misbehaves — shown at the bottom of every stage
// rather than only after an error, so it's never a dead end.
function HelpLink({ onBack }: { onBack?: () => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="mt-10 flex flex-col items-center gap-4 text-center">
      {/* Fine-print Back on its own line above Need help, on every step after the search */}
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          className="text-xs uppercase tracking-[0.15em] text-burgundy-600/60 hover:text-burgundy-600"
        >
          &larr; Back
        </button>
      )}
      <div>
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

  // The name picked from search, waiting on the postcode check before anything about the household is shown
  const [unlocking, setUnlocking] = useState<Match | null>(null);
  const [postcode, setPostcode] = useState("");
  const [postcodeError, setPostcodeError] = useState<string | null>(null);
  const [checkingPostcode, setCheckingPostcode] = useState(false);
  // Sent again with every submit_rsvp call, which checks it server-side too
  const [verifiedPostcode, setVerifiedPostcode] = useState("");

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
  const [showMessage, setShowMessage] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "submitting" | "done" | "error">("idle");
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [configError, setConfigError] = useState<string | null>(null);

  // On a phone the thank-you card is much shorter than the form, so bring it back into view
  useEffect(() => {
    if (submitStatus === "done") {
      document.getElementById("rsvp")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [submitStatus]);

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
    if (trimmed.length < 3) return;
    const handle = setTimeout(() => runSearch(trimmed), 350);
    return () => clearTimeout(handle);
  }, [query, runSearch]);

  function handleQueryChange(value: string) {
    setQuery(value);
    if (value.trim().length < 3) {
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

  function selectSelf(m: Match) {
    setConfigError(null);
    setPostcode("");
    setPostcodeError(null);
    setUnlocking(m);
  }

  async function handlePostcode(e: React.FormEvent) {
    e.preventDefault();
    if (!unlocking || !postcode.trim()) return;
    setCheckingPostcode(true);
    setPostcodeError(null);
    try {
      const { data, error } = await getSupabase().rpc("get_party", {
        invitee_id: unlocking.id,
        p_postcode: postcode,
      });
      if (error) throw error;
      const result = data as { status: string; members?: PartyMember[] };
      if (result.status === "ok") {
        setVerifiedPostcode(postcode);
        setConfirmingParty(result.members ?? []);
        setUnlocking(null);
      } else if (result.status === "locked") {
        setPostcodeError("Too many tries. Please wait 15 minutes, or get in touch with Alex on 0423 340 677.");
      } else {
        setPostcodeError("That postcode doesn\u2019t match our records. Please try again.");
      }
    } catch (err) {
      setPostcodeError(errorMessage(err));
    } finally {
      setCheckingPostcode(false);
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

  // From the form, step back to "Is that your household?"
  function backFromForm() {
    if (!party) return;
    setConfirmingParty(party);
    setParty(null);
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
            p_postcode: verifiedPostcode,
          })
        )
      );
      const firstError = results.find((r) => r.error)?.error;
      if (firstError) throw firstError;
      if (results.some((r) => r.data !== "ok")) {
        throw new Error("We couldn\u2019t save your RSVP. Please search your name again, or get in touch with Alex on 0423 340 677.");
      }
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
      // min-h-svh on mobile: without a floor on its own height there isn't
      // always enough page left below it for the browser to scroll #rsvp's
      // top flush with scroll-mt-24 when a shorter stage (like this one) is
      // showing — the scroll lands short and the section sits partway down
      // the viewport instead of at the header. A full viewport of height
      // guarantees enough scroll room regardless of which stage is
      // rendered. Desktop caps that at 70vh instead: a full viewport was
      // leaving a large empty stretch of villa photo below the (much
      // shorter) form content on laptop-sized screens — "massive" per
      // feedback — and CountdownSection now follows this one with real
      // content of its own, so there's always page below RSVP regardless
      // of its own height, making the full-viewport floor unnecessary
      // there.
      <section id="rsvp" className="relative min-h-[115svh] sm:min-h-[max(85vh,780px)] scroll-mt-24 overflow-hidden">
        <RsvpBackground />
        {/* Same cream card and position as the form, so the thank-you sits where they just replied */}
        <div className="relative z-10 mx-auto max-w-6xl sm:px-10 sm:pt-6">
          <div className="mx-5 mt-4 bg-cream-100/[0.93] shadow-[0_8px_28px_rgba(74,21,33,0.10)] sm:mx-0 sm:my-14 sm:max-w-[420px] sm:px-9">
            <PageHeader
              kicker="By 14 January 2027"
              title="Rsvp"
              padding="pt-10 pb-6"
            />
            {/* Same wording as the confirmation email */}
            <div className="mx-auto max-w-md px-6 pb-12 text-center sm:px-0">
              <p className="leading-relaxed">
                Thank you for letting us know! Your response has been warmly&nbsp;received.
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    // See the min-h-svh/sm:min-h-[70vh] comment on the "done" branch above —
    // same reasoning applies here, and matters even more for this branch
    // since it's the one guests actually land on when clicking RSVP in the
    // nav.
    <section id="rsvp" className="relative min-h-[115svh] sm:min-h-[max(85vh,780px)] scroll-mt-24 overflow-hidden">
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
      {/* -mt-14 pulls the text up on mobile only (cancelling most of
          PageHeader's own pt-20) — the photo only occupies the lower part
          of this section on mobile, so with the default padding the text
          sat in a big empty gap above the photo rather than filling it.
          sm:mt-0 leaves tablet/desktop (already tuned via sm:pt-24 above)
          untouched. */}
      <div className="relative z-10 mx-auto max-w-6xl sm:px-10 sm:pt-6">
        <div className="mx-5 mt-4 bg-cream-100/[0.93] shadow-[0_8px_28px_rgba(74,21,33,0.10)] sm:mx-0 sm:my-14 sm:max-w-[420px] sm:px-9">
          <PageHeader
            kicker="By 14 January 2027"
            title="Rsvp"
            padding="pt-10 pb-6"
          />
          <div className="mx-auto max-w-md px-6 pb-10 sm:mx-0 sm:px-0">
        {/* Stage 1: search */}
        {!unlocking && !confirmingParty && !previousReview && !party && (
          <>
            <form onSubmit={handleSearch} className="flex flex-col gap-3">
              <label className="flex flex-col gap-1 text-sm">
                Find your invitation
                <span className="relative flex flex-col">
                  <input
                    value={query}
                    onChange={(e) => handleQueryChange(e.target.value)}
                    placeholder="Type your full name"
                    autoComplete="off"
                    className="border-b border-burgundy-800/30 bg-transparent py-2 focus:outline-none focus:border-burgundy-800"
                  />
                  {/* Matches float over the card as a dropdown, so the card doesn't grow while typing */}
                  {matches.length > 0 && (
                    <span className="absolute left-0 right-0 top-full z-20 mt-1 flex max-h-56 flex-col overflow-y-auto rounded-lg border border-gold-400/50 bg-cream-100 shadow-[0_8px_24px_rgba(74,21,33,0.12)]">
                      {rankMatches(matches, query).map((m) => (
                        <button
                          key={m.id}
                          type="button"
                          onClick={() => selectSelf(m)}
                          className="border-b border-gold-400/25 px-4 py-2.5 text-left text-base last:border-b-0 hover:bg-cream-200 transition-colors"
                        >
                          {m.full_name}
                        </button>
                      ))}
                    </span>
                  )}
                </span>
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


            <HelpLink />
          </>
        )}

        {/* Stage 1.5: postcode check before any household details are shown */}
        {unlocking && (
          <form onSubmit={handlePostcode} className="flex flex-col gap-4">
            <p className="font-display text-lg text-burgundy-600">{unlocking.full_name}</p>
            <label className="flex flex-col gap-1 text-sm">
              Enter your postcode to continue
              <input
                value={postcode}
                onChange={(e) => setPostcode(e.target.value)}
                autoComplete="postal-code"
                autoFocus
                className="border-b border-burgundy-800/30 bg-transparent py-2 focus:outline-none focus:border-burgundy-800"
              />
            </label>
            {postcodeError && <p className="text-sm text-red-700">{postcodeError}</p>}
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={checkingPostcode}
                className="rounded-full bg-taupe-600 text-cream-100 px-8 py-2.5 text-sm tracking-[0.2em] uppercase hover:bg-[#77604f] transition-colors disabled:opacity-50"
              >
                {checkingPostcode ? "Checking..." : "Continue"}
              </button>
            </div>
            <HelpLink onBack={() => setUnlocking(null)} />
          </form>
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
            <HelpLink onBack={rejectParty} />
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
            <HelpLink onBack={() => setPreviousReview(null)} />
          </div>
        )}

        {/* Stage 3: the actual RSVP form */}
        {party && (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {party.map((m) => (
              <fieldset key={m.id} className="border-t border-gold-400/40 pt-3 flex flex-col gap-2">
                <legend className="font-display text-lg text-burgundy-600">{m.full_name}</legend>
                {/* Pill toggles, side by side so each guest stays on one row on a phone */}
                <div className="flex gap-2 text-sm">
                  {([["yes", "Accept"], ["no", "Decline"]] as const).map(([val, label]) => {
                    const on = responses[m.id]?.attending === val;
                    return (
                      <label
                        key={val}
                        className={`relative flex-1 cursor-pointer rounded-full border px-4 py-2 text-center tracking-[0.12em] uppercase text-xs transition-colors ${
                          on
                            ? "border-taupe-600 bg-taupe-600 text-cream-100"
                            : "border-burgundy-800/30 text-burgundy-600 hover:bg-cream-200"
                        }`}
                      >
                        <input
                          type="radio"
                          name={`attending-${m.id}`}
                          required
                          checked={on}
                          onChange={() =>
                            setResponses((r) => ({ ...r, [m.id]: { ...r[m.id], attending: val } }))
                          }
                          className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                        />
                        {label}
                      </label>
                    );
                  })}
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

            <label className="flex flex-col gap-1 text-sm border-t border-gold-400/40 pt-3">
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

            {/* Message box stays tucked away until asked for (or already has something in it) */}
            {showMessage || message ? (
              <label className="flex flex-col gap-1 text-sm">
                Message for us (optional)
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={3}
                  autoFocus={showMessage && !message}
                  className="border-b border-burgundy-800/30 bg-transparent py-2 focus:outline-none focus:border-burgundy-800"
                />
              </label>
            ) : (
              <button
                type="button"
                onClick={() => setShowMessage(true)}
                className="self-start text-sm text-burgundy-600 underline underline-offset-4 decoration-gold-400 hover:text-burgundy-800"
              >
                + Add a message for us
              </button>
            )}

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
            <HelpLink onBack={backFromForm} />
          </form>
        )}
          </div>
        </div>
      </div>
    </section>
  );
}
