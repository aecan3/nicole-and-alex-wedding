import Image from "next/image";

// A gold wax seal that sits across the join between two sections, as a
// small visual connector. The wrapper has zero height, so dropping one
// between two sections doesn't add any space or shift layout; the seal is
// centred on that line and overhangs both sides equally. z-20 keeps it
// above either section's background. Decorative only, so it's hidden from
// screen readers.
export function SectionSeal() {
  return (
    <div aria-hidden="true" className="relative z-20 h-0">
      <Image
        src="/decor/wax-seal.png"
        alt=""
        width={385}
        height={377}
        className="pointer-events-none absolute left-1/2 top-0 h-auto w-[70px] sm:w-[88px] -translate-x-1/2 -translate-y-1/2 drop-shadow-[0_4px_10px_rgba(0,0,0,0.38)] select-none"
      />
    </div>
  );
}
