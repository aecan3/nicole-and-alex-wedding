"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/page-header";

// Ceremony start (see the Timetable section: "4:00pm"), in the venue's own
// timezone — Victoria is still on daylight saving in mid-March (DST doesn't
// end until the first Sunday of April), so this is a fixed +11:00 offset
// rather than "local time", which would otherwise silently drift by an hour
// depending on the visitor's own clock/timezone.
const WEDDING_DATE = new Date("2027-03-11T16:00:00+11:00");

type TimeLeft = { days: number; hours: number; minutes: number; seconds: number };

function getTimeLeft(): TimeLeft {
  const diff = Math.max(WEDDING_DATE.getTime() - Date.now(), 0);
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

export function CountdownSection() {
  // Starts null rather than computing getTimeLeft() immediately, so the
  // server-rendered markup and the first client render match (both show the
  // "--" placeholder) — computing a real value up front would render a
  // number server-side that's already stale by the time it reaches the
  // browser, causing a hydration mismatch. The real countdown takes over
  // a moment after mount, once this effect runs.
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);

  useEffect(() => {
    const update = () => setTimeLeft(getTimeLeft());
    // The first update is deferred to a microtask rather than called
    // directly in the effect body — react-hooks/set-state-in-effect flags
    // a synchronous setState call there (it can cascade renders). A
    // microtask still lands before the browser's next paint, so there's no
    // visible delay versus calling it inline.
    queueMicrotask(update);
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  const units: { label: string; value: number | undefined }[] = [
    { label: "Days", value: timeLeft?.days },
    { label: "Hours", value: timeLeft?.hours },
    { label: "Minutes", value: timeLeft?.minutes },
    { label: "Seconds", value: timeLeft?.seconds },
  ];

  return (
    <section id="countdown" className="scroll-mt-24">
      <PageHeader kicker="Thursday 11 March 2027" title="The countdown is on" />
      <div className="mx-auto max-w-2xl px-6 pb-24">
        <div className="grid grid-cols-4 gap-3 sm:gap-8 text-center">
          {units.map((u) => (
            <div key={u.label}>
              <p className="font-display text-3xl sm:text-6xl text-burgundy-600 tabular-nums">
                {u.value !== undefined ? String(u.value).padStart(2, "0") : "--"}
              </p>
              <p className="mt-2 text-[10px] sm:text-xs uppercase tracking-[0.15em] sm:tracking-[0.2em] text-taupe-600">
                {u.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
