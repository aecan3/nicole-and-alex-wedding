"use client";

import { useState } from "react";
import { PageHeader } from "@/components/page-header";
import { getSupabase } from "@/lib/supabase";

type Match = { id: string; party_id: string; full_name: string };
type PartyMember = { id: string; full_name: string; rsvp_status: string };
type Response = {
  attending: "yes" | "no" | "";
  dietary: string;
};

export default function RsvpPage() {
  const [query, setQuery] = useState("");
  const [matches, setMatches] = useState<Match[]>([]);
  const [searching, setSearching] = useState(false);
  const [searched, setSearched] = useState(false);

  const [party, setParty] = useState<PartyMember[] | null>(null);
  const [responses, setResponses] = useState<Record<string, Response>>({});
  const [song, setSong] = useState("");
  const [message, setMessage] = useState("");
  const [submitStatus, setSubmitStatus] = useState<"idle" | "submitting" | "done" | "error">("idle");
  const [configError, setConfigError] = useState<string | null>(null);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    setSearching(true);
    setSearched(false);
    setConfigError(null);
    try {
      const { data } = await getSupabase().rpc("search_invitees", { query });
      setMatches(data ?? []);
      setSearched(true);
    } catch (err) {
      setConfigError(err instanceof Error ? err.message : "Something went wrong — please try again shortly.");
    } finally {
      setSearching(false);
    }
  }

  async function selectSelf(id: string) {
    setConfigError(null);
    try {
      const { data } = await getSupabase().rpc("get_party", { invitee_id: id });
      const members: PartyMember[] = data ?? [];
      setParty(members);
      const initial: Record<string, Response> = {};
      members.forEach((m) => {
        initial[m.id] = { attending: "", dietary: "" };
      });
      setResponses(initial);
    } catch (err) {
      setConfigError(err instanceof Error ? err.message : "Something went wrong — please try again shortly.");
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!party) return;
    setSubmitStatus("submitting");
    try {
      const sb = getSupabase();
      await Promise.all(
        party.map((m) =>
          sb.rpc("submit_rsvp", {
            invitee_id: m.id,
            p_status: responses[m.id]?.attending === "yes" ? "attending" : "declined",
            p_dietary: responses[m.id]?.dietary || null,
            p_song: song || null,
            p_message: message || null,
          })
        )
      );
      setSubmitStatus("done");
    } catch {
      setSubmitStatus("error");
    }
  }

  if (submitStatus === "done") {
    return (
      <main className="flex-1">
        <PageHeader kicker="Thank you" title="RSVP Received" />
        <div className="mx-auto max-w-xl px-6 pb-24 text-center">
          <p className="leading-relaxed">
            Thanks so much for letting us know — we can&rsquo;t wait to celebrate
            with you on 11 March 2027.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1">
      <PageHeader kicker="By 24 January 2027" title="RSVP" />
      <div className="mx-auto max-w-md px-6 pb-24">
        {!party && (
          <>
            <form onSubmit={handleSearch} className="flex flex-col gap-3">
              <label className="flex flex-col gap-1 text-sm">
                Find your invitation
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Type your full name"
                  className="border-b border-burgundy-800/30 bg-transparent py-2 focus:outline-none focus:border-burgundy-800"
                />
              </label>
              <button
                type="submit"
                disabled={searching}
                className="self-start rounded-full bg-burgundy-800 text-cream-100 px-8 py-2.5 text-sm tracking-[0.2em] uppercase hover:bg-burgundy-700 transition-colors disabled:opacity-50"
              >
                {searching ? "Searching..." : "Search"}
              </button>
            </form>

            {configError && (
              <p className="mt-6 text-sm text-red-700">{configError}</p>
            )}

            {!configError && searched && matches.length === 0 && (
              <p className="mt-6 text-sm text-burgundy-700/80">
                Couldn&rsquo;t find that name — try a different spelling, or get in
                touch with Alex on 0423 340 677.
              </p>
            )}

            {matches.length > 0 && (
              <div className="mt-6 flex flex-col gap-2">
                <p className="text-sm text-burgundy-700/80">That you?</p>
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
          </>
        )}

        {party && (
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <p className="text-sm text-burgundy-700/80">
              Please respond for everyone in your party.
            </p>
            {party.map((m) => (
              <fieldset key={m.id} className="border-t border-gold-400/40 pt-4 flex flex-col gap-2">
                <legend className="font-display text-lg text-burgundy-800">{m.full_name}</legend>
                <div className="flex gap-6 text-sm">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name={`attending-${m.id}`}
                      required
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

            <label className="flex flex-col gap-1 text-sm">
              Song request (optional)
              <input
                value={song}
                onChange={(e) => setSong(e.target.value)}
                className="border-b border-burgundy-800/30 bg-transparent py-2 focus:outline-none focus:border-burgundy-800"
              />
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
              className="rounded-full bg-burgundy-800 text-cream-100 px-10 py-3 text-sm tracking-[0.2em] uppercase hover:bg-burgundy-700 transition-colors disabled:opacity-50"
            >
              {submitStatus === "submitting" ? "Sending..." : "Send RSVP"}
            </button>
            {submitStatus === "error" && (
              <p className="text-sm text-red-700 text-center">
                Something went wrong sending that — mind trying again?
              </p>
            )}
          </form>
        )}
      </div>
    </main>
  );
}
