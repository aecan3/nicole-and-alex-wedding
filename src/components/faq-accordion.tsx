"use client";

import { useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";

export type FaqItem = {
  q: string;
  a: ReactNode;
};

const EASE = [0.16, 1, 0.3, 1] as const;

// All questions start collapsed — visitors see the full list of what's
// answerable at a glance, and open only the ones they actually want to
// read. Opening one doesn't close the others, since there's no reason two
// answers can't be open side by side.
export function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [openSet, setOpenSet] = useState<Set<number>>(new Set());

  const toggle = (i: number) => {
    setOpenSet((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  };

  return (
    <div className="space-y-1">
      {items.map((item, i) => {
        const isOpen = openSet.has(i);
        return (
          <div key={item.q} className="border-t border-gold-400/40 last:border-b">
            <button
              type="button"
              onClick={() => toggle(i)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between gap-4 py-5 text-left"
            >
              <h2 className="font-display text-lg text-burgundy-600">{item.q}</h2>
              <span
                aria-hidden
                className={`relative h-4 w-4 shrink-0 text-taupe-600 transition-transform duration-300 ${
                  isOpen ? "rotate-45" : ""
                }`}
              >
                <span className="absolute left-1/2 top-1/2 h-px w-4 -translate-x-1/2 -translate-y-1/2 bg-current" />
                <span className="absolute left-1/2 top-1/2 h-4 w-px -translate-x-1/2 -translate-y-1/2 bg-current" />
              </span>
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.35, ease: EASE }}
                  className="overflow-hidden"
                >
                  <div className="pb-6 leading-relaxed text-burgundy-600/90">{item.a}</div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
