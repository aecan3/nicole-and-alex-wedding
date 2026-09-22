import Image from "next/image";

// Shadow is baked into the PNG. A CSS drop-shadow here made iOS Safari flash
// a pale box behind the seal while the image was still loading.
export function SectionSeal() {
  return (
    <div aria-hidden="true" className="relative z-20 h-0">
      <Image
        src="/decor/wax-seal-shadow.png"
        alt=""
        width={505}
        height={497}
        loading="eager"
        className="pointer-events-none absolute left-1/2 top-0 h-auto w-[92px] sm:w-[115px] -translate-x-1/2 -translate-y-1/2 select-none"
      />
    </div>
  );
}
