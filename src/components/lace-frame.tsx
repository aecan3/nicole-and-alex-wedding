import { type ReactNode } from "react";

/**
 * Decorative lace-doily border (see .lace-frame / .lace-frame::before in
 * globals.css and public/decor/lace-border.svg for the actual artwork and
 * construction notes). Purely presentational — sizes to its content, so
 * callers control max-width/centering from the outside.
 */
export function LaceFrame({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`lace-frame px-7 py-8 sm:px-11 sm:py-10 ${className}`}>
      {children}
    </div>
  );
}
