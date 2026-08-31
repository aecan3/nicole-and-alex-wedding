"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Mount-gate for heavy children (a live map, autoplaying video) that used to
 * only exist at all once a visitor navigated to that section's own page —
 * now that every section lives on one continuous-scroll page, without this
 * they'd all mount at once on first paint instead of only when scrolled
 * near. Renders `fallback` (default: nothing) until the wrapped element is
 * within `rootMargin` of the viewport, then mounts `children` permanently
 * (matching Reveal's `once: true` — no need to unmount again once shown).
 */
export function InView({
  children,
  fallback = null,
  // Mounting inserts real DOM height, and on a continuous-scroll page a nav
  // click can smooth-scroll straight past this element while it's still
  // unmounted. That used to be a real problem — the browser's native anchor
  // scroll computes its target once, so a mount landing mid-animation and
  // shifting the page's height would make the scroll settle in the wrong
  // spot. It no longer is: every in-page nav link now scrolls via
  // scrollToSection (src/lib/scroll-to-section.ts), which re-measures its
  // target every animation frame instead of once, so a mid-flight mount
  // here gets absorbed instead of stranding the scroll. rootMargin only has
  // to cover ordinary wheel/trackpad scrolling now, so it stays modest
  // rather than needing a large lead-in.
  rootMargin = "400px",
  className,
}: {
  children: ReactNode;
  fallback?: ReactNode;
  rootMargin?: string;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    if (shown) return;
    const el = ref.current;
    if (!el) return;
    // If IntersectionObserver isn't available for some reason, fail open
    // rather than permanently hiding the section's content. This has to
    // stay an effect-time check (not folded into useState's initializer)
    // so server and initial-client render both start from `false` — Node
    // has no IntersectionObserver either, so deciding this during the
    // initial render would make the server always render `children` and
    // the browser's first paint always render `fallback`, a guaranteed
    // hydration mismatch.
    if (typeof IntersectionObserver === "undefined") {
      // Reacting to a runtime environment capability that's only knowable
      // client-side post-mount, not state derivable during render.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setShown(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setShown(true);
          observer.disconnect();
        }
      },
      { rootMargin }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [shown, rootMargin]);

  return (
    <div ref={ref} className={className}>
      {shown ? children : fallback}
    </div>
  );
}
