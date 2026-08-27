"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";

export type MediaItem = {
  type: "image" | "video";
  src: string;
  alt?: string;
  /** Real pixel dimensions of the file — required so each tile can sit at
   * its own natural aspect ratio in the masonry layout instead of being
   * cropped into a uniform square. */
  width: number;
  height: number;
};

/**
 * Editorial masonry grid (CSS columns) with a lightbox. Each tile keeps its
 * own aspect ratio — portraits, landscapes and video sit together the way a
 * curated photo spread would, rather than a uniform cropped grid. Pass real
 * assets via `items` once they're uploaded to /public/gallery. Renders
 * nothing if the list is empty — pair with <GalleryPlaceholder /> for a
 * tasteful "coming soon" state instead of a blank page.
 */
export function Gallery({ items }: { items: MediaItem[] }) {
  const [open, setOpen] = useState<number | null>(null);
  if (items.length === 0) return null;

  return (
    <>
      <div className="columns-2 sm:columns-3 gap-3 sm:gap-4 [&>*]:mb-3 sm:[&>*]:mb-4">
        {items.map((item, i) => (
          <button
            key={item.src + i}
            onClick={() => setOpen(i)}
            className="group relative block w-full break-inside-avoid overflow-hidden rounded-sm bg-burgundy-900/5 shadow-[0_1px_3px_rgba(58,15,24,0.08)]"
          >
            {item.type === "image" ? (
              <Image
                src={item.src}
                alt={item.alt ?? ""}
                width={item.width}
                height={item.height}
                sizes="(max-width: 640px) 50vw, 33vw"
                className="w-full h-auto object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
            ) : (
              <>
                <video
                  src={item.src}
                  width={item.width}
                  height={item.height}
                  muted
                  loop
                  autoPlay
                  playsInline
                  className="w-full h-auto object-cover"
                  style={{ aspectRatio: `${item.width} / ${item.height}` }}
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
                width={items[open].width}
                height={items[open].height}
                className="max-h-[85vh] max-w-full w-auto h-auto object-contain"
              />
            ) : (
              <video
                src={items[open].src}
                controls
                autoPlay
                className="max-h-[85vh] max-w-full"
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
