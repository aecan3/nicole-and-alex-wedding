"use client";

// Matches every section's `scroll-mt-24` (6rem) so the sticky header never
// covers a jumped-to section's top content.
const NAV_OFFSET = 96;
const MAX_DURATION_MS = 2500;

// Bumped on every call so an in-flight animation's own rAF loop can tell
// it's been superseded and stop. Without this, clicking a second nav link
// before the first click's scroll finishes would leave two loops chasing
// two different targets at once — each fighting the other's window.scrollTo
// calls — and the page would settle somewhere between the two, not on
// either. Module-level state is fine here: there's only ever one page, one
// scroll position, and callers always want the newest click to win.
let activeToken = 0;

/**
 * Smooth-scrolls to the element with the given id, offset for the sticky
 * header. This exists instead of just relying on the browser's native
 * anchor jump (globals.css still sets `scroll-behavior: smooth` on <html>
 * as a no-JS fallback) because that native jump computes its landing
 * position once, at click time. On this continuous-scroll page a click can
 * kick off a scroll spanning several lazy-mounted sections (see InView in
 * in-view.tsx) — if one of them finishes mounting mid-scroll and shifts the
 * page's height, the native jump lands wherever that now-stale target used
 * to be instead of where the section actually ended up.
 *
 * This re-measures the target element's position on every animation frame
 * instead, moving a fraction of the remaining distance each frame (simple
 * exponential ease-out) rather than animating between a fixed start/end
 * pair — so a layout shift partway through gets absorbed into the next
 * frame's measurement instead of producing a bad landing spot.
 */
export function scrollToSection(id: string) {
  if (typeof window === "undefined") return;
  const el = document.getElementById(id);
  if (!el) return;

  const myToken = ++activeToken;

  // Keeps the URL (and browser back/forward, and bookmarking/sharing) in
  // sync even though the actual scroll below is driven by JS, not the
  // browser's native hash-jump. Skipped when the hash already matches (the
  // initial-load correction in nav.tsx calls this with the hash the page
  // was already loaded with) so it doesn't pad browser history with a
  // same-URL entry.
  if (window.location.hash !== `#${id}`) {
    window.history.pushState(null, "", `#${id}`);
  }

  const clamp = (y: number) => {
    const max = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
    return Math.max(0, Math.min(y, max));
  };
  const rawTarget = () => el.getBoundingClientRect().top + window.scrollY - NAV_OFFSET;

  // Every jump below is written as an explicit "instant" scroll — deliberately
  // bypassing the CSS `scroll-behavior: smooth` set on <html> in globals.css.
  // That property applies to *any* window.scrollTo call, including these; if
  // left on, each frame's small step would itself kick off a new browser-
  // smoothed hop before the previous one finished, compounding into a slow,
  // creeping scroll instead of the easing curve this loop already computes.
  const jumpTo = (y: number) => window.scrollTo({ top: y, left: 0, behavior: "instant" });

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    jumpTo(clamp(rawTarget()));
    return;
  }

  const start = performance.now();
  function step(now: number) {
    if (myToken !== activeToken) return; // a newer click took over
    const target = clamp(rawTarget());
    const dy = target - window.scrollY;
    if (Math.abs(dy) < 1 || now - start > MAX_DURATION_MS) {
      jumpTo(target);
      return;
    }
    jumpTo(window.scrollY + dy * 0.2);
    requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}
