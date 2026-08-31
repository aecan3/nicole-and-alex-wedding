"use client";

import Link from "next/link";
import type { ComponentProps, MouseEvent } from "react";
import { scrollToSection } from "@/lib/scroll-to-section";

type AnchorLinkProps = Omit<ComponentProps<typeof Link>, "href"> & {
  /** A same-page section id, e.g. "#faq" — not an external/route href. */
  href: `#${string}`;
};

/**
 * A same-page section link. Renders a real `<a href="#id">` (works with no
 * JS, middle-click/open-in-new-tab, keyboard nav) but intercepts a plain
 * left-click to drive scrollToSection's self-correcting smooth scroll
 * instead of the browser's native anchor jump — see scroll-to-section.ts
 * for why that matters here. Every in-page nav/CTA/cross-link on the site
 * should use this instead of next/link's Link directly.
 */
export function AnchorLink({ href, onClick, ...props }: AnchorLinkProps) {
  const id = href.slice(1);
  return (
    <Link
      href={href}
      onClick={(e: MouseEvent<HTMLAnchorElement>) => {
        onClick?.(e);
        if (e.defaultPrevented) return;
        // Let modified clicks (open in new tab, etc.) and non-left clicks
        // fall through to the native <a href> behavior.
        if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        e.preventDefault();
        scrollToSection(id);
      }}
      {...props}
    />
  );
}
