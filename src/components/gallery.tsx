"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";

export type MediaItem = {
  type: "image" | "video";
  src: string;
  alt?: string;
};

/**
 * Responsive photo/video grid with a lightbox. Pass real assets via `items`
 * once they're uploaded to /public/gallery (or an external URL). Renders
 * nothing if the list is empty — pair with <GalleryPlaceholder /> for a
 * tasteful "coming soon" state instead of a blank page.
 */
export function Gallery({ items }: { items: MediaItem[] }) {
  const [open, setOpen] = useState<number | null>(null);
  if (items.length === 0) return null;

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
        {items.map((item, i) => (
          <button
            key={item.src + i}
            onClick={() => setOpen(i)}
            className="relative aspect-[3/4] overflow-hidden rounded-sm bg-burgundy-900/5 group"
          >
            {item.type === "image" ? (
              <Image
                src={item.src}
                alt={item.alt ?? ""}
                fill
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
            ) : (
              <>
                <video
                  src={item.src}
                  muted
                  loop
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover"
                />
                <span className="absolute bottom-2 right-2 flex h-7 w-7 items-center justify-center rounded-full bg-burgundy-950/60 text-cream-100 text-xs backdrop-blur-sm">
                  ▶
                </span>
              </>
            )}
          </button>
        ))}
      </div>

      <AnimatePresence>
        {open !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-burgundy-950/95 backdrop-blur-sm flex items-center justify-center p-6"
            onClick={() => setOpen(null)}
          >
            {items[open].type === "image" ? (
              <Image
                src={items[open].src}
                alt={items[open].alt ?? ""}
                width={1400}
                height={1400}
                className="max-h-[85vh] w-auto object-contain"
              />
            ) : (
              <video
                src={items[open].src}
                controls
                autoPlay
                className="max-h-[85vh]"
                onClick={(e) => e.stopPropagation()}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/** Tasteful stand-in grid shown before real photos/videos are uploaded. */
export function GalleryPlaceholder({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="aspect-[3/4] rounded-sm border border-gold-400/30 bg-gradient-to-br from-burgundy-800/10 via-olive-700/10 to-burgundy-800/5 flex items-center justify-center"
        >
          <span className="text-[10px] tracking-[0.2em] uppercase text-burgundy-600/40">
            Photo soon
          </span>
        </div>
      ))}
    </div>
  );
}
