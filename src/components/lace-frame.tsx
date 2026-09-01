import { type ReactNode } from "react";

/**
 * Decorative lace-doily border (see .lace-frame / .lace-frame__text in
 * globals.css and public/decor/lace-frame-src-v3.png for the actual
 * artwork and construction notes — the filename is versioned so a
 * pixel change always forces a fresh fetch instead of risking a stale
 * cached copy under the old URL). The frame is a fixed-aspect-ratio image — it
 * always scales uniformly, never stretches — with `children` overlaid in
 * the solid-card region via an absolutely-positioned text zone. Callers
 * control the frame's overall size via `className` (e.g. a max-width);
 * the text zone's own percentage insets track it automatically.
 */
export function LaceFrame({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`lace-frame ${className}`}>
      <div className="lace-frame__text">{children}</div>
    </div>
  );
}
